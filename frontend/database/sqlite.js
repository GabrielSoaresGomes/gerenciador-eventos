import * as SQLite from 'expo-sqlite';

let db

const initDB = async () => {

    db = await SQLite.openDatabaseAsync("manager_events.db");
    await db.execAsync(`
        -- DROP TABLE IF EXISTS events;
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time_start TEXT NOT NULL,
            time_end TEXT NOT NULL,
            location_lat TEXT NOT NULL,
            location_long TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            image BYTEA
        )`
    );
    console.log('Tabela criada com sucesso!!');
};

const getAllEvents = async () => {
    const result = await db?.getAllAsync(`
            SELECT *
            FROM events
        `);
    return result;
}

const getEventById = async(eventId) => {
    const result = await db.getFirstAsync(`
            SELECT *
            FROM events
            WHERE id = ?
        `, [eventId]);
    return result;
}

const deleteEventById = async (eventId) => {
    const result = await db.runAsync(`
            DELETE FROM events
            WHERE id = ?
            RETURNING id
        `, [eventId]);
    return result;
}


const insertEvent = async (eventBody) => {
    const result = await db.runAsync(`
        INSERT INTO events (title, date, time_start, time_end, address, location_lat, location_long, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
    return result;
};

export {initDB, getAllEvents, getEventById, deleteEventById, insertEvent};