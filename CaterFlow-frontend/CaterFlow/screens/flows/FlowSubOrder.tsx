import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ContainType, SubOrderDTO } from "../../generated";
import { getDiningOptionDisplayName } from "../../constants/DiningOptionDisplayNames";
import { getContainTypeDisplayName } from "../../constants/ContainTypeDisplayNames";

interface IFlowSubOrderProps {
    subOrder: SubOrderDTO;
    elapsedTime: number;
    setSubOrderReady: (subOrderId: number) => void;
}

export const FlowSubOrder = (props: IFlowSubOrderProps) => {

    return (
        <TouchableOpacity style={[styles.subOrderContainer]} onPress={() => props.setSubOrderReady(props.subOrder.id!)}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.text, styles.title]} >{getDiningOptionDisplayName(props.subOrder.diningOption!)/* USER NICKNAME */} / {props.subOrder.waiterName}</Text>
                <Text style={[styles.text, styles.title]}>{props.elapsedTime}</Text>
            </View>
            {
                props.subOrder.subOrderItems!.map(subOrderItem => {
                    return (
                        <View key={subOrderItem.id}>
                            <Text style={styles.text}>{subOrderItem.product!.name} x {subOrderItem.amount}</Text>
                            {subOrderItem.product?.ingredients
                                ?.filter((ingredient) => ingredient.containType !== ContainType.NUMBER_0)
                                .map((ingredient) => (
                                    <View key={ingredient.id} style={{ flexDirection: "row" }}>
                                        <Text
                                            style={{ marginStart: 20, fontWeight: "bold", color: ingredient.containType === ContainType.NUMBER_1 ? "#7CFC00" : "red" }}>
                                            {getContainTypeDisplayName(ingredient.containType!)}
                                        </Text>
                                        <Text style={styles.text}>
                                            {" " + ingredient.name}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    )
                })
            }
            <View>

            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subOrderContainer: {
        backgroundColor: '#920941',
        borderRadius: 10,
        minHeight: 100,
        margin: 10,
        padding: 10,
        width: 320,
    },
});