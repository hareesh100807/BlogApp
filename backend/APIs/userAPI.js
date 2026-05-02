import exp from 'express'
import {UserModel} from '../models/userModel.js'

import {ArticleSchema} from '../models/articleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const userApp = exp.Router()

//read articles of all authors
userApp.get("/article",verifyToken("USER"),async(req,res)=>{
	//read article 

	const articleList= await ArticleSchema.find({isArticleActive:true})

	//send response
	res.status(200).json({message:"Articles",payload:articleList})
})



//add comments to an article
userApp.put("/article",verifyToken("USER"),async(req,res)=>{
	//get the body of request
	const {articleId,comment} = req.body 

	//check Article
	const articleDoc = await ArticleSchema.findOne({_id:articleId,isArticleActive:true})
	if(!articleDoc){
		return res.status(404).json({message:"Article not found"})

	}
	const userId = req.user?.userId

	//add comment to comments array of articleDocument
	articleDoc.comments.push({user:userId,comment:comment})
	await articleDoc.save()
	res.status(200).json({message:"COMMENT IS ADDED"})

})




