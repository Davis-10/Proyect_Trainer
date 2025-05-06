from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from models import db, User
from config import Config

# Inicialización de la aplicación
app = Flask(__name__, static_folder='../frontend', static_url_path='')
app.config.from_object(Config)

# Inicialización de extensiones
CORS(app, resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager(app)
db.init_app(app)

# Crear las tablas de la base de datos
with app.app_context():
    db.create_all()

# Ruta para servir archivos estáticos del frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'API funcionando correctamente'}), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Verificar si el usuario ya existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'El correo electrónico ya está registrado'}), 400
    
    # Calcular IMC
    altura_m = float(data['datos_fisicos']['altura']) / 100
    peso = float(data['datos_fisicos']['peso'])
    imc = round(peso / (altura_m * altura_m), 2)
    
    # Crear nuevo usuario
    new_user = User(
        nombre=data['nombre'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d'),
        genero=data['genero'],
        peso=peso,
        altura=data['datos_fisicos']['altura'],
        nivel_actividad=data['datos_fisicos']['nivel_actividad'],
        imc=imc,
        objetivo_principal=data['objetivos']['principal'],
        tiempo_disponible=data['objetivos']['tiempo_disponible'],
        plan_seleccionado=data.get('plan_seleccionado')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generar token de acceso
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        'message': 'Usuario registrado exitosamente',
        'token': access_token,
        'user': new_user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': access_token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'message': 'Credenciales inválidas'}), 401

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    # Calcular calorías base y ajustadas
    edad = datetime.now().year - user.fecha_nacimiento.year
    altura_m = user.altura / 100
    imc = round(user.peso / (altura_m * altura_m), 2)
    
    # Actualizar el IMC si ha cambiado
    if user.imc != imc:
        user.imc = imc
        db.session.commit()
    
    return jsonify({
        'id': user.id,
        'nombre': user.nombre,
        'email': user.email,
        'fecha_nacimiento': user.fecha_nacimiento.isoformat(),
        'genero': user.genero,
        'datos_fisicos': {
            'peso': user.peso,
            'altura': user.altura,
            'nivel_actividad': user.nivel_actividad,
            'imc': user.imc
        },
        'objetivos': {
            'principal': user.objetivo_principal,
            'tiempo_disponible': user.tiempo_disponible
        },
        'plan_seleccionado': user.plan_seleccionado,
        'fecha_registro': user.fecha_registro.isoformat()
    }), 200

@app.route('/api/payment/process', methods=['POST'])
@jwt_required()
def process_payment():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    plan_id = data.get('plan_id')
    amount = data.get('amount')
    
    if not plan_id or not amount:
        return jsonify({'message': 'Datos de pago incompletos'}), 400
    
    try:
        # Simular procesamiento de pago
        # En un entorno real, aquí se integraría con un gateway de pago
        
        # Actualizar el estado del plan del usuario
        user.plan_seleccionado = plan_id
        db.session.commit()
        
        return jsonify({
            'message': 'Pago procesado exitosamente',
            'plan': plan_id,
            'amount': amount
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al procesar el pago'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
