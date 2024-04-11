import {Text, TextInput, View} from "react-native";
import React from "react";
import style from "../style";

const DescriptionInput = ({description, handleUpdateDescription}) => {
    return (
    <View>
        <Text style={style.textDiv}>Descrição</Text>
        <TextInput value={description} style={style.descricaoInput} onChangeText={handleUpdateDescription}></TextInput>
    </View>
    )
}

export default DescriptionInput;