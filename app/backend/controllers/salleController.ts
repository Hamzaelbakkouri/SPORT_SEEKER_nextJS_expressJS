import asyncHandler from 'express-async-handler';
import { SalleModel } from "../models/salleModel";
import { CreateSalleI } from '../interfaces';
import { exist } from 'joi';

// function to create the NextBillingDate
function addOneMonthToDate(currentDate: any) {
    // Get the current date
    let date = new Date(currentDate);
    // Add one month to the current date
    date.setMonth(date.getMonth() + 1);
    // Handle cases where the result goes to the next year
    if (date.getMonth() !== ((new Date(currentDate)).getMonth() + 1) % 12) {
        date.setDate(0); // Set to the last day of the previous month
    }
    return date;
}


const createSalle = asyncHandler(async (req: any, res: any) => {
    const currentDate = new Date()
    const oneMonthLaterDate = addOneMonthToDate(currentDate)
    // YYYY-MM-DD
    const formattedDate = oneMonthLaterDate.toISOString().slice(0, 10);

    const AllData: CreateSalleI = req.body;
    if (AllData) {
        await new SalleModel({ ...AllData, nextBillingDate: formattedDate }).save()
            .then(() => {
                return res.status(200).json({ error: false, message: `salle : ${req.body.nameEN} created Successfully` })
            })
    } else {
        return res.status(400).json({ error: true, message: "miss something " })
    }
})


const getOnesalle = asyncHandler(async (req: any, res: any) => {
    const salleID = await req.params.id
    try {
        const salle = await SalleModel.findById(salleID)
        return res.status(200).json({ error: false, salle })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong" })
    }
})


const getAllSalles = asyncHandler(async (req: any, res: any) => {
    try {
        const allsalles = await SalleModel.find({})
        return res.status(200).json({ error: false, allsalles })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong " })
    }
})

const deleteSalle = asyncHandler(async (req: any, res: any) => {
    const SalleId = req.params.id
    if (SalleId) {
        try {
            const salleToDelete = await SalleModel.findById(SalleId)
            await salleToDelete?.deleteOne()
            return res.status(200).json({ error: false, messsage: "salle deleted successfully" })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: true, messsage: "something went wrong" })
        }
    } else {
        return res.status(404).json({ error: true, message: "id Not Found" })
    }
})

const updateSalle = asyncHandler(async (req: any, res: any) => {
    const SalleID = req.params.id

    if (SalleID) {
        try {
            const SalleToUpdate = await SalleModel.findByIdAndUpdate(SalleID, req.body)
            return res.status(200).json({ error: false, SalleToUpdate })
        } catch (error) {
            console.log(error);
            return res.status(404).json({ error: false, message: "Not Found" })
        }
    }
}

)
const getSallesByOneSport = asyncHandler(async (req: any, res: any) => {
    const sportID = req.params.id
    try {
        const allSalles = await SalleModel.find({ category: sportID })
        if (allSalles.length === 0) return res.status(404).json({ error: true, message: "there's no salles" })
        return res.status(200).json({ error: false, allSalles })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong " })
    }
})


export {
    createSalle,
    deleteSalle,
    updateSalle,
    getSallesByOneSport,
    getOnesalle,
    getAllSalles
}