require('dotenv').config();
const Axios = require('axios');

const keyApiNasa = process.env.KEY_API_NASA;
const timeout = process.env.TIMEOUT;

async function getNasaData() {
    try {
      const { data } = await Axios.get(`https://api.nasa.gov/planetary/apod?api_key=${keyApiNasa}`, { timeout });
      return data;
    }
    catch(error) {
      if (error.code === 'ECONNABORTED') {
        console.error("Erro de timeout em getNasaImage: " + error.message);
      } 
      else {
        console.error("Erro desconhecido em getNasaImage: " + error.message);
      }
    }
}

module.exports = {
    getNasaData
}