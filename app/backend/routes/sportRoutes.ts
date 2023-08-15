import express from "express";
import { createSport, deleteSport, getAllSports, getSportByid, getSportsIntoOneSalle, updateSport } from "../controllers/sportController";
import { newAccessToken } from "../controllers/userController";
import { protect, protectAdmin } from "../middleWare/authMiddleware";

const router = express.Router()

router.post('/create', protectAdmin, newAccessToken, createSport)
router.delete('/delete/:id', protectAdmin, newAccessToken, deleteSport)
router.put('/update/:id', protectAdmin, newAccessToken, updateSport)
router.get('/getallsports/', protect, newAccessToken, getAllSports)
router.get('/getonesport/:id', protect, newAccessToken, getSportByid)
router.get('/sportsintosalle/:id', protect, newAccessToken, getSportsIntoOneSalle)


export default router