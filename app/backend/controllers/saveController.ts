import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import SaveModel from '../models/saveModel';
import { SalleModel } from '../models/salleModel';


const createSave = asyncHandler(async (req: any, res: any) => {
    const salleID = req.params.id
    // @ts-ignore
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
    const userid = decoded._id as string
    if (userid && salleID) {
        try {
            const ifExist = await SalleModel.findById(salleID)
            if (ifExist) {
                await new SaveModel({ salleID: salleID, userID: userid }).save()
                return res.status(200).json({ error: false, message: "saved successfully" })
            }
            return res.status(404).json({ error: true, message: "salle not found" })
        } catch (error) {
            return res.status(400).json({ error: true, message: "something went wrong" })
        }
    }
})

const deleteSave = asyncHandler(async (req: any, res: any) => {
    const salleID = req.params.id
    try {
        await SaveModel.findByIdAndDelete(salleID)
        return res.status(200).json({ error: false, message: "deleted successfully" })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong" })
    }
})

export {
    createSave,
    deleteSave
}