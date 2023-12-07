import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { CateringUnitApi, CateringUnitDTO, CreateCateringUnitDTO } from "../../generated";
import { BackButton } from "../../components/BackButton";
import { useTokenContext } from "../../contexts/TokenContext";
import * as jose from 'jose';
import { useUnitContext } from "../../contexts/UnitContext";

export const CreateUnit = ({ navigation }) => {

    const { token, setToken } = useTokenContext();
    const { setUnitId } = useUnitContext();

    const [unitName, setUnitName] = useState<string>('')
    const [nickName, setNickName] = useState<string>('');
    const [numberOfTables, setNumberOfTables] = useState<number>(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const createUnit = async () => {
        if (unitName.length === 0) {
            setError(true);
            setErrorMessage('Please fill the catering unit name field.');
            return;
        }

        if (nickName.length === 0) {
            setError(true);
            setErrorMessage('Please fill the nickname field.');
            return;
        }

        setError(false);
        setErrorMessage('');
        const cateringUnitService = new CateringUnitApi();
        const newCateringUnit: CreateCateringUnitDTO = {
            cateringUnitName: unitName,
            tableCount: numberOfTables,
            creatorNickName: nickName,
            creatorId: Number(jose.decodeJwt(token).UserId)
        };
        const options = {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        };

        await cateringUnitService.apiCateringUnitPost(newCateringUnit, options).then((response) => {
            const newUnit: CateringUnitDTO = response.data;
            setUnitId(newUnit.id!);
            setToken(newUnit.cateringUnitUsers![0].tokenString!);
            navigation.navigate('UnitWelcome');
        }).catch((error) => {
            console.log(error);
            setErrorMessage(error.response.data);
            setError(true);
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
                <Text style={styles.inputTitle}>Catering Unit Name</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Catering Unit Name"
                        placeholderTextColor="black"
                        onChangeText={(name) => setUnitName(name)}
                    />
                </View>
                <Text style={styles.inputTitle}>Your Nickname in the Unit</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nickname"
                        placeholderTextColor="black"
                        onChangeText={(name) => setNickName(name)}
                    />
                </View>
                <Text style={styles.inputTitle}>Number of tables</Text>
                <View style={styles.inputView}>
                    <Picker
                        style={styles.textInput}
                        mode="dialog"
                        placeholder="Number of tables"
                        selectedValue={numberOfTables}
                        onValueChange={(itemValue, itemIndex) =>
                            setNumberOfTables(itemValue)
                        }>
                        {
                            Array.from({ length: 201 }, (_, i) => (
                                <Picker.Item key={i} label={`${i}`} value={i} />
                            ))
                        }
                    </Picker>
                </View>
                {error ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.actionBtn} onPress={() => createUnit()}>
                    <Text style={styles.actionBtnText}>Create Unit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
    },
    centerContainer:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    backButtonContainer: {
        marginLeft: 20,
        alignSelf: "flex-start",
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
        borderRadius: 30,
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