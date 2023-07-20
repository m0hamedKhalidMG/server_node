import mongoose from "mongoose";
import { Cover } from "../models/questionScheme.js";
import UserModel from '../models/User.js'
const {Schema} =mongoose
const resultModel= new Schema({
    result : { type : Array, default : []},
    createdAt : { type : Date, default : Date.now},
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    idcover:{type:String,required: true} ,
    degree:{type:String,required: true} 
})
export default mongoose.model("result",resultModel) 