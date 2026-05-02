import exp from 'express'
import {UserModel} from '../models/userModel.js'
import {ArticleSchema} from '../models/articleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const authorApp = exp.Router()

//write articles(protected route)
authorApp.post("/article",verifyToken("AUTHOR"),async(req,res)=>{
    //get articleobj from client
    const articleObj = req.body
    //get user from decoded token
    const user = req.user
    //check author
    let author = await UserModel.findById(articleObj.author)
   



    if(author.email !== user.email){
        return res.status(403).json({message:"Invalid author ID"})
    }
     if(!author){
        return res.status(404).json({message:"Invalid author"})
    }

    // if(author.role!=="AUTHOR"){
    //      return res.status(403).json({message:"Invalid author"})
    // }
    //create article document 
    const articleDoc = new ArticleSchema(articleObj)

    await articleDoc.save()
    res.status(201).json({message:"Article created"})
})
//read own articles
authorApp.get("/article",verifyToken("AUTHOR"),async(req,res)=>{
    const authorId = req.user?.userId
    const articles = await ArticleSchema.find({author:authorId})

    res.status(200).json({message:"details",payload:articles})
})


authorApp.put("/article",verifyToken("AUTHOR"),async(req,res)=>{
    // const update = req.body
    // let AAID = req.params.articleID
    //  //const updatedUser =await UserModel.findByIdAndUpdate(AAID,{$set:{ ...update}},{new:true,runValidators:true})
    //  const updatedUser =await UserModel.findOneAndUpdate(AAID,{$set:{ ...update}})


    // res.status().json({message:"details",payload:updatedUser})

    const authorIdOfToken = req.user?.userId
    const {articleId, articleID, title, category, content} = req.body
    const targetArticleId = articleId || articleID
    const ModifiedArticle = await ArticleSchema.findOneAndUpdate(
        {_id:targetArticleId,author:authorIdOfToken},
        {$set:{title,category,content}},
        {new:true}
    )

    if(!ModifiedArticle){
        return res.status(403).json({message:"Not authrosied to edit article"})
    }

    res.status(200).json({message:"Modified",payload:ModifiedArticle})

})

//delete article(soft delete)


authorApp.patch('/article',verifyToken("AUTHOR"),async(req,res)=>{
     const authorIdOfToken = req.user?.userId
    const {articleId, articleID, isArticleActive} = req.body;
    const targetArticleId = articleId || articleID

    const articleOfDB = await ArticleSchema.findOne({_id:targetArticleId,author:authorIdOfToken})

    if(!articleOfDB){
        return res.status(404).json({message:"Article not found"})
    }

    //check status
    if(isArticleActive === articleOfDB.isArticleActive){
        return res.status(200).json({message:"Article is already in the same state"})
    }

    articleOfDB.isArticleActive = isArticleActive
    await articleOfDB.save()

    //send response

    res.status(200).json({message:"Article modified ",payload:articleOfDB})


})