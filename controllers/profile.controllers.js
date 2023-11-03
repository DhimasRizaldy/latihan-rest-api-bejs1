const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imageKit = require('../libs/imagekit');
const path = require('path');

module.exports = {
  // update profile
  updateProfile: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { idUser, first_name, last_name, birth_date } = req.body;
      idUser = Number(idUser);
      let strFile = req.file.buffer.toString('base64');

      let profileExist = await prisma.userProfile.findUnique({ where: { id: Number(id) } });
      if (!profileExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'profile not found!',
          data: null
        });
      }
      let idUserExist = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!idUserExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'idUser not found!',
          data: null
        });
      }

      // Simpan URL `profile_picture` lama
      const oldProfilePictureURL = profileExist.profile_picture;

      // Hapus foto lama dari ImageKit jika ada
      if (oldProfilePictureURL) {
        imageKit.deleteFile(oldProfilePictureURL, function (error, result) {
          if (error) {
            console.log('Gagal menghapus foto lama:', error);
          } else {
            console.log('Berhasil menghapus foto lama:', result);
          }
        });
      }

      let { url } = await imageKit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile
      });

      let updateProfile = await prisma.userProfile.update({
        where: { idUser: Number(id) },
        data: {
          first_name,
          last_name,
          birth_date,
          profile_picture: url
        }
      });

      return res.status(200).json({
        status: true,
        message: 'Profile Updated!',
        err: null,
        data: { updateProfile }
      });

    } catch (err) {
      next(err);
    }
  }
}
