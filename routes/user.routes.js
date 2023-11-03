const router = require('express').Router();
const { register, login, authenticate } = require('../controllers/user.controllers');
const { restrict } = require('../middlewares/user.middlewares');
const { } = require('../middlewares/user.middlewares');

router.post('/register', register);
router.post('/login', login);
router.get('/authenticate', restrict, authenticate);


module.exports = router;