import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { BackButton } from "../../components/BackButton";
import { AddUser, CateringUnitApi } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import { useTokenContext } from "../../contexts/TokenContext";
import * as jose from 'jose';
import { useUnitContext } from "../../contexts/UnitContext";

export const JoinUnit = ({ navigation }) => {

    const { token, setToken } = useTokenContext();
    const { setUnitId } = useUnitContext();

    const [unitCode, setUnitCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const joinUnit = async () => {
        if (unitCode.length === 0 || nickname.length === 0) {
            setError(true);
            setErrorMessage('Please fill in all fields');
            return;
        }
        setError(false);
        setErrorMessage('');
        setLoading(true);
        const cateringUnitService = new CateringUnitApi();
        const addUser: AddUser = {
            userId: Number(jose.decodeJwt(token).UserId),
            nickName: nickname,
            entryCode: Number(unitCode),
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        };

        await cateringUnitService.apiCateringUnitPut(addUser, options).then((response) => {
            setToken(response.data.tokenString!);
            setLoading(false);
            setUnitId(response.data.cateringUnitId!);
            navigation.navigate('UnitWelcome');
        }).catch((error) => {
            setLoading(false);
            setErrorMessage(error.response.data);
            setError(true);
            console.log(error);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <BackButton navigation={navigation} />
            </View>
            <View style={styles.centerContainer}>
                <View>
                    <Image style={styles.logo} source={require('../../assets/catering_logo.jpg')} />
                </View>
                <Text style={styles.inputTitle}>Unit Entry Code</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Entry Code"
                        placeholderTextColor="black"
                        onChangeText={(unitCode) => setUnitCode(unitCode)}
                    />
                </View>
                <Text style={styles.inputTitle}>Your Nickname in the Unit</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nickname"
                        placeholderTextColor="black"
                        onChangeText={(nickname) => setNickname(nickname)}
                    />
                </View>
                {error ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.actionBtn} onPress={() => joinUnit()}>
                    <Text style={styles.actionBtnText}>Join Unit</Text>
                </TouchableOpacity>
            </View>
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
    },
    backButtonContainer: {
        marginLeft: 20,
        alignSelf: "flex-start",
    },
    centerContainer:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: 40,
    },
    actionBtn:
    {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: "#920941",
    },
    actionBtnText:
    {
        color: "white",
        fontWeight: "bold",
    },
    inputTitle: {
        color: "white",
        fontSize: 15,
        marginBottom: 5,
    },
    inputView: {
        backgroundColor: "white",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    textInput: {
        width: "100%",
        textAlign: 'center',
        height: 50,
        flex: 1,
        padding: 10,
    },
    errorMessage: {
        color: "red",
        marginBottom: 20,
    },
});