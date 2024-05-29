import {BackHandler, ScrollView, TouchableOpacity} from "react-native";
import {
    useNavigation, useFocusEffect
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from "react";
import Card from "../../components/Card/Card";
import AddButton from "../../components/AddButton/AddButton";
import {initDB, getAllEvents, syncEventsWithFirebase, deleteEventById, removeDocumentFirebase} from "../../database/api";

const Home = () => {

    const [databaseStarted, setDatabaseStarted] = useState(false);
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();

    async function initializeDB() {
        await initDB();
        setDatabaseStarted(true)
    }

    useEffect(() => {
        if (!databaseStarted) {
            initializeDB().then();
        }
    }, []);

    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useFocusEffect(
        useCallback(() => {
            syncEventsWithFirebase().then();
            const getEvents = async () => {
                const eventsData = await getAllEvents();
                if (eventsData !== null) {
                    setEvents(eventsData);
                } else {
                    setEvents([]);
                }
            };

            getEvents().then();
        }, [])
    );

    const handleDoubleTap = (callback) => {
        let lastTap = null;
        return () => {
            const now = Date.now();
            if (lastTap && (now - lastTap) < 300) {
                callback();
            } else {
                lastTap = now;
            }
        };
    };

    const handleCardDoubleTap = (event) => {
        deleteEventById(event?.id).then();
        removeDocumentFirebase(event?.id).then();
        setEvents(events.filter(ev => ev?.id !== event?.id));
    };

    return (
        <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>
            <AddButton onPress={() => navigation.navigate('AddEvent')}/>
            {events?.map((event) => {
                return (
                    <TouchableOpacity
                        key={event.id}
                        onPress={handleDoubleTap(() => handleCardDoubleTap(event))}
                    >
                        <Card key={event.id} title={event.title} location={event.address} date={event.date}
                              timeStart={event.time_start}
                              timeEnd={event.time_end}/>
                    </TouchableOpacity>
                )
            })}

        </ScrollView>
    );
}

export default Home;