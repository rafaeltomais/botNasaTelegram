const express = require("express");

const route = express('');

const { sendTextMessage, sendImageMessage } = require('./src/services/sendMessages.js'); 
const { getNasaData } = require('./src/services/getNasaData.js');
const { textNormalizer } = require('./src/services/textNormalizer.js');
const { getPhoebeData } = require('./src/services/getPhoebeData.js');

route.post("/", async (req, res) => {
    const receivedJSON = req.body;
   console.log(receivedJSON);
   
    if(undefined == receivedJSON.message) { 
        console.log("Without message");
        return 0;
    }
    
    const chat_id = receivedJSON.message.chat.id;
    const userInput = receivedJSON.message.text;
    const messageWithMedia = 
        receivedJSON.message.voice || 
        receivedJSON.message.photo || 
        receivedJSON.message.video || 
        receivedJSON.message.video_note || 
        receivedJSON.message.document || 
        receivedJSON.message.animation || 
        receivedJSON.message.location ||
        receivedJSON.message.contact ||
        receivedJSON.message.poll;
    const userInputNormalized = !messageWithMedia ? textNormalizer(userInput) : false;
    
    const regexGreeting = /^(ola)|^([oe]*i)$|(bomdia)|(boatarde)|(boanoite)/g;
    const regexFarewell = /(tchau)|^(xau(zim)?)$|(ate)((mais)|((\w)(proxima)$))/g;
    const regexNasa = /^(1)$|(nasa)/g;
    const regexPhoebe = /^(2)$|(phoebe)|(cachorr?a)|(cadela)|(foto)(\w)*(fib[ie])/g;

    //zero option - messages with medias
    if(messageWithMedia) {
        await sendTextMessage(chat_id, "Vish, por aqui só entendo mensagens de texto. Mensagens de mídias ainda não entendo.");
    }
    //first option - greeting message
    else if(userInputNormalized.match(regexGreeting)) {
        await sendTextMessage(chat_id, "Olá, seja muito bem vindo ao bot de imagens.%0A%0AEscolha uma das opções abaixo:%0A%0A1 - Foto da Nasa%0A2 - Foto da Phoebe");
    }
    //second option - farewell message
    else if(userInputNormalized.match(regexFarewell)) {
        await sendTextMessage(chat_id, "Até mais! Sempre que quiser dar uma olhadinha, estarei por aqui! 👋");
    }
    //third option - image from NASA message
    else if(userInputNormalized.match(regexNasa)) {
        const imageNasaData = await getNasaData();

        if(undefined === imageNasaData) {
            const imageDefault = {
            title: "M94: A Double Ring Galaxy",
            url: "https://apod.nasa.gov/apod/image/2306/M94_Brennan_960.jpg"
            } 
            await sendTextMessage(chat_id, "Ops, tivemos um problema para capturar a imagem de hoje, tente novamente mais tarde!%0A%0ADesculpe o transtorno, mas pra não ficar sem imagem irei uma que gostamos muito.");   
            await sendImageMessage(chat_id, imageDefault);
        }
        else {
            await sendTextMessage(chat_id, "Aqui temos todos os dias uma imagem diferente do espaço fornecida pela NASA!");
            await sendImageMessage(chat_id, imageNasaData);
        }
    } 
    //fourth option - Phoebe image message
    else if(userInputNormalized.match(regexPhoebe)) {
        const imagePhoebe = await getPhoebeData();
        
        await sendTextMessage(chat_id, "Temos um banco de fotos da Phoebe! %0A%0APara cada solicitação, nós te mandaremos uma diferente.");
        await sendImageMessage(chat_id, imagePhoebe);
    } 
    //fifth option - error message
    else {
        await sendTextMessage(chat_id, "Desculpe, não entendi sua mensagem, envie um 'oi' para ver o que podemos fazer por aqui.");
    }

  res.status(200).json(receivedJSON);
});

module.exports = route;