const express= require('express');
const authMiddle = require('../middlewares/authMiddle');
const { getAllUsersController, getAlldoctorController, changeAcccountStatusController, } = require('../controllers/adminCtrl');

const router = express.Router()


//GET METHOD FOR USERS
router.get('/getAllUsers',authMiddle, getAllUsersController)

// GET METHOD FOR DOCTORS
router.get('/getAllDoctors',authMiddle, getAlldoctorController)

//POST ACCOUNT STATUs
router.post('/changeAcoountStatus',authMiddle,changeAcccountStatusController)


module.exports=router