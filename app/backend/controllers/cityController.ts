import asyncHandler from 'express-async-handler';
import cityModel from '../models/cityModel';


const createCity = asyncHandler(async (req: any, res: any) => {
    try {
        const cityData = await new cityModel({ ...req.body }).save()
        return res.status(200).json({ error: false, cityData })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong" })
    }
})



const getAllCitys = asyncHandler(async (req: any, res: any) => {
    try {
        const allCities = await cityModel.find({})

        if (allCities.length == 0) return res.status(400).json({ error: true, message: "cities not found" })
        return res.status(200).json({ error: false, allCities })
    } catch (error) {
        return res.status(400).json({ error: true, message: "something went wrong" })
    }
})


const deleteCity = asyncHandler(async (req: any, res: any) => {
    const cityID = req.params.id
    if (cityID) {
        try {
            await cityModel.findByIdAndDelete(cityID)
            return res.status(200).json({ error: false, message: "city deletef successfully " })
        } catch (error) {
            return res.status(400).json({ error: true, message: "something went wrong" })
        }
    }
    return res.status(404).json({ error: true, message: "city not found" })
})


const updateCity = asyncHandler(async (req: any, res: any) => {
    const cityID = req.params.id
    if (cityID) {
        try {
            const updateCity = await cityModel.findByIdAndUpdate(cityID, req.body)
            return res.status(200).json({ error: false, updateCity })
        } catch (error) {
            return res.status(400).json({ error: true, message: "something went wrong " })
        }
    }
    return res.status(404).json({ error: true, message: "city not found" })
})


const getCitiesByCountry = asyncHandler(async (req: any, res: any) => {
    let country = req.params.id
    country = country.toString().toLowerCase();

    if (country) {
        try {
            const Allcities = await cityModel.find({ country: country })
            if (Allcities.length == 0) return res.status(400).json({ error: true, message: "cities not found" })
            return res.status(200).json({ error: false, Allcities })
        } catch (error) {
            return res.status(400).json({ error: true, message: "something went wrong" })
        }
    }
})


export {
    createCity,
    getAllCitys,
    deleteCity,
    updateCity,
    getCitiesByCountry
}