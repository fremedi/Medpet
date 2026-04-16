import axios from "axios";
import https from "https";
import config from '../../config/env.js';

// Instancia de Axios para evitar problemas de certificado local, igual que en server.js
const agent = new https.Agent({
  rejectUnauthorized: false
});
const axiosInstance = axios.create({ httpsAgent: agent });

const sendToWhatsApp = async (data) => {
    const baseUrl = `${config.BASE_URL}/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`;
    const headers = {
        Authorization: `Bearer ${config.API_TOKEN}`
    };

    try {
        const response = await axiosInstance({
            method: 'POST',
            url: baseUrl,
            headers: headers,
            data,
        })
        return response.data;
    } catch (error) {
        console.error("Error al comunicarse con WhatsApp Graph API:");
        if (error.response) {
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("No se recibió respuesta:", error.request);
        } else {
            console.error("Mensaje de error:", error.message);
        }
    }
};

export default sendToWhatsApp;