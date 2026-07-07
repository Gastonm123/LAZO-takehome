import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: process.env.DB_POOL_SIZE,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const query = (text, params) => {
    return pool.query(text, params);
};

export const connect = () => {
    return pool.connect();
};