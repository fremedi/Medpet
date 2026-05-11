# 🚀 Guía Rápida de Inicio

Esta guía te ayudará a ejecutar Medpet localmente en 5 minutos.

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- Una cuenta de [WhatsApp Business](https://business.facebook.com)
- Una clave API de [OpenAI](https://platform.openai.com/api-keys)

## Paso 1: Clonar y Instalar

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/medpet.git
cd medpet

# Instalar dependencias
npm install
```

## Paso 2: Configurar Variables de Entorno

```bash
# Copiar template
cp .env-example .env

# Editar .env con tus valores
# Abre .env y reemplaza con:
# - WEBHOOK_VERIFY_TOKEN: un string aleatorio (ej: "mi_token_secreto_123")
# - API_TOKEN: obtén de Meta Business
# - BUSINESS_PHONE: tu número sin +
# - OPENAI_API_KEY: obtén de OpenAI
```

**Valores mínimos necesarios:**
```env
WEBHOOK_VERIFY_TOKEN=mi_token_local
API_TOKEN=tu_token_whatsapp
BUSINESS_PHONE=tu_numero
API_VERSION=v18.0
PORT=3000
OPENAI_API_KEY=tu_clave_openai
```

## Paso 3: Ejecutar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver:
```
Server is listening on port:  3000
```

## Paso 4: Probar el Webhook

### Opción A: Con ngrok (para desarrollo local)

```bash
# Instalar ngrok: https://ngrok.com/download

# En otra terminal, crear túnel
ngrok http 3000

# Copiar URL: https://xxxx-xx-xxx-xx-xx.ngrok.io
```

### Opción B: Desplegar a servidor público

- Usa Railway, Heroku, o tu servidor favorito
- La URL debe estar disponible en internet

## Paso 5: Configurar Webhook en WhatsApp

1. Ve a [Meta Business Suite](https://business.facebook.com/)
2. Selecciona tu app de WhatsApp
3. En Configuración → Webhooks, agrega:
   - **URL del Callback**: `https://tu-dominio.com/webhook` (o ngrok)
   - **Verificar Token**: El valor de `WEBHOOK_VERIFY_TOKEN`
4. Suscribirse a eventos: `messages`, `message_template_status_update`

## Paso 6: Enviar Mensaje de Prueba

Desde WhatsApp, envía un mensaje a tu número de negocio:

```
Hola
```

Deberías recibir:
```
Hola [Tu Nombre], bienvenido a MEDPET 🐾🐶🐱

Somos tu tienda de mascotas en línea.
¿En qué puedo ayudarte hoy?

[Botones de menú]
```

## 🎯 Próximos Pasos

### Personalización Básica

**1. Cambiar mensaje de bienvenida**

Editar `src/services/messageHandler.js` línea 123:

```javascript
const text = `Hola ${name}, bienvenido a *TU_NEGOCIO* 🏥

Tu mensaje personalizadoaquí.`;
```

**2. Cambiar prompt del IA**

Editar `src/services/openAiService.js` línea 14:

```javascript
content: `
Sos un experto en [tu especialidad].
[Tus reglas personalizadas aquí]
`
```

**3. Cambiar opciones del menú**

Editar `src/services/messageHandler.js` línea 142:

```javascript
const buttons = [
  { type: 'reply', reply: { id: 'option_1', title: 'Tu opción 1' } },
  // ...
];
```

### Google Sheets (Opcional)

Para guardar datos automáticamente:

1. Crear Google Sheet
2. Crear cuenta de servicio en Google Cloud
3. Descargar JSON de credenciales a `src/credentials/credentials.json`
4. Compartir Sheet con email de la cuenta de servicio
5. Actualizar `SPREADSHEET_ID` en `googleSheetsService.js`

## 🔧 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "API_TOKEN is undefined"
- Verifica que .env existe y contiene los valores
- Revisa que no hay espacios alrededor de `=`
- Reinicia el servidor después de cambiar .env

### Webhook no se verifica
- Asegúrate que URL es accesible desde internet
- Verifica que `WEBHOOK_VERIFY_TOKEN` coincide
- Revisa logs en consola para más detalles

### Mensajes no se envían
- Verifica permisos en Meta Business
- Confirma que `BUSINESS_PHONE` es correcto
- Revisa que `API_TOKEN` no expiró

## 📚 Recursos Útiles

- [Documentación Completa](README.md)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [OpenAI API](https://platform.openai.com/docs)
- [Guía de Contribución](CONTRIBUTING.md)

## 🆘 Necesitas Ayuda?

- Revisa [README.md](README.md) para más detalles
- Abre un [Issue en GitHub](https://github.com/tu-usuario/medpet/issues)
- Consulta la [Guía de Troubleshooting](README.md#-troubleshooting)

---

¡Listo! Ya puedes empezar a usar Medpet. 🎉
