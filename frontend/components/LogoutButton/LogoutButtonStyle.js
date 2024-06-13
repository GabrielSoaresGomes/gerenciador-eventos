import {Dimensions, StyleSheet} from "react-native";

const size = Dimensions.get('window').width;

const style = StyleSheet.create({
    image: {
        width: size * 0.08,
        height: size * 0.08,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: size * 0.02,
        marginLeft: size * 0.02,
        alignSelf: 'stretch',
    },
});

export default style;
