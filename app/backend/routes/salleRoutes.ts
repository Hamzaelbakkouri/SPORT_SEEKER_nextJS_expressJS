import express from "express";
import { protect, protectAdmin } from "../middleWare/authMiddleware";
import { newAccessToken } from "../controllers/userController";
import { createSalle, deleteSalle, getAllSalles, getOnesalle, getSallesByOneSport, updateSalle } from "../controllers/salleController";

const router = express.Router()

router.post('/create', protectAdmin, newAccessToken, createSalle)
router.delete('/delete/:id', protectAdmin, newAccessToken, deleteSalle)
router.put('/update/:id', protectAdmin, newAccessToken, updateSalle)
router.get('/sallesbysport/:id', protect, newAccessToken, getSallesByOneSport)
router.get('/getonesalle/:id', protect, newAccessToken, getOnesalle)
router.get('/getallsalles/', protect, newAccessToken, getAllSalles)


export default router