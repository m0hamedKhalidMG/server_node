import TokenModel from '../models/Token.js'
import UserModel from '../models/User.js'
import results from "../models/resultScheme.js";

import bcrypt from 'bcrypt';
import validator from 'validator';
export async function getUsers  (req, res)  {
  UserModel.find({}).then(data=>{

res.send(data)

  }).catch(err=>{

    console.error('Error while get user :', err);

    return res.status(400).json({error: err.message });

  })



} 
export async function postUser (req, res)  {
  //await UserModel.deleteMany()
  const user=req.body;
  const {confirmPassword}=user;
  delete user['confirmPassword'];
  console.log(confirmPassword)

 const saving_user = new UserModel(user);
  console.log(saving_user)
  if (!validator.isEmail(user.Email)) {
    return res.status(400).json({ error: 'Invalid email format'   });
  }
  if (saving_user.password !== confirmPassword) {
    return res.status(400).json({error:  'Passwords do not match' });
  }
  saving_user.save()
  .then(doc => {
    console.log(doc)
    return res.status(200).json({ message: 'Registration successful' });
  })
  .catch(err => {
    console.error('Error while saving user :', err);

    return res.status(400).json({error: err.message });

   // res.send('error while saving user');
  });
}
export async function getProfilePage (req, res)  {
  const currentUser = req.user;
  res.send(currentUser);
};

export async function login  (req, res)  {
  const { Email, password } = req.body;
  
  UserModel.findOne({ Email })
  .exec()
  .then(user => {
    if (!user) {
    
      res.send({ error: "unauthorized" });
    } else {
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) { 
            res.send({ error: "unauthorized" });
          } else {
            const token = new TokenModel({ userId: user.id, createdAt: Date.now() }) ;
            return token.save();   
          }
        })
        .then(token => {
            if(token){
              res.cookie('session', token.id, {secure: true, sameSite: 'none' })
            

          res.send(user);
        
        }
        });
    }
  })
  .catch(err => {
    console.error('Error while finding user:', err);
    res.send({ error: "unauthorized" });
  });
  

}
     



export async function logout(req, res) {
  const {session}=req.cookies;
  if(!session)
  {
    
    res.send({ error: "Unauthorized" });
    return;  }
    TokenModel.findOneAndDelete({_id:session}).exec()
    .then(()=>{
      res.clearCookie('session');
      res.send({ message: "Logged out successfully" });
    })
    .catch(err => {
      res.send({ error: "Something went wrong" });
    });

  }
 export async function user_update (req,res){
  const id = req.params.id;
  const newObject=req.body;
  console.log(newObject)
  UserModel.findByIdAndUpdate(id, newObject, { new: true })
  .then((Updateduser) => {
    console.log("Updateduser:", Updateduser);
    res.json({ msg: "Data Saved Successfully...!" });
  })
  .catch((error) => {
    res.json({ msg: "Error...!" });

    console.error("Error Updateduser:", error);
  });
 }
 export async function user_deleted(req, res) {
  const id = req.params.id;

  UserModel.findByIdAndDelete(id)
    .then((deluser) => {
      if (!deluser) {
        return res.status(404).json({ error: "user not found" });
      } else {
        Questions.findOneAndDelete({ UserModel: id }).then((deleted) => {
          console.log(deleted);
          if (deleted)
            return res.json({
              message: "user deleted successfully ",
              deluser,
            });
          else
            return res.json({
              message: "user deleted successfully ",
              deluser,
            });
        });
      }
    })
    .catch((error) => {
      return res.json({ message: "error ", error });
    });
}