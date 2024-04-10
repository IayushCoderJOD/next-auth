import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.Mongo_Url!)
        const connection=mongoose.connection

        connection.on('connected',()=>{
            console.log("mongoDb connected")
        })

        connection.on('error',()=>{
            console.log("mongoDb connection error, please make sure db is up and running")
            process.exit();
        })
        
    } catch (error) {
        console.log("something went wrong")
    }
}