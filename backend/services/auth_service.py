import jwt
import bcrypt
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os
import secrets

class AuthService:
    def __init__(self, db):
        self.db = db
        self.users = db.users
        # Ensure JWT_SECRET_KEY is properly set
        self.secret_key = os.getenv('JWT_SECRET_KEY')
        if not self.secret_key:
            # Generate a random secret key if not set (for development only)
            self.secret_key = secrets.token_urlsafe(32)
            print("Warning: JWT_SECRET_KEY not set. Using generated key for this session.")
        
        # Ensure secret key is a string
        if not isinstance(self.secret_key, str):
            self.secret_key = str(self.secret_key)

    def register_user(self, email, password, first_name=None, last_name=None):
        if self.users.find_one({"email": email}):
            raise ValueError("Email already registered")

        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        user_doc = {
            "email": email,
            "password_hash": password_hash,
            "first_name": first_name,
            "last_name": last_name,
            "created_at": datetime.utcnow()
        }
        result = self.users.insert_one(user_doc)
        return str(result.inserted_id)

    def login_user(self, email, password):
        # Fetch raw user document
        user_doc = self.users.find_one({"email": email})
        if not user_doc:
            raise ValueError("Invalid email or password")

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user_doc['password_hash']):
            raise ValueError("Invalid email or password")

        # Generate JWT
        token = self.generate_token(str(user_doc['_id']))

        # Build JSON-serializable user dict
        user_data = {
            'id': str(user_doc['_id']),
            'email': user_doc['email'],
            'firstName': user_doc.get('first_name'),
            'lastName': user_doc.get('last_name')
        }

        return token, user_data

    def generate_token(self, user_id):
        # Ensure user_id is a string
        if not isinstance(user_id, str):
            user_id = str(user_id)
            
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=1)
        }
        
        # Ensure secret_key is bytes for JWT encoding
        secret_bytes = self.secret_key.encode('utf-8') if isinstance(self.secret_key, str) else self.secret_key
        return jwt.encode(payload, secret_bytes, algorithm='HS256')

    def verify_token(self, token):
        try:
            # Ensure secret_key is bytes for JWT decoding
            secret_bytes = self.secret_key.encode('utf-8') if isinstance(self.secret_key, str) else self.secret_key
            payload = jwt.decode(token, secret_bytes, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
    
    def create_demo_user(self):
        """Create or get demo user for demo mode"""
        demo_email = "demo@snipx.com"
        demo_user = self.users.find_one({"email": demo_email})
        
        if not demo_user:
            # Create demo user
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw("demo1234".encode('utf-8'), salt)
            
            demo_user_doc = {
                "email": demo_email,
                "password_hash": password_hash,
                "first_name": "Demo",
                "last_name": "User",
                "created_at": datetime.utcnow(),
                "is_demo": True
            }
            result = self.users.insert_one(demo_user_doc)
            demo_user_id = str(result.inserted_id)
        else:
            demo_user_id = str(demo_user['_id'])
        
        # Generate token for demo user
        token = self.generate_token(demo_user_id)
        
        user_data = {
            'id': demo_user_id,
            'email': demo_email,
            'firstName': 'Demo',
            'lastName': 'User',
            'isDemo': True
        }
        
        return token, user_data

    def get_user_by_id(self, user_id):
        from models.user import User  # import here to avoid circular
        user_doc = self.users.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            raise ValueError("User not found")
        return User.from_dict(user_doc)

    def update_user(self, user_id, updates):
        updates['updated_at'] = datetime.utcnow()
        result = self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made")
        return self.get_user_by_id(user_id)
