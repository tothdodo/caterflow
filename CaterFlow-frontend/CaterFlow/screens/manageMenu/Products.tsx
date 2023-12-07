import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { BackButton } from "../../components/BackButton";
import { LoadingModal } from "react-native-loading-modal";
import { ProductApi, ProductsByCategory } from "../../generated";
import { useTokenContext } from "../../contexts/TokenContext";
import { useUnitContext } from "../../contexts/UnitContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import { CategoryContainer } from "./CategoryContainer";
import { useFocusEffect } from "@react-navigation/native";

export const Products = ({ navigation }) => {
    const { token } = useTokenContext();
    const { unitId } = useUnitContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductsByCategory[]>([]);

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

    useFocusEffect(
        React.useCallback(() => {
            getProducts();
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Products</Text>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("AddProduct", { productId: null })}>
                    <Icon
                        name={"plus"} size={40}
                        color={"green"} />
                </TouchableOpacity>
            </View>
            {products.length > 0 ?
                products.map((category) => (
                    <CategoryContainer
                        key={category.categoryName}
                        category={category}
                        setLoading={setLoading}
                        getProducts={getProducts}
                        navigation={navigation}
                        token={token}
                        unitId={unitId} />
                )) :
                <Text>No products in this unit</Text>
            }
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        color: "white",
        fontSize: 30,
        textAlign: "center",
        marginBottom: 10,
    },
    text: {
        color: "white",
        fontSize: 20,
    },
    addButtonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 10,
    },
});