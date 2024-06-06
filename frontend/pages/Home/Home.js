import {BackHandler, Button, ScrollView, ToastAndroid, TouchableOpacity} from "react-native";
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

// LOGIN OAUTH angolano
/*
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
WebBrowser.maybeCompleteAuthSession();
*/
// FIM LOGIN OAUTH angolano

// LOGIN GPT
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

const useProxy = AuthSession.useProxy();
const redirectUri = AuthSession.makeRedirectUri({
    useProxy,
});
// FIM LOGIN GPT

const Home = () => {
    // LOGIN OAUTH angolano
    /*
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '957534108537-qelqm9vldl9h315fc461kj19hc3sqll3.apps.googleusercontent.com'
    });

    const callAuthGoogle = async () => {
        await promptAsync();
    }

    const getUserInfo = async (responseAuth) => {
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {
                    Authorization: `Bearer ${responseAuth?.authentication?.accessToken}`
                }
            })
        } catch (error) {
            console.log('ERROR: ', error)
        }
    }

    const getResponse = async () => {
        if (response) {
            if (response?.type === 'error') {
                ToastAndroid.show('Erro ao obter informações do usuário na autenticação pelo Google', ToastAndroid.SHORT);
            } else if (response?.type === 'cancel') {
                ToastAndroid.show('Login pelo google cancelado', ToastAndroid.SHORT);
            } else if (response?.type === 'success') {
                await getUserInfo(response);
            }
        }
    }

    useEffect(() => {
        getResponse().then();
    }, [response]);
     */
    // FIM LOGIN OAUTH angolano


    // login gpt
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: 'YOUR_EXPO_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
        redirectUri,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const {authentication} = response;
            // Use o token de autenticação para se comunicar com a API do Google
            console.log(authentication);
        }
    }, [response]);
    // fim login gpt


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
            <Button title={'Logar'} onPress={promptAsync}/>
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