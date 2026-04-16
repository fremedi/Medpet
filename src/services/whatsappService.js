import sendToWhatsApp from './httpRequest/sendToWhatsApp.js';

class WhatsAppService {
  async sendMessage(to, body, replyToMessageId) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body },
      ...(replyToMessageId && {
        context: { message_id: replyToMessageId }
      }),
    };

    return sendToWhatsApp(data);
  }

  async sendInteractiveButtons(to, bodyText, buttons) {
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons,
        },
      },
    };

    await sendToWhatsApp(data);
  }

  async markAsRead(messageId) {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    return sendToWhatsApp(data);
  }
}

export default new WhatsAppService();