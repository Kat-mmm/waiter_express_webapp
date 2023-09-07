import pgPromise from 'pg-promise';
import 'dotenv/config';

const username = 'postgres';
const password = process.env.Password;
const host = 'localhost';
const port = 5432;
const databaseName = 'waiterdb';

const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);

const connection = process.env.DATABASE_URL || `postgresql://${encodedUsername}:${encodedPassword}@${host}:${port}/${databaseName}`;

const db = pgPromise()(connection);

export default db;