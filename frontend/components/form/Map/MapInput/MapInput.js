import {style} from "../../style";
import {Text, View} from "react-native";
import React from "react";

const MapInput = ({location, address, setShowMap}) => {

    return (
        <View>
            <Text style={style.textDiv}>{location ? "Adicionar Localização" : "Alterar Localização"}</Text>
            <Text numberOfLines={2} onPress={() => setShowMap(true)}
                  style={style.locationInput}>{address}</Text>


        </View>)
}

export default MapInput;