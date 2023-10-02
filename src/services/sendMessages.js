require('dotenv').config();
const Axios = require('axios');

const botToken = process.env.BOT_TOKEN;
const baseURL = `${process.env.BASE_URL}/bot${botToken}/`;

async function sendTextMessage(chat_id, textMessage) {
    try {
      const sendTextMessageUrl = `sendMessage?chat_id=${chat_id}&text=${textMessage}`;
      await sendUrlMessageToUser(sendTextMessageUrl);
      console.log("Send text message success!");
    }
    catch(error) {
      console.error("Erro em sendTextMessage: " + error.message);
    }
}
  
async function sendImageMessage(chat_id, imageMetadata) {
    try {
        const { title, url } = imageMetadata;

        const sendImageMessageUrl = `sendPhoto?chat_id=${chat_id}&photo=${url}&caption=${title}`;
        await sendUrlMessageToUser(sendImageMessageUrl);
        console.log("Send image message success!");
    }
    catch(error) {
        console.error("Erro em sendImageMessage: " + error.message);
    }
}

async function sendUrlMessageToUser(sendMessageUrl) {
    console.log(baseURL)
    const urlFinal = baseURL + sendMessageUrl;
    await Axios.get(urlFinal);
}

module.exports = {
    sendTextMessage,
    sendImageMessage
}