import {style} from "../../style";
import {Text, TouchableOpacity, View} from "react-native";
import React from "react";


const MapButtons = ({location, showMap, address, setShowMap}) => {
    return (
        (location && showMap) && <View style={style.mapButtons}>
            <Text style={style.addressPreview}>{address}</Text>

            <TouchableOpacity style={style.confirmAddressButton}
                              onPress={() => setShowMap(false)}
            >
                <Text style={style.confirmAddressButtonText}>CONFIRMAR</Text>
            </TouchableOpacity>
        </View>
    );
}

export default MapButtons;
