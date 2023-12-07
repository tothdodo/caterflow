import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Welcome = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <View style={styles.logoutButtonContainer}>
                    <TouchableOpacity style={styles.logoutTouchable} onPress={() => navigation.navigate("Login")}>
                        <Icon
                            name={"arrow-left"} size={30}
                            color="#920941" />
                        <Text style={styles.actionBtnText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Image style={styles.logo} source={require('../../assets/catering_logo.jpg')} />
                </View>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CreateUnit')}>
                    <Text style={styles.actionBtnText}>Create New Unit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('JoinUnit')}>
                    <Text style={styles.actionBtnText}>Join Unit with Entry Code</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.myUnitsBtnContainer}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MyUnits')}>
                    <Text style={styles.actionBtnText}>My Units</Text>
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
        justifyContent: 'flex-start',
    },
    logoutButtonContainer: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginLeft: 20,
    },
    logoutTouchable:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        columnGap: 10,
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
    myUnitsBtnContainer:
    {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        marginBottom: 40,
    },
    welcomeText:
    {
        color: "white",
        fontSize: 40,
        marginBottom: 40,
        fontWeight: "bold",
    },
});