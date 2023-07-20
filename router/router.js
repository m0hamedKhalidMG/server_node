import { Router } from "express";
import *as controlle from '../controllers/authlogin.js'
import {checkAuthentication}  from '../controllers/authlogin.js' ;
import { getUsers, postUser, getProfilePage, login,logout }  from'../controllers/userController.js' ;
import { Authadmin } from "../controllers/Authadmin.js";
import *as controller from '../controllers/controllers.js'

const router=Router();
router.route('/questions')
.get(checkAuthentication,controller.getqestions)
.post(Authadmin,controller.insertqestions)
.put(Authadmin,controller.updatequestion)

router.route('/result')
.delete(Authadmin,controller.dropresult)
.post(checkAuthentication,controller.storeresult)
router.route('/cover')
.get(Authadmin,controller.getcover)
.post(Authadmin,controller.insertcover) 
.put(Authadmin,controller.updatecover)
router.route('/cover/:id')
.delete(Authadmin,controller.delcover)
router.route('/questions/:id')
.get(Authadmin,controller.getqestionsBYID)

router.route('/questions/:idcover/:id')
.delete(Authadmin,controller.delquestion)


router.get('/users', Authadmin, getUsers);
router.get('/profile', checkAuthentication, getProfilePage)
router.post('/signup', Authadmin,postUser);
router.post('/login', login)
router.get('/logout',checkAuthentication, logout)

router.route('/result/:id')
.get(checkAuthentication,controller.attempts)

export default router
