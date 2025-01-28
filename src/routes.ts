import { Router, Request, Response } from "express";
import { Document } from "./controller/DocumenController";
import { Auth } from "./controller/AuthController";
import { Authentication } from "./middleware/middle";
const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});


//authentication router
router.post('/api/register',Auth.register);
router.post('/api/login', Auth.Login);
router.patch('/api/update');
router.delete('/api/destroy');
router.post('/api/refresh');


//user list 
router.get("/api/userlist", Auth.UserList, Authentication.layer);
router.get("/api/documentlist");
router.get("/api/documentlist/:documentid");
//document router
router.post('/api/document', Document.zahiral);
router.post('/api/documentpage1',);
router.get('/api/documentpage2');
router.patch('/api/');
router.delete('');
export default router;