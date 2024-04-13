import {Text, View} from "react-native";
import React from "react";
import {style} from "../style";

const TimeInput = ({textLabel, showPicker, timeFormatted}) => {
    return (
        <View style={style.containerHorarioInputs}>
            <Text>{textLabel}</Text>
            <Text style={style.horarioInputs} onPress={showPicker}>{timeFormatted}</Text>
        </View>
    )
}

export default TimeInput;