const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../lib/imagekit');
const multer = require("../lib/multer");
const path = require('path');

module.exports = {
  createProfile: async (req, res, next) => {
    try {
      const { userId, first_name, last_name, birth_date } = req.body;

      const strFile = req.file.buffer.toString('base64');

      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      // Sekarang, kami akan mengintegrasikan URL gambar ke profil pengguna.
      const newProfile = await prisma.userProfile.create({
        data: {
          userId,
          first_name,
          last_name,
          birth_date,
          profile_picture: url, // Menyimpan URL gambar sebagai tipe String
        },
      });

      res.status(201).json({
        status: true,
        message: "Profil berhasil dibuat!",
        data: newProfile,
      });
    } catch (err) {
      next(err);
    }
  },

  imagekit: async (req, res, next) => {
    try {
      const strFile = req.file.buffer.toString('base64');

      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      return res.json({
        status: true,
        message: 'OK',
        error: null,
        data: { profile_picture: url } // Menyimpan URL gambar dalam respons
      });
    } catch (err) {
      next(err);
    }
  },


  // get profiles detal by: id
  getDetailProfile: async (req, res, next) => {
    try {
      let { id } = req.params;
      let profiles = await prisma.userProfile.findUnique({
        where: { id: Number(id) }
      });

      if (!profiles) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No Profiles Found With Id ' + id
        });
      }

      res.status(200).json({
        status: true,
        message: 'Details Profiles',
        data: profiles
      });
    } catch (err) {
      next(err);
    }
  },

  // update data profiles
  updateProfiles: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { userId, first_name, last_name, birth_date, profile_picture } = req.body;

      let updateOperation = await prisma.userProfile.update({
        where: { id: Number(id) },
        data: {
          userId,
          first_name,
          last_name,
          birth_date,
          profile_picture
        }
      });

      res.status(200).json({
        status: true,
        message: 'Updated Profiles Successfuly!',
        data: updateOperation
      });
    } catch (err) {
      next(err);
    }
  }

};
