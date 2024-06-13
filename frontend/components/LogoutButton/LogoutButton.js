import logoutIcon from "../../assets/logout_24dp_FILL0_wght400_GRAD0_opsz24.png"
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import style from "./LogoutButtonStyle"
import {useNavigation} from "@react-navigation/native";

const LogoutButton = () => {

    const navigation = useNavigation();

    const redirect = () => {
        navigation.navigate("Login");
    }

    return (
        <View style={style.container}>
            <TouchableOpacity  onPress={redirect}>
                <Image style={style.image} source={logoutIcon} />
            </TouchableOpacity>
        </View>

    )
}

export default LogoutButton;