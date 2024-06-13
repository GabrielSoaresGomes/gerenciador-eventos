import {collection, doc, updateDoc, setDoc, getDocs, deleteDoc, query, where} from 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import {dbFirebase} from '../firebase-config';
import {randomUUID} from "expo-crypto";

const initDB = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    await recreateTableEvents();
    await createUserTable();
    console.info('Tabela criada com sucesso!!');
};

const getAllEvents = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db?.getAllAsync(`
            SELECT *
            FROM events
        `);
    return result;
}

const createUserTable = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    await db.execAsync(`
        DROP TABLE IF EXISTS user;
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            user_uuid TEXT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        );
        DROP TABLE IF EXISTS user_to_add;
        CREATE TABLE IF NOT EXISTS user_to_add (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        );
        DROP TABLE IF EXISTS user_to_delete;
        CREATE TABLE IF NOT EXISTS user_to_delete (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            user_uuid TEXT
        );
    `);
}

const recreateTableEvents = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    await db.execAsync(`
        DROP TABLE IF EXISTS events;
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            event_uuid TEXT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time_start TEXT NOT NULL,
            time_end TEXT NOT NULL,
            location_lat TEXT NOT NULL,
            location_long TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            image BYTEA
        );
        DROP TABLE IF EXISTS events_to_add;
        CREATE TABLE IF NOT EXISTS events_to_add (
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
        );
        DROP TABLE IF EXISTS events_to_delete;
        CREATE TABLE IF NOT EXISTS events_to_delete (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            event_uuid INTEGER
        );

    `);
}

const getAllEventsToAdd = async () => {
    try {
        const db = await SQLite.openDatabaseAsync("manager_events.db");
        const result = await db?.getAllAsync(`
            SELECT *
            FROM events_to_add
        `);
        return result;
    } catch (error) {
        console.error(`Falha ao listar eventos para criar, ERROR: `, error);
        return [];
    }
}

const getAllEventsToDelete = async () => {
    try {
        const db = await SQLite.openDatabaseAsync("manager_events.db");
            const result = await db?.getAllAsync(`
            SELECT *
            FROM events_to_delete
        `);
        return result;
    } catch (error) {
        console.error(`Falha ao listar eventos para apagar, ERROR: `, error);
        return [];
    }
}

const getEventById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.getFirstAsync(`
            SELECT *
            FROM events
            WHERE id = ?
        `, [eventId]);
    return result;
}

const deleteEventToAddById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        DELETE FROM events_to_add
        WHERE id = ?
        RETURNING id
    `, [eventId]);
    return result;
}

const deleteEventToDeleteById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        DELETE FROM events_to_delete
        WHERE id = ?
        RETURNING id
    `, [eventId]);
    return result;
}

const removeDocumentFirebase = async (eventId) => {
    try {
        const eventsRef = collection(dbFirebase, 'events');
        const q = query(eventsRef, where('event_id', '==', eventId));
        const querySnapshot = await getDocs(q);
        for (const document of querySnapshot.docs) {
            await deleteDoc(doc(dbFirebase, 'events', document?.id));
        }
    } catch (error) {
        console.error(`Falha ao apagar o evento no firebase: ${JSON.stringify(eventId)}, ERROR: `, error)
    }
}

const insertEvent = async (eventBody) => {
    try {
        const db = await SQLite.openDatabaseAsync("manager_events.db");
        const result = await db.runAsync(`
        INSERT INTO events (event_uuid, title, date, time_start, time_end, address, location_lat, location_long, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    `, [eventBody.event_id, eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
        return result;
    } catch (error) {
        console.error('Erro ao salvar evento: ', error);
    }
};

const insertToQueueAdd = async (eventBody) => {
    try {
        const db = await SQLite.openDatabaseAsync("manager_events.db");
        const result = await db.runAsync(`
        INSERT INTO events_to_add (title, date, time_start, time_end, address, location_lat, location_long, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
    `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
        return result;
    } catch (error) {
        console.error('Erro ao salvar evento: ', error);
    }
};

const insertToQueueDelete = async (eventBody) => {
    try {
        const db = await SQLite.openDatabaseAsync("manager_events.db");
        const result = await db.runAsync(`
        INSERT INTO events_to_delete (event_uuid)
        VALUES (?)
        RETURNING id
    `, [eventBody.event_uuid]);
        return result;
    } catch (error) {
        console.error('Erro ao salvar evento: ', error);
    }
};

const addDocumentFirebase = async (event) => {
    try {
        const docRef = doc(dbFirebase, "events", `${event?.event_uuid}`);
        await setDoc(docRef, {
            title: event?.title,
            event_id: event?.id,
            date: event?.date,
            time_start: event?.time_start,
            time_end: event?.time_end,
            address: event?.address,
            location_lat: event?.location_lat,
            location_long: event?.location_long,
            description: event?.description,
            image: event?.image
        });
    } catch (error) {
        console.error(`Falha ao criar o evento no firebase: ${JSON.stringify(event)}, ERROR: `, error)
    }
}

const updateEvent = async (eventId, eventBody) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        UPDATE events
        SET title = ?, date = ?, time_start = ?, time_end = ?, address = ?, location_lat = ?, location_long = ?, description = ?, image = ?
        RETURNING id
    `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
    return result;
};

const updateDocumentFirebase = async (event) => {
    const docRef = doc(dbFirebase, "events", `${event?.id}`);
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
}

const syncEventsWithFirebase = async () => {
    console.info('Iniciando sincronização com firebase');
    const connection = await NetInfo.fetch();
    if (connection.isConnected && connection.isInternetReachable) {
        console.info('Conexão com internet OK');
        try {
            console.info('Sincronizando eventos para adicionar!');
            const eventsToAdd = await getAllEventsToAdd();
            for (const event of eventsToAdd) {
                event.event_uuid = randomUUID();
                await addDocumentFirebase(event);
                await deleteEventToAddById(event?.id);
            }

            console.info('Sincronizando eventos para apagar!');
            const eventsToDelete = await getAllEventsToDelete();
            for (const event of eventsToDelete) {
                await removeDocumentFirebase(event?.event_uuid);
                await deleteEventToDeleteById(event?.id);
            }

            console.info('Iniciando sincronização do Firebase para o banco local!');
            const documents = await getDocs(collection(dbFirebase, 'events'));
            await recreateTableEvents();

            for (const document of documents.docs) {
                await insertEvent(document.data());
            }
        } catch (error) {
            console.error(`Erro ao sincronizar firebase com o local`, error);
        }
        console.info('Finalizando sincronizações!');
    }
}


export {
    initDB,
    getAllEvents,
    getEventById,
    insertEvent,
    insertToQueueDelete,
    insertToQueueAdd,
    syncEventsWithFirebase,
    removeDocumentFirebase,
    addDocumentFirebase
};