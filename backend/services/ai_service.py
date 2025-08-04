import os
import json
import requests
from datetime import datetime

class AIService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        
    def get_chatbot_response(self, message, conversation_history=None):
        """Get AI chatbot response using available AI service"""
        try:
            # Try OpenAI first
            if self.openai_api_key:
                return self._get_openai_response(message, conversation_history)
            # Fallback to Gemini
            elif self.gemini_api_key:
                return self._get_gemini_response(message, conversation_history)
            else:
                # Fallback to rule-based responses
                return self._get_fallback_response(message)
        except Exception as e:
            print(f"AI Service error: {e}")
            return self._get_fallback_response(message)
    
    def _get_openai_response(self, message, conversation_history=None):
        """Get response from OpenAI GPT"""
        url = "https://api.openai.com/v1/chat/completions"
        
        messages = [
            {
                "role": "system",
                "content": """You are a helpful assistant for SnipX, a video editing platform. 
                You help users with video uploading, editing, subtitle generation, audio enhancement, 
                and other video processing features. Be concise, helpful, and friendly."""
            }
        ]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Last 5 messages for context
        
        messages.append({"role": "user", "content": message})
        
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-3.5-turbo",
            "messages": messages,
            "max_tokens": 150,
            "temperature": 0.7
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    
    def _get_gemini_response(self, message, conversation_history=None):
        """Get response from Google Gemini"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}"
        
        # Build context from conversation history
        context = "You are a helpful assistant for SnipX video editing platform. "
        if conversation_history:
            for msg in conversation_history[-3:]:  # Last 3 messages for context
                context += f"{msg['role']}: {msg['content']} "
        
        full_prompt = f"{context}\n\nUser: {message}\n\nAssistant:"
        
        data = {
            "contents": [{
                "parts": [{
                    "text": full_prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 150
            }
        }
        
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    def _get_fallback_response(self, message):
        """Fallback rule-based responses when AI services are unavailable"""
        message_lower = message.lower()
        
        # Video upload related
        if any(word in message_lower for word in ['upload', 'video', 'file']):
            return "To upload a video, go to the Editor page and drag & drop your file or click 'Select Video'. We support MP4, MOV, AVI, and MKV formats up to 500MB."
        
        # Subtitle related
        elif any(word in message_lower for word in ['subtitle', 'caption', 'text']):
            return "Our AI can generate subtitles in multiple languages including English, Urdu, Spanish, French, and German. You can also edit them after generation in the editor."
        
        # Processing related
        elif any(word in message_lower for word in ['process', 'time', 'how long']):
            return "Processing time typically takes 1-3 minutes per minute of video content, depending on the features you select like subtitle generation, audio enhancement, etc."
        
        # Audio related
        elif any(word in message_lower for word in ['audio', 'sound', 'voice', 'enhance']):
            return "SnipX can enhance your audio by removing background noise, normalizing volume levels, and cutting silent parts automatically."
        
        # Pricing related
        elif any(word in message_lower for word in ['price', 'cost', 'plan', 'payment']):
            return "SnipX offers flexible pricing plans. You can start with our free tier and upgrade as needed. Check our pricing page for detailed information."
        
        # Features related
        elif any(word in message_lower for word in ['feature', 'what can', 'capabilities']):
            return "SnipX offers video cutting, subtitle generation, audio enhancement, thumbnail creation, and video summarization. All powered by AI for the best results."
        
        # Account related
        elif any(word in message_lower for word in ['account', 'login', 'signup', 'register']):
            return "You can create an account by clicking 'Get Started' or use our demo mode to try features without registration."
        
        # Greeting
        elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'help']):
            return "Hello! I'm your SnipX assistant. I can help you with video uploads, editing features, subtitle generation, and more. What would you like to know?"
        
        # Default response
        else:
            return "I'm here to help with SnipX! You can ask me about video uploads, subtitle generation, audio enhancement, processing times, or any other features. What would you like to know?"