const path = require('path')
const jimp = require('jimp')

const SUPPORTED_MIME_TYPES = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png"
};

const generate = (file, destination) => {
  return new Promise((resolve, reject) => {
    let extension = ""
    try {
      extension = path.extname(file)
      extension = extension.split('.').pop()
    } catch (ex) {
      return reject(ex)
    }

    if (!SUPPORTED_MIME_TYPES[extension]) {
      return reject("File not of correct type (extension)")
    }

    if (typeof destination === 'undefined') {
      destination = path.dirname(file)
    }

    const lqFile = path.join(destination, `${path.basename(file, path.extname(file))}-lq.${extension}`)

    jimp
      .read(file)
      .then(image => {
        return image
          .resize(10, jimp.AUTO)
          .blur(5)
          .write(lqFile)
      })
      .catch(err => reject(err))

    return resolve(`File generated @ ${lqFile}`)
  })
}

module.exports = {
  generate
}