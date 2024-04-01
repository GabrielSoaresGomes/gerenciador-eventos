import {TouchableOpacity, StyleSheet, View, Text, Dimensions, Image} from "react-native";
import addButtonImage from '../../assets/add-button.png';

const AddButton = ({onPress}) => {

    const size = Dimensions.get('window').width;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            marginTop: size * 0.02,
            marginRight: size * 0.02,
            alignSelf: 'stretch',
        },
        image: {
            width: size * 0.1,
            height: size * 0.1
        }
    });


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <Image style={styles.image} source={addButtonImage}/>
            </TouchableOpacity>
        </View>
    )
};

export default AddButton;