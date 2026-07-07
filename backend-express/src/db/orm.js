import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { logger } from '../lib/logging.js';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: {
        max: process.env.DB_POOL_SIZE,
        acquire: 30000,
        idle: 10000
    },
    logging: logger,
    dialect: 'postgres'
});

export const init = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}
