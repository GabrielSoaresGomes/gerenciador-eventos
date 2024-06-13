import {Dimensions, StyleSheet} from "react-native";

const size = Dimensions.get('window').width;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: size * 0.40
    },
    registerButton: {
        backgroundColor: '#98baf1',
        width: size * 0.5,
        height: size * 0.1,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButtonText: {
        fontSize: 18,
        fontWeight: "800",
    },

});

export default style;
