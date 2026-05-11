# 🐾 Medpet - WhatsApp AI Assistant

Un agente inteligente de WhatsApp impulsado por IA (GPT-4o) diseñado para proporcionar consultas veterinarias automáticas y gestionar citas médicas. Sistema completo de atención al cliente integrado con WhatsApp Cloud API y OpenAI.

## ✨ Características Principales

- **🤖 Asistente IA Veterinario**: Respuestas inteligentes a consultas de mascotas usando GPT-4o
- **📅 Gestión de Citas**: Flujo conversacional para agendar citas veterinarias
- **💬 Menú Interactivo**: Botones de respuesta rápida para mejorar la UX
- **📍 Información de Contacto**: Envío de ubicación y números de emergencia
- **📊 Integración Google Sheets**: Almacenamiento automático de citas en Google Sheets
- **🌐 Webhook WhatsApp**: Recepción y procesamiento de mensajes en tiempo real
- **🔄 Flujo Conversacional**: Estados de conversación para múltiples usuarios simultáneamente
- **🇦🇷 Soporte Multiidioma**: Normalización de números argentinos y respuestas contextuales

## 🏗️ Arquitectura

```
src/
├── app.js                    # Punto de entrada principal
├── config/
│   └── env.js               # Configuración de variables de entorno
├── controllers/
│   └── webhookController.js # Controlador de webhooks
├── routes/
│   └── webhookRoutes.js     # Definición de rutas
├── services/
│   ├── messageHandler.js    # Lógica principal de mensajes y flujos
│   ├── openAiService.js     # Integración con OpenAI GPT-4o
│   ├── whatsappService.js   # Servicio de WhatsApp
│   ├── googleSheetsService.js # Integración con Google Sheets
│   └── httpRequest/
│       └── sendToWhatsApp.js # Solicitudes HTTP a WhatsApp API
└── credentials/
    └── credentials.json     # Credenciales de Google (no commitear)
```

## 📋 Requisitos Previos

- Node.js v18+
- npm o yarn
- Cuenta de WhatsApp Business con acceso a WhatsApp Cloud API
- Clave de API de OpenAI
- Credenciales de Google Cloud para acceso a Google Sheets

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/medpet.git
cd medpet
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env-example` a `.env`:

```bash
cp .env-example .env
```

Completa las variables en `.env`:

```env
# WhatsApp Configuration
WEBHOOK_VERIFY_TOKEN=tu_token_de_verificacion_webhook
API_TOKEN=tu_token_de_api_de_whatsapp
BUSINESS_PHONE=tu_numero_de_telefono_negocios_sin_signo_mas
API_VERSION=v18.0

# Server Configuration
PORT=3000
BASE_URL=https://graph.facebook.com

# OpenAI Configuration
OPENAI_API_KEY=tu_clave_api_de_openai
```

### 4. Configurar Google Sheets (Opcional)

Para habilitar el almacenamiento automático de citas:

1. Crea un proyecto en Google Cloud Console
2. Habilita la API de Google Sheets
3. Crea una cuenta de servicio y descarga el JSON de credenciales
4. Guarda el archivo en `src/credentials/credentials.json`
5. Comparte tu Google Sheet con el email de la cuenta de servicio
6. Actualiza el `SPREADSHEET_ID` en `src/services/googleSheetsService.js`

## 📖 Guía de Inicio Rápido

### Desarrollo

```bash
npm run dev
```

Este comando inicia el servidor con `nodemon`, que reinicia automáticamente cuando detecta cambios en los archivos.

### Producción

```bash
npm start
```

Inicia el servidor directamente.

## 🔌 API Endpoints

### Webhook de WhatsApp

**POST** `/webhook`
- Recibe mensajes entrantes de WhatsApp
- Procesa el mensaje y envía respuestas automáticas

**GET** `/webhook`
- Verifica el webhook con WhatsApp (required para configurar)
- Parámetros query:
  - `hub.mode`: siempre debe ser "subscribe"
  - `hub.verify_token`: debe coincidir con `WEBHOOK_VERIFY_TOKEN`
  - `hub.challenge`: desafío de verificación

## 💬 Flujos de Conversación

### 1. Flujo de Saludo
```
Usuario: "Hola"
Bot: Envía mensaje de bienvenida + menú interactivo
```

### 2. Flujo de Cita
```
Usuario: Selecciona "Agendar"
Bot: Solicita nombre completo
Bot: Solicita DNI
Bot: Solicita nombre de mascota
Bot: Solicita tipo de mascota
Bot: Solicita motivo de consulta
Bot: Confirma y guarda en Google Sheets
```

### 3. Flujo de Consulta IA
```
Usuario: Selecciona "Consultar"
Usuario: Hace pregunta sobre su mascota
Bot: GPT-4o responde como veterinario
Bot: Pregunta si la respuesta fue útil
```

### 4. Opciones del Menú
- **Agendar**: Inicia flujo de agendamiento de citas
- **Consultar**: Inicia sesión con asistente IA
- **Ubicación**: Envía dirección y teléfono de emergencia

## 🤖 Prompts del Asistente IA

El asistente está configurado con el siguiente sistema de prompts (personalizable en `openAiService.js`):

```
Sos un veterinario profesional de Medpet.

Tu tarea es:
- Responder directamente la consulta del usuario
- Evaluar si los síntomas pueden ser graves
- Dar recomendaciones claras y responsables
- Si detectás signos de urgencia, indicá acudir de inmediato a un centro veterinario Medpet

Reglas:
- NO pidas datos personales
- NO inicies interrogatorios
- NO indiques dosis exactas de medicamentos
- Podés sugerir medidas generales y preventivas
- Respondé en el mismo idioma del usuario
- Sé claro, empático y profesional
```

## 📝 Variables de Entorno Detalladas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `WEBHOOK_VERIFY_TOKEN` | Token para verificar webhooks con WhatsApp | `your_verify_token` |
| `API_TOKEN` | Token de acceso de WhatsApp Business API | `EAABs...` |
| `BUSINESS_PHONE` | ID de teléfono de negocios (sin +) | `5493585484890` |
| `API_VERSION` | Versión de WhatsApp Graph API | `v18.0` |
| `PORT` | Puerto del servidor | `3000` |
| `BASE_URL` | URL base de WhatsApp Graph API | `https://graph.facebook.com` |
| `OPENAI_API_KEY` | Clave API de OpenAI | `sk-...` |

## 🔍 Características Avanzadas

### Normalización de Números Telefónicos
- Detecta automáticamente números argentinos (549...) y los normaliza a 54...
- Útil para manejar diferentes formatos de números

### Detección de Saludos
- Utiliza similitud de Levenshtein para detectar saludos con tolerancia a errores
- Soporta múltiples idiomas (español e inglés)
- Maneja abreviaciones comunes

### Gestión de Estado
- Mantiene estado conversacional por usuario
- Soporta múltiples flujos simultáneos
- Limpieza automática de estado al completar flujos

## 🧪 Testing

Actualmente no hay tests configurados. Para agregar:

```bash
npm test
```

Para configurar tests, consulta el archivo `package.json` y configura un framework de testing como Jest o Mocha.

## 🔐 Seguridad

**⚠️ Importante:**
- No commitees el archivo `.env` o credenciales
- `.env-example` debe incluir solo variables template
- Las credenciales de Google deben estar en `.gitignore`
- Usa variables de entorno para valores sensibles

### Archivo `.gitignore` Recomendado
```
.env
.env.local
node_modules/
src/credentials/credentials.json
.DS_Store
*.log
```

## 📊 Monitoreo y Logs

El proyecto incluye logging completo en consola:

```javascript
console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
console.error("❌ Error en openAiService:", error);
```

Para producción, considera usar una librería como Winston o Pino.

## 🛠️ Troubleshooting

### El webhook no se verifica
- Verifica que `WEBHOOK_VERIFY_TOKEN` coincida en el dashboard de WhatsApp
- Asegúrate de que la URL sea accesible desde internet (usa ngrok para desarrollo local)

### Los mensajes no se envían
- Verifica que `API_TOKEN` sea válido y no esté expirado
- Confirma que `BUSINESS_PHONE` es el ID correcto (sin +)
- Revisa los logs de error en consola

### OpenAI no responde
- Verifica que `OPENAI_API_KEY` sea válido
- Comprueba que tu cuenta tiene créditos disponibles
- Asegúrate de que el modelo `gpt-4o` está disponible en tu plan

## 📦 Dependencias Principales

```json
{
  "axios": "^1.15.0",          // Cliente HTTP
  "dotenv": "^17.4.2",          // Gestión de variables de entorno
  "express": "^5.2.1",          // Framework web
  "googleapis": "^171.4.0",      // Integración con Google APIs
  "openai": "^6.34.0"            // Cliente de OpenAI
}
```

## 🚀 Deployment

### Sugerencias de Hosting

- **Heroku**: Soporte nativo para Node.js, fácil deployment
- **Railway**: Alternativa moderna a Heroku
- **AWS Lambda**: Para arquitectura serverless
- **DigitalOcean**: Máquinas virtuales asequibles

### Pasos Básicos para Heroku

```bash
# Instalar Heroku CLI
heroku login
heroku create medpet-app
git push heroku main

# Establecer variables de entorno
heroku config:set WEBHOOK_VERIFY_TOKEN=tu_token
heroku config:set API_TOKEN=tu_token
# ... más variables
```

## 📚 Recursos Útiles

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado por el equipo Medpet.

## 📞 Soporte

Para soporte técnico o reportar bugs, por favor abre un issue en el repositorio.

---

**Última actualización**: Mayo 2026
**Versión**: 0.1.0-dev
**Estado**: En desarrollo y mantenimiento activo
