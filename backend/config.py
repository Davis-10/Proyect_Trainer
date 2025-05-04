import os
from datetime import timedelta

class Config:
    # Configuración básica
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    # Configuración de MongoDB
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/davis_trainer'
    
    # Configuración de JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    
    # Configuración de CORS
    CORS_HEADERS = 'Content-Type'



