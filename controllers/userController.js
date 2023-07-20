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
  const user = new UserModel(req.body);
  console.log(user)
  if (!validator.isEmail(user.Email)) {
    return res.status(400).json({ error: 'Invalid email format'   });
  }
  if (user.password !== user.confirmPassword) {
    return res.status(400).json({error:  'Passwords do not match' });
  }
  user.save()
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
  
  console.log(password)
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
              res.cookie('session', token.id, {
                httpOnly: true
            })

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
 