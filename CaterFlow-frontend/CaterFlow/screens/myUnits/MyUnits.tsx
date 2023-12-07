import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { CateringUnitApi, CateringUnitDTO } from "../../generated";
import { CateringUnitCard } from "../welcome/CateringUnitCard";
import { LoadingModal } from "react-native-loading-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTokenContext } from "../../contexts/TokenContext";
import * as jose from 'jose';
import { useUnitContext } from "../../contexts/UnitContext";
import { useFocusEffect } from "@react-navigation/native";

export const MyUnits = ({ navigation }) => {

    const { token } = useTokenContext();
    const { setUnitId } = useUnitContext();

    const [units, setUnits] = useState<CateringUnitDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getMyUnits = async () => {
        const cateringUnitService = new CateringUnitApi();
        try {
            setLoading(true);

            const userId = Number(jose.decodeJwt(token).UserId);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const userUnits = await cateringUnitService.apiCateringUnitGet(userId, options);
            setUnits(userUnits.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getMyUnits();
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            {
                !loading &&
                <View style={styles.innerContainer}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                            <Icon
                                name={"arrow-left"} size={30}
                                color="#920941" />
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.logo} source={require('../../assets/catering_logo.jpg')} />
                    <Text style={styles.myUnitsText}>My Units</Text>
                    {units.length > 0 ?
                        <View style={styles.myUnitsContainer}>
                            {
                                units.map((unit) => {
                                    return (
                                        <TouchableOpacity key={unit.id} onPress={() => {
                                            setUnitId(unit.id!);
                                            navigation.navigate("UnitWelcome");
                                        }}>
                                            <CateringUnitCard unit={unit} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        :
                        <View>
                            <Text style={{ color: "white" }}>You are not a member of any units.</Text>
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity>
                                    <Text onPress={() => navigation.navigate('JoinUnit')} style={styles.optionLink}>Join</Text>
                                </TouchableOpacity>
                                <Text style={styles.or}>or</Text>
                                <TouchableOpacity>
                                    <Text onPress={() => navigation.navigate('CreateUnit')} style={styles.optionLink}>Create</Text>
                                </TouchableOpacity>
                                <Text style={styles.or}>one!</Text>
                            </View>
                        </View>
                    }
                </View>
            }
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
    },
    innerContainer:
    {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    backButtonContainer: {
        marginLeft: 20,
        marginTop: 20,
        alignSelf: "flex-start",
    },
    logo: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: 40,
    },
    myUnitsText:
    {
        color: "white",
        fontSize: 20,
        textAlign: "left",
        fontWeight: "bold",
        marginLeft: 40,
        marginBottom: 10,
        width: "90%",
    },
    myUnitsContainer:
    {
        width: "80%",
    },
    or: {
        color: "white",
        marginLeft: 5,
        marginRight: 5,
        fontSize: 16,
    },
    optionLink: {
        textDecorationLine: 'underline',
        color: "white",
        fontSize: 16,
    },
    optionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    }
});
