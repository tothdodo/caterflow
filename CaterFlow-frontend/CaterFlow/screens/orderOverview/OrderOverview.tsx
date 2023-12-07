import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native"
import { GetOrder, ModifySubOrder, OrderApi, OrderDTO, OrderStatus, SubOrderDTO } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import { SubOrderOverview } from "./SubOrderOverview";
import { getOrderStatusDisplayName } from "../../constants/OrderStatusDisplayNames";
import SubOrderModifyModal from "./SubOrderModifyModal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUnitContext } from "../../contexts/UnitContext";
import { useTokenContext } from "../../contexts/TokenContext";

export const OrderOverview = ({ route, navigation }) => {

    const { unitId } = useUnitContext();
    const { token } = useTokenContext();
    const { orderId } = route.params;

    const [order, setOrder] = useState<OrderDTO>();
    const [loading, setLoading] = useState<boolean>(false);

    const [modifySubOrder, setModifySubOrder] = useState<SubOrderDTO>();
    const [modifyModalVisible, setModifyModalVisible] = useState<boolean>(false);

    const getOrder = async () => {
        setLoading(true);
        try {
            const orderService = new OrderApi();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await orderService.apiOrderGet(orderId, unitId, options).then((response) => {
                setOrder(response.data);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateSubOrder() {
        try {
            const orderService = new OrderApi();
            const modifiedSubOrder: ModifySubOrder = {
                id: modifySubOrder!.id!,
                orderId: orderId,
                cateringUnitId: unitId,
                subOrderItems: modifySubOrder!.subOrderItems!.map((subOrderItem) => {
                    return {
                        id: subOrderItem.id!,
                        amount: subOrderItem.amount!,
                        productId: subOrderItem.product?.productId,
                    }
                })
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await orderService.apiOrderSubordersPut(modifiedSubOrder, options);
            setModifySubOrder(undefined);
        } catch (error) {
            console.log(error);
        }
    }

    const openModifySubOrder = () => {
        setModifyModalVisible(true);
    }

    const setServed = async (orderId: number) => {
        try {
            setLoading(true);
            const orderService = new OrderApi();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const order: GetOrder = {
                orderId: orderId,
                cateringUnitId: unitId
            }
            await orderService.apiOrderServedPut(order, options);
            getOrder();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrder();
    }, [orderId, unitId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getOrder();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            {
                modifySubOrder &&
                <SubOrderModifyModal
                    subOrder={modifySubOrder}
                    modalVisible={modifyModalVisible}
                    getOrder={getOrder}
                    updateSubOrder={updateSubOrder}
                    setModalVisible={setModifyModalVisible} />
            }
            {
                !loading && order &&
                <View style={styles.innerContainer}>
                    <View style={styles.topContainer}>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("ActiveOrders", { unitId: unitId })}>
                                <Icon
                                    name={"arrow-left"} size={30}
                                    color="#920941" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Order Overview</Text>
                        <View style={styles.statusContainer}>
                            <View>
                                <Text style={{ color: "white" }}>
                                    Order ID:
                                    <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5 }}>
                                        {orderId}
                                    </Text>
                                </Text>
                                <Text style={{ color: "white" }}>
                                    Table:
                                    <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5 }}>
                                        {order.tableNumber ?? "None"}
                                    </Text>
                                </Text>
                                <Text style={{ color: "white" }}>
                                    Status:
                                    <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5 }}>
                                        {getOrderStatusDisplayName(order.status!)}
                                    </Text>
                                </Text>
                            </View>
                            <View style={{rowGap: 10}}>
                                <Button
                                    title="New suborder"
                                    disabled={order.status === OrderStatus.NUMBER_2 || order.status === OrderStatus.NUMBER_3}
                                    onPress={() => navigation.navigate("NewSubOrderPickup", { orderId: order.id, tableNumber: order.tableNumber, unitId: unitId })}
                                    color={"#920941"} />
                                {
                                order.status === OrderStatus.NUMBER_2 &&
                                    <Button
                                        title="Mark as Served"
                                        onPress={() => setServed(order.id!)}
                                        color={"#920941"} />
                                }
                            </View>
                        </View>
                        <View style={styles.subOrdersContainer}>
                            <Text style={{ color: "white", textAlign: "left" }}>Suborders</Text>
                        </View>
                        <ScrollView>
                            {
                                order.subOrders ?
                                    order.subOrders.map((subOrder) => {
                                        return (
                                            <View key={subOrder.id}>
                                                <SubOrderOverview
                                                    subOrder={subOrder}
                                                    openModifySubOrder={openModifySubOrder}
                                                    setModifySubOrder={setModifySubOrder} />
                                            </View>
                                        )
                                    }) :
                                    <Text style={{ color: "white" }}>Order has no suborders.</Text>
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.fullPriceText}>Total: {order.fullPrice!.toFixed(2)} $</Text>
                        <View style={styles.payButtonContainer}>
                            <Button title="Pay" onPress={() => { navigation.navigate("Payment", { orderId: orderId }) }} color={"green"} />
                        </View>
                    </View>
                </View>

            }
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        width: "100%"
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    topContainer:
    {
        flex: 1,
        width: "90%",
    },
    backButtonContainer: {
        marginTop: 20,
        marginLeft: 20,
        alignSelf: "flex-start",
    },
    title: {
        color: "white",
        marginBottom: 20,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    subOrdersContainer: {

    },
    bottomContainer: {
        width: "90%",
        marginVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fullPriceText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    payButtonContainer: {
        width: "40%",
    }
});