import { ScrollView, StyleSheet, Text, TextInput, Dimensions, Platform, View} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    useNavigation,
} from '@react-navigation/native';
import MapView from "react-native-maps";
import {useEffect, useState} from "react";
import {requestForegroundPermissionsAsync, getCurrentPositionAsync} from "expo-location";


const AddEvent = () => {
    const [location, setLocation] = useState()

    async function requestLocationPermission() {
        const { granted } = await requestForegroundPermissionsAsync();

            if (granted) {
                const currentPosition = await getCurrentPositionAsync();
                setLocation(currentPosition);

                console.log("LOCALIZAÇÃO ATUAL => ", currentPosition);
            }
    }

    // {"coords": {"accuracy": 100, "altitude": 346.1999816894531, "altitudeAccuracy": 100, "heading": 0, "latitude": -22.3451737, "longitude": -43.683842, "speed": 0}, "mocked": false, "timestamp": 1711933238555}

    useEffect(() =>{
         requestLocationPermission()
    }, []);

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


    const size = Dimensions.get('window').width;

    const style = StyleSheet.create({
        container: {
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

    const navigation = useNavigation();
    return (
        <View style={style.container}>
        {
            location &&
            <MapView
                style={style.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }}

        />
        }
        </View>
    );
}

export default AddEvent;