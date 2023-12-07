import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContainType, CreateSubOrderItem, IngredientContain, ProductApi, ProductInOrder, ProductsByCategory } from "../../generated";
import ProductCustomizationModal from "./ProductCustomizationModal";
import { LoadingModal } from "react-native-loading-modal";
import { getContainTypeDisplayName } from "../../constants/ContainTypeDisplayNames";
import { useTokenContext } from "../../contexts/TokenContext";

export interface IOrderAddProductsProps {
    readonly subOrderItems: CreateSubOrderItem[];
    readonly setSubOrderItems: (subOrderItems: CreateSubOrderItem[]) => void;
    readonly products: ProductsByCategory[];
    readonly unitId: number;
}

export function OrderAddProducts(props: IOrderAddProductsProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [subOrderItem, setSubOrderItem] = useState<CreateSubOrderItem>();
    const { token } = useTokenContext();

    const addDefaultProduct = async (productId: number, productName: string) => {
        const ingredients = await getIngredientsData(productId);
        const product: ProductInOrder = {
            id: productId,
            name: productName,
            ingredients: ingredients,
        }
        const CreateSubOrderItem: CreateSubOrderItem = {
            id: getRandomInt(1, 10000000),
            product: product,
            amount: 1,
        };
        props.setSubOrderItems([...props.subOrderItems, CreateSubOrderItem]);
    };

    function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const updateProduct = (subOrderItemId: number, newSubOrderItem: CreateSubOrderItem) => {
        const subOrderItems = props.subOrderItems.map((subOrderItem) => {
            if (subOrderItem.id === subOrderItemId) {
                return newSubOrderItem;
            } else {
                return subOrderItem;
            }
        });
        props.setSubOrderItems(subOrderItems);
    }

    const removeProduct = (subOrderItemId: number) => {
        const subOrderItems = props.subOrderItems.filter((subOrderItem) => subOrderItem.id !== subOrderItemId);
        props.setSubOrderItems(subOrderItems);
    };

    const getProductCounter = (productId: number) => {
        return props.subOrderItems.filter((subOrderItem) => subOrderItem.product?.id === productId).length;
    }

    const toggleCategory = (categoryName: string) => {
        if (expandedCategories.includes(categoryName)) {
            setExpandedCategories(expandedCategories.filter((name) => name !== categoryName));
        } else {
            setExpandedCategories([...expandedCategories, categoryName]);
        }
    };

    const getIngredientsData = async (productId: number): Promise<IngredientContain[]> => {
        setLoading(true);
        const ingredientService = new ProductApi();

        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            };
            const result = await ingredientService.apiProductGet(productId, props.unitId, options);
            const ingredientContainArray = result.data.ingredients?.map((ingredient) => {
                const ingredientContain: IngredientContain = {
                    id: ingredient.id,
                    name: ingredient.name!,
                    plusPrice: ingredient.plusPrice ?? 0,
                    plusable: ingredient.plusable!,
                    containType: ContainType.NUMBER_0,
                };
                return ingredientContain;
            }) ?? [];

            setLoading(false);
            return ingredientContainArray;
        } catch (error) {
            console.error(error);
            setLoading(false);
            throw error;
        }
    };


    const setProductModalProps = (subOrderItem: CreateSubOrderItem) => {
        setSubOrderItem(subOrderItem);
        setModalVisible(true);
    }

    return (
        <View>
            {
                subOrderItem &&
                <ProductCustomizationModal
                    updateProduct={updateProduct}
                    subOrderItem={subOrderItem}
                    setSubOrderItem={setSubOrderItem}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible} />
            }
            {props.products.length > 0 ?
                props.products.map((category) => (
                    <View key={category.categoryName}>
                        <TouchableOpacity onPress={() => toggleCategory(category.categoryName!)}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.unitNameText}>{category.categoryName}</Text>
                                <Icon style={styles.categoryHeaderIcon}
                                    name={expandedCategories.includes(category.categoryName!) ? "caret-up" : "caret-down"} size={30}
                                    color="#900" />
                            </View>
                        </TouchableOpacity>
                        {category.products ? expandedCategories.includes(category.categoryName!) ?
                            category.products.map((product) => (
                                <View key={product.id} style={styles.productContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.productText}>
                                            {product.name}{getProductCounter(product.id!) != 0
                                                ? `\n(${getProductCounter(product.id!)})`
                                                : ""}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => addDefaultProduct(product.id!, product.name!)}>
                                        <Icon name="plus" size={30} color="green" />
                                    </TouchableOpacity>
                                </View>
                            )) : null :
                            <Text>No products in this category</Text>
                        }
                    </View>
                )) :
                <Text>No products in this unit</Text>
            }
            <View style={styles.orderItems}>
                {
                    props.subOrderItems.length > 0 &&
                    props.subOrderItems.map((subOrderItem) => (
                        <View key={subOrderItem.id} style={styles.subOrderItemContainer}>
                            <TouchableOpacity onPress={() => removeProduct(subOrderItem.id!)}>
                                <Icon name="trash" size={30} color="red" />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => setProductModalProps(subOrderItem)}>
                                    <Text style={styles.productText}>
                                        {subOrderItem.product?.name}
                                    </Text>
                                </TouchableOpacity>
                                {
                                    subOrderItem.product?.ingredients?.map((ingredient) => (
                                        <Text key={ingredient.id} style={styles.ingredientText}>
                                            {
                                                ingredient.containType !== ContainType.NUMBER_0 &&
                                                <View>
                                                    <Text>
                                                        {ingredient.name + " " + getContainTypeDisplayName(ingredient.containType!) + " "}
                                                        {ingredient.containType === ContainType.NUMBER_1 ? ingredient.plusPrice + " $" : ""}
                                                    </Text>
                                                </View>
                                            }
                                        </Text>
                                    ))
                                }
                            </View>
                        </View>
                    ))
                }
            </View>
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </View>
    );
}

const styles = StyleSheet.create({
    productText: {
        color: "white",
        fontSize: 20,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 25,
        textAlign: "center",
        borderRadius: 10,
        backgroundColor: "#920941",
    },
    productContainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    subOrderItemContainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 20,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryHeaderIcon: {
        marginLeft: 10,
    },
    unitNameText: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    orderItems: {
        marginTop: 20,
        paddingTop: 20,
        borderTopColor: "white",
        borderTopWidth: 1,
    },
    ingredientText: {
        textAlign: 'center',
        color: "white",
    },
});