const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../lib/imagekit');
const path = require('path');

// export
module.exports = {
  // create profile
  createProrile: async (req, res, next) => {
    try {
      let { userId, first_name, last_name, birth_date} = req.body;

      let strFile = req.file.buffer.toString('base64');

      let

      let newProfile = await prisma.userProfile.create({
        data: {
          userId,
          first_name,
          last_name,
          birth_date,
          profile_picture,
        },
      });

      res.status(201).json({
        status: true,
        message: "Created Profile Successfuly!",
        data: newProfile
      })
    } catch (err) {
      next(err);
    }
  }


}