// Shared business logic can be added here as the API grows.
const ImageKit = require('@imagekit/nodejs')
require('dotenv').config()

const Imagekitclient = new ImageKit({
    publicKey : process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(fileData, originalName) {
  const extension = originalName.split(".").pop();

  const result = await Imagekitclient.files.upload({
    file: fileData,
    fileName: `Lynk_Profile_${Date.now()}.${extension}`,
    folder: "BKND-Project/Lynk",
  });

  return result;
}

module.exports = uploadFile