import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import Authentication from "./pages/Authentication/Authentication";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";


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
        },
        Login: {
            screen: Login,
            options: {
                title: 'Login',
                headerTitleAlign: 'center',
                headerBackVisible: false
            }
        },
        Register: {
            screen: Register,
            options: {
                title: 'Register',
                headerTitleAlign: 'center'
            }
        }
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation/>;
}