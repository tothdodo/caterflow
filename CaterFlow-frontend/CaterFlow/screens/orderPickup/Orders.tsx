import { TouchableOpacity, StyleSheet, View, Text } from "react-native"
import { OrderHeader } from "../../generated";

interface OrdersProps {
    orders: OrderHeader[];
    color: string;
    navigation: any;
}

export const Orders = (props: OrdersProps) => {
    return (
        <View>
            {
                props.orders
                    .slice()
                    .sort((a, b) => {
                        const tableNumberA = a.tableNumber ?? Infinity;
                        const tableNumberB = b.tableNumber ?? Infinity;

                        return tableNumberA - tableNumberB;
                    })
                    .map((order) => {
                        return (
                            <TouchableOpacity
                                key={order.id}
                                onPress={() => props.navigation.navigate("OrderOverview", { orderId: order.id })}>
                                <Text style={[styles.activeOrderText, {backgroundColor: props.color}]}>
                                    {`Order ID: ${order.id}`}{order.tableNumber ? ` (Table ${order.tableNumber})` : ""}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    
    activeOrderText: {
        color: "white",
        fontSize: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 25,
        textAlign: "center",
        borderRadius: 10,
        flex: 1,
    },
});