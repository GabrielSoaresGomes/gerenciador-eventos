import {Button, Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import style from "./styleLogin";
import passwordIconOn from "../../assets/visibility_24dp_FILL0_wght400_GRAD0_opsz24.png";
import passwordIconOff from "../../assets/visibility_off_24dp_FILL0_wght400_GRAD0_opsz24.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);

    const changeEmailText = (value) => {
        setEmail(value);
    }

    const changePasswordText = (value) => {
        setPassword(value);
    }

    const switchPasswordVisibility = () => {
        setHidePassword(!hidePassword);
    }

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const loginAction = () => {
        if (email === "" || email === null || email === undefined){
            console.warn("É obrigatório preencher o email!");
        } else if (!validateEmail(email)){
            console.warn("Por favor, insira um email válido!");
        } else if (password === "" || password === null || password === undefined){
            console.warn("É obrigatório preencher a senha!");
        }else {
            console.log('tá funfando?');
        }
    }

    return (
        <View style={style.container}>
            <Text style={style.textDiv}>Email</Text>
            <TextInput textContentType={"emailAddress"} style={style.divInput} value={email} onChangeText={changeEmailText} />
            <Text style={style.textDiv}>Password</Text>
            <View style={style.passwordContainer}>
                <TextInput
                    textContentType={"password"}
                    secureTextEntry={hidePassword}
                    style={[style.divInput, style.passwordInput]}
                    value={password}
                    onChangeText={changePasswordText}
                />
                <TouchableOpacity style={style.passwordButton} onPress={switchPasswordVisibility}>
                    <Image style={style.image} source={hidePassword ? passwordIconOff : passwordIconOn}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={loginAction}>
                <Text> Login </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text> Register Here</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Login;
