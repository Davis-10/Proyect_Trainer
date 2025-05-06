from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    genero = db.Column(db.String(20), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Datos físicos
    peso = db.Column(db.Float, nullable=False)
    altura = db.Column(db.Integer, nullable=False)
    nivel_actividad = db.Column(db.String(20), nullable=False)
    imc = db.Column(db.Float)
    
    # Objetivos
    objetivo_principal = db.Column(db.String(50), nullable=False)
    tiempo_disponible = db.Column(db.Integer, nullable=False)
    plan_seleccionado = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat(),
            'genero': self.genero,
            'datos_fisicos': {
                'peso': self.peso,
                'altura': self.altura,
                'nivel_actividad': self.nivel_actividad,
                'imc': self.imc
            },
            'objetivos': {
                'principal': self.objetivo_principal,
                'tiempo_disponible': self.tiempo_disponible
            },
            'plan_seleccionado': self.plan_seleccionado
        }