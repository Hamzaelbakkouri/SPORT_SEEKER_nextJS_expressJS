import express from 'express';
import { protect, protectAdmin } from '../middleWare/authMiddleware';
import { newAccessToken } from '../controllers/userController';
import { createCity, deleteCity, getAllCitys, getCitiesByCountry, updateCity } from '../controllers/cityController';


const router = express.Router()

router.post('/create', protectAdmin, newAccessToken, createCity)
router.get('/getall', protect, newAccessToken, getAllCitys)
router.put('/update/:id', protectAdmin, newAccessToken, updateCity)
router.delete('/delete/:id', protectAdmin, newAccessToken, deleteCity)
router.get('/getallbycountry/:id', protect, newAccessToken, getCitiesByCountry)

export default router