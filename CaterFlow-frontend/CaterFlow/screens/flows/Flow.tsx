import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native"
import { OrderApi, ProductCreationPlace, SubOrderDTO, SubOrderStatus, UpdateSubOrderState } from "../../generated"
import { getCreationPlaceDisplayName } from "../../constants/CreationPlaceDisplayNames";
import { useEffect, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { FlowSubOrder } from "./FlowSubOrder";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Audio } from 'expo-av';
import { LoadingModal } from "react-native-loading-modal";
import { useTokenContext } from "../../contexts/TokenContext";

interface IFlowProps {
    unitId: number;
    place: ProductCreationPlace;
    navigation: any;
}

export const Flow = (props: IFlowProps) => {
    const [elapsedTimes, setElapsedTimes] = useState<{ [key: number]: number }>({});
    const [subOrders, setSubOrders] = useState<SubOrderDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState<HubConnection>();

    const { token } = useTokenContext();

    const colPerRow = calculateColsPerRow();

    const startConnection = async () => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl('http://localhost:7251/suborder', {
                    accessTokenFactory: () => token,
                })
                .configureLogging(LogLevel.Information)
                .build();
            setConnection(connection);
            connection.on(`Receive${getCreationPlaceDisplayName(props.place)}SubOrder`, async (subOrder) => {
                const { sound } = await Audio.Sound.createAsync(require('../../assets/new-suborder-sound.mp3'));
                await sound.playAsync();
                setSubOrders(prevSubOrders => [
                    ...prevSubOrders,
                    subOrder
                ]);
            });

            await connection.start();
            await connection.invoke("EnterPlace", props.unitId, props.place);
        } catch (error) {
            console.log(error);
        }
    }

    const closeConnection = async () => {
        try {
            if (connection) {
                await connection.stop();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getSubOrders = async () => {
        try {
            setLoading(true);
            const orderService = new OrderApi();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const subOrders = await orderService.apiOrderSubordersGet(props.unitId, props.place, options);
            setSubOrders(subOrders.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const setSubOrderReady = async (subOrderId: number) => {
        try {
            const orderService = new OrderApi();
            const updateState: UpdateSubOrderState = {
                cateringUnitId: props.unitId,
                subOrderId: subOrderId,
                newStatus: SubOrderStatus.NUMBER_1,
                creationPlace: props.place,
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await orderService.apiOrderSubordersStatePut(updateState, options);
            await getSubOrders();
        } catch (error) {
            console.log(error);
        }
    }

    function calculateColsPerRow() {
        const windowWidth = Dimensions.get('window').width;
        if (windowWidth < 700) {
            return 1;
        } else if (windowWidth < 1100) {
            return 2;
        } else if (windowWidth < 1500) {
            return 3;
        } else {
            return 4;
        }
    }

    const updateElapsedTimes = () => {
        const updatedElapsedTimes = { ...elapsedTimes };
        subOrders.forEach((subOrder) => {
            if (subOrder.id && subOrder.date) {
                const currentTime = new Date().getTime();
                const orderTime = new Date(subOrder.date).getTime();
                const elapsedTime = Math.floor((currentTime - orderTime) / 1000);
                updatedElapsedTimes[subOrder.id] = elapsedTime;
            }
        });
        setElapsedTimes(updatedElapsedTimes);
    };


    useEffect(() => {
        const interval = setInterval(updateElapsedTimes, 1000);
        return () => clearInterval(interval);
    }, [subOrders]);

    useEffect(() => {
        startConnection();
        getSubOrders();
        return () => {
            closeConnection();
        }
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.upperContainer}>
                <BackButton navigation={props.navigation} />
                <Text style={[styles.text, styles.title]} >{getCreationPlaceDisplayName(props.place)} Flow</Text>
            </View>
            <View style={styles.subOrdersContainer}>
                {
                    subOrders && colPerRow ?
                        <FlatList
                            style={{ columnGap: 20 }}
                            data={subOrders}
                            numColumns={colPerRow}
                            renderItem={({ item }) => <FlowSubOrder
                                subOrder={item}
                                elapsedTime={elapsedTimes[item.id ?? -1] || 0}
                                setSubOrderReady={setSubOrderReady} />}
                            keyExtractor={item => item.id!.toString()}
                        />
                        : <Text style={styles.text} >No active suborder for {getCreationPlaceDisplayName(props.place)} station.</Text>
                }
            </View>
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black',
        width: '100%',
    },
    upperContainer: {
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    subOrdersContainer: {
        flex: 4,
        marginHorizontal: "auto",
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 15,
        marginLeft: 30,
    },
    text: {
        color: 'white',
    },
});