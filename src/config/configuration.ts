import dotenv from 'dotenv';
dotenv.config()
const _config = {
PORT:process.env.PORT,
CONNECTION_STRING:process.env.CONNECTION_STRING,
ENV:process.env.ENV,
SECRET_KEY:process.env.SECRET_KEY,
FRONTEND_URL:process.env.FRONTEND_URL,
DASHBOARD_URL:process.env.DASHBOARD_URL
};
export const config = Object.freeze(_config);
