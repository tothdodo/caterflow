import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { CateringUnitApi, CateringUnitDTO, Role, UserApi } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTokenContext } from "../../contexts/TokenContext";
import * as jose from 'jose';
import { useUnitContext } from "../../contexts/UnitContext";
import { CateringUnitUserRoles } from "../../models/CateringUnitUserRoles";

export const UnitWelcome = ({ navigation }) => {
    const { token, setToken } = useTokenContext();
    const { unitId } = useUnitContext();

    const [unit, setUnit] = useState<CateringUnitDTO>();
    const [nickname, setNickname] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [unitRole, setUnitRole] = useState<number>();

    const getUnitById = async () => {
        const cateringUnitService = new CateringUnitApi();
        const userService = new UserApi();
        try {
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const unit = await cateringUnitService.apiCateringUnitUnitIdGet(unitId, options);
            setUnit(unit.data);
            const usersUnitInfo = await userService.apiUserUserunitinfoGet(Number(jose.decodeJwt(token).UserId), unitId, options);
            setToken(usersUnitInfo.data.tokenString!);
            setNickname(usersUnitInfo.data.nickName!);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const setUserRoles = () => {
        const decodedToken = jose.decodeJwt(token);
        const roles: CateringUnitUserRoles[] = JSON.parse(decodedToken.CateringUnitUserData as string).CateringUnitUsers;
        const unitRole = roles.find(r => r.CateringUnitId === unitId);
        setUnitRole(unitRole?.Role);
    }

    useEffect(() => {
        if (unitId) {
            getUnitById();
            setUserRoles();
        }
    }, [unitId]);

    useEffect(() => {
        setUserRoles();
    }, [token]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("MyUnits")}>
                        <Icon
                            name={"arrow-left"} size={30}
                            color="#920941" />
                    </TouchableOpacity>
                </View>
                <Image style={styles.logo} source={require('../../assets/catering_logo.jpg')} />
                {!loading && unitRole !== null &&
                    <View style={styles.unitOpererationsContainer}>
                        <Text style={styles.unitNameText}>{unit?.name}</Text>
                        <Text style={styles.welcomeText}>Welcome, {nickname}!</Text>
                        {unitRole === Role.NUMBER_4 &&
                            <Text style={styles.welcomeText}>Ask the admin for access to operations!</Text>}
                        {(unitRole === Role.NUMBER_0 ||
                            unitRole === Role.NUMBER_1 ||
                            unitRole === Role.NUMBER_2) &&
                            <TouchableOpacity onPress={() => navigation.navigate("ActiveOrders", {waiterName: nickname})}>
                                <Text style={styles.unitOperationText}>Order Pickup</Text>
                            </TouchableOpacity>
                        }
                        {(unitRole === Role.NUMBER_0 ||
                            unitRole === Role.NUMBER_1 ||
                            unitRole === Role.NUMBER_3) &&
                            <View>
                                <TouchableOpacity onPress={() => navigation.navigate("DrinkFlow")}>
                                    <Text style={styles.unitOperationText}>Drink Flow</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("KitchenFlow")}>
                                    <Text style={styles.unitOperationText}>Kitchen Flow</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={styles.manageContainer}>
                            {unitRole === Role.NUMBER_0 &&
                                <TouchableOpacity onPress={() => navigation.navigate("ManageStaff")}>
                                    <Text style={[styles.unitOperationText, { marginRight: 0 }]}>Manage{"\n"}Staff</Text>
                                </TouchableOpacity>
                            }
                            {(unitRole === Role.NUMBER_0 || unitRole === Role.NUMBER_1) &&
                                <TouchableOpacity onPress={() => navigation.navigate("ManageMenu")}>
                                    <Text style={[styles.unitOperationText, { marginLeft: 0 }]}>Manage{"\n"}Menu</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }
            </View>
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
    },
    backButtonContainer: {
        marginTop: 20,
        marginLeft: 20,
        alignSelf: "flex-start",
    },
    manageContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logo: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: 40,
    },
    unitOpererationsContainer:
    {
        width: "80%",
    },
    unitOperationText: {
        color: "white",
        fontSize: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 25,
        textAlign: "center",
        borderRadius: 10,
        flex: 1,
        backgroundColor: "#920941",
    },
    welcomeText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
    },
    unitNameText: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
});