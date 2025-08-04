import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from bson.objectid import ObjectId
import os

class SupportService:
    def __init__(self, db):
        self.db = db
        self.tickets = db.support_tickets
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
    
    def create_ticket(self, ticket_data):
        """Create a new support ticket"""
        ticket = {
            'name': ticket_data['name'],
            'email': ticket_data['email'],
            'subject': ticket_data['subject'],
            'description': ticket_data['description'],
            'priority': ticket_data['priority'],
            'type': ticket_data['type'],
            'status': 'open',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'responses': []
        }
        
        result = self.tickets.insert_one(ticket)
        ticket_id = str(result.inserted_id)
        
        # Send confirmation email
        try:
            self._send_confirmation_email(ticket_data, ticket_id)
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")
        
        return ticket_id
    
    def get_ticket(self, ticket_id):
        """Get a specific ticket"""
        ticket = self.tickets.find_one({"_id": ObjectId(ticket_id)})
        if ticket:
            ticket['_id'] = str(ticket['_id'])
        return ticket
    
    def get_all_tickets(self, status=None):
        """Get all tickets, optionally filtered by status"""
        query = {}
        if status:
            query['status'] = status
        
        tickets = list(self.tickets.find(query).sort("created_at", -1))
        for ticket in tickets:
            ticket['_id'] = str(ticket['_id'])
        
        return tickets
    
    def update_ticket_status(self, ticket_id, status):
        """Update ticket status"""
        result = self.tickets.update_one(
            {"_id": ObjectId(ticket_id)},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    def add_response(self, ticket_id, response_data):
        """Add a response to a ticket"""
        response = {
            'message': response_data['message'],
            'author': response_data['author'],
            'author_type': response_data.get('author_type', 'support'),
            'created_at': datetime.utcnow()
        }
        
        result = self.tickets.update_one(
            {"_id": ObjectId(ticket_id)},
            {
                "$push": {"responses": response},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return result.modified_count > 0
    
    def _send_confirmation_email(self, ticket_data, ticket_id):
        """Send confirmation email to user"""
        if not all([self.smtp_username, self.smtp_password]):
            print("SMTP credentials not configured, skipping email")
            return
        
        subject = f"Support Ticket Created - #{ticket_id[:8]}"
        
        body = f"""
        Dear {ticket_data['name']},
        
        Thank you for contacting SnipX support. We have received your support ticket and will respond within our standard response times based on priority.
        
        Ticket Details:
        - Ticket ID: #{ticket_id[:8]}
        - Subject: {ticket_data['subject']}
        - Priority: {ticket_data['priority'].title()}
        - Type: {ticket_data['type'].replace('_', ' ').title()}
        
        Expected Response Times:
        - Urgent: 2-4 hours
        - High: 4-8 hours  
        - Medium: 12-24 hours
        - Low: 24-48 hours
        
        You can check the status of your ticket by contacting us with your ticket ID.
        
        Best regards,
        SnipX Support Team
        """
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_username
            msg['To'] = ticket_data['email']
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            
            text = msg.as_string()
            server.sendmail(self.smtp_username, ticket_data['email'], text)
            server.quit()
            
            print(f"Confirmation email sent to {ticket_data['email']}")
            
        except Exception as e:
            print(f"Failed to send email: {e}")
            raise