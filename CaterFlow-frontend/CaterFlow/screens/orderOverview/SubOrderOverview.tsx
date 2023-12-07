import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ContainType, SubOrderDTO } from "../../generated";
import { getSubOrderStatusDisplayName } from "../../constants/SubOrderStatusDisplayNames";
import { getContainTypeDisplayName } from "../../constants/ContainTypeDisplayNames";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDiningOptionDisplayName } from "../../constants/DiningOptionDisplayNames";

interface ISubOrderOverviewProps {
    subOrder: SubOrderDTO;
    setModifySubOrder: (subOrder: SubOrderDTO) => void;
    openModifySubOrder: () => void;
}

export const SubOrderOverview = (props: ISubOrderOverviewProps) => {
    return (
        <View style={styles.subOrderContainer}>
            <View style={styles.subOrderItemContainer}>
                <Text style={styles.text}>
                    Drink/Kitchen status:
                    <Text style={[styles.text, { fontWeight: "bold", marginStart: 5 }]}>
                        {getSubOrderStatusDisplayName(props.subOrder.drinkStatus!)}/{getSubOrderStatusDisplayName(props.subOrder.kitchenStatus!)}
                    </Text>
                </Text>
                
                <TouchableOpacity onPress={() => {
                    props.setModifySubOrder(props.subOrder);
                    props.openModifySubOrder();
                }}>
                    <Icon name="wrench" size={20} color={"#920941"} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.text, { fontWeight: "bold"}]}>{getDiningOptionDisplayName(props.subOrder.diningOption!)}</Text>
            <View style={{ marginTop: 10 }}>
                {
                    props.subOrder.subOrderItems ?
                        props.subOrder.subOrderItems.map((orderItem) => {
                            return (
                                <View key={orderItem.id}>
                                    <View style={styles.subOrderItemContainer}>
                                        <View style={{ width: "70%" }}>
                                            <Text style={styles.text}>{orderItem.amount} x {orderItem.product!.name}</Text>
                                            {orderItem.product?.ingredients
                                                ?.filter((ingredient) => ingredient.containType !== ContainType.NUMBER_0)
                                                .map((ingredient) => (
                                                    <View key={ingredient.id} style={{ flexDirection: "row" }}>
                                                        <Text
                                                            style={{ marginStart: 20, fontWeight: "bold", color: ingredient.containType === ContainType.NUMBER_1 ? "green" : "red" }}>
                                                            {getContainTypeDisplayName(ingredient.containType!)}
                                                        </Text>
                                                        <Text style={styles.text}>
                                                            {" " + ingredient.name}
                                                        </Text>
                                                    </View>
                                                ))}
                                        </View>
                                        <Text style={styles.text}>{(orderItem.product!.price! * orderItem.amount!).toFixed(2)} $</Text>
                                    </View>
                                </View>
                            )
                        })
                        : <Text style={styles.text}>No suborder items.</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subOrderContainer: {
        border: "2px solid #920941",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5
    },
    subOrderItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        color: "white"
    }
})
