export type loginT = {
    email: string,
    password: string
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