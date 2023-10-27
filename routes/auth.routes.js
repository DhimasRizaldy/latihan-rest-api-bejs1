const router = require('express').Router();
const { image } = require('../lib/multer');
const { register, login, whoami } = require('../controllers/auth.controllers');
// const { imagekit, generateQrCode } = require('../controllers/media.controllers');
const { restrict } = require('../middlewares/auth.middlewares');
const { createProfile, getDetailProfile, updateProfiles, imagekit } = require('../controllers/profile.controllers');

// auth register & login:
router.post('/register', register);
router.get('/login', login);
router.get('/whoami', restrict, whoami);

// const multer = require('multer')();
// Menerima gambar dengan endpoint '/upload-image'
// router.post('/imagekit/images', image.single('profile_picture'), imagekit);

// Upload gambar profil pengguna dengan endpoint '/profile'
router.post('/profile', createProfile);
router.post('/profile', image.single('profile_picture'), createProfile);
router.get('/profile/:id', getDetailProfile);
router.put('/profile/:id', updateProfiles);


router.post('/imagekit/images', image.single('image'), imagekit);

module.exports = router;
