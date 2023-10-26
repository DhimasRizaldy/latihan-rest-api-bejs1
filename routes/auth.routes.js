const router = require('express').Router();
const { image } = require('../lib/multer');
const { register, login, whoami } = require('../controllers/auth.controllers');
const { imagekit, generateQrCode } = require('../controllers/media.controllers');
const { restrict } = require('../middlewares/auth.middlewares');

// auth register & login:
router.post('/register', register);
router.get('/login', login);
router.get('/whoami', restrict, whoami);


// imagekit
router.post('/imagekit/images', image.single('image'), imagekit);



module.exports = router;