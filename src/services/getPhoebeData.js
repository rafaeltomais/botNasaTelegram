require('dotenv').config()
const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUD_NAME
const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET

cloudinary.config({
cloud_name: cloudName,
api_key: apiKey,
api_secret: apiSecret
});

async function getPhoebeData() {
    return new Promise((resolve, reject) => {
        cloudinary.api.resources({ type: 'upload', prefix: 'phoebe-photos/', max_results: 20 }, async (error, result) => {
        if(error){
            console.error(error);
            reject(error);
        }
        else{
            const bdPhoebePhotos = result.resources.map(resource => resource.public_id);
            const randomIndex = Math.floor(Math.random() * (bdPhoebePhotos.length + 1));
            const imagePhoebe = bdPhoebePhotos[randomIndex];

            try {
                const selectedImage = await getImageMetadata(imagePhoebe);
                resolve(selectedImage);
                return selectedImage;
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        }
        });
    })
}

async function getImageMetadata(publicId) {
  try {
    const { url, context: { custom: { caption } } } = await cloudinary.api.resource(publicId);
    const metadata = {
        title: caption,
        url: url,
    }
    return metadata;
  } catch (error) {
    return await getImageMetadata('phoebe-photos/alegre-quintal');
  }
}

module.exports = {
    getPhoebeData
}