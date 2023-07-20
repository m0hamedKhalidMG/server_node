import TokenModel from "../models/Token.js";
import UserModel from "../models/User.js";
    
export async function Authadmin(req, res, next) {
    
      const token = req.cookies.session;
      if (!token) {
        res.statusCode = 401;
        res.send("Unauthorized");
        return;
      }
      console.log(token);
      TokenModel.findOne({ _id: token })
        .exec()
        .then((token) => {
          if (!token) {
            res.statusCode = 401;
            res.send("Unauthorized");
          } else {
            UserModel.findOne({ _id: token.userId ,role:"admin"})
              .exec()
              .then((user) => {
                req.user = user;
                next();
              })
              .catch((err) => {
                console.error("Error while finding user:", err);
                res.send({ error: "unauthorized" });
              });
          }
        })
        .catch((err) => {
          console.error("Error while finding user:", err);
          res.send({ error: "unauthorized" });
        });
    }
    