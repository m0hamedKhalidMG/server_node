import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const User = new mongoose.Schema({
  FullName: { type: String, required: true, max: 100 },
  Email: { type: String, required: true  },
  password: { type: String, required: true, min: 8, max: 15 },
  confirmPassword:{ type: String, required: true, min: 8, max: 15 },
  PhoneNumber: { type: String, required: true, min: 11, max: 15 },
  Group: { type: String, required: true },
  StreetAddress: { type: String, required: true },
  active:{type:Boolean},
  phase:{type:String},
  City:{type:String,required: true}
});
User.pre("save",async function(next){
    const user = this;
if(!user.isModified("password")){
    return next();}

    try {
      const existingUser = await this.model('UserModel').findOne({ Email: this.Email });
      if (existingUser) {
        throw new Error('Email already exists');
      }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
      } catch (error) {
        return next(error);
      }
    });


export default mongoose.model('UserModel', User)