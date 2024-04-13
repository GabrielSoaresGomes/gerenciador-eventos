import {style} from "../style";
import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";

const CameraInput = ({setCameraVisible, imgUri, handleSaveEventData}) => {
    return (
        <View>
            <Text style={style.textDiv} onPress={() => setCameraVisible(true)}>{imgUri? "Alterar Imagem": "Adicionar Imagem +"}</Text>
            { imgUri &&
                <Image style={style.imgPreview} src={imgUri}></Image>
            }
        </View>
    )
}

export default CameraInput;