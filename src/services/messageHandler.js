import whatsappService from './whatsappService.js';

class MessageHandler {

  /* =========================
     Normalización de número
     (incluye parche Argentina)
  ========================= */
  normalizePhoneNumber(rawFrom) {
    if (!rawFrom) return rawFrom;

    // PARCHE ARGENTINA:
    // Meta a veces envía 549XXXXXXXXX cuando espera 54XXXXXXXXXX
    if (rawFrom.startsWith('549') && rawFrom.length === 13) {
      const normalized = rawFrom.replace(/^549/, '54');
      console.log(`[Parche AR] Número normalizado: ${rawFrom} → ${normalized}`);
      return normalized;
    }

    return rawFrom;
  }

  /* =========================
     Normalización de texto
  ========================= */
  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  /* =========================
     Similaridad (Levenshtein)
  ========================= */
  getSimilarity(a, b) {
    if (!a || !b) return 0;

    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) => {
        if (i === 0) return j;
        if (j === 0) return i;
        return 0;
      })
    );

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    return 1 - distance / Math.max(a.length, b.length);
  }

  /* =========================
     Detección de saludo
  ========================= */
  isGreeting(text) {
    const normalized = this.normalizeText(text);
    const words = normalized.split(/\s+/);

    const greetings = [
      'hola',
      'buenos',
      'buenas',
      'dia',
      'dias',
      'tardes',
      'noches',
      'hello',
      'hi',
      'hey'
    ];

    const SIMILARITY_THRESHOLD = 0.7;

    return words.some(word =>
      greetings.some(greeting =>
        this.getSimilarity(word, greeting) >= SIMILARITY_THRESHOLD
      )
    );
  }

  /* =========================
     Nombre del remitente
  ========================= */
  getSenderName(contact) {
    const rawName = contact?.profile?.name;

    if (!rawName) {
      return contact?.wa_id || '👋';
    }

    const noEmojis = rawName.replace(/[\p{Extended_Pictographic}]/gu, '');

    const cleanName = noEmojis
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
      .trim();

    const firstName = cleanName.split(/\s+/)[0];

    return firstName || '👋';
  }

  /* =========================
     Mensaje de bienvenida
  ========================= */
  async sendWelcomeMessage(to, messageId, contact) {
    const name = this.getSenderName(contact);

    const welcomeMessage =
      `Hola ${name}, bienvenido a *MEDPET* 🐾\n\n` +
      `Somos tu tienda de mascotas en línea.\n` +
      `¿En qué puedo ayudarte hoy?`;

    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  /* =========================
     Menú de bienvenida
  ========================= */
  async sendWelcomeMenu(to) {
    const menuMessage = 'Por favor, elige una opción:';

    const buttons = [
      {
        type: 'reply',
        reply: { id: 'option_agendar', title: 'Agendar' }
      },
      {
        type: 'reply',
        reply: { id: 'option_consultar', title: 'Consultar' }
      },
      {
        type: 'reply',
        reply: { id: 'option_ubicacion', title: 'Ubicación' }
      }
    ];

    await whatsappService.sendInteractiveButtons(
      to,
      menuMessage,
      buttons
    );
  }

  /* =========================
     Manejo de opciones del menú
  ========================= */
  async handleMenuOption(to, option) {
    console.log('Opción seleccionada:', option);

    let response;

    switch (option) {
      case 'option_agendar':
        response = '📅 *Agendar cita*\n\nIndicanos qué día y horario te gustaría.';
        break;

      case 'option_consultar':
        response = '💬 *Consultas*\n\nContanos en qué podemos ayudarte.';
        break;

      case 'option_ubicacion':
        response = '📍 *Nuestra ubicación*\n\nEstamos en Av. Principal 123, Ciudad.';
        break;

      default:
        response =
          '❌ Lo siento, no entendí tu selección.\n' +
          'Por favor, elegí una de las opciones del menú.';
    }

    await whatsappService.sendMessage(to, response);
  }

  /* =========================
     Handler principal
  ========================= */
  async handleIncomingMessage(message) {
    if (!message) return;

    // 👉 Normalizamos el número UNA SOLA VEZ
    const to = this.normalizePhoneNumber(message.from);

    /* ========= MENSAJE DE TEXTO ========= */
    if (message?.type === 'text') {
      const incomingText = message.text?.body || '';

      if (this.isGreeting(incomingText)) {
        await this.sendWelcomeMessage(
          to,
          message.id,
          message.contact
        );

        await this.sendWelcomeMenu(to);
      } else {
        const response = `Echo: ${incomingText}`;
        await whatsappService.sendMessage(to, response, message.id);
      }

      await whatsappService.markAsRead(message.id);
    }

    /* ========= MENSAJE INTERACTIVO ========= */
    else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.id;

      await this.handleMenuOption(to, option);
      await whatsappService.markAsRead(message.id);
    }
  }
}

export default new MessageHandler();