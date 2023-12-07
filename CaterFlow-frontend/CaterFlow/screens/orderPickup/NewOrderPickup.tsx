import { View, StyleSheet, ScrollView, Button, Text } from "react-native";
import { useEffect, useState } from "react";
import { CreateOrder, CreateSubOrder, CreateSubOrderItem, DiningOption, OrderApi, ProductApi, ProductsByCategory, TableApi } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import { Picker } from "@react-native-picker/picker";
import { OrderAddProducts } from "./OrderAddProducts";
import { BackButton } from "../../components/BackButton";
import { groupItemsByIngredients } from "../../services/ProductEqualService";
import { useUnitContext } from "../../contexts/UnitContext";
import * as jose from 'jose';
import { useTokenContext } from "../../contexts/TokenContext";

export function NewOrderPickup({ navigation }) {
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();

    const [products, setProducts] = useState<ProductsByCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [selectedTable, setSelectedTable] = useState<number>(0);

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

    const getTables = async () => {
        const tableService = new TableApi();
        try {
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const tableNumber = await tableService.apiTableCateringUnitIdGet(unitId, options);
            setTableNumber(tableNumber.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const pushNewOrder = async (diningOption: DiningOption) => {
        const orderService = new OrderApi();
        try {
            setLoading(true);
            const createOrder: CreateOrder = {
                cateringUnitId: unitId,
                tableNumber: selectedTable === 0 ? null : selectedTable,
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const createdOrder = await orderService.apiOrderPost(createOrder, options);
            const orderId = createdOrder.data.id!;
            const createSubOrder: CreateSubOrder = {
                orderId: orderId,
                cateringUnitId: unitId,
                userId: Number(jose.decodeJwt(token).UserId),
                subOrderItems: groupItemsByIngredients(subOrderItems),
                diningOption: diningOption,
            }
            await orderService.apiOrderSubordersPost(createSubOrder, options);
            setLoading(false);
            navigation.navigate("OrderOverview", { unitId: unitId, orderId: orderId });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTables();
        getProducts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innerContainer}>
                {!loading &&
                    <View style={styles.widthContainer}>
                        <BackButton navigation={navigation} />
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerText}>Choose a table: </Text>
                            <Picker

                                selectedValue={selectedTable}
                                onValueChange={(value) => setSelectedTable(value)}
                                style={{ height: 30, width: 150 }}>
                                <Picker.Item label="None" value="None" />
                                {Array.from({ length: tableNumber }, (_, index) => index + 1).map((number) => (
                                    <Picker.Item key={number} label={number.toString()} value={number} />
                                ))}
                            </Picker>
                        </View>
                        <OrderAddProducts unitId={unitId} products={products} subOrderItems={subOrderItems} setSubOrderItems={setSubOrderItems} />
                    </View>
                }
                <View style={styles.approveButtonsContainer}>
                    <View style={styles.approveOrderButton}>
                        <Button
                            onPress={() => pushNewOrder(DiningOption.NUMBER_0)}
                            title="HERE"
                            color="green"
                            disabled={Object.values(subOrderItems).every((subOrderItem) => subOrderItem.amount === 0)}
                        />
                    </View>
                    <View style={styles.approveOrderButton}>
                        <Button
                            onPress={() => pushNewOrder(DiningOption.NUMBER_1)}
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
    widthContainer:
    {
        width: "80%",
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    pickerText: {
        color: "white",
        fontSize: 16,
        marginHorizontal: 20,
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