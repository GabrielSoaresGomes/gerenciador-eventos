import {Text, TextInput, View} from "react-native";
import {style} from "../style";

const TitleInput = ({title, handleUpdateTitle}) => {
    return(
        <View>
            <Text style={style.textDiv}>Título</Text>
            <TextInput style={style.divInput} value={title} onChangeText={handleUpdateTitle} />
        </View>
    )
}

export default TitleInput;