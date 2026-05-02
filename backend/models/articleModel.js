import {Schema,model,Types} from 'mongoose'

const commentSchema = new Schema({
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"user ID is required"]
    },
    comment:{
        type:String,
        required:[true,"Enter a comment"]
    },
})

const articleSchema = new Schema({
    author:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"Author ID is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"]
    },
    content:{
        type:String,
        required:[true,"Author ID is required"]
    },
    comments:[{type: commentSchema,default:[]}],
    isArticleActive:{
        type:Boolean,
        default:true
    }
},{
    versionKey:false,
    timestamps:true
})

export const ArticleSchema = model("article",articleSchema)
