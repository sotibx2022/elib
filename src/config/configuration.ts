import dotenv from 'dotenv';
dotenv.config()
const _config = {
PORT:process.env.PORT,
CONNECTION_STRING:process.env.CONNECTION_STRING,
ENV:process.env.ENV,
SECRET_KEY:process.env.SECRET_KEY
};
export const config = Object.freeze(_config);
