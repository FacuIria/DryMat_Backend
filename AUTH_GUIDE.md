# 🔐 GUÍA DE AUTENTICACIÓN - DRYMAT BACKEND

## ✅ IMPLEMENTACIÓN COMPLETA

Se implementó el sistema de autenticación completo con:
- ✅ Bcrypt para hash de contraseñas
- ✅ JWT para tokens de autenticación
- ✅ Guards para proteger endpoints
- ✅ Roles (USER, ADMIN)
- ✅ Rate limiting (100 req/min por IP)
- ✅ Helmet para seguridad HTTP

---

## 🚀 PRIMEROS PASOS

### 1. Asegúrate de tener MongoDB corriendo

```bash
# Verificar si MongoDB está corriendo
mongosh

# Si no está corriendo, iniciarlo (Windows)
net start MongoDB
```

### 2. Instalar dependencias (ya está hecho)

```bash
npm install
```

### 3. Iniciar el servidor

```bash
npm run start:dev
```

El servidor estará en: `http://localhost:3000/api`

---

## 👤 CREAR TU PRIMER ADMIN

Tienes 2 opciones:

### Opción 1: Endpoint temporal `/auth/setup-admin`

```bash
POST http://localhost:3000/api/auth/setup-admin
Content-Type: application/json

{
  "nombre": "Admin",
  "apellido": "DryMat",
  "email": "admin@drymat.com",
  "password": "admin123456",
  "fechaNacimiento": "1990-01-01",
  "genero": "OTHER",
  "adminCode": "mi_codigo_super_secreto_2024"
}
```

### Opción 2: Usar código secreto en registro normal

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin",
  "apellido": "DryMat",
  "email": "admin@drymat.com",
  "password": "admin123456",
  "fechaNacimiento": "1990-01-01",
  "genero": "Masculino",
  "adminCode": "mi_codigo_super_secreto_2024"
}
```

**IMPORTANTE**: El `adminCode` debe coincidir con el valor de `ADMIN_SECRET_CODE` en tu archivo `.env`

---

## 📡 ENDPOINTS DISPONIBLES

### 🔓 Públicos (sin autenticación)

#### Registrar usuario
```bash
POST /api/auth/register
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@mail.com",
  "password": "password123",
  "fechaNacimiento": "1995-05-15",
  "genero": "Masculino"
}

Respuesta:
{
  "user": { ... },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "juan@mail.com",
  "password": "password123"
}

Respuesta:
{
  "user": { ... },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔐 Protegidos (requieren JWT)

#### Ver perfil
```bash
GET /api/auth/profile
Authorization: Bearer <tu_token>

Respuesta:
{
  "message": "Perfil del usuario autenticado",
  "user": {
    "id": "...",
    "email": "juan@mail.com",
    "role": "USER",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

### 👥 Usuarios (todos requieren autenticación)

#### Listar usuarios (solo ADMIN)
```bash
GET /api/users
Authorization: Bearer <admin_token>
```

#### Ver un usuario (ADMIN o el mismo usuario)
```bash
GET /api/users/:id
Authorization: Bearer <token>
```

#### Actualizar usuario (ADMIN o el mismo usuario)
```bash
PUT /api/users/:id
Authorization: Bearer <token>
{
  "nombre": "Nuevo Nombre"
}
```

#### Eliminar usuario (solo ADMIN)
```bash
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## 🔑 CÓMO USAR LOS TOKENS

### En el Frontend (React + Axios)

```javascript
// Guardar token después de login/register
localStorage.setItem('token', response.data.access_token);

// Configurar Axios para enviar el token en cada request
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// O crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Hacer requests
const profile = await api.get('/auth/profile');
```

### En Postman/Thunder Client

1. Haz login o register
2. Copia el `access_token` de la respuesta
3. En la pestaña **Headers**, agrega:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🛡️ PERMISOS POR ROL

| Endpoint | USER | ADMIN |
|----------|------|-------|
| POST /auth/register | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ |
| GET /auth/profile | ✅ (propio) | ✅ |
| GET /users | ❌ | ✅ |
| GET /users/:id | ✅ (propio) | ✅ |
| PUT /users/:id | ✅ (propio) | ✅ |
| DELETE /users/:id | ❌ | ✅ |

---

## ⚙️ CONFIGURACIÓN

### Variables de entorno (.env)

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/drymat

# JWT
JWT_SECRET=super_secret_change_in_production_min_32_chars
JWT_EXPIRATION=7d

# Admin Setup
ADMIN_SECRET_CODE=mi_codigo_super_secreto_2024

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Seguridad implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración (7 días por defecto)
- ✅ Rate limiting: 100 requests por minuto por IP
- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado solo para localhost:5173
- ✅ Validación de DTOs con class-validator
- ✅ Guards para protección de rutas
- ✅ Roles para control de acceso

---

## 🧪 TESTING

### Flujo completo de prueba

1. **Registrar usuario normal**
```bash
POST /api/auth/register
{
  "nombre": "Test",
  "apellido": "User",
  "email": "test@mail.com",
  "password": "test123",
  "fechaNacimiento": "2000-01-01",
  "genero": "Masculino"
}
```

2. **Login con ese usuario**
```bash
POST /api/auth/login
{
  "email": "test@mail.com",
  "password": "test123"
}
```

3. **Ver perfil (con el token)**
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

4. **Crear admin (con código secreto)**
```bash
POST /api/auth/setup-admin
{
  "nombre": "Admin",
  "apellido": "DryMat",
  "email": "admin@drymat.com",
  "password": "admin123",
  "fechaNacimiento": "1990-01-01",
  "genero": "OTHER",
  "adminCode": "mi_codigo_super_secreto_2024"
}
```

5. **Login como admin**
```bash
POST /api/auth/login
{
  "email": "admin@drymat.com",
  "password": "admin123"
}
```

6. **Listar todos los usuarios (con token de admin)**
```bash
GET /api/users
Authorization: Bearer <admin_token>
```

---

## 🔧 PRÓXIMOS PASOS

1. ✅ Autenticación completa (HECHO)
2. ⏳ Implementar módulo de Products
3. ⏳ Implementar módulo de Payments (Mercado Pago/Stripe)
4. ⏳ Implementar upload de imágenes (Cloudinary)
5. ⏳ Implementar emails con templates
6. ⏳ Deploy a producción

---

## 📞 SOPORTE

Si algo no funciona:

1. Verifica que MongoDB esté corriendo
2. Verifica que el archivo `.env` exista y tenga todas las variables
3. Asegúrate de estar enviando el token en el header `Authorization: Bearer <token>`
4. Revisa los logs del servidor en la consola

---

**¡Sistema de autenticación completo y funcionando!** 🎉
