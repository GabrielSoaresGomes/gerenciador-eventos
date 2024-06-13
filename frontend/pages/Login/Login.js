import {Text, TouchableOpacity, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import style from "./styleLogin";
import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {getAllEvents, initDB, selectUserByEmailAndPassword, syncEventsWithFirebase} from "../../database/api"


const Login = () => {
    const [databaseStarted, setDatabaseStarted] = useState(false);

    async function initializeDB() {
        await initDB();
        setDatabaseStarted(true)
    }

    useEffect(() => {
        if (!databaseStarted) {
            initializeDB().then();
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchEvents = async () => {
                await syncEventsWithFirebase();
            };

            fetchEvents().then();
        }, [])
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const loginAction = async () => {
        if (email === "" || email === null || email === undefined){
            console.warn("É obrigatório preencher o email!");
        } else if (!validateEmail(email)){
            console.warn("Por favor, insira um email válido!");
        } else if (password === "" || password === null || password === undefined){
            console.warn("É obrigatório preencher a senha!");
        }else {
            const userData = {
                email,
                password
            }
            const resultLogin = await selectUserByEmailAndPassword(userData);
            console.log(resultLogin);
            if (resultLogin?.length) {
                navigation.navigate('Home');
            }else {
                console.warn(`Usuário ou senha inválidos! ${JSON.stringify(userData)}`);
            }
        }
    }

    const handleRegisterRequest = () => {
        navigation.navigate('Register');
    }

    return (
        <View style={style.container}>
            <EmailInput  email={email} setEmail={setEmail}/>
            <PasswordInput password={password} setPassword={setPassword} />
            <View>
                <TouchableOpacity style={style.loginButton} onPress={loginAction}>
                    <Text style={style.loginButtonText}> Entrar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.registerButton} onPress={handleRegisterRequest}>
                    <Text style={style.registerButtonText}> Registrar-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Login;
