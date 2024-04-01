import {ScrollView, StyleSheet, Text, TextInput, Dimensions, Platform, View, TouchableOpacity} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, {Callout, Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync} from "expo-location";


const AddEvent = () => {
    const [location, setLocation] = useState()
    const [address, setAddress] = useState('');
    const [mapRef, setMapRef] = useState(null);

    async function requestLocationPermission() {
        const {granted} = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

    async function fetchAddress(loc) {
        const response = await reverseGeocodeAsync({latitude: loc.latitude, longitude: loc.longitude});
        if (response && response.length > 0) {
            const firstResult = response[0];
            const formattedAddress = firstResult.formattedAddress;
            setAddress(formattedAddress);
            console.log(formattedAddress);
        } else {
            setAddress('Endereço não encontrado.');
            console.log('Endereço não encontrado.');
        }
    }

    useEffect(() => {
        requestLocationPermission()
    }, []);

    const [showMap, setShowMap] = useState(false);

    const [date, setDate] = useState(new Date());
    const [dateFormatted, setDateFormatted] = useState('');
    const [showDate, setShowDate] = useState(false);

    const [timeStart, setTimeStart] = useState(new Date);
    const [timeStartFormatted, setTimeStartFormatted] = useState('');
    const [showTimeStart, setShowTimeStart] = useState(false);

    const [timeEnd, setTimeEnd] = useState(new Date);
    const [timeEndFormatted, setTimeEndFormatted] = useState('');
    const [showTimeEnd, setShowTimeEnd] = useState(false);

    const showDatepicker = () => {
        setShowDate(true);
    };

    const showStartTimepicker = () => {
        setShowTimeStart(true);
    };

    const showEndTimepicker = () => {
        setShowTimeEnd(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
        setDateFormatted(formatDate(currentDate));
    };

    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || timeStart;
        setShowTimeStart(Platform.OS === 'ios');
        setTimeStart(currentTime);
        setTimeStartFormatted(formatTime(currentTime));
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || timeEnd;
        setShowTimeEnd(Platform.OS === 'ios');
        setTimeEnd(currentTime);
        setTimeEndFormatted(formatTime(currentTime));
    };

    const formatDate = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1; // getMonth() retorna mês de 0-11
        let year = date.getFullYear();

        // Garantindo que dia e mês tenham dois dígitos
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return `${day}/${month}/${year}`;
    };

    const formatTime = (time) => {
        const hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();

        return `${hours}:${minutes}`;
    }

    async function moveToCurrentLocation() {
        const {granted} = await requestForegroundPermissionsAsync();
        if (granted) {
            const currentPosition = await getCurrentPositionAsync({});
            setLocation(currentPosition);
            const newRegion = {
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            mapRef.animateToRegion(newRegion, 1000); // Anima o mapa para a nova região
        }
    }


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
            marginVertical: size * 0.04,
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
            borderRadius: 6
        },
        textDiv: {
            marginTop: size * 0.1,
        },
        map: {
            flex: 1,
            width: '100%',
            height: '100%'
        }
    })

    return (
        <View style={style.container}>

            {!showMap &&
                <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>

                    <Text style={style.textDiv}>Título</Text>
                    <TextInput style={style.divInput}></TextInput>

                    <Text style={style.textDiv}>Data</Text>
                    <Text style={style.divInput} onPress={showDatepicker}>{dateFormatted}</Text>
                    <View style={style.containerAllHorarioInputs}>
                        <View style={style.containerHorarioInputs}>
                            <Text>Horário Inicio</Text>
                            <Text style={style.horarioInputs} onPress={showStartTimepicker}>{timeStartFormatted}</Text>
                        </View>
                        <View style={style.containerHorarioInputs}>
                            <Text>Horário Fim</Text>
                            <Text style={style.horarioInputs} onPress={showEndTimepicker}>{timeEndFormatted}</Text>
                        </View>

                    </View>
                    <Text style={style.textDiv}>Adicionar Localização</Text>

                    <Text numberOfLines={2} onPress={() => setShowMap(true)}
                          style={style.locationInput}>{address}</Text>

                    <Text style={style.textDiv}>Descrição</Text>
                    <TextInput style={style.descricaoInput}></TextInput>

                    <Text style={style.textDiv}>Adicionar Imagens +</Text>


                    {showDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    {showTimeStart && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={timeStart}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeStartTime}
                        />
                    )}

                    {showTimeEnd && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={timeEnd}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeEndTime}
                        />
                    )}
                </ScrollView>
            }

            {
                (location && showMap) &&
                <MapView
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
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                            }
                        };
                        setLocation(loc);
                        fetchAddress(loc.coords);
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        onCalloutPress={() => console.log("Callout pressionado!")}
                    >
                        <Callout>
                            <Text>Localização:</Text>
                            <Text>{address || ''}</Text>
                        </Callout>
                    </Marker>
                </MapView>
            }
            {
                (location && showMap) &&
                <View style={{
                    position: 'absolute',
                    display: 'flex',
                    gap: size * 0.02,
                    bottom: size * 0.05,
                    right: size * 0.05,
                    width: size * 0.45
                }}>
                    <Text style={{fontSize: size * 0.03}}>{address}</Text>

                    <TouchableOpacity style={{
                        backgroundColor: '#00ff00',
                        padding: size * 0.02,
                        borderRadius: 6
                    }}
                    onPress={() => setShowMap(false)}
                    >
                        <Text style={{textAlign: 'center'}}>CONFIRMAR</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

export default AddEvent;