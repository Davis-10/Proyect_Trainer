from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId
from config import Config

# Inicialización de la aplicación
app = Flask(__name__)
app.config.from_object(Config)

# Inicialización de extensiones
jwt = JWTManager(app)
mongo = PyMongo(app)
CORS(app)

# Modelo de Usuario (helper functions)
def user_to_json(user):
    if user:
        return {
            'id': str(user['_id']),
            'nombre': user['nombre'],
            'email': user['email'],
            'fecha_nacimiento': user['fecha_nacimiento'],
            'genero': user['genero'],
            'datos_fisicos': user['datos_fisicos'],
            'objetivos': user['objetivos'],
            'plan_seleccionado': user.get('plan_seleccionado', None)
        }
    return None

# Rutas de autenticación
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Verificar si el usuario ya existe
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'El correo electrónico ya está registrado'}), 400
    
    # Crear nuevo usuario
    new_user = {
        'nombre': data['nombre'],
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'fecha_nacimiento': data['fecha_nacimiento'],
        'genero': data['genero'],
        'datos_fisicos': {
            'peso': float(data['datos_fisicos']['peso']),
            'altura': int(data['datos_fisicos']['altura']),
            'nivel_actividad': data['datos_fisicos']['nivel_actividad']
        },
        'objetivos': {
            'principal': data['objetivos']['principal'],
            'tiempo_disponible': int(data['objetivos']['tiempo_disponible'])
        },
        'plan_seleccionado': data.get('plan_seleccionado'),
        'fecha_registro': datetime.utcnow()
    }
    
    # Calcular IMC y calorías base
    altura_m = new_user['datos_fisicos']['altura'] / 100
    peso = new_user['datos_fisicos']['peso']
    new_user['datos_fisicos']['imc'] = round(peso / (altura_m * altura_m), 2)
    
    # Insertar usuario en la base de datos
    mongo.db.users.insert_one(new_user)
    
    # Generar token de acceso
    access_token = create_access_token(identity=str(new_user['_id']))
    
    return jsonify({
        'message': 'Usuario registrado exitosamente',
        'token': access_token,
        'user': user_to_json(new_user)
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})
    
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': access_token,
            'user': user_to_json(user)
        }), 200
    
    return jsonify({'message': 'Credenciales inválidas'}), 401

# Ruta protegida de ejemplo
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    return jsonify(user_to_json(user)), 200

# Ruta para actualizar perfil
@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Actualizar solo los campos permitidos
    update_data = {
        'datos_fisicos': data.get('datos_fisicos'),
        'objetivos': data.get('objetivos')
    }
    
    result = mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': update_data}
    )
    
    if result.modified_count:
        user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})
        return jsonify(user_to_json(user)), 200
    
    return jsonify({'message': 'No se realizaron cambios'}), 304

if __name__ == '__main__':
    app.run(debug=True, port=5000)
