import { Router, Request, Response } from "express";
import { Document } from "./controller/DocumenController";
import { Auth } from "./controller/AuthController";
import { Authentication } from "./middleware/middle";
import express from 'express';
import { verifyToken } from './middleware/middle';

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});


//authentication router
router.post('/api/register',Auth.register);
router.post('/api/login', Auth.Login);
router.patch('/api/update');
router.delete('/api/destroy');
router.post('/api/refresh', Auth.refresh);


//user list 
router.get("/api/userlist", Auth.UserList, Authentication.layer);
router.get("/api/documentlist", verifyToken, Document.list);
router.get("/api/documentlist/:documentid", verifyToken, Document.getById);
//document router
router.post('/api/document', Document.zahiral);
router.post('/api/documentpage1',);
router.get('/api/documentpage2');
router.patch('/api/');
router.delete('');

// Protected routes - add verifyToken middleware
router.get('/users', verifyToken, Auth.UserList);
router.put('/update', verifyToken, Auth.Update);

export default router;