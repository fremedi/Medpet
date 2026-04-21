import whatsappService from './whatsappService.js';
import appendToSheet from './googleSheetsService.js';
import openAiService from './openAiService.js';

class MessageHandler {
  constructor() {
    this.appointmentState = {};
    this.assistandState = {}; // estado asistente IA
  }

  /* ========================= Normalización de número (parche Argentina) ========================= */
  normalizePhoneNumber(rawFrom) {
    if (!rawFrom) return rawFrom;

    if (rawFrom.startsWith('549') && rawFrom.length === 13) {
      const normalized = rawFrom.replace(/^549/, '54');
      console.log(`[Parche AR] ${rawFrom} → ${normalized}`);
      return normalized;
    }
    return rawFrom;
  }

  /* ========================= Normalización de texto ========================= */
  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  /* ========================= Expansión de abreviaciones ========================= */
  expandAbbreviations(text) {
    const map = {
      bns: 'buenas',
      bno: 'buenos',
      trds: 'tardes',
      tds: 'todos',
      bn: 'bien',
      d: 'dia',
      q: 'que',
      xq: 'porque',
      x: 'por'
    };

    return text
      .split(/\s+/)
      .map(word => map[word] || word)
      .join(' ');
  }

  /* ========================= Similaridad (Levenshtein) ========================= */
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

  /* ========================= Detección de saludo ========================= */
  isGreeting(text) {
    let normalized = this.normalizeText(text);
    normalized = this.expandAbbreviations(normalized);

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

    return words.some(word =>
      greetings.some(g => this.getSimilarity(word, g) >= 0.7)
    );
  }

  /* ========================= Nombre del remitente ========================= */
  getSenderName(contact) {
    const rawName = contact?.profile?.name;
    if (!rawName) return contact?.wa_id || '👋';

    const noEmojis = rawName.replace(/[\p{Extended_Pictographic}]/gu, '');
    const clean = noEmojis.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
    const firstName = clean.split(/\s+/)[0];

    return firstName || '👋';
  }

  /* ========================= Mensaje de bienvenida ========================= */
  async sendWelcomeMessage(to, messageId, contact) {
    const name = this.getSenderName(contact);

    const text = `Hola ${name}, bienvenido a *MEDPET* 🐾🐶🐱

Somos tu tienda de mascotas en línea.
¿En qué puedo ayudarte hoy?`;

    await whatsappService.sendMessage(to, text, messageId);

    await whatsappService.sendMediaMessage(
      to,
      'image',
      'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png',
      ' '
    );
  }

  /* ========================= Menú principal ========================= */
  async sendWelcomeMenu(to) {
    const text = 'Por favor, elegí una opción:';

    const buttons = [
      { type: 'reply', reply: { id: 'option_agendar', title: 'Agendar' } },
      { type: 'reply', reply: { id: 'option_consultar', title: 'Consultar' } },
      { type: 'reply', reply: { id: 'option_ubicacion', title: 'Ubicación' } }
    ];

    await whatsappService.sendInteractiveButtons(to, text, buttons);
  }

  /* ========================= Opciones del menú ========================= */
  async handleMenuOption(to, option) {
    let response;

    switch (option) {
      case 'option_agendar':
        this.appointmentState[to] = {
          step: 'fullName',
          fullName: null,
          dni: null,
          petName: null,
          petType: null,
          reason: null
        };

        response =
          '📅 *Agendar cita*\n\nPara comenzar, indicame tu *nombre completo*:';
        break;

      case 'option_consultar':
        this.assistandState[to] = { step: 'question' };

        response =
          '💬 *Consultas*\n\nContanos en qué podemos ayudarte.';
        break;

      case 'option_ubicacion':
        response =
          '📍 *Nuestra ubicación*\n\nEstamos en Av. Principal 123, Río Cuarto, Córdoba.';
        break;

      default:
        response =
          '❌ No entendí tu selección.\nPor favor, elegí una opción del menú.';
    }

    await whatsappService.sendMessage(to, response);
  }

  /* ========================= Flujo asistente IA ========================= */
  async handleAssistandFlow(to, message) {
    const state = this.assistandState[to];
    if (!state) return;

    let response = 'No pude procesar tu consulta.';

    if (state.step === 'question') {
      try {
        response = await openAiService(message);
      } catch (err) {
        console.error('❌ Error OpenAI:', err);
        response = 'No pude procesar tu consulta en este momento.';
      }
    }

    delete this.assistandState[to];

    const menuMessage = '¿La respuesta fue de tu ayuda?';

    const buttons = [
      { type: 'reply', reply: { id: 'option_4', title: 'Si, Gracias' } },
      { type: 'reply', reply: { id: 'option_5', title: 'Hacer otra pregunta' } },
      { type: 'reply', reply: { id: 'option_6', title: 'Emergencia' } }
    ];

    await whatsappService.sendMessage(to, response);
    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  /* ========================= Opciones de asistente IA ========================= */
  async handleAssistandButtons(to, option) {
    switch (option) {

      case 'option_4':
        delete this.assistandState[to];
        await whatsappService.sendMessage(
          to,
          '¡Genial! 😊 Me alegra haber podido ayudarte.'
        );
        break;

      case 'option_5':
        this.assistandState[to] = { step: 'question' };
        await whatsappService.sendMessage(
          to,
          'Perfecto 👍 Haceme tu nueva consulta.'
        );
        break;

      case 'option_6':
        delete this.assistandState[to];
        await this.sendContact(to);
        await whatsappService.sendMessage(
          to,
          '🚨 Emergencia registrada. Un especialista te contactará.'
        );
        break;

      default:
        await whatsappService.sendMessage(
          to,
          'No entendí la opción seleccionada.'
        );
    }
  }

  /* ========================= Flujo de agendamiento ========================= */
  async handleAppointmentFlow(to, message) {
    const state = this.appointmentState[to];
    if (!state) return;

    let response;

    switch (state.step) {
      case 'fullName':
        state.fullName = message;
        state.step = 'dni';
        response = 'DNI sin puntos:';
        break;

      case 'dni':
        state.dni = message;
        state.step = 'petName';
        response = 'Nombre de la mascota:';
        break;

      case 'petName':
        state.petName = message;
        state.step = 'petType';
        response = 'Tipo de mascota:';
        break;

      case 'petType':
        state.petType = message;
        state.step = 'reason';
        response = 'Motivo de consulta:';
        break;

      case 'reason':
        state.reason = message;
        response = this.completeAppointment(to, state);
        delete this.appointmentState[to];
        break;
    }

    await whatsappService.sendMessage(to, response);
  }

  /* ========================= Confirmación final ========================= */
  completeAppointment(to, appointment) {
    appendToSheet([
      to,
      appointment.fullName,
      appointment.dni,
      appointment.petName,
      appointment.petType,
      appointment.reason,
      new Date().toISOString()
    ]);

    return `✅ Cita registrada

👤 ${appointment.fullName}
🪪 ${appointment.dni}
🐾 ${appointment.petName} (${appointment.petType})
📝 ${appointment.reason}`;
  }

  /* ======================= CONTACTO Y UBICACIÓN ======================= */
  async sendContact(to) {
  const contact = {
    name: {
      formatted_name: 'MedPet Emergencias',
      first_name: 'MedPet',
      last_name: 'Emergencias'
    },
    phones: [
      {
        phone: '+5493585484890',
        wa_id: '5493585484890',
        type: 'WORK'
      }
    ]
  };

  await whatsappService.sendContactMessage(to, contact);
}

  async sendLocation(to) {
    await whatsappService.sendLocationMessage(
      to,
      -33.1304,
      -64.3527,
      'MedPet',
      'Río Cuarto, Córdoba'
    );
  }

  /* ========================= HANDLER PRINCIPAL ========================= */
  async handleIncomingMessage(message) {
    if (!message?.from) return;

    const to = this.normalizePhoneNumber(message.from);

    if (message.type === 'text') {
      const text = message.text?.body || '';

      if (this.appointmentState[to]) {
        await this.handleAppointmentFlow(to, text);
        return;
      }

      if (this.assistandState[to]) {
        await this.handleAssistandFlow(to, text);
        return;
      }

      if (this.isGreeting(text)) {
        await this.sendWelcomeMessage(to, message.id, message.contact);
        await this.sendWelcomeMenu(to);
      } else {
        await whatsappService.sendMessage(to, `Echo: ${text}`);
      }
    }

    if (message.type === 'interactive') {
      const option = message?.interactive?.button_reply?.id;
      if (!option) return;

      if (
        ['option_agendar','option_consultar','option_ubicacion'].includes(option)
      ) {
        await this.handleMenuOption(to, option);
      }

      if (
        ['option_4','option_5','option_6'].includes(option)
      ) {
        await this.handleAssistandButtons(to, option);
      }
    }
  }
}

export default new MessageHandler();