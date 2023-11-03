const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      let userExist = await prisma.user.findUnique({
        where: { email: email }
      });

      if (userExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Email sudah digunakan!',
          data: null
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);

      // Buat entri baru dalam model User
      let user = await prisma.user.create({
        data: {
          email,
          password: encryptedPassword
        }
      });

      // Dapatkan ID dari entri yang baru dibuat
      const idUser = user.id;

      // Buat entri dalam model UserProfile dengan ID yang telah didapatkan
      await prisma.userProfile.create({
        data: {
          idUser: idUser,
          first_name: null,
          last_name: null,
          birth_data: null,
          profile_picture: null
        }
      });

      return res.status(201).json({
        status: true,
        message: 'Dibuat',
        err: null,
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      let user = await prisma.user.findUnique({ where: { email }, });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'invalid email or password!',
          data: null
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'invalid email or password!',
          data: null
        });
      }

      let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: { user, token }
      });
    } catch (err) {
      next(err);

    }
  },
  authenticate: async (req, res, next) => {
    try {
      const user = req.user;
      const profileUser = await prisma.userProfile.findUnique({ where: { idUser: user.id, }, });
      return res.status(200).json({
        status: true,
        message: "OK",
        err: null,
        data: { user: { ...profileUser, email: user.email } },
      });
    } catch (err) {
      next(err);
    }
  }
}