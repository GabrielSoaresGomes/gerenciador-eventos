import {Text, TextInput, View} from "react-native";
import style from "./EmailInputStyle";

const EmailInput = ({email, setEmail}) => {
    const changeEmailText = (value) => {
        setEmail(value);
    }

    return (
        <View>
            <Text style={style.textDiv}>E-mail</Text>
            <TextInput textContentType={"emailAddress"} style={style.divInput} value={email} onChangeText={changeEmailText} />
        </View>
    );
}

export default EmailInput;