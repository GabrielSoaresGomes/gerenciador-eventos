import {Text, StyleSheet, Dimensions, View, Image} from "react-native";
import calendarImage from '../../assets/calendar.png';
import locationImage from '../../assets/maps-and-flags.png';
import clockImage from '../../assets/clock.png';

const Card = ({title, location, date, timeStart, timeEnd}) => {

    const size = Dimensions.get('window').width;

    const cardStyle = StyleSheet.create({
        cardBody: {
            backgroundColor: '#D9D9D9',
            marginTop: size * 0.05,
            marginBottom: size * 0.05,
            padding: size * 0.015,
            height: size * 0.25,
            width: size * 0.85,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 6
        },
        cardText: {
            textAlign: 'center',
        },
        imageIcon: {
            width: size * 0.03,
            height: size * 0.03,
            marginRight: size * 0.01
        },
        firstColumn: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        secondColumn: {
            display: 'flex'
        },
        titleText: {
            fontSize: size * 0.04,
            fontWeight: 'bold'
        },
        textIconContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        locationText: {
            fontSize: size * 0.03
        }
    });

    return (
        <View style={cardStyle.cardBody}>
            <View style={cardStyle.firstColumn}>
                <Text style={cardStyle.titleText}>{title}</Text>
                <View style={cardStyle.textIconContainer}>
                    <Image source={locationImage} style={cardStyle.imageIcon}/>
                    <Text style={cardStyle.locationText}>{location}</Text>
                </View>
            </View>
            <View style={cardStyle.secondColumn}>
                <View style={cardStyle.textIconContainer}>
                    <Image source={calendarImage} style={cardStyle.imageIcon} />
                    <Text> {date} </Text>
                </View>
                <View style={cardStyle.textIconContainer}>
                    <Image source={clockImage} style={cardStyle.imageIcon} />
                    <Text> {timeStart} - {timeEnd} </Text>
                </View>
            </View>
        </View>
    );
};

export default Card;