import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { ContainType, SubOrderDTO } from '../../generated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getContainTypeDisplayName } from '../../constants/ContainTypeDisplayNames';
import { LoadingModal } from "react-native-loading-modal";

interface IProductCustomizationModal {
    subOrder: SubOrderDTO;
    modalVisible: boolean;
    getOrder: () => Promise<void>;
    updateSubOrder: () => Promise<void>;
    setModalVisible: (modalVisible: boolean) => void;
}

const SubOrderModifyModal = (props: IProductCustomizationModal) => {
    const [subOrder, setSubOrder] = useState<SubOrderDTO>(props.subOrder);
    const [loading, setLoading] = useState<boolean>(false);

    function decreaseAmountOfProduct(subOrdetItemId: number): void {
        const subOrderItem = subOrder.subOrderItems?.find((subOrderItem) => subOrderItem.id === subOrdetItemId);
        if (subOrderItem?.amount !== 0) {
            subOrderItem!.amount = subOrderItem!.amount! - 1;
            setSubOrder({ ...subOrder });
        }
    }

    function increaseAmountOfProduct(subOrdetItemId: number): void {
        const subOrderItem = subOrder.subOrderItems?.find((subOrderItem) => subOrderItem.id === subOrdetItemId);
        subOrderItem!.amount = subOrderItem!.amount! + 1;
        setSubOrder({ ...subOrder });
    }



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.setModalVisible(!props.modalVisible);
            }}>
            <ScrollView contentContainerStyle={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.productText}>Suborder</Text>
                    {props.subOrder.subOrderItems?.length !== 0 ?
                        props.subOrder.subOrderItems?.map((subOrderItem) => (
                            <View key={subOrderItem.id}>
                                <View key={subOrderItem.id} style={styles.ingredientContainer}>
                                    <TouchableOpacity disabled={subOrderItem.amount === 0} onPress={() => decreaseAmountOfProduct(subOrderItem.id!)}>
                                        <Icon name="minus" size={30} color={subOrderItem.amount === 0 ? "grey" : "red"} />
                                    </TouchableOpacity>
                                    <Text style={styles.ingredientText}>
                                        {subOrderItem.product!.name} x {subOrderItem.amount}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => increaseAmountOfProduct(subOrderItem.id!)}>
                                        <Icon
                                            name="plus"
                                            size={30}
                                            color={"green"} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    subOrderItem.product?.ingredients
                                        ?.filter((ingredient) => ingredient.containType !== ContainType.NUMBER_0)
                                        .map((ingredient) => (
                                            <View key={ingredient.id} style={{ flexDirection: "row" }}>
                                                <Text
                                                    style={{ marginStart: 20, fontWeight: "bold", color: ingredient.containType === ContainType.NUMBER_1 ? "green" : "red" }}>
                                                    {getContainTypeDisplayName(ingredient.containType!)}
                                                </Text>
                                                <Text style={{ fontWeight: "bold" }}>
                                                    {" " + ingredient.name}
                                                </Text>
                                            </View>
                                        ))
                                }
                            </View>
                        ))
                        : <Text>No ingredients for this product.</Text>
                    }
                    <Pressable
                        style={[styles.button, styles.buttonDone]}
                        onPress={async () => {
                            setLoading(true);
                            await props.updateSubOrder();
                            await props.getOrder();
                            setLoading(false);
                            props.setModalVisible(!props.modalVisible);
                        }}>
                        <Text style={styles.textStyle}>Done</Text>
                    </Pressable>
                </View>
            </ScrollView>
            <LoadingModal modalVisible={loading} color={"#920941"} />
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
        marginBottom: 20,
        fontWeight: 'bold',
    },
    ingredientText: {
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default SubOrderModifyModal;
