import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from "react-native"
import { useUnitContext } from "../../contexts/UnitContext";
import { useEffect, useState } from "react";
import { PaymentSubOrderItem } from "../../models/PaymentSubOrderItem";
import { ContainType, OrderApi, PaySubOrderItem, PaySubOrderItems } from "../../generated";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getContainTypeDisplayName } from "../../constants/ContainTypeDisplayNames";
import { LoadingModal } from "react-native-loading-modal";
import { BackButton } from "../../components/BackButton";
import { useTokenContext } from "../../contexts/TokenContext";

export const Payment = ({ navigation, route }) => {
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();
    const { orderId } = route.params;

    const [remainingItems, setRemainingItems] = useState<PaymentSubOrderItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<PaymentSubOrderItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const moveItemToSelected = (itemIndex) => {
        const itemToMove = remainingItems[itemIndex];

        if (itemToMove.amount > 0) {
            const updatedRemainingItems = [...remainingItems];
            updatedRemainingItems[itemIndex] = { ...itemToMove, amount: itemToMove.amount - 1 };

            if (itemToMove.amount === 1) {
                updatedRemainingItems.splice(itemIndex, 1);
            }

            setRemainingItems(updatedRemainingItems);

            const existingSelectedItem = selectedItems.find(item => item.id === itemToMove.id);
            if (existingSelectedItem) {
                const updatedSelectedItems = selectedItems.map(item =>
                    item.id === itemToMove.id ? { ...item, amount: item.amount + 1 } : item
                );
                setSelectedItems(updatedSelectedItems);
            } else {
                setSelectedItems([...selectedItems, { ...itemToMove, amount: 1 }]);
            }
        }
    };

    const moveItemToRemaining = (itemIndex) => {
        const itemToMove = selectedItems[itemIndex];

        if (itemToMove.amount > 0) {
            const updatedSelectedItems = [...selectedItems];
            updatedSelectedItems[itemIndex] = { ...itemToMove, amount: itemToMove.amount - 1 };

            if (itemToMove.amount === 1) {
                updatedSelectedItems.splice(itemIndex, 1);
            }

            setSelectedItems(updatedSelectedItems);

            const existingRemainingItem = remainingItems.find(item => item.id === itemToMove.id);
            if (existingRemainingItem) {
                const updatedRemainingItems = remainingItems.map(item =>
                    item.id === itemToMove.id ? { ...item, amount: item.amount + 1 } : item
                );
                setRemainingItems(updatedRemainingItems);
            } else {
                setRemainingItems([...remainingItems, { ...itemToMove, amount: 1 }]);
            }
        }
    };

    const selectAll = () => {
        if (remainingItems.length > 0) {
            const updatedSelectedItems = [...selectedItems, ...remainingItems];
            setSelectedItems(updatedSelectedItems);
            setRemainingItems([]);
        }
    };

    const deselectAll = () => {
        if (selectedItems.length > 0) {
            const updatedRemainingItems = [...remainingItems, ...selectedItems];
            setRemainingItems(updatedRemainingItems);
            setSelectedItems([]);
        }
    };

    const getRemainingItems = async () => {
        try {
            setLoading(true);
            const orderService = new OrderApi();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const order = await orderService.apiOrderPayableGet(orderId, unitId, options);
            const orderItems: PaymentSubOrderItem[] = order.data.subOrderItems?.map(item => {
                return {
                    id: item.id!,
                    productName: item.product?.name!,
                    price: item.product?.price!,
                    amount: item.amount!,
                    ingredients: item.product?.ingredients?.map(ingredient => {
                        return {
                            id: ingredient.id!,
                            name: ingredient.name!,
                            containType: ingredient.containType!,
                        };
                    }) ?? [],
                };
            }) ?? [];
            setRemainingItems(orderItems);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const pay = async () => {
    try {
        setLoading(true);
        const orderService = new OrderApi();

        const payItemsArrays: PaySubOrderItem[] = selectedItems.map(item => ({
            subOrderItemId: item.id,
            amount: item.amount,
        }));

        const orderPay: PaySubOrderItems = {
            cateringUnitId: unitId,
            orderId: orderId,
            subOrderItemIds: payItemsArrays,
        };

        const options = {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        };

        await orderService.apiOrderPaymentPut(orderPay, options);

        setSelectedItems([]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await getRemainingItems();
        // navigation.navigate("OrderOverview", { unitId: unitId, orderId: orderId });
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (orderId) {
            getRemainingItems();
        }
    }, [orderId]);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={[styles.text, styles.title]}>Payment</Text>
            <Text style={[styles.text, styles.orderIdText]}>Order ID: {orderId}</Text>
            <ScrollView style={styles.remainingContainer}>
                <Text style={[styles.text, styles.listTitle]}>Remaining suborder items</Text>
                {
                    remainingItems.map((item, index) => {
                        return (
                            <View key={item.id}>
                                <View style={styles.listItem}>
                                    <View style={styles.iconName}>
                                        <TouchableOpacity
                                            onPress={() => moveItemToSelected(index)}>
                                            <Icon
                                                name="plus"
                                                size={30}
                                                color={"green"} />
                                        </TouchableOpacity>
                                        <Text style={styles.text}>{item.productName} x {item.amount}</Text>
                                    </View>
                                    <Text style={styles.text}>{item.price.toFixed(2)}$/piece</Text>
                                </View>
                                {item.ingredients
                                    ?.filter((ingredient) => ingredient.containType !== ContainType.NUMBER_0)
                                    .map((ingredient) => (
                                        <View key={ingredient.id} style={{ flexDirection: "row", marginLeft: 10 }}>
                                            <Text
                                                style={{ marginStart: 20, fontWeight: "bold", color: ingredient.containType === ContainType.NUMBER_1 ? "#7CFC00" : "red" }}>
                                                {getContainTypeDisplayName(ingredient.containType!)}
                                            </Text>
                                            <Text style={styles.ingredient}>
                                                {" " + ingredient.name}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        );
                    })
                }
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <View style={styles.button}>
                    <Button title="Select all" color="#920941" disabled={remainingItems.length === 0} onPress={() => selectAll()} />
                </View>
                <View style={styles.button}>
                    <Button title="Deselect all" color="#920941" disabled={selectedItems.length === 0} onPress={() => deselectAll()} />
                </View>
            </View>
            <ScrollView style={styles.remainingContainer}>
                <Text style={[styles.text, styles.listTitle]}>Selected suborder items</Text>
                {
                    selectedItems.map((item, index) => {
                        return (
                            <View key={item.id}>
                                <View style={styles.listItem}>
                                    <View style={styles.iconName}>
                                        <TouchableOpacity
                                            onPress={() => moveItemToRemaining(index)}>
                                            <Icon
                                                name="minus"
                                                size={30}
                                                color={"red"} />
                                        </TouchableOpacity>
                                        <Text style={[styles.text, {flexWrap: "wrap"}]}>{item.productName} x {item.amount}</Text>
                                    </View>
                                    <Text style={styles.text}>{item.price.toFixed(2)}$/piece</Text>
                                </View>
                                {item.ingredients
                                    ?.filter((ingredient) => ingredient.containType !== ContainType.NUMBER_0)
                                    .map((ingredient) => (
                                        <View key={ingredient.id} style={{ flexDirection: "row", marginLeft: 10 }}>
                                            <Text
                                                style={{ marginStart: 20, fontWeight: "bold", color: ingredient.containType === ContainType.NUMBER_1 ? "#7CFC00" : "red" }}>
                                                {getContainTypeDisplayName(ingredient.containType!)}
                                            </Text>
                                            <Text style={styles.ingredient}>
                                                {" " + ingredient.name}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        );
                    })
                }
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={[styles.text, styles.title]}>Total:</Text>
                <Text style={[styles.text, styles.title]}> {selectedItems.reduce((total, item) => total + item.price * item.amount, 0).toFixed(2)}$</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.button}>
                    <Button title="Cash" color="green" disabled={selectedItems.length === 0} onPress={() => pay()} />
                </View>
                <View style={styles.button}>
                    <Button title="Card" color="green" disabled={true} onPress={() => pay()} />
                </View>
            </View>
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        paddingHorizontal: 20,
        paddingBottom: 20,
        flex: 1,
    },
    text: {
        color: "white",
        fontSize: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    listTitle: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 5,
        fontWeight: "bold",
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    iconName: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        width: "60%"
    },
    orderIdText: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 5,
    },
    remainingContainer: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        border: "1px solid white",
    },
    ingredient: {
        color: "white",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
    },
    button: {
        width: "40%",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginHorizontal: 20
    },
});