const imagekit = require('../lib/imagekit');
const path = require('path');
const qr = require('qr-image');


module.exports = {
  // imagekit
  imagekit: async (req, res, next) => {
    try {
      // 
      const { userId, first_name, last_name, birth_date } = req.body;

      let strFile = req.file.buffer.toString('base64');

      let { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile
      });

      return res.json({
        status: true,
        message: 'OK',
        error: null,
        data: { userId, first_name, last_name, birth_date, profile_picture: url }
      })

    } catch (err) {
      next(err);
    }
  },

  // Generate Qrcode
  generateQrCode: async (req, res, next) => {
    try {
      let { qr_data } = req.body;
      if (!qr_data) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'qr_data is required!',
          data: null
        });
      }

      let qrPng = qr.imageSync(qr_data, { type: 'png' });
      let { url } = await imagekit.upload({
        fileName: Date.now() + '.png',
        file: qrPng.toString('base64')
      });

      return res.json({
        status: true,
        message: 'OK',
        error: null,
        data: { qr_code_url: url }
      });
    } catch (err) {
      next(err);
    }
  }
};