import {BackHandler, Button, ScrollView, TouchableOpacity} from "react-native";
import {
    useNavigation, useFocusEffect
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from "react";
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

import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();


const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const config = {
        androidClientId: '957534108537-qelqm9vldl9h315fc461kj19hc3sqll3.apps.googleusercontent.com',
        webClientId: '957534108537-3tqtuidj3rsgrkp4ms82andvr5qff055.apps.googleusercontent.com',
    };
    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const getUserInfo = async (token) => {
        //absent token
        if (!token) return;
        //present token
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            const user = await response.json();
            //store user information  in Asyncstorage
            console.log('User: ', user);
            await AsyncStorage.setItem("user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {
            console.error(
                "Failed to fetch user data:",
                response.status,
                response.statusText
            );
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Attempt to retrieve user information from AsyncStorage
            const userJSON = await AsyncStorage.getItem("user");

            if (userJSON) {
                // If user information is found in AsyncStorage, parse it and set it in the state
                setUserInfo(JSON.parse(userJSON));
            } else if (response?.type === "success") {
                // If no user information is found and the response type is "success" (assuming response is defined),
                // call getUserInfo with the access token from the response
                getUserInfo(response.authentication.accessToken);
            }
        } catch (error) {
            // Handle any errors that occur during AsyncStorage retrieval or other operations
            console.error("Error retrieving user data from AsyncStorage:", error);
        }
    };

    //add it to a useEffect with response as a dependency
    useEffect(() => {
        signInWithGoogle();
    }, [response]);

    //log the userInfo to see user details
    console.log(JSON.stringify(userInfo))

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

    const handleCardDoubleTap = async (event) => {
        const connection = await NetInfo.fetch();
        if (connection.isConnected && connection.isInternetReachable) {
            removeDocumentFirebase(event?.event_uuid).then(() => console.info(`Evento de ID ${event?.id} apagado no firebase`));
        } else {
            insertToQueueDelete(event?.id).then(() => console.info(`Evento de ID ${event?.id} apagado no sqlite`));
        }
        setEvents(events.filter(ev => ev?.id !== event?.id));
    };

    return (
        <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>
            <AddButton onPress={() => navigation.navigate('AddEvent')}/>
            <Button title="sign in with google" onPress={() => {
                promptAsync()
            }}/>
            {events?.map((event) => {
                return (
                    <TouchableOpacity
                        key={event.id}
                        onPress={handleDoubleTap(() => handleCardDoubleTap(event).then())}
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