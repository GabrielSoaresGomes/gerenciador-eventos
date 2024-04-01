import {Button, ScrollView, Text} from "react-native";
import {
    useNavigation, useFocusEffect
} from '@react-navigation/native';
import {useEffect, useState} from "react";
import Card from "../../components/Card/Card";
import AddButton from "../../components/AddButton/AddButton";

import eventsMock from '../../events-mock.json';
import card from "../../components/Card/Card";

const Home = () => {
    const [events, setEvents] = useState(eventsMock);
    const navigation = useNavigation();

    useFocusEffect(() => {
        const eventsMock = require('../../events-mock.json');
        setEvents(eventsMock);
        console.log(events);
    });

    return (
        <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>
            <AddButton onPress={() => navigation.navigate('AddEvent')}/>
            {events.map((event) => {
                return (
                    <Card key={event.id} title={event.title} location={event.location} date={event.date} timeStart={event.time_start}
                  timeEnd={event.time_end}/>
                )
            })}

        </ScrollView>
    );
}

export default Home;