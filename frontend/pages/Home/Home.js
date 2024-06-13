import {
    BackHandler,
    Button,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import {
    useNavigation,
    useFocusEffect
} from '@react-navigation/native';
import {
    useCallback,
    useEffect,
    useState
} from "react";
import Card from "../../components/Card/Card";
import AddButton from "../../components/AddButton/AddButton";
import {
    initDB,
    getAllEvents,
    syncEventsWithFirebase,
    removeDocumentFirebase,
    insertToQueueDelete
} from "../../database/api";
import NetInfo from "@react-native-community/netinfo";

const Home = () => {
    const [databaseStarted, setDatabaseStarted] = useState(false);
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
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
            const fetchEvents = async () => {
                await syncEventsWithFirebase();
                const eventsData = await getAllEvents();
                setEvents(eventsData || []);
            };

            fetchEvents().then();
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await syncEventsWithFirebase();
        const eventsData = await getAllEvents();
        setEvents(eventsData || []);
        setRefreshing(false);
    }, []);

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

    const handleCardDoubleTap = async (event) => {
        const connection = await NetInfo.fetch();
        if (connection.isConnected && connection.isInternetReachable) {
            removeDocumentFirebase(event?.event_uuid).then(() => console.info(`Evento de ID ${event?.id} apagado no firebase`));
            await syncEventsWithFirebase();
            const eventsData = await getAllEvents();
            setEvents(eventsData || []);
        } else {
            insertToQueueDelete(event?.id).then(() => console.info(`Evento de ID ${event?.id} apagado no sqlite`));
        }
        setEvents(events.filter(ev => ev?.id !== event?.id));
    };

    return (
        <ScrollView
            contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <AddButton onPress={() => navigation.navigate('AddEvent')} />
            {events?.map((event) => (
                <TouchableOpacity
                    key={event.id}
                    onPress={handleDoubleTap(() => handleCardDoubleTap(event).then())}
                >
                    <Card
                        key={event.id}
                        title={event.title}
                        location={event.address}
                        date={event.date}
                        timeStart={event.time_start}
                        timeEnd={event.time_end}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

export default Home;
