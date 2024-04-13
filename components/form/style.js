import {Dimensions, StyleSheet} from "react-native";

const size = Dimensions.get('window').width;

const style = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    divInput: {
        display: 'flex',
        backgroundColor: "#D9D9D9",
        width: size * 0.85,
        marginVertical: size * 0.03,
        height: size * 0.09,
        lineHeight: size * 0.09,
        textAlign: 'center',
        borderRadius: 6,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    locationInput: {
        display: 'flex',
        backgroundColor: "#D9D9D9",
        width: size * 0.85,
        padding: size * 0.01,
        marginVertical: size * 0.04,
        height: size * 0.18,
        lineHeight: size * 0.09,
        textAlign: 'center',
        borderRadius: 6,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    containerAllHorarioInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: size * 0.15,

    },
    containerCamera: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        gap: size * 0.15,
        alignItems: "flex-end",
        justifyContent: "space-around"

    },
    containerHorarioInputs: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    horarioInputs: {
        display: 'flex',
        backgroundColor: "#D9D9D9",
        width: size * 0.3,
        height: size * 0.09,
        textAlign: 'center',
        lineHeight: size * 0.09,
        fontSize: size * 0.05,
        borderRadius: 6,
        borderWidth: 0.5,
    },
    descricaoInput: {
        width: size * 0.85,
        height: size * 0.7,
        backgroundColor: "#D9D9D9",
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 6,
        marginTop: size * 0.05,
    },
    textDiv: {
        marginTop: size * 0.05,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    saveButton: {
        width: size * 0.5,
        height: size * 0.1,
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
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default style;