const express =require('express')
const {getDoctorInfoController,updateProfileController, getDoctorByIdController, appointmentfordoctorcontroller, updateStatusController}=require('../controllers/doctorCtrl')
const authMiddle= require('../middlewares/authMiddle')
const router =express.Router()
//GET SINGLE DOC INFO
router.post('/getDoctorInfo',authMiddle,getDoctorInfoController)
router.post('/updateProfile',authMiddle,updateProfileController)
router.post('/getDoctorById',authMiddle,getDoctorByIdController)
router.get('/doctor-appointments',authMiddle,appointmentfordoctorcontroller)
router.post('/update-status',authMiddle,updateStatusController)

module.exports = router