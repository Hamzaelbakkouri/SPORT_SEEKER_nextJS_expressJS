export type loginT = {
    email: string,
    password: string
}

export interface Salle {
    nameFR: string;
    nameEN: string;
    status: string;
    isPartner: boolean;
    city: string;
    nextBillingDate: string;
    descriptionFR: string;
    descriptionEN: string;
    country: string;
    category: string[];
    images: string[];
    createdAt: string;
}


export interface CreateSalleI {
    nameFR: string,
    nameEN: string,
    isPartner: boolean,
    city: string,
    descriptionFR: string,
    descriptionEN: string,
    category: string[],
    country: string,
    images: string[]
}

export type registerT = {
    name: string,
    email: string,
    password: string,
    roles: string
}

export type refreshToken = {
    refreshToken: string
}