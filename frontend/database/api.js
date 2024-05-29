import {getDoc, collection, doc, updateDoc, setDoc} from 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import {dbFirebase} from '../firebase-config';

const initDB = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
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
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db?.getAllAsync(`
            SELECT *
            FROM events
        `);
    return result;
}

const getEventById = async(eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.getFirstAsync(`
            SELECT *
            FROM events
            WHERE id = ?
        `, [eventId]);
    return result;
}

const deleteEventById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
            DELETE FROM events
            WHERE id = ?
            RETURNING id
        `, [eventId]);
    return result;
}

const insertEvent = async (eventBody) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        INSERT INTO events (title, date, time_start, time_end, address, location_lat, location_long, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
    return result;
};

const syncEventsWithFirebase = async () => {
    console.log('Iniciando sincronização com firebase');
    const connection = await NetInfo.fetch();
    if (connection.isConnected && connection.isInternetReachable) {
        console.log('Conexão com internet OK');
        const events = await getAllEvents();
        if (events?.length) {
            for (const event of events) {
                try {
                    const docRef = doc(dbFirebase, "events", `${event?.id}`);
                    const document = await getDoc(docRef);
                    if (document.exists()) {
                        await updateDoc(docRef, {
                            title: event?.title,
                            date: event?.date,
                            time_start: event?.time_start,
                            time_end: event?.time_end,
                            address: event?.address,
                            location_lat: event?.location_lat,
                            location_long: event?.location_long,
                            description: event?.description,
                            image: event?.image
                        });
                        console.log(`Evento de id ${event?.id} atualizado no Firebase`);
                    } else {
                        await setDoc(docRef, {
                            title: event?.title,
                            date: event?.date,
                            time_start: event?.time_start,
                            time_end: event?.time_end,
                            address: event?.address,
                            location_lat: event?.location_lat,
                            location_long: event?.location_long,
                            description: event?.description,
                            image: event?.image
                        });
                        console.log(`Evento de id ${event?.id} adicionado no Firebase`);
                    }
                } catch (error) {
                    console.error(`Erro ao processar evento de id ${event?.id} no Firebase: `, error);
                }
            }
        } else {
            console.log('Não foi encontrado nenhum registro!');
        }
    }
}


export {initDB, getAllEvents, getEventById, deleteEventById, insertEvent, syncEventsWithFirebase};