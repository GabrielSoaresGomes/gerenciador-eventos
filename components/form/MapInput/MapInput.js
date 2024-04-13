import {style} from "../style";
import MapView, {Callout, Marker} from "react-native-maps";
import {Text, View} from "react-native";
import React from "react";
import {reverseGeocodeAsync} from "expo-location";

const MapInput = ({location, showMap, setMapRef, setLocation, setAddress, address}) => {

    async function fetchAddress(loc) {
        const response = await reverseGeocodeAsync({latitude: loc.latitude, longitude: loc.longitude});
        if (response && response.length > 0) {
            const firstResult = response[0];
            let formattedAddress = firstResult.formattedAddress;
            if (!formattedAddress || formattedAddress === "") {
                formattedAddress = location
            }
            setAddress(formattedAddress);
        } else {
            setAddress('Endereço não encontrado.');
        }
    }

    return ((location && showMap) && <MapView
        showsTraffic={true}
        showsUserLocation={true}
        userLocationAnnotationTitle={address}
        ref={(map) => setMapRef(map)}
        style={style.map}
        toolbarEnabled={false}
        initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        }}
        onPress={(e) => {
            const loc = {
                coords: {
                    latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude,
                }
            };
            setLocation(loc);
            fetchAddress(loc.coords);
        }}
    >
        <Marker
            coordinate={{
                latitude: location.coords.latitude, longitude: location.coords.longitude,
            }}
            onCalloutPress={() => console.log("Callout pressionado!")}
        >
            <Callout>
                <Text>Localização:</Text>
                <Text>{address || ''}</Text>
            </Callout>
        </Marker>
    </MapView>)
}

export default MapInput;