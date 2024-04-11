import {Text, View} from "react-native";
import React from "react";
import style from "../style";

const DataInput = ({dateFormatted, showDatepicker}) => {
    return (
        <View>
            <Text style={style.textDiv}>Data</Text>
            <Text style={style.divInput} onPress={showDatepicker}>{dateFormatted}</Text>
        </View>
    )
}

export default DataInput;