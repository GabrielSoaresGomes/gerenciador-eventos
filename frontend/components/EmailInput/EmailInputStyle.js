import {Dimensions, StyleSheet} from "react-native";

const size = Dimensions.get('window').width;

const style = StyleSheet.create({
    divInput: {
        backgroundColor: "#D9D9D9",
        width: size * 0.85,
        marginVertical: size * 0.03,
        height: size * 0.09,
        lineHeight: size * 0.09,
        textAlign: 'left',
        paddingLeft: 15,
        borderRadius: 6,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    textDiv: {
        marginTop: size * 0.05,
    }
});

export default style;
