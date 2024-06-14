import {Text, TouchableOpacity, View} from "react-native";
import {Camera, CameraType} from "expo-camera/legacy";
import {style} from "../style";
import React, {useState} from "react";

const CameraScreen = ({cameraRef, setCameraVisible, setImgUri}) => {
    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({base64: true, quality: 0.2});
                setCameraVisible(false);
                setImgUri(photo.base64);
            } catch (error) {
                console.error('Erro ao capturar a foto:', error);
            }
        }
    };

    return (
        <View style={{flex: 1}}>
            <Camera ref={cameraRef} style={{flex: 1}} type={CameraType.back}>
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

export default CameraScreen;