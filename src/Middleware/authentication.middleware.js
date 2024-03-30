import { asyncHandler } from "./../utils/errorHandling.js"
import jwt from 'jsonwebtoken'
import {tokenModel} from '../../DB/models/token.model.js'
import {userModel} from '../../DB/models/user.model.js'
export const isAuthenticated = asyncHandler(async(req , res ,next) =>{
    //check token existence an type
    let token = req.headers["token"]
    if(!token || !token.startsWith(process.env.BEARER_KEY)) 
      return next(new Error("valid token is required" , 400))
    //check payload
    token = token.split(process.env.BEARER_KEY)[1]
    const decoded = jwt.verify(token,process.env.TOKEN_KEY)
    if(!decoded) return next(new Error("Invalid token !"))
    //check token in DB

    const tokenDB = await tokenModel.findOne({token , isvalid:true })
    if(tokenDB) return next(new Error(" Token expired !"))

    //check user existence
    const user = await userModel.findOne({email:decoded.email})
    if(!user) return next(new Error("User not found !"))
    //pass user
    req.user=user;
    //return next

    return next()
})