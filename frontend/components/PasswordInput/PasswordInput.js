import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import style from "./PasswordInputStyle";
import passwordIconOff from "../../assets/visibility_off_24dp_FILL0_wght400_GRAD0_opsz24.png";
import passwordIconOn from "../../assets/visibility_24dp_FILL0_wght400_GRAD0_opsz24.png";
import {useState} from "react";

const PasswordInput = ({password, setPassword}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const changePasswordText = (value) => {
        setPassword(value);
    }

    const switchPasswordVisibility = () => {
        setHidePassword(!hidePassword);
    }

    return (
    <View>
        <Text style={style.textDiv}>Senha</Text>
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
    </View>
    )
}

export default PasswordInput;