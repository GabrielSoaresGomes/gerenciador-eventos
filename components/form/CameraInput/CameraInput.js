import style from "../style";
import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";

const CameraInput = (setCameraVisible, imgUri, handleSaveEventData) => {
    return (
        <View>
            <Text style={style.textDiv} onPress={() => setCameraVisible(true)}>{imgUri? "Alterar Imagem": "Adicionar Imagem +"}</Text>
            { imgUri &&
                <Image style={{width: size * 0.5, height: size * 0.9}} src={imgUri}></Image>
            }
            <TouchableOpacity><Text style={style.saveButton} onPress={handleSaveEventData}>Salvar</Text></TouchableOpacity>
        </View>
    )
}

export default CameraInput;