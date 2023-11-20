const doctorModel= require('../models/docterModels');
const userModel= require('../models/userModels')
const getAllUsersController = async(req,res)=>{
    try {
        const users=await userModel.find({})
        res.status(200).send({
            success:true,
            message:'Users data',
            data:users
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while fetching users',
            error,
        })
    }
}
const getAlldoctorController = async(req,res) =>{
    try {
        const doctors=await doctorModel.find({});
        res.status(200).send({
            success:true,
            message:'doctors data',
            data:doctors,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while fetching doctors data',
            error,
        })
    }
}
//doctor account status
const changeAcccountStatusController=async (req,res)=>{
    try {
        const {doctorId , status}=req.body
        const doctor=await doctorModel.findByIdAndUpdate(doctorId,{status})
        const user=await userModel.findOne({_id:doctor.userId})
        const notification =user.notification
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your Doctor Account Request has ${status}`,
            onClickPath:'/notification',
        })
        user.isDoctor = status === "approved" ? true : status === 'reject' ? false: false;
        await user.save();
        res.status(201).send({
            success:true,
            message:'Account status updated',
            data:doctor,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in account status',
            error,
        })
    }
}
module.exports ={getAllUsersController,getAlldoctorController,changeAcccountStatusController}