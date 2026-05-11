# 🔐 Política de Seguridad

## Reportar Vulnerabilidades

Si descubres una vulnerabilidad de seguridad, **no la reportes públicamente en GitHub Issues**.

En su lugar:

1. **NO** abras un issue público
2. Envía un email a: `security@medpet.example.com` (actualizar con email real)
3. Incluye:
   - Descripción de la vulnerabilidad
   - Pasos para reproducirla
   - Posible impacto
   - Sugerencias de fix (si tienes)

Recibirás una respuesta en 48 horas.

## Prácticas de Seguridad

### Variables de Entorno
- ✅ Usa `.env` para valores sensibles
- ❌ Nunca commitees `.env`
- ✅ Incluye `.env-example` con valores template
- ✅ Usa `.gitignore` para excluir `.env`

### Credenciales
- ✅ Guarda credenciales en variables de entorno
- ❌ No las hagas hardcode en el código
- ✅ Rota keys/tokens regularmente
- ✅ Usa Google Cloud Secret Manager para producción

### Dependencias
- ✅ Mantén npm packages actualizados
- ❌ No uses packages con vulnerabilidades conocidas
- ✅ Revisa `npm audit` regularmente

```bash
npm audit
npm audit fix
```

### API Keys
- ✅ Restringir scopes de keys a lo mínimo necesario
- ✅ Usar claves diferentes para dev/prod
- ✅ Rotar keys regularmente
- ❌ No compartir keys en mensajes/chats

### WhatsApp API
- ✅ Valida webhooks con `WEBHOOK_VERIFY_TOKEN`
- ✅ Usa HTTPS (nunca HTTP)
- ✅ Valida origen de requests
- ✅ Implementa rate limiting

### OpenAI API
- ✅ Usa modelos con contenido filtrado
- ✅ Monitorea uso de API
- ✅ Implementa timeouts
- ❌ No guardes conversaciones completas sin consentimiento

### Validación de Entrada
```javascript
// ✅ Bien: validar y sanitizar
const message = sanitize(req.body.message);
if (!isValidMessage(message)) {
  return res.status(400).json({ error: 'Invalid input' });
}

// ❌ Mal: usar input sin validar
const message = req.body.message;
await openAiService(message);
```

### HTTPS
- ✅ Usar HTTPS en producción
- ✅ Usar certificados válidos
- ✅ Actualizar certificados antes de expirar

## Configuración Segura

### Desarrollo Local
```bash
# .env.local
WEBHOOK_VERIFY_TOKEN=tu_token_local
API_TOKEN=token_test_no_productivo
```

### Producción
```bash
# Variables en plataforma de hosting
# NO en archivos committeados
NODE_ENV=production
WEBHOOK_VERIFY_TOKEN=token_secreto_fuerte
API_TOKEN=token_produccion_valido
```

## Monitoreo

- 📊 Monitorea logs para actividades sospechosas
- 📧 Configura alertas para errores críticos
- 🔍 Revisa acceso a datos sensibles
- ⏱️ Implementa rate limiting

## Actualizaciones de Seguridad

- Revisa dependencias: `npm outdated`
- Actualiza regularmente: `npm update`
- Audita: `npm audit`
- Suscríbete a GitHub Security Alerts

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

## Disclaimer

Este software se proporciona "tal como está". Los autores no son responsables por daños derivados del uso del software.

---

**Última actualización**: Mayo 2026
