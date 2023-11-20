
const appointmentModel = require('../models/appointmentModel');
const doctorModel=require('../models/docterModels');
const userModels = require('../models/userModels');
const getDoctorInfoController= async(req,res)=>{
    try {
        const doctor=await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'doctor data fetch success',
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in Fetching Doctor Details'
        })
    }
}
const updateProfileController = async (req,res)=>{
    try {
        const doctor=await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body)
        res.status(201).send({
            success:true,
            message:'Doctor Profile updated',
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Doctor Profile update issue',
            error,
        })
    }
}
const getDoctorByIdController = async (req,res)=>{
    try {
        const doctor= await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:'Single Doctor Info get successfully',
            data:doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error getting Single Doctor Info',
            error
        })
    }
}
const appointmentfordoctorcontroller= async(req,res) =>{
    try {
        const doctor= await doctorModel.findOne({userId: req.body.userId})
        const appointments= await appointmentModel.find({doctorId:doctor.id})
        res.status(200).send({
            message:'Doctor Appointment fetch Successfully',
            success:true,
            data:appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error Doc Appointment ',
            error,
            
        })
    }
}
const updateStatusController= async (req,res)=>{
    try {
        const {appointmentsId,status}=req.body
        const appointments= await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
        const user= await userModels.findOne({_id:appointments.userId})
        const notification = user.notification
        notification.push({
            type:'status updated',
            message:`Your appointment has been ${status}`,
            onClickPath:'/doctor-appointments'

        })
        await user.save();
        res.status(200).send({
            success:true,
            message:'Appointment Status updated'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in upadating the status',
            error
        })
    }
}
module.exports={getDoctorInfoController,updateProfileController,getDoctorByIdController,appointmentfordoctorcontroller,updateStatusController};