import {Schema,model} from 'mongoose'

const userSchema = new Schema({
    firstName:{
        type:String,
        required:[true,'first name is required'],
        
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already exists']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,'{Value} Invalid role']
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true,
    versionKey:false,
    strict:"throw"
}
)


//cretate model

export const UserModel = model("user",userSchema)