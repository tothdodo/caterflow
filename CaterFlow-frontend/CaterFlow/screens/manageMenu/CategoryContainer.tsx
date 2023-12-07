import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProductsByCategory } from "../../generated";
import { ProductContainer } from "./ProductContainer";

interface CategoryContainerProps {
    category: ProductsByCategory,
    navigation: any,
    unitId: number,
    token: string,
    getProducts: () => void,
    setLoading: (loading: boolean) => void,
}

export const CategoryContainer = (props: CategoryContainerProps) => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (categoryName: string) => {
        if (expandedCategories.includes(categoryName)) {
            setExpandedCategories(expandedCategories.filter((name) => name !== categoryName));
        } else {
            setExpandedCategories([...expandedCategories, categoryName]);
        }
    };

    return (
        <View style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => toggleCategory(props.category.categoryName!)}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categryName}>{props.category.categoryName}</Text>
                    <Icon style={{}}
                        name={expandedCategories.includes(props.category.categoryName!) ? "caret-up" : "caret-down"} size={30}
                        color="#900" />
                </View>
            </TouchableOpacity>
            <View style={styles.productsContainer}>
                {props.category.products ? expandedCategories.includes(props.category.categoryName!) ?
                    props.category.products.map((product) => (
                        <ProductContainer 
                            key={product.id}
                            token={props.token}
                            unitId={props.unitId}
                            product={product}
                            navigation={props.navigation}
                            getProducts={props.getProducts}
                            setLoading={props.setLoading}/>
                    )) : null :
                    <Text>No products in this category</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    
    categoryContainer: {
        marginBottom: 10,
        marginHorizontal: 30,
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        border: "3px solid white",
        borderRadius: 10,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    categryName: {
        color: "white",
        fontSize: 20,
    },
    productsContainer: {
        rowGap: 20,
        marginBottom: 10,
    },
});