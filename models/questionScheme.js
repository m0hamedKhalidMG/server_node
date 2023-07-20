import mongoose from "mongoose";
const {Schema} =mongoose
const coverSchema=new Schema({
    createdAt:{type:Date,default:Date.now},
    title:{type: String,required: true},
    desc:{type: String,required: true},
    num:{type: String,required: true},
    duration:{type: String,required: true},
    maxMark:{type: String,required: true},
    starttime:{type: String,required: true},
    id:{type: Number,required: true},

    active: { type: Boolean, required: true, default: false }
    })
    const questionSchema=new Schema({
        questions:{type:Array,default:[]},
        answers:{type:Array,default:[]},
        createdAt:{type:Date,default:Date.now},
        cover:{ type: Schema.Types.ObjectId, ref: 'Cover' },
        })
        
    const Cover = mongoose.model('Cover', coverSchema);
    const Questions = mongoose.model('Question', questionSchema);    
    export { Cover, Questions };