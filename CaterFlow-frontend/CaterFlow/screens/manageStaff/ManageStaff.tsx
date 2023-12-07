import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { CateringUnitApi, CateringUnitUserDTO, ChangeRole, Role, TableApi, TableCateringUnitDTO } from "../../generated";
import { LoadingModal } from "react-native-loading-modal";
import { BackButton } from "../../components/BackButton";
import { useUnitContext } from "../../contexts/UnitContext";
import { getRoleDisplayName } from "../../constants/RoleDisplayNames";
import SelectDropdown from "react-native-select-dropdown";
import { useTokenContext } from "../../contexts/TokenContext";

export const ManageStaff = ({ navigation }) => {

    const { unitId } = useUnitContext();
    const { token } = useTokenContext();

    const [entryCode, setEntryCode] = useState<string>('');
    const [tableCounter, setTableCounter] = useState<number>(0);
    const [originalTableCounter, setOriginalTableCounter] = useState<number>(0);

    const [staff, setStaff] = useState<CateringUnitUserDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const roles = [
        getRoleDisplayName(Role.NUMBER_1),
        getRoleDisplayName(Role.NUMBER_2),
        getRoleDisplayName(Role.NUMBER_3),
        getRoleDisplayName(Role.NUMBER_4),
    ]

    async function getEntryCode() {
        setLoading(true);
        const cateringUnitService = new CateringUnitApi();
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const entryCode = await cateringUnitService.apiCateringUnitUnitDetailsUnitIdGet(unitId, options);
            setEntryCode(entryCode.data.entryCode!.toString());
            setTableCounter(entryCode.data.tableCounter!);
            setOriginalTableCounter(entryCode.data.tableCounter!);
        } catch (error) {
            console.log(error);
        }
    }

    async function getStaff() {
        const cateringUnitService = new CateringUnitApi();
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const staff = await cateringUnitService.apiCateringUnitUsersUnitIdGet(unitId, options);
            setStaff(staff.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    async function changeRole(userId: number, role: string) {
        setLoading(true);
        const cateringUnitService = new CateringUnitApi();
        try {
            let roleEnum: Role;
            switch (role) {
                case getRoleDisplayName(Role.NUMBER_1):
                    roleEnum = Role.NUMBER_1;
                    break;
                case getRoleDisplayName(Role.NUMBER_2):
                    roleEnum = Role.NUMBER_2;
                    break;
                case getRoleDisplayName(Role.NUMBER_3):
                    roleEnum = Role.NUMBER_3;
                    break;
                case getRoleDisplayName(Role.NUMBER_4):
                    roleEnum = Role.NUMBER_4;
                    break;
                default:
                    roleEnum = Role.NUMBER_0;
            }
            const changeRole: ChangeRole = {
                userId: userId,
                cateringUnitId: unitId,
                role: roleEnum,
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await cateringUnitService.apiCateringUnitChangeRolePut(changeRole, options);
            await getStaff();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    async function saveTables() {
        if( originalTableCounter === tableCounter) {
            return;
        }
        if (originalTableCounter > tableCounter) {
            alert("You can't decrease the number of tables.");
            setTableCounter(originalTableCounter);
        }

        setLoading(true);
        const tableService = new TableApi();
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const tableDTO: TableCateringUnitDTO = {
                cateringUnitId: unitId,
                tableCounter: tableCounter,
            }
            await tableService.apiTablePut(tableDTO, options);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);

    }

    useEffect(() => {
        getEntryCode();
        getStaff();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {
                !loading &&
                <View>
                    <View style={styles.backButtonContainer}>
                        <BackButton navigation={navigation} />
                    </View>
                    <Text style={styles.title}>Manage Staff</Text>
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>Unit entry code:</Text>
                        <Text style={styles.text}>{entryCode}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>Number of tables:</Text>
                        <TextInput
                            style={[styles.text, { width: 50 }]}
                            onChangeText={(text) => setTableCounter(Number(text.replace(/[^0-9]/g, '')))}
                            value={tableCounter.toString()}
                            keyboardType="numeric"
                            onBlur={saveTables}
                            textAlign={'right'}
                        />
                    </View>
                    <View>
                        {
                            staff
                                .toSorted((a, b) => {
                                    const roleA = a.role?.toString() || '';
                                    const roleB = b.role?.toString() || '';
                                    return roleA.localeCompare(roleB);
                                })
                                .map((staffMember) => {
                                    return (
                                        <View style={styles.userContainer} key={staffMember.userId}>
                                            <Text style={styles.text}>{staffMember.nickName}</Text>
                                            {
                                                staffMember.role === Role.NUMBER_0 ?
                                                    <Text style={styles.text}>{getRoleDisplayName(staffMember.role)}</Text> :
                                                    <SelectDropdown
                                                        data={roles}
                                                        defaultValue={getRoleDisplayName(staffMember.role!)}
                                                        onSelect={async (selectedItem) => {
                                                            await changeRole(staffMember.userId!, selectedItem.toString());
                                                        }}
                                                        buttonTextAfterSelection={(selectedItem) => {
                                                            return selectedItem
                                                        }}
                                                        rowTextForSelection={(item) => {
                                                            return item
                                                        }}
                                                    />
                                            }
                                        </View>
                                    );
                                })
                        }
                    </View>
                </View>
            }
            <LoadingModal modalVisible={loading} color={"#920941"} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
    },
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 20,
    },
    userContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 20,
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
    text: {
        color: "white",
        fontSize: 20,
    },
    backButtonContainer: {
        marginLeft: 20,
    }
});