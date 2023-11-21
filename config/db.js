const mongoose= require('mongoose')
mongoose.set('strictQuery', false);

const colors= require('colors')

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`MongoDB connected to ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`MongoDB Server Issue ${error}`.bgRed.white);
    }
}
module.exports= connectDB;