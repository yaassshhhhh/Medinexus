import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`, {
        tls: true,
        tlsAllowInvalidCertificates: false,
        serverSelectionTimeoutMS: 10000,
    })

}

export default connectDB