import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";


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
    return <Navigation/>;
}