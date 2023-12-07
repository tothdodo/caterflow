import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { ContainType, CreateSubOrderItem, IngredientContain } from '../../generated';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IProductCustomizationModal {
    subOrderItem: CreateSubOrderItem;
    setSubOrderItem: (subOrderItem: CreateSubOrderItem) => void;
    updateProduct: (subOrderItemId: number, newSubOrderItem: CreateSubOrderItem) => void;
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
}

const ProductCustomizationModal = (props: IProductCustomizationModal) => {
    const decreaseIngredientCounterInProduct = (ingredientId: number) => {
        props.setSubOrderItem({
            ...props.subOrderItem,
            product: {
                ...props.subOrderItem.product!,
                ingredients: props.subOrderItem.product?.ingredients?.map((ingredient: IngredientContain) => {
                    if (ingredient.id === ingredientId) {
                        if (ingredient.containType === ContainType.NUMBER_0) {
                            ingredient.containType = ContainType.NUMBER_2;
                        } else if (ingredient.containType === ContainType.NUMBER_1) {
                            ingredient.containType = ContainType.NUMBER_0;
                        }
                    }
                    return ingredient;
                }) ?? [],
            },
        });
    };

    const increaseIngredientCounterInProduct = (ingredientId: number) => {
        props.setSubOrderItem({
            ...props.subOrderItem,
            product: {
                ...props.subOrderItem.product!,
                ingredients: props.subOrderItem.product?.ingredients?.map((ingredient: IngredientContain) => {
                    if (ingredient.id === ingredientId) {
                        if (ingredient.containType === ContainType.NUMBER_0) {
                            ingredient.containType = ContainType.NUMBER_1;
                        } else if (ingredient.containType === ContainType.NUMBER_2) {
                            ingredient.containType = ContainType.NUMBER_0;
                        }
                    }
                    return ingredient;
                }) ?? [],
            },
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.updateProduct(props.subOrderItem.id!, props.subOrderItem);
                props.setModalVisible(!props.modalVisible);
            }}>
            <ScrollView contentContainerStyle={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.productText}>{props.subOrderItem.product?.name}</Text>
                    {props.subOrderItem.product?.ingredients?.length !== 0 ?
                        props.subOrderItem.product?.ingredients?.map((ingredient) => (
                            <View key={ingredient.id} style={styles.ingredientContainer}>
                                <TouchableOpacity disabled={ingredient.containType === ContainType.NUMBER_2} onPress={() => decreaseIngredientCounterInProduct(ingredient.id!)}>
                                    <Icon name="minus" size={30} color={ingredient.containType === ContainType.NUMBER_2 ? "grey" : "red"} />
                                </TouchableOpacity>
                                <Text style={styles.ingredientText}>
                                    {ingredient.name}
                                </Text>
                                {
                                    <TouchableOpacity
                                        disabled={ingredient.containType === ContainType.NUMBER_1 || !ingredient.plusable && ingredient.containType === ContainType.NUMBER_0}
                                        onPress={() => increaseIngredientCounterInProduct(ingredient.id!)}>
                                        <Icon
                                            name="plus"
                                            size={30}
                                            color={ingredient.containType === ContainType.NUMBER_1 || !ingredient.plusable && ingredient.containType === ContainType.NUMBER_0 ? "grey" : "green"} />
                                    </TouchableOpacity>
                                }
                            </View>
                        ))
                        : <Text>No ingredients for this product.</Text>
                    }
                    <Pressable
                        style={[styles.button, styles.buttonDone]}
                        onPress={() => props.setModalVisible(!props.modalVisible)}>
                        <Text style={styles.textStyle}>Done</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Modal >
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    ingredientContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonDone: {
        marginTop: 20,
        backgroundColor: '#920941',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    productText: {
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    ingredientText: {
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default ProductCustomizationModal;
