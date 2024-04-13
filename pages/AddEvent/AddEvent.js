import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef, useState, useEffect} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, {Callout, Marker} from 'react-native-maps';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync} from 'expo-location';
import {useNavigation} from "@react-navigation/native";
import style from "../../components/form/style";
import TitleInput from "../../components/form/TitleInput/TitleInput";
import DataInput from "../../components/form/DataInput/DataInput"
import TimeInput from "../../components/form/TimeInputs/TimeInput";
import DescriptionInput from "../../components/form/DescriptionInput/DescriptionInput";

const AddEvent = () => {
    const navigation = useNavigation();
    const [type, setType] = useState(CameraType.back);
    const [permission, setPermission] = useState(null);
    const cameraRef = useRef(null);
    const [cameraVisible, setCameraVisible] = useState(false);

    //Form values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imgUri, setImgUri] = useState('');

    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        timeStart: '',
        timeEnd: '',
        location: '',
        imageUri: ''
    });

    const [location, setLocation] = useState()
    const [address, setAddress] = useState('não escolhido');
    const [mapRef, setMapRef] = useState(null);

    async function requestLocationPermission() {
        const {granted} = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

    async function requestCamPermission() {
        const permission = Camera.useCameraPermissions();

        if (permission) {
            await setPermission(permission);
        }
    }

    async function fetchAddress(loc) {
        const response = await reverseGeocodeAsync({latitude: loc.latitude, longitude: loc.longitude});
        if (response && response.length > 0) {
            const firstResult = response[0];
            let formattedAddress = firstResult.formattedAddress;
            if (!formattedAddress || formattedAddress === ""){
                formattedAddress = location
            }
            setAddress(formattedAddress);

            const newEventData = eventData;
            newEventData.location = formattedAddress;
            setEventData(newEventData);
        } else {
            setAddress('Endereço não encontrado.');
        }
    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
        })();
        requestLocationPermission();
    }, []);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        })();
        requestLocationPermission();
    }, []);

    const toggleCameraType = () => {
        // setType((currentType) => (currentType === CameraType.back ? CameraType.front : CameraType.back));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                const newEventData = eventData;
                newEventData.imageUri = photo.uri;
                setEventData(newEventData);
                setCameraVisible(false); // Esconde a câmera após capturar a foto
                setImgUri(photo.uri);
            } catch (error) {
                console.error('Erro ao capturar a foto:', error);
            }
        }
    };

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
        const newEventData = eventData;
        newEventData.date = formatDate(currentDate);
        setEventData(newEventData);
    };

    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || timeStart;
        setShowTimeStart(Platform.OS === 'ios');
        setTimeStart(currentTime);
        setTimeStartFormatted(formatTime(currentTime));
        const newEventData = eventData;
        newEventData.timeStart = formatTime(currentTime);
        setEventData(newEventData)
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || timeEnd;
        setShowTimeEnd(Platform.OS === 'ios');
        setTimeEnd(currentTime);
        setTimeEndFormatted(formatTime(currentTime));
        const newEventData = eventData;
        newEventData.timeEnd = formatTime(currentTime);
        setEventData(newEventData)
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


    // Código para mostrar a câmera em tela cheia com botão de captura
    if (cameraVisible) {
        return (
            <View style={{flex: 1}}>
                <Camera ref={cameraRef} style={{flex: 1}} type={type}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        margin: 20
                    }}>
                        <View style={style.containerCamera}>
                            <TouchableOpacity onPress={() => setCameraVisible(false)}>
                                <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}}>Voltar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={takePicture}>
                                <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}}>Tirar Foto</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </Camera>
            </View>
        );
    }


    const handleUpdateTitle = (title) => {
        const newEventData = eventData;
        newEventData.title = title;
        setTitle(title)
        setEventData(newEventData);
    }

    const handleUpdateDescription = (description) => {
        const newEventData = eventData;
        newEventData.description = description;
        setDescription(description)
        setEventData(newEventData);

    }

    const handleSaveEventData = async () => {
    try {
        // Recuperar eventos existentes
        const existingEvents = JSON.parse(await AsyncStorage.getItem('events-mock') || '[]');

        // Adicionar novo evento
        const newEvents = [...existingEvents, eventData];

        // Salvar de volta no AsyncStorage
        await AsyncStorage.setItem('events-mock', JSON.stringify(newEvents));
        console.log('Evento salvo com sucesso!');
        navigation.navigate('Home');
    } catch (error) {
        console.error('Erro ao salvar evento:', error);
    }
}


    return (
        <View style={style.container}>

            {!showMap &&
                <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>

                    <TitleInput title={title} handleUpdateTitle={handleUpdateTitle}/>

                    <DataInput dateFormatted={dateFormatted} showDatepicker={showDatepicker}/>

                    <View style={style.containerAllHorarioInputs}>
                        <TimeInput timeFormatted={timeStartFormatted} showPicker={showStartTimepicker} textLabel={"Horário Início"} />
                        <TimeInput timeFormatted={timeEndFormatted} showPicker={showEndTimepicker} textLabel={"Horário Fim"} />
                    </View>

                    <Text style={style.textDiv}>Adicionar Localização</Text>

                    <Text numberOfLines={2} onPress={() => setShowMap(true)}
                          style={style.locationInput}>{address}</Text>

                    <DescriptionInput description={description} handleUpdateDescription={handleUpdateDescription} />

                    <Text style={style.textDiv} onPress={() => setCameraVisible(true)}>{imgUri? "Alterar Imagem": "Adicionar Imagem +"}</Text>
                    { imgUri &&
                    <Image style={{width: size * 0.5, height: size * 0.9}} src={imgUri}></Image>
                    }
                    <TouchableOpacity><Text style={style.saveButton} onPress={handleSaveEventData}>Salvar</Text></TouchableOpacity>


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