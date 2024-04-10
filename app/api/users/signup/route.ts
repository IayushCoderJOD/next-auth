import { connect } from "@/dbConfig/dbConnection";
import User from "@/models/userModel"
import {NextRequest,NextResponse} from 'next/server'
import bcryptjs from "bcryptjs"
import {sendMail} from "@/helpers/mailer"

connect();

export async function POST(req:NextRequest) {
    try {
        const reqBody=await req.json();
    const {username,email,password}=reqBody
    const user=  await User.findOne({email})
    if(user){
        return NextResponse.json({error:"User already exits"},{status:400})
    }
    // yaha validation bhi lagni chahiye..

    const salt= await bcryptjs.genSalt(10);
    const hashedPassword=await bcryptjs.hash(password,salt);
    const newUser=new User({
        username,
        email,
        password: hashedPassword
    })

    const savedUser= await newUser.save();
    console.log(savedUser)

    await sendMail({email,emailType:"VERIFY",userId:savedUser._id})

    return NextResponse.json({
        message:"user registered successfully",
        success:true,
        savedUser
    })  
    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message
            },{
                status: 500
            }
        );
        
    }
    
}