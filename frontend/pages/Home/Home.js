import {BackHandler, ScrollView} from "react-native";
import {
    useNavigation, useFocusEffect
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from "react";
import Card from "../../components/Card/Card";
import AddButton from "../../components/AddButton/AddButton";
import { syncEventsWithFirebase } from '../../api';
import { initDB, getAllEvents } from "../../database/sqlite";

const Home = () => {

    const [databaseStarted, setDatabaseStarted] = useState(false);
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        if (!databaseStarted) {
            async function initializeDB() {
                await initDB();
                setDatabaseStarted(true)
            }

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
        syncEventsWithFirebase();
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

    return (
        <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>
            <AddButton onPress={() => navigation.navigate('AddEvent')}/>
            {events?.map((event) => {
                return (
                    <Card key={event.id} title={event.title} location={event.address} date={event.date} timeStart={event.time_start}
                  timeEnd={event.time_end}/>
                )
            })}

        </ScrollView>
    );
}

export default Home;