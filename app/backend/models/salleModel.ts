import mongoose from "mongoose";
import { Salle } from "../interfaces";


const SalleSchema = new mongoose.Schema<Salle>(
    {
        nameFR: { type: String },
        nameEN: { type: String },
        isPartner: {
            type: Boolean,
            default: false
        },
        city: { type: String },
        nextBillingDate: { type: String },
        descriptionFR: { type: String },
        descriptionEN: { type: String },
        country: { type: String },
        category: [{ type: String }],
        images: [{ type: String }],
    },
    { timestamps: true }
);

export const SalleModel = mongoose.model<Salle>('Salle', SalleSchema);