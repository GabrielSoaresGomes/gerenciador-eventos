import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import {useEffect, useState} from "react";

// import RNFS from 'react-native-fs';
import eventsMock from './events-mock.json';


const RootStack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: Home,
            options: {
                title: 'Início',
                headerTitleAlign: 'center'
            }
        },
        AddEvent: {
            screen: AddEvent,
            options: {
                title: 'Adicionar Eventos'
            }
        }
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {

    const [events, setEvents] = useState(eventsMock);


    const listEvents = () => {
        return events;
    }

    const addEvent = (event) => {
        const newEventsData = events
        newEventsData.push(event);
        setEvents(newEventsData);
    }

    const getEventById = (eventId) => {
        return events.find(({id}) => id === eventId);
    }

    const removeEventById = (eventId) => {
        const newEventsData = events.filter(event => event.id !== eventId);
        setEvents(newEventsData);
        return events;
    }

    const updateEventById = (eventId, newEventData) => {
        const newEventsData = events.map(event => {
            if (event.id === eventId) {
                return {...event, ...newEventData};
            }
            return event;
        });
        setEvents(newEventsData);
        return events;
    }

    return <Navigation/>;
}