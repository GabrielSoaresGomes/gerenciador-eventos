const { Pool } = require('pg');

class DatabaseConnector {
    async configureConnection() {
        if(!global.databaseConnection) {
            global.databaseConnection = new Pool({
                user: process.env.DATABASE_USER,
                host: process.env.DATABASE_HOST,
                database: process.env.DATABASE_NAME,
                password: process.env.DATABASE_PASSWORD,
                port: process.env.DATABASE_PORT,
                max: process.env.DATABASE_CONNECTION_LIMIT,
            });
        }
        return global.databaseConnection;
    }

    async generateConnection() {
        return Promise.resolve(this.configureConnection());
    }
}


module.exports = DatabaseConnector;