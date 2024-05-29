import {getDoc, collection, doc, updateDoc, setDoc, getDocs, deleteDoc} from 'firebase/firestore';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import {dbFirebase} from '../firebase-config';

const initDB = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    await db.execAsync(`
        DROP TABLE IF EXISTS events;
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
            image BYTEA,
            deleted BOOL DEFAULT false
        )`
    );
    console.log('Tabela criada com sucesso!!');
};

const getAllEvents = async () => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db?.getAllAsync(`
            SELECT *
            FROM events
            WHERE deleted = false
        `);
    return result;
}

const getEventById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.getFirstAsync(`
            SELECT *
            FROM events
            WHERE id = ?
            AND deleted = false
        `, [eventId]);
    return result;
}

const deleteEventById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        UPDATE events
        SET deleted = true
        WHERE id = ?
        AND deleted = false
        RETURNING id
    `, [eventId]);
    return result;
}

const undeleteEventById = async (eventId) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        UPDATE events
        SET deleted = false
        WHERE id = ?
        AND deleted = true
        RETURNING id
    `, [eventId]);
    return result;
}

const removeDocumentFirebase = async (eventId) => {
    const docRef = doc(dbFirebase, 'events', `${eventId}`);
    await deleteDoc(docRef);
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

const updateEvent = async (eventId, eventBody) => {
    const db = await SQLite.openDatabaseAsync("manager_events.db");
    const result = await db.runAsync(`
        UPDATE events
        SET title = ?, date = ?, time_start = ?, time_end = ?, address = ?, location_lat = ?, location_long = ?, description = ?, image = ?
        WHERE deleted = false
        RETURNING id
    `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location_lat, eventBody.location_long, eventBody.description, eventBody.image]);
    return result;
};

const syncEventsWithFirebase = async () => {
    console.info('Iniciando sincronização com firebase');
    const connection = await NetInfo.fetch();
    if (connection.isConnected && connection.isInternetReachable) {
        console.info('Conexão com internet OK');

        console.info('Iniciando sincronização dos dados locais para o Firebase');

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
                        console.info(`Evento de id ${event?.id} atualizado no Firebase`);
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
                        console.info(`Evento de id ${event?.id} adicionado no Firebase`);
                    }
                } catch (error) {
                    console.error(`Erro ao processar evento de id ${event?.id} no Firebase: `, error);
                }
            }
        } else {
            console.info('Não foi encontrado nenhum registro no banco local!');
        }

        try {
            console.info('Iniciando sincronização do Firebase para o banco local!');
            const documents = await getDocs(collection(dbFirebase, 'events'));
            for (const document of documents.docs) {
                const event = await getEventById(document.id);
                if (!event?.id) {
                    console.info(`Documento de id ${document?.id} não está no banco local, inserindo!`);
                    await undeleteEventById(document.id);
                    await updateEvent(document.id, document.data());
                }
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
    deleteEventById,
    insertEvent,
    syncEventsWithFirebase,
    removeDocumentFirebase
};