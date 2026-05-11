# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Medpet! Este documento proporciona pautas y procesos para contribuir al proyecto.

## 📋 Código de Conducta

Esperamos que todos los contribuyentes se adhieran a los siguientes principios:
- Sé respetuoso y considerado
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía con otros miembros

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. **Verifica** que el bug no haya sido reportado previamente
2. **Abre un issue** con un título descriptivo
3. **Proporciona detalles**:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Tu entorno (Node.js version, SO, etc.)
4. **Adjunta logs** si es relevante

Ejemplo:
```
Título: Los mensajes con emojis causan error en la API

Descripción:
Cuando envío un mensaje con emojis, recibo un error de 500.

Pasos a reproducir:
1. Iniciar el servidor
2. Enviar mensaje "Hola 👋"
3. Ver error en consola

Error: ...
```

## 💡 Solicitar Nuevas Características

Para sugerir una mejora:

1. **Abre un issue** con el tag `enhancement`
2. **Explica el use case**: ¿Qué problema resuelve?
3. **Proporciona ejemplos**: Cómo debería funcionar
4. **Considera el impacto**: ¿Afecta la compatibilidad?

## 🔧 Proceso de Contribución

### 1. Fork el Repositorio

```bash
git clone https://github.com/tu-usuario/medpet.git
cd medpet
```

### 2. Crea una Rama

```bash
git checkout -b feature/nombre-descriptivo
# o para fixes
git checkout -b fix/descripcion-del-bug
```

**Convenciones de nombre:**
- `feature/descripcion-feature` - Nueva funcionalidad
- `fix/descripcion-bug` - Corrección de bug
- `docs/descripcion` - Cambios de documentación
- `test/descripcion` - Nuevos tests

### 3. Realiza tus Cambios

- Escribe código limpio y legible
- Sigue el estilo existente del proyecto
- Agrega comentarios solo donde sea necesario
- Asegúrate de no dejar código muerto

### 4. Testing

```bash
npm test
```

Asegúrate de:
- ✅ Los tests existentes pasen
- ✅ Agregar nuevos tests si aplica
- ✅ Probar manualmente la funcionalidad

### 5. Commit

```bash
git add .
git commit -m "tipo(scope): descripción breve"
```

**Formato de commit (Conventional Commits):**
- `feat:` Nuevas funcionalidades
- `fix:` Correcciones de bugs
- `docs:` Cambios de documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactoring de código
- `perf:` Mejoras de performance
- `test:` Agregar o actualizar tests

Ejemplos:
```
feat(openai): agregar soporte para GPT-4o turbo
fix(whatsapp): corregir envío de mensajes con emojis
docs(readme): actualizar instrucciones de instalación
```

### 6. Push a tu Fork

```bash
git push origin feature/nombre-descriptivo
```

### 7. Abre un Pull Request

En GitHub:

1. Ve a tu fork
2. Haz click en "Compare & pull request"
3. **Llena el template de PR** con:
   - Descripción clara de cambios
   - Problema que resuelve (referencia a issue si aplica)
   - Cómo fue testeado
   - Capturas de pantalla si aplica

4. Espera revisión

## 📝 Guía de Estilo

### JavaScript

- Usa `const` por defecto, `let` si es necesario, nunca `var`
- Usa comillas simples `'` o backticks para templates
- Punto y coma al final de sentencias
- Indentación de 2 espacios
- Nombres descriptivos (no `x`, `temp`, etc.)

```javascript
// ✅ Bien
const userName = user.profile.name;
const greeting = `Hola ${userName}`;

// ❌ Mal
var x = u.p.n;
let greeting = "Hola " + x;
```

### Estructura de Archivos

```
src/
├── services/     # Lógica de negocio
├── controllers/  # Controladores
├── routes/       # Rutas de Express
├── config/       # Configuración
└── utils/        # Funciones auxiliares
```

### Async/Await

Siempre usa async/await en lugar de `.then()`:

```javascript
// ✅ Bien
async function handleMessage(message) {
  try {
    const response = await openAiService(message);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// ❌ Mal
function handleMessage(message) {
  return openAiService(message).then(response => {
    return response;
  });
}
```

## 🔍 Proceso de Revisión

Cuando abres un PR:

1. **CI/CD Checks**: Verifica que pasen todos los tests
2. **Code Review**: Mantenedores revisarán el código
3. **Solicitud de Cambios**: Si hay problemas, te los haremos saber
4. **Aprobación y Merge**: Una vez aprobado, se hará merge a main

## 📚 Documentación

- Actualiza el README si cambias funcionalidad
- Comenta código complejo
- Mantén JSDoc actualizado
- Agrega ejemplos si introduces nuevas APIs

## 🚀 Checklist Antes de Enviar PR

- [ ] He leído y entiendo el CONTRIBUTING.md
- [ ] Mi rama está basada en main actualizado
- [ ] He agregado/actualizado tests
- [ ] Todos los tests pasan (`npm test`)
- [ ] He seguido el estilo del código del proyecto
- [ ] He actualizado la documentación relevante
- [ ] Mi commit message sigue Conventional Commits
- [ ] No tengo conflictos con main

## ❓ Preguntas

- Abre una **Issue** con tag `question`
- Participa en **Discussions** si tu repositorio las tiene
- Contacta a los mantenedores en caso de dudas

## 🙏 Gracias

¡Apreciamos tu tiempo y esfuerzo en contribuir a Medpet! Cada contribución, por pequeña que sea, ayuda a mejorar el proyecto.

---

**Última actualización**: Mayo 2026
