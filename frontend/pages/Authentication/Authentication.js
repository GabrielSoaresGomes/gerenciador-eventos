import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from '@react-navigation/native';

const Authentication = () => {

    const navigation = useNavigation();

    const handleAuthenticate = async () => {
        try {
            await AsyncStorage.setItem('events-mock', JSON.stringify([]));
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autentique-se para continuar',
            });
            if (result.success) {
                console.info('Usuário autenticado com sucesso');
                navigation.navigate('Login');
            } else {
                console.warn('Falha na autenticação');
            }
        } catch (error) {
            console.error('Erro ao autenticar:', error);
        }
    };

    const size = Dimensions.get('window').width;

    const style = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        tryAgainButton: {
            width: size * 0.5,
            height: size * 0.5,
            backgroundColor: 'rgba(34,231,34,0.33)',
            color: 'black',
            fontSize: size * 0.05,
            fontWeight: 'bold',
            textAlign: 'center',
            textAlignVertical: 'center',
            borderColor: 'black',
            borderWidth: 0.5,
            borderRadius: 6,
            marginTop: size * 0.1,
            }
    })

    handleAuthenticate();
    return (
        <View style={style.container}>
            <TouchableOpacity>
                <Text style={style.tryAgainButton} onPress={handleAuthenticate}>Tentar Autenticar novamente.</Text>
            </TouchableOpacity>
        </View>
    );

}
export default Authentication;