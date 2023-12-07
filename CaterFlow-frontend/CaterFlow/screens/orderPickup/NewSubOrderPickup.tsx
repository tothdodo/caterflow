import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Button, Text } from "react-native";
import { CreateSubOrder, CreateSubOrderItem, DiningOption, OrderApi, ProductApi, ProductsByCategory } from "../../generated";
import { OrderAddProducts } from "./OrderAddProducts";
import { LoadingModal } from "react-native-loading-modal";
import { BackButton } from "../../components/BackButton";
import { groupItemsByIngredients } from "../../services/ProductEqualService";
import { useUnitContext } from "../../contexts/UnitContext";
import { useTokenContext } from "../../contexts/TokenContext";
import * as jose from 'jose';

export function NewSubOrderPickup({ route, navigation }) {
    
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();
    const { orderId, tableNumber } = route.params;

    const [products, setProducts] = useState<ProductsByCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [subOrderItems, setSubOrderItems] = useState<CreateSubOrderItem[]>([]);

    const getProducts = async () => {
        const productService = new ProductApi();
        try {
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const products = await productService.apiProductCateringUnitIdGet(unitId, options);
            setProducts(products.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const addNewSubOrder = async (diningOption: DiningOption) => {
        const orderService = new OrderApi();
        try {
            setLoading(true);
            const createSubOrder: CreateSubOrder = {
                orderId: orderId,
                cateringUnitId: unitId,
                subOrderItems: groupItemsByIngredients(subOrderItems),
                diningOption: diningOption,
                userId: Number(jose.decodeJwt(token).UserId),
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            await orderService.apiOrderSubordersPost(createSubOrder, options);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            navigation.navigate("OrderOverview", { unitId: unitId, orderId: orderId });
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innerContainer}>
                {!loading &&
                    <View style={styles.unitOpererationsContainer}>
                        <BackButton navigation={navigation}/>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{"(Order ID: " + orderId + ")"}</Text>
                            <Text style={styles.titleText}>{tableNumber ? "Add a new suborder to the active order located at table " + tableNumber + "." : "No table for this order."}</Text>
                        </View>
                        <OrderAddProducts unitId={unitId} products={products} setSubOrderItems={setSubOrderItems} subOrderItems={subOrderItems}/>
                    </View>
                }
                <View style={styles.approveButtonsContainer}>
                    <View style={styles.approveOrderButton}>
                        <Button
                            onPress={() => addNewSubOrder(DiningOption.NUMBER_0)}
                            title="HERE"
                            color="green"
                            disabled={Object.values(subOrderItems).every((subOrderItem) => subOrderItem.amount === 0)}
                        />
                    </View>
                    <View style={styles.approveOrderButton}>
                        <Button
                            onPress={() => addNewSubOrder(DiningOption.NUMBER_1)}
                            title="TAKE AWAY"
                            color="green"
                            disabled={Object.values(subOrderItems).every((subOrderItem) => subOrderItem.amount === 0)}
                        />
                    </View>
                </View>
            </View>
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </ScrollView>
    );
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
    unitOpererationsContainer:
    {
        width: "80%",
    },
    titleContainer: {
        marginVertical: 20,
    },
    titleText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
    },
    welcomeText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
    },
    approveButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "70%",
    },
    approveOrderButton: {
        width: 120,
        marginVertical: 20,
        borderRadius: 10,
    },
});