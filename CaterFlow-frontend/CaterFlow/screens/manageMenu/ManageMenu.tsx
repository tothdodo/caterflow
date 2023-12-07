import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BackButton } from "../../components/BackButton";

export const ManageMenu = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Manage Menu</Text>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
                    <Text style={styles.unitOperationText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Products")}>
                    <Text style={styles.unitOperationText}>Products</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        color: "white",
        fontSize: 30,
        textAlign: "center",
        marginBottom: 30,
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
});