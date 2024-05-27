const DatabaseConnector = require('./components/event/data/connectors/database-connector');
const databaseConnector = new DatabaseConnector();

const initDB = async () => {
    const connection = await databaseConnector.generateConnection();
    await connection.query(`
        -- DROP TABLE IF EXISTS events;
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time_start TEXT NOT NULL,
            time_end TEXT NOT NULL,
            location TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            image BYTEA
        )
    `);
}

module.exports = initDB;
