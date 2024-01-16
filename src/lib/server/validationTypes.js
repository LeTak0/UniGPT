import Joi from 'joi';

export const usernameShema = Joi.string().min(3).max(32).pattern(/^[a-zA-Z0-9_]+$/).required();
export const passwordShema = Joi.string().min(8).max(128).required();
export const roleShema = Joi.string().valid('user', 'admin').required();

export const chatNameShema = Joi.string().min(3).max(64).pattern(/^[a-zA-Z0-9_\-!?. ]+$/).required();

export const chatGptMessageShema = Joi.string().min(1).max(4096).required();