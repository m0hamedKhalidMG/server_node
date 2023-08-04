import { Router } from "express";
import { checkAuthentication } from "../controllers/authlogin.js";
import {
  getUsers,
  postUser,
  getProfilePage,
  login,
  logout,
  user_update,
  user_deleted,
} from "../controllers/userController.js";
import { Authadmin } from "../controllers/authaadmin.js";
import * as controller from "../controllers/controllers.js";
import {
  Reset_password,
  Forgetpassword,
  ForgetpasswordPost,
} from "../controllers/restpaswword.js";

const router = Router();
router
  .route("/questions")
  .post(Authadmin, controller.insertqestions)
  .put(Authadmin, controller.updatequestion);
  router.route("/questions/:title")
  .get(checkAuthentication, controller.getqestions)
router
  .route("/result")
  .delete(Authadmin, controller.dropresult)
  .post(checkAuthentication, controller.storeresult);
router
  .route("/cover")
  .get(Authadmin, controller.getcover)
  .post(Authadmin, controller.insertcover)
  .put(Authadmin, controller.updatecover);
router.route("/cover/:id").delete(Authadmin, controller.delcover);
router.route("/questions_admin/:id").get(Authadmin, controller.getqestionsBYID);

router
  .route("/questions/:idcover/:id")
  .delete(Authadmin, controller.delquestion);

router.get("/users", Authadmin, getUsers);
router.get("/profile", checkAuthentication, getProfilePage);
router.post("/signup", Authadmin, postUser);
router.post("/login", login);
router.get("/logout", checkAuthentication, logout);
router
  .route("/user/:id")
  .put(Authadmin, user_update)
  .delete(Authadmin, user_deleted);
router.route("/result/:id").get(checkAuthentication, controller.attempts);

router.get("/reset-password/:id/:token", Reset_password);

router.post("/forgot-password", Forgetpassword);

router.post("/reset-password/:id/:token", ForgetpasswordPost);

export default router;
