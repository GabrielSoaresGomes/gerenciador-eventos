import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef, useState, useEffect} from 'react';
import { randomUUID } from 'expo-crypto';
import {ScrollView, Text, View, TouchableOpacity, Platform} from 'react-native';
import {Camera} from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {useNavigation} from "@react-navigation/native";
import {style} from "../../components/form/style";
import TitleInput from "../../components/form/TitleInput/TitleInput";
import DataInput from "../../components/form/DataInput/DataInput"
import TimeInput from "../../components/form/TimeInputs/TimeInput";
import DescriptionInput from "../../components/form/DescriptionInput/DescriptionInput";
import CameraScreen from "../../components/form/CameraScreen/CameraScreen";
import CameraInput from "../../components/form/CameraInput/CameraInput";
import MapInput from "../../components/form/Map/MapInput/MapInput";
import MapScreen from "../../components/form/Map/MapScreen/MapScreen";
import MapButtons from "../../components/form/Map/MapButtons/MapButtons";
import {insertToQueueAdd, addDocumentFirebase, syncEventsWithFirebase} from "../../database/api"
import NetInfo from "@react-native-community/netinfo";


const AddEvent = () => {
    const navigation = useNavigation();
    const [permission, setPermission] = useState(null);
    const cameraRef = useRef(null);
    const [cameraVisible, setCameraVisible] = useState(false);

    //Form values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imgUri, setImgUri] = useState('');

    const [location, setLocation] = useState()
    const [address, setAddress] = useState('não escolhido');

    async function requestLocationPermission() {
        const {granted} = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        })();
        requestLocationPermission();
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
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return `${day}/${month}/${year}`;
    };

    const formatTime = (time) => {
        const hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();

        return `${hours}:${minutes}`;
    }

    if (cameraVisible) {
        return (<CameraScreen cameraRef={cameraRef} setCameraVisible={setCameraVisible} setImgUri={setImgUri}/>);
    }

    const handleUpdateTitle = (title) => {
        setTitle(title);
    }

    const handleUpdateDescription = (description) => {
        setDescription(description);
    }

    const handleSaveEventData = async () => {
        try {
            const fields = [
                { name: title, message: 'O campo title precisa ser preenchido!' },
                { name: dateFormatted, message: 'O campo date precisa ser preenchido!' },
                { name: timeStartFormatted, message: 'O campo time start precisa ser preenchido!' },
                { name: timeEndFormatted, message: 'O campo time end precisa ser preenchido!' },
                { name: description, message: 'O campo description precisa ser preenchido!' },
                { name: imgUri, message: 'O campo imgUri precisa ser preenchido!' },
                { name: address, message: 'O campo address precisa ser preenchido!' }
            ];

            let hasError = false;

            fields.forEach(field => {
                if (!field.name || field.name === '' || field.name === 'não escolhido') {
                    console.warn(field.message);
                    hasError = true;
                }
            });

            if (hasError) {
                return;
            }

            const id = randomUUID();
            const newEvent = {
                id,
                title,
                date: dateFormatted,
                time_start: timeStartFormatted,
                time_end: timeEndFormatted,
                address,
                location_lat: location.coords.latitude,
                location_long: location.coords.longitude,
                description,
                image: imgUri
            }

            const connection = await NetInfo.fetch();
            console.info('Iniciando inserção do evento!');
            if (connection.isConnected && connection.isInternetReachable) {
                newEvent.event_uuid = randomUUID();
                await addDocumentFirebase(newEvent);
            } else {
                await insertToQueueAdd(newEvent);
            }
            await syncEventsWithFirebase();
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
        }
    }

    return (<View style={style.container}>

        {!showMap && <ScrollView contentContainerStyle={{display: 'flex', alignItems: 'center'}}>

            <TitleInput title={title} handleUpdateTitle={handleUpdateTitle}/>

            <DataInput dateFormatted={dateFormatted} showDatepicker={showDatepicker}/>

            <View style={style.containerAllHorarioInputs}>
                <TimeInput timeFormatted={timeStartFormatted} showPicker={showStartTimepicker}
                           textLabel={"Horário Início"}/>
                <TimeInput timeFormatted={timeEndFormatted} showPicker={showEndTimepicker}
                           textLabel={"Horário Fim"}/>
            </View>

            <MapInput address={address} location={location}  setShowMap={setShowMap}/>


            <DescriptionInput description={description} handleUpdateDescription={handleUpdateDescription}/>

            <CameraInput setCameraVisible={setCameraVisible} cameraRef={cameraRef}
                         handleSaveEventData={handleSaveEventData} imgUri={imgUri} setImgUri={setImgUri}/>

            <TouchableOpacity><Text style={style.saveButton}
                                    onPress={handleSaveEventData}>Salvar</Text></TouchableOpacity>


            {showDate && (<DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
            />)}

            {showTimeStart && (<DateTimePicker
                testID="dateTimePicker"
                value={timeStart}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeStartTime}
            />)}

            {showTimeEnd && (<DateTimePicker
                testID="dateTimePicker"
                value={timeEnd}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeEndTime}
            />)}
        </ScrollView>}

        <MapScreen showMap={showMap} location={location} address={address} setAddress={setAddress} setLocation={setLocation} />
        <MapButtons showMap={showMap} location={location} setShowMap={setShowMap} address={address}/>

    </View>);
}

export default AddEvent;