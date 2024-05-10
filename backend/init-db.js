const DatabaseConnector = require('./components/event/data/connectors/database-connector');
const databaseConnector = new DatabaseConnector();

const initDB = async () => {
    const connection = await databaseConnector.generateConnection();
    await connection.query(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time_start TEXT NOT NULL,
            time_end TEXT NOT NULL,
            location TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            image BLOB)
        )
    `);
}

module.exports = initDB();
