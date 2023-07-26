import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { loginT, refreshToken, registerT } from "../interfaces";

const signUpBodyValidation = (body: registerT) => {
    const schema = Joi.object({
        name: Joi.string().required().label("name"),
        email: Joi.string().email().required().label("email"),
        password: passwordComplexity().required().label("password"),
        roles: Joi.string().required().label("roles"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body: loginT) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("email"),
        password: Joi.string().required().label("password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body: object) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
    });
    return schema.validate(body);
};
const postBodyValidation = (body: object) => {
    const schema = Joi.object({
        postTitle: Joi.string().trim().required(),
        postText: Joi.string(),
        postImage: Joi.string(),
    });
    return schema.validate(body);
};

export {
    signUpBodyValidation,
    logInBodyValidation,
    refreshTokenBodyValidation,
    postBodyValidation
};