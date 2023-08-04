import { sendEmail } from "../sendEmail .js";
import UserModel from "../models/User.js";

const JWT_SECRET =
  "zadvay6ert7283928944aiyg8t87qt72393293883ucffiuh78ttq3ifi78272jbgt?[]]pou89ywe";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export async function Reset_password(req, res) {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await UserModel.findOne({ _id: id });
  console.log(oldUser);
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("reset-password", {
      email: verify.Email,
      status: "Not Verified",
    });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
}
export async function Forgetpassword(req, res) {
  const { email } = req.body;
  const oldUser = await UserModel.findOne({ Email: email });

  if (!oldUser) {
    return res.status(400).json({ error: "User Not Exists!!" });
  }

  const secret = JWT_SECRET + oldUser.password;
  const token = jwt.sign({ Email: oldUser.Email, id: oldUser._id }, secret, {
    expiresIn: "5m",
  });
  const link = `${req.protocol}://${req.headers.host}/api/reset-password/${oldUser._id}/${token}`;
  sendEmail(
    oldUser.Email,
    "Password Reset",
    `Click this link to reset your password:${link}`
  );
  return res.status(200).json({ message: "sent email" });
}
export async function ForgetpasswordPost(req, res) {
  const { token } = req.params;
  const { password, confirmpassword } = req.body;
  console.log(req.body);
  const id = req.params.id;
  if (password === confirmpassword) {
    const oldUser = await UserModel.findOne({ _id: id });

    console.log(oldUser);

    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await UserModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );

      res.render("reset-password", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  } else {
    res.json({ status: "Passwords do not match" });
  }
}
