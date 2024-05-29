import {BackHandler, ScrollView} from "react-native";
import {
    useNavigation, useFocusEffect
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from "react";
import Card from "../../components/Card/Card";
import AddButton from "../../components/AddButton/AddButton";
import { syncEventsWithFirebase } from '../../api';

const Home = () => {

    const [events, setEvents] = useState([]);
    const navigation = useNavigation();


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
    }, [])
);

    return (
        <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>
            <AddButton onPress={() => navigation.navigate('AddEvent')}/>
            {events.map((event) => {
                return (
                    <Card key={event.title} title={event.title} location={event.location} date={event.date} timeStart={event.timeStart}
                  timeEnd={event.timeEnd}/>
                )
            })}

        </ScrollView>
    );
}

export default Home;