import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { CategoryDTO, CategoryApi, CreateCategory, GetCategory } from "../../generated";
import { useTokenContext } from "../../contexts/TokenContext";
import { useUnitContext } from "../../contexts/UnitContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BackButton } from "../../components/BackButton";
import { LoadingModal } from "react-native-loading-modal";
import { Separator } from "../../components/Separator";

export const Categories = ({ navigation }) => {
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [actualChangingCategory, setActualChangingCategory] = useState<CategoryDTO>();

    async function loadCategories(): Promise<void> {
        setLoading(true);
        const categoriesApi = new CategoryApi();
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        await categoriesApi.apiCategoryCateringUnitIdGet(unitId, options).then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.log(error);
        });
        setLoading(false);
    }

    async function addNewCategory(): Promise<void> {
        setLoading(true);
        const categoriesApi = new CategoryApi();
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const newCategory: CreateCategory = {
            name: categoryName,
            cateringUnitId: unitId,
        }
        await categoriesApi.apiCategoryPost(newCategory, options).then(() => {
            loadCategories();
            setCategoryName("");
        }).catch((error) => {
            if (error.response.status === 409) {
                alert("Category name already exists!");
            };
            console.log(error);
        });
        setLoading(false);
    }

    async function updateCategory(categoryId: number): Promise<void> {
        if (actualChangingCategory === null || actualChangingCategory === undefined) {
            return;
        }
        setLoading(true);
        const categoriesApi = new CategoryApi();
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const newCategory: CategoryDTO = {
            id: categoryId,
            name: actualChangingCategory.name
        }
        await categoriesApi.apiCategoryCateringUnitIdPut(unitId, newCategory, options).then(() => {
            loadCategories();
            setCategoryName("");
        }).catch((error) => {
            if (error.response.status === 409) {
                setActualChangingCategory(undefined);
                alert("Category name already exists!");
            };
            console.log(error);
        });
        setLoading(false);
    }

    async function deleteCategory(categoryId: number): Promise<void> {
        setLoading(true);
        const categoriesApi = new CategoryApi();
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const category: GetCategory = {
            categoryId: categoryId,
            cateringUnitId: unitId,
        }
        await categoriesApi.apiCategoryDelete(category, options).then(() => {
            loadCategories();
        }).catch((error) => {
            if(error.response.status === 400) {
                alert(error.response.data);
            }
            console.log(error);
        });
        setLoading(false);
    }

    useEffect(() => {
        setCategoryName("");
        loadCategories();
    }, [])

    return (
        <ScrollView style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Categories</Text>
            <View style={styles.addCategoryContainer}>
                <TextInput
                    style={styles.categoryInput}
                    value={categoryName}
                    placeholder="Enter new category name"
                    placeholderTextColor="white"
                    onChangeText={(name) => setCategoryName(name)}
                />
                <TouchableOpacity disabled={categoryName === ""} onPress={() => addNewCategory()}>
                    <Icon
                        name={"plus"} size={40}
                        color={categoryName === "" ? "grey" : "green"} />
                </TouchableOpacity>
            </View>
            <Separator/>
            {categories.map((category) => {
                return (
                    <View key={category.id} style={styles.categories}>
                        <TextInput
                            style={styles.categoryInput}
                            value={actualChangingCategory?.id === category.id ? actualChangingCategory?.name! : category.name!}
                            placeholder={category.name!}
                            placeholderTextColor="white"
                            onBlur={() => updateCategory(category.id!)}
                            onChangeText={(name) => setActualChangingCategory(
                                {
                                    id: category.id,
                                    name: name,
                                }
                            )} />
                        <TouchableOpacity onPress={() => deleteCategory(category.id!)}>
                            <Icon
                                name={"trash"} size={40}
                                color={"red"} />
                        </TouchableOpacity>
                    </View>
                );
            })}
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
        marginBottom: 30,
    },
    text: {
        color: "white",
        fontSize: 20,
    },
    categoryInput: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 3,
        color: "white",
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    addCategoryContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    categories: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
});