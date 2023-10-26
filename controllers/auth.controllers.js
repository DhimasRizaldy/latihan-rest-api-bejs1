const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  // Register
  register: async (req, res, next) => {
    try {
      // inisialisasi
      let { email, password, password_confirmation } = req.body;
      // kondisi
      if (password != password_confirmation) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'please ensure that the password and password confirmation match!',
          data: null
        });
      }

      // cek user jika email sudah terdaftar
      let userExist = await prisma.user.findUnique({ where: { email } });
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'user has already been user!',
          data: null
        });
      }

      // ecryption password (hash)
      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          email,
          password: encryptedPassword
        }
      });

      return res.status(201).json({
        status: true,
        message: 'Create User Susccessfuly!',
        err: null,
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  // Login
  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Invalid email or password!',
          data: null
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'Invalid email or password!',
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

  whoami: (req, res, next) => {
    return res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: { user: req.user }
    });
  },

  
};