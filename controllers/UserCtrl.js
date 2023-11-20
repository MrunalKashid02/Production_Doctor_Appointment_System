const UserModel= require('../models/userModels')
const bcrypt =require('bcryptjs');

const jwt= require('jsonwebtoken');
const doctorModel=require('../models/docterModels');
const moment = require('moment')
const appointmentModel= require('../models/appointmentModel');
const userModels = require('../models/userModels');



const registerController = async (req,res) => {
    try {
        const existingUser = await UserModel.findOne({email: req.body.email});
        if(existingUser){
            return res.status(200).send({message:`User Already Register`,success:false});
        }
        const password= req.body.password;
        const salt= await bcrypt.genSalt(10);       
        const hashedPassword= await bcrypt.hash(password, salt);
        req.body.password=hashedPassword;
        const newUser = new UserModel(req.body);
        await newUser.save();
        res.status(201).send({message:"Register Successfully",success:true});


    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message: `Register controller ${error.message}`});
    }
};

//login callback
const loginController = async (req,res) => {
    try {
        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({message: 'User not found', success:false});
        }
        const isMatch= await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.status(200).send({message: 'Invalid Email or Password',success:false});
        }
        const token =jwt.sign({id:user._id},process.env.JWT_TKN, {expiresIn: '1d'});
        res.status(200).send({message: "Login Successfully",success:true,token});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Error in Login CTRL ${error.message}`})
    }
}

const authController = async (req,res)=>{
    try {
        const user = await UserModel.findOne({_id:req.body.userId})
        user.password=undefined;
        if(!user){
            return res.status(200).send({
                message: 'user not found',
                success:false
            })
        }
        else{
            res.status(200).send({
                success:true,
                data :user
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Authentication error',
            success:false,
            error
        })
    }
}

//apply doctor control
const applyDoctorController =async(req,res)=>{
    try {
        const newDoctor= await doctorModel({...req.body,status:'pending'})
        await newDoctor.save();
        const adminUser= await UserModel.findOne({isAdmin:true});
        const notification=adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for Docter Account`,
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName +' '+newDoctor.lastName,
                onClickPath:"/admin/doctors"
            }
        });
        await UserModel.findByIdAndUpdate(adminUser._id,{notification});
        res.status(201).send({
            success:true,
            message:"Doctor Account Applied Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error While Applying for doctor"
        })
        
    }

};
const getAllNotificationController= async (req,res)=>{
    try {
        const user= await UserModel.findOne({_id:req.body.userId})
        const seenNotification= user.seenNotification
        const notification= user.notification
        seenNotification.push(...notification);
        user.notification = []
        user.seenNotification=notification
        const updatedUser= await user.save();
        res.status(200).send({
            success:true,
            message:'all notification marked as read',
            data:updatedUser
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error
        })
    }
}

//delete notification

const deleteAllNotificationController = async(req,res) =>{
    try {
        const user= await UserModel.findOne({_id:req.body.userId})
        user.notification= []
        user.seenNotification = []
        const updatedUser= await user.save();
        updatedUser.password=undefined;
        res.status(200).send({
            success:true,
            message:'Notifiacation deleted sucessfully',
            data:updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Unable to delete all Notification',
            error,
        })
    }
}
// 
const getAllDoctorsController = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({status:'approved'})
        res.status(200).send({
            success:true,
            message:"Doctors Lists Fetched Successfully",
            data:doctors
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Getting list of Doctors',
            error
        })
    }
}
const bookAppointmentController =async(req,res)=>{
    try {
        req.body.date=moment(req.body.date,'DD-MM-YYYY').toISOString()
        req.body.time= moment(req.body.time,'HH:mm').toISOString()
        req.body.status="pending"
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user= await UserModel.findOne({_id:req.body.doctorInfo.userId})
        user.notification.push({
            type:'New-appointment-request',
            message:`A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath:'/user/appointments'

        })
        await user.save();
        res.status(200).send({
            message:'Appointment Booked Successfully',
            success:true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error while booking appointment',
            success:false,
            error
        })
    }
}
const bookingAvailabilityController = async (req,res)=>{
    try {
        const date= moment(req.body.date, 'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1,'hours').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(1,'hours').toISOString()
        const doctorId= req.body.doctorId
        const appointments= await appointmentModel.find({doctorId,
            date,
            time:{
                $gte:fromTime, $lte:toTime
            }
        })
        if(appointments.length > 0){
            return res.status(200).send({
                message:'Appointments not Available at this time',
                success:true
            })
        }else{
            return res.status(200).send({
                success:true,
                message:'Appointments Available'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in Booking',
            error,
            success:false
        })
        
    }
}
const useAppointContoller= async(req,res)=>{
    try {
        const appointments= await appointmentModel.find({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'User Appointment list fetch Successfully',
            data:appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error getting User Appointment list',
            error
        })
    }
}

module.exports= {loginController,registerController,authController,applyDoctorController,getAllNotificationController,getAllDoctorsController,bookAppointmentController,deleteAllNotificationController,bookingAvailabilityController,useAppointContoller,};