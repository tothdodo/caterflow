import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Button } from "react-native";
import { OrderApi, OrderHeader } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import { BackButton } from "../../components/BackButton";
import { useUnitContext } from "../../contexts/UnitContext";
import { useTokenContext } from "../../contexts/TokenContext";
import { Orders } from "./Orders";
import { Separator } from "../../components/Separator";
import { useFocusEffect } from "@react-navigation/native";

export function ActiveOrders({ navigation, route }) {
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();
    const { waiterName } = route.params; 
    
    const [waiterOrders, setWaiterOrders] = useState<OrderHeader[]>([]);
    const [otherOrders, setOtherOrders] = useState<OrderHeader[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    async function getActiveOrders() {
        setLoading(true);
        try {
            const orderService = new OrderApi();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const orders = await orderService.apiOrderActiveGet(unitId, waiterName, options);
            setWaiterOrders(orders.data.waiterOrders ?? []);
            setOtherOrders(orders.data.otherOrders ?? []);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getActiveOrders();
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            {
                !loading &&
                <View style={styles.innerContainer}>
                    <View style={styles.backButtonContainer}>
                        <BackButton navigation={navigation} />
                    </View>
                    <View style={styles.newOrderButton}>
                        <Button
                            onPress={() => navigation.navigate("NewOrderPickup")}
                            title="Create new order"
                            color="#920941"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <Text style={styles.activeOrdersText}>Active Orders</Text>
                    {waiterOrders.length > 0 || otherOrders.length > 0 ?
                        <View style={styles.activeOrdersContainer}>
                            <Orders navigation={navigation} orders={waiterOrders} color="#CC7000"/>
                            {
                                waiterOrders.length > 0 && otherOrders.length > 0 &&
                                <Separator/>
                            }
                            <Orders navigation={navigation} orders={otherOrders} color="#920941"/>
                        </View>
                        :
                        <View>
                            <Text style={{ color: "white" }}>There is no active order.</Text>
                        </View>
                    }
                </View>
            }
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </ScrollView>
    )
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
        marginLeft: 20,
        alignSelf: "flex-start",
    },
    activeOrdersText:
    {
        color: "white",
        fontSize: 20,
        textAlign: "left",
        marginLeft: 40,
        marginBottom: 10,
        width: "90%",
    },
    activeOrdersContainer:
    {
        width: "80%",
    },
    newOrderButton: {
        width: 200,
        marginBottom: 20,
        borderRadius: 10,
        padding: 20,
    }
});