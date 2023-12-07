import { StyleSheet, Text } from "react-native";
import { CateringUnitDTO } from "../../generated";

type CateringUnitCardProps = {
    unit: CateringUnitDTO;
}

export const CateringUnitCard = (props: CateringUnitCardProps) => {
    return (
        <Text style={styles.UnitCard}>{props.unit.name}</Text>
    );
}

const styles = StyleSheet.create({
    UnitCard: {
        color: "white",
        fontWeight: "bold",
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 20,
        textAlign: "center",
        borderRadius: 10,
        flex: 1,
        backgroundColor: "#920941",
    },
});