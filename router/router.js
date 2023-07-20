import { Router } from "express";
import *as controlle from '../controllers/authlogin.js'
import {checkAuthentication}  from '../controllers/authlogin.js' ;
import { getUsers, postUser, getProfilePage, login,logout }  from'../controllers/userController.js' ;
import { checkAdmin } from "../controllers/Authadmin.js";
import *as controller from '../controllers/controllers.js'

const router=Router();
router.route('/questions')
.get(checkAuthentication,controller.getqestions)
.post(checkAdmin,controller.insertqestions)
.put(checkAdmin,controller.updatequestion)

router.route('/result')
.delete(checkAdmin,controller.dropresult)
.post(checkAuthentication,controller.storeresult)
router.route('/cover')
.get(checkAdmin,controller.getcover)
.post(checkAdmin,controller.insertcover) 
.put(checkAdmin,controller.updatecover)
router.route('/cover/:id')
.delete(checkAdmin,controller.delcover)
router.route('/questions/:id')
.get(checkAdmin,controller.getqestionsBYID)

router.route('/questions/:idcover/:id')
.delete(checkAdmin,controller.delquestion)


router.get('/users', checkAdmin, getUsers);
router.get('/profile', checkAuthentication, getProfilePage)
router.post('/signup', checkAdmin,postUser);
router.post('/login', login)
router.get('/logout',checkAuthentication, logout)

router.route('/result/:id')
.get(checkAuthentication,controller.attempts)

export default router
