import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GetProduct, ProductApi } from "../../generated";

interface ProductContainerProps {
    navigation: any,
    product: any,
    unitId: number,
    token: string,
    getProducts: () => void,
    setLoading: (loading: boolean) => void,
}

export const ProductContainer = (props: ProductContainerProps) => {

    async function deleteProduct(productId: number) {
        const productService = new ProductApi();
        try {
            props.setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            };
            const product: GetProduct = {
                productId: productId,
                cateringUnitId: props.unitId,
            }
            await productService.apiProductDelete(product, options);
            props.getProducts();
        } catch (error) {
            console.log(error);
        } finally {
            props.setLoading(false);
        }
    }
    return (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>
                {props.product.name}
            </Text>
            <View style={styles.productActionContainer}>
                <TouchableOpacity onPress={() => props.navigation.navigate("AddProduct", { productId: props.product.id })}>
                    <Icon
                        name={"pencil"} size={30}
                        color={"#920941"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(props.product.id!)}>
                    <Icon
                        name={"trash"} size={30}
                        color={"red"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
    productName: {
        color: "white",
        fontSize: 15,
    },
    productContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 30,
    },
    productActionContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 20,
        marginLeft: 20,
    },
});