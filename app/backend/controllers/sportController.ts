import asyncHandler from 'express-async-handler';
import SportModel from '../models/sportModel';
import { SalleModel } from '../models/salleModel';


const createSport = asyncHandler(async (req: any, res: any) => {
    try {
        await new SportModel(req.body).save()
        return res.status(200).json({ error: false, message: "sport created successfully" })
    } catch (error) {
        return res.status(409).json({ error: true, message: "sport already exist , or something whent wrong " })
    }
})

const getSportByid = asyncHandler(async (req: any, res: any) => {
    const sportID = req.params.id
    try {
        const sport = await SportModel.findById(sportID)
        return res.status(200).json({ error: false, sport })
    } catch (error) {
        return res.status(200).json({ error: true, message: "something went wrong" })
    }
})

const getAllSports = asyncHandler(async (req: any, res: any)=>{
    try {
        const allSport = await SportModel.find({});
        return res.status(200).json({error : false , allSport})
    } catch (error) {
        return res.status(200).json({error : false , message : "something went wrong"})
    }
})


const deleteSport = asyncHandler(async (req: any, res: any) => {
    const sportID = req.params.id
    if (sportID) {
        try {
            await SportModel.findByIdAndDelete(sportID)
            return res.status(200).json({ error: false, message: "deleted successfuly" })
        } catch (error) {
            console.log(error);
            return res.status(200).json({ error: true, message: "something went wrong" })
        }
    }
    return res.status(200).json({ error: true, message: "Not Found" })
})

const updateSport = asyncHandler(async (req: any, res: any) => {
    const sportID = req.params.id
    if (sportID) {
        try {
            await SportModel.findByIdAndUpdate(sportID, req.body)
            return res.status(200).json({ error: false, message: "sport updated successfully" })
        } catch (error) {
            return res.status(409).json({ error: true, message: "sport already exist , or something whent wrong " })
        }
    }
})

const getSportsIntoOneSalle = asyncHandler(async (req: any, res: any) => {
    const salleID = req.params.id.toString()
    if (salleID) {
        try {
            const salle = await SalleModel.findById(salleID).select('category');
            const onlyCategory = salle?.category
            const allsports = await SportModel.find({
                _id: { $in: onlyCategory }
            });
            return res.status(200).json({ error: false, allsports })
        } catch (error) {
            return res.status(400).json({ error: true, message: "something went wrong" })
        }
    }
})

export {
    createSport,
    deleteSport,
    updateSport,
    getSportsIntoOneSalle,
    getSportByid,
    getAllSports
}