import { View, StyleSheet } from "react-native";

export const Separator = () => {
    return (
        <View style={styles.separator} />
    );
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "white",
        marginVertical: 10,
    },
});