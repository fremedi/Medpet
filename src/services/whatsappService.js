import sendToWhatsApp from './httpRequest/sendToWhatsApp.js';

class WhatsAppService {

  /* =========================
     Enviar mensaje de texto
  ========================= */
  async sendMessage(to, body, replyToMessageId) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
      ...(replyToMessageId && {
        context: { message_id: replyToMessageId }
      }),
    };

    await sendToWhatsApp(data);
  }

  /* =========================
     Botones interactivos
  ========================= */
  async sendInteractiveButtons(to, bodyText, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: { buttons },
      },
    };

    await sendToWhatsApp(data);
  }

  /* =========================
     Envío de media
  ========================= */
  async sendMediaMessage(to, type, mediaUrl, caption) {
    const mediaObject = {};

    switch (type) {
      case 'image':
        mediaObject.image = { link: mediaUrl, caption };
        break;
      case 'audio':
        mediaObject.audio = { link: mediaUrl };
        break;
      case 'video':
        mediaObject.video = { link: mediaUrl, caption };
        break;
      case 'document':
        mediaObject.document = {
          link: mediaUrl,
          caption,
          filename: 'medpet-file.pdf'
        };
        break;
      default:
        throw new Error('Not Supported Media Type');
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type,
      ...mediaObject,
    };

    await sendToWhatsApp(data);
  }

  /* =========================
     Marcar mensaje como leído
  ========================= */
  async markAsRead(messageId) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    await sendToWhatsApp(data);
  }

  /* =========================
     Enviar contacto
  ========================= */
  async sendContactMessage(to, contact) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'contacts',
      contacts: [contact],
    };

    await sendToWhatsApp(data);
  }

  /* =========================
     Enviar ubicación
  ========================= */
  async sendLocationMessage(to, latitude, longitude, name, address) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'location',
      location: {
        latitude,
        longitude,
        name,
        address
      }
    };

    await sendToWhatsApp(data);
  }
}

export default new WhatsAppService();