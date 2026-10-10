const express = require('express')
const userProfilecontoller = require('../controllers/LynkPost.controller.js')
const userAuthcontroller = require('../controllers/auth.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js');
const upload = require('../middleware/upload.js')
const router = express.Router()

//AUTHENTICATIONS
router.post('/SignUp',userAuthcontroller.SignUp)
router.post('/Login',userAuthcontroller.Loginuser)
router.post('/Logout',userAuthcontroller.Logoutuser)
router.post("/forgot-password", userAuthcontroller.forgotPassword);
router.post("/reset-password/:token", userAuthcontroller.resetPassword);

router.post('/Lynks', authMiddleware, userProfilecontoller.Lynk)
router.get('/getLynk', authMiddleware, userProfilecontoller.getLynk)
router.delete('/Lynks/:id', authMiddleware, userProfilecontoller.deleteLynk)
router.post('/profile/image',upload.single('Profileimage'),authMiddleware,userProfilecontoller.uploadProfileImage)


module.exports = router