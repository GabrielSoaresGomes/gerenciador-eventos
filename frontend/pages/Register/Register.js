import {Text, TouchableOpacity, View} from "react-native";

import style from './styleRegister';
import {useState} from "react";
import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import NetInfo from "@react-native-community/netinfo";
import {randomUUID} from "expo-crypto";
import {insertUserOnRemote, insertUserToQueueAdd} from "../../database/api";
import {useNavigation} from "@react-navigation/native";

const Register = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const registerAction = async () => {
        if (email === "" || email === null || email === undefined){
            console.warn("É obrigatório preencher o email!");
        } else if (!validateEmail(email)){
            console.warn("Por favor, insira um email válido!");
        } else if (password === "" || password === null || password === undefined){
            console.warn("É obrigatório preencher a senha!");
        }else {
            console.info(`Iniciando registro de usuário com email: ${email} e senha ${password}`)
            const connection = await NetInfo.fetch();
            const newUser = {
                email,
                password,
                user_uuid: randomUUID()
            }
            if (connection.isConnected && connection.isInternetReachable) {
                console.info('Inserindo usuário no banco remoto!');
                const insertResult = await insertUserOnRemote(newUser);
                if (insertResult) {
                    console.info(`Usuário registrado com sucesso: ${JSON.stringify(newUser)}`);
                    navigation.navigate('Login');
                }

            } else {
                await insertUserToQueueAdd(newUser);
            }
        }
    }

    return (
        <View style={style.container}>
            <EmailInput email={email} setEmail={setEmail}/>
            <PasswordInput password={password} setPassword={setPassword} />
            <TouchableOpacity style={style.registerButton} onPress={registerAction}>
                <Text style={style.registerButtonText}> Registrar-se</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Register;