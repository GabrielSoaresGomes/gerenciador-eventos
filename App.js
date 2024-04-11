import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import Authentication from "./pages/Authentication/Authentication";


const RootStack = createNativeStackNavigator({
    screens: {
        Authentication: {
            screen: Authentication,
            options: {
                title: 'Authentication',
                headerTitleAlign: 'center',
                headerBackVisible: false
            }
        },
        Home: {
            screen: Home,
            options: {
                title: 'Início',
                headerTitleAlign: 'center',
                headerBackVisible: false
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