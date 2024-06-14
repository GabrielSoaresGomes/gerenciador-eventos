import {Text, StyleSheet, Dimensions, View, Image, TouchableOpacity} from "react-native";
import calendarImage from '../../assets/calendar.png';
import locationImage from '../../assets/maps-and-flags.png';
import clockImage from '../../assets/clock.png';
import arrowDownImage from '../../assets/arrow_down.png';
import arrowUpImage from '../../assets/arrow_up.png';
import React, {useState} from "react";
import {style} from "../form/style";

const Card = ({title, location, date, timeStart, timeEnd, imageSrc}) => {

    const [showImage, setShowImage] = useState(false);
    const size = Dimensions.get('window').width;

    const cardStyle = StyleSheet.create({
        cardALl: {
            display: "flex",
            flexDirection: "column",
            gap: 8
        },
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
            justifyContent: 'space-between',
            width: size * 0.52
        },
        secondColumn: {
            display: 'flex'
        },
        titleText: {
            fontSize: size * 0.03,
            fontWeight: 'bold'
        },
        textIconContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',

        },
        locationText: {
            fontSize: size * 0.03,
        },
        textRight: {
            textAlign: 'right',
            fontSize: size * 0.03
        },
        imageArrowDownIcon: {
            width: size * 0.05,
            height: size * 0.05,
        },
        cardImage: {
            alignItems: "center",
            borderRadius: '40px'
        },
        imgPreview: {
            borderRadius: '40px'

        }
    });

    const handleShowImage = async () => {
        setShowImage(!showImage);
    }

    return (
        <View style={cardStyle.cardALl}>
            <View style={cardStyle?.cardBody}>
                <View style={cardStyle.firstColumn}>
                    <Text numberOfLines={2} style={cardStyle.titleText}>{title}</Text>
                    <View style={cardStyle.textIconContainer}>
                        <Image source={locationImage} style={cardStyle.imageIcon}/>
                        <Text numberOfLines={2} style={cardStyle.locationText}>{location}</Text>
                    </View>
                </View>
                <View style={cardStyle.secondColumn}>
                    <View style={cardStyle.textIconContainer}>
                        <Image source={calendarImage} style={cardStyle.imageIcon} />
                        <Text style={cardStyle.textRight}> {date} </Text>
                    </View>
                    <View style={cardStyle.textIconContainer}>
                        <Image source={clockImage} style={cardStyle.imageIcon} />
                        <Text style={cardStyle.textRight}> {timeStart} - {timeEnd} </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleShowImage}>
                    {
                        showImage ? <Image source={arrowUpImage} style={cardStyle.imageArrowDownIcon} />
                            :
                            <Image source={arrowDownImage} style={cardStyle.imageArrowDownIcon} />

                    }
                </TouchableOpacity>
            </View>
            {
                showImage && (
                    <View style={cardStyle?.cardImage}>
                        <Image style={style.imgPreview} source={{uri: `data:image/png;base64,${imageSrc}`}}></Image>
                    </View>
                )
            }

        </View>
    );
};

export default Card;