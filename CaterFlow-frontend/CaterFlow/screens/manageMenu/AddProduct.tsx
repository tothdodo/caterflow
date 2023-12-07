import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button } from "react-native";
import { BackButton } from "../../components/BackButton";
import React, { useEffect, useState } from "react";
import { CategoryApi, CategoryDTO, ContainType, CreateProduct, ProductApi, ProductCreationPlace } from "../../generated";
import { useTokenContext } from "../../contexts/TokenContext";
import { useUnitContext } from "../../contexts/UnitContext";
import { getContainTypeDisplayName } from "../../constants/ContainTypeDisplayNames";
import { LoadingModal } from "react-native-loading-modal";
import SelectDropdown from "react-native-select-dropdown";
import { Switch } from 'react-native-switch';
import { Separator } from "../../components/Separator";
import Icon from 'react-native-vector-icons/FontAwesome';
import { CreateIngredientPrice } from "../../models/CreateIngredientPrice";

export const AddProduct = ({ navigation, route }) => {
    const { productId } = route.params;
    const { unitId } = useUnitContext();
    const { token } = useTokenContext();


    const [existingProduct, setExistingProduct] = useState<CreateProduct>();

    const [name, setName] = useState<string>(existingProduct?.name ?? "");
    const [dollar, setDollar] = useState<number>(Number(existingProduct?.price?.toFixed(2).split(".")[0]));
    const [cent, setCent] = useState<number>(Number(existingProduct?.price?.toFixed(2).split(".")[1]));
    const [ingredients, setIngredients] = useState<CreateIngredientPrice[]>([]);
    const [creationPlace, setCreationPlace] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");

    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getCategories = async () => {
        const categoryService = new CategoryApi();
        try {
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const categories = await categoryService.apiCategoryCateringUnitIdGet(unitId, options);
            setCategories(categories.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getProduct = async () => {
        const productService = new ProductApi();
        try {
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const productDTO = await productService.apiProductGet(productId, unitId, options);
            const createIngredients: CreateIngredientPrice[] = productDTO.data.ingredients?.map((ingredient) => {
                return {
                    id: ingredient.id,
                    name: ingredient.name,
                    containType: getContainTypeDisplayName(ingredient.containType!),
                    plusable: ingredient.plusable,
                    plusPriceDollar: ingredient.plusPrice?.toFixed(2).split(".")[0] ?? "0",
                    plusPriceCent: ingredient.plusPrice?.toFixed(2).split(".")[1] ?? "00",
                }
            }) ?? [];
            setIngredients(createIngredients);
            const createProduct: CreateProduct = {
                name: productDTO.data.name,
                price: productDTO.data.price,
                ingredients: createIngredients,
                cateringUnitId: unitId,
                categoryId: productDTO.data.categoryId,
                creationPlace: productDTO.data.creationPlace,
            }
            setName(productDTO.data.name!);
            setDollar(Number(productDTO.data.price?.toFixed(2).split(".")[0] ?? "0"));
            setCent(Number(productDTO.data.price?.toFixed(2).split(".")[1] ?? "00"));
            setCreationPlace(productDTO.data.creationPlace === ProductCreationPlace.NUMBER_0 ? "Drink" : "Kitchen");
            setExistingProduct(createProduct);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const addNewProduct = async () => {
        if (!validateProduct()) {
            return;
        }
        try {
            const productService = new ProductApi();
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const updateProduct: CreateProduct = {
                name: name,
                price: dollar + cent / 100,
                ingredients: ingredients.map((ingredient) => {
                    return {
                        name: ingredient.name,
                        plusable: ingredient.plusable,
                        plusPrice: Number(ingredient.plusPriceDollar) + Number(ingredient.plusPriceCent) / 100,
                        containType: getContainTypeDisplayName(ContainType.NUMBER_0),
                    }
                }),
                cateringUnitId: unitId,
                categoryId: categories.find((category) => category.name === categoryName)?.id ?? existingProduct?.categoryId,
                creationPlace: creationPlace === "Drink" ? ProductCreationPlace.NUMBER_0 : ProductCreationPlace.NUMBER_1,
            }
            await productService.apiProductPost(updateProduct, options);
        } catch (error) {
            console.log(error);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            navigation.navigate("Products");
        }
    }

    const updateProduct = async () => {
        if (!validateProduct()) {
            return;
        }
        try {
            const productService = new ProductApi();
            setLoading(true);
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const updateProduct: CreateProduct = {
                name: name,
                price: dollar + cent / 100,
                ingredients: ingredients.map((ingredient) => {
                    return {
                        name: ingredient.name,
                        plusable: ingredient.plusable,
                        plusPrice: Number(ingredient.plusPriceDollar) + Number(ingredient.plusPriceCent) / 100,
                        containType: getContainTypeDisplayName(ContainType.NUMBER_0),
                    }
                }),
                cateringUnitId: unitId,
                categoryId: categories.find((category) => category.name === categoryName)?.id ?? existingProduct?.categoryId,
                creationPlace: creationPlace === "Drink" ? ProductCreationPlace.NUMBER_0 : ProductCreationPlace.NUMBER_1,
            }
            await productService.apiProductPut(productId, unitId, updateProduct, options);
        } catch (error) {
            console.log(error);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            navigation.navigate("Products");
        }
    }

    const validateProduct = () => {
        if (dollar === 0 && cent === 0) {
            alert("Price can't be 0!");
            return false;
        }
        if (name === "") {
            alert("Name can't be empty!");
            return false;
        }
        if (categoryName === "" && existingProduct?.categoryId === undefined) {
            alert("Category can't be empty!");
            return false;
        }
        if (ingredients.some((ingredient) => ingredient.name === "")) {
            alert("Ingredient name can't be empty!");
            return false;
        }
        if (ingredients.some((ingredient) => ingredient.plusable && ingredient.plusPriceDollar === "0" && ingredient.plusPriceCent === "00")) {
            alert("Plus price of plusable ingredient can't be 0!");
            return false;
        }
        return true;
    }

    const addNewIngredient = () => {
        const newIngredients = [...ingredients];
        const lastIngredient = newIngredients[newIngredients.length - 1]; // Access the last ingredient

        const newIngredient: CreateIngredientPrice = {
            id: lastIngredient ? lastIngredient.id! + 1 : 1, // Increment the ID if available, otherwise start from 1
            name: "",
            plusable: false,
            plusPriceDollar: "0",
            plusPriceCent: "00",
        };

        newIngredients.push(newIngredient);
        setIngredients(newIngredients);
    };

    const removeIngredient = (ingredientName: string) => {
        const newIngredients = [...ingredients];
        const updatedIngredients = newIngredients.filter((ingredient) => ingredient.name !== ingredientName);
        setIngredients(updatedIngredients);
    }

    useEffect(() => {
        getCategories();
        if (productId) {
            getProduct();
        }
    }, []);

    return (
        <ScrollView style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>
                {productId ? "Edit Product" : "Add Product"}
            </Text>
            <View style={styles.inputRow}>
                <Text style={styles.inputText}>
                    Name:
                </Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Enter Name"
                    onChangeText={(name) => setName(name)}
                    value={name}
                />
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputText}>
                    Price:
                </Text>
                <View style={styles.priceContainer}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Dollar"
                        onChangeText={(dollar) => setDollar(Number(dollar.replace(/[^0-9]/g, '').slice(0, 4)))}
                        value={Number.isNaN(dollar) ? "0" : dollar.toString()}
                        textAlign="right"
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputText}>
                        .
                    </Text>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Cent"
                        onChangeText={(cent) => setCent(Number(cent.replace(/[^0-9]/g, '').slice(0, 2)))}
                        value={Number.isNaN(cent) ? "00" : cent.toString()}
                        textAlign="right"
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputText}>
                        $
                    </Text>
                </View>
            </View>
            <View style={styles.inputRow}>
                <Text style={styles.inputText}>
                    Category:
                </Text>
                <SelectDropdown
                    data={categories.map((category) => category.name!)}
                    defaultValue={existingProduct?.categoryId ? categories.find(c => c.id === existingProduct?.categoryId)?.name : "Select Category"}
                    defaultButtonText={"Select Category"}
                    onSelect={(selectedItem) => setCategoryName(selectedItem)}
                />
            </View>
            <View style={[styles.inputRow, { marginRight: 30 }]}>
                <Text style={styles.inputText}>
                    Creation place:
                </Text>
                <Switch
                    activeText={'Drink'}
                    inActiveText={'Kitchen'}
                    backgroundActive={'blue'}
                    backgroundInactive={'coral'}
                    circleActiveColor={'darkblue'}
                    circleInActiveColor={'orangered'}
                    value={creationPlace === "" ? existingProduct?.creationPlace === ProductCreationPlace.NUMBER_0 : creationPlace === "Drink"}
                    onValueChange={(val) => setCreationPlace(val ? "Drink" : "Kitchen")}
                />
            </View>
            <View style={styles.ingredientsContainer}>
                <Text style={styles.inputText}>
                    Ingredients:
                </Text>
                <View>
                    {ingredients.map((ingredient, index) => (
                        <View key={ingredient.id}>
                            <View style={styles.inputRow}>
                                <View style={styles.ingredientNameRow}>
                                    <Text style={[styles.inputText, { marginRight: 10 }]}>
                                        Name:
                                    </Text>
                                    <TextInput
                                        style={styles.nameInput}
                                        placeholder="Ingredient Name"
                                        onChangeText={(name) => {
                                            const newIngredients = [...ingredients];
                                            const updatedIngredient = { ...newIngredients[index], name: name };
                                            newIngredients[index] = updatedIngredient;
                                            setIngredients(newIngredients);
                                        }}
                                        value={ingredient.name!}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => removeIngredient(ingredient.name!)}>
                                    <Icon
                                        name={"trash"} size={30}
                                        color={"red"} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputRow, { justifyContent: "flex-start" }]}>
                                <Text style={styles.inputText}>
                                    Plusable:
                                </Text>
                                <View style={{ marginLeft: 30 }}>
                                    <Switch
                                        activeText={'Yes'}
                                        inActiveText={'No'}
                                        backgroundActive={'green'}
                                        backgroundInactive={'red'}
                                        circleActiveColor={'darkgreen'}
                                        circleInActiveColor={'darkred'}
                                        value={ingredient.plusable}
                                        onValueChange={(val) => {
                                            const newIngredients = [...ingredients];
                                            const updatedIngredient = { ...newIngredients[index], plusable: val };
                                            newIngredients[index] = updatedIngredient;
                                            setIngredients(newIngredients);
                                        }} />
                                </View>

                            </View>
                            <View style={[styles.inputRow, { justifyContent: "flex-start" }]}>
                                <Text style={styles.inputText}>
                                    Plus price:
                                </Text>
                                <View style={styles.priceContainer}>
                                    <TextInput
                                        style={styles.nameInput}
                                        placeholder="Dollar"
                                        onChangeText={(dollar) => {
                                            const newIngredients = [...ingredients];
                                            const updatedIngredient = { ...newIngredients[index], plusPriceDollar: dollar.replace(/[^0-9]/g, '').slice(0, 4) };
                                            newIngredients[index] = updatedIngredient;
                                            setIngredients(newIngredients);
                                        }}
                                        value={ingredient.plusPriceDollar?.toString()}
                                        textAlign="right"
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.inputText}>
                                        .
                                    </Text>
                                    <TextInput
                                        style={styles.nameInput}
                                        placeholder="Cent"
                                        onChangeText={(cent) => {
                                            const newIngredients = [...ingredients];
                                            const updatedIngredient = { ...newIngredients[index], plusPriceCent: cent.replace(/[^0-9]/g, '').slice(0, 2) };
                                            newIngredients[index] = updatedIngredient;
                                            setIngredients(newIngredients);
                                        }}
                                        value={ingredient.plusPriceCent?.toString()}
                                        textAlign="right"
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.inputText}>
                                        $
                                    </Text>
                                </View>
                            </View>
                            <Separator />
                        </View>
                    ))}
                </View>
                <View style={styles.inputRow}>
                    <TouchableOpacity onPress={() => addNewIngredient()}>
                        <Icon
                            name={"plus"} size={30}
                            color={"green"} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Button title={productId ? "Update Product" : "Add Product"} color={"#920941"} onPress={() => productId ? updateProduct() : addNewProduct()} />
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
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    title: {
        color: "white",
        fontSize: 30,
        textAlign: "center",
        marginBottom: 30,
    },
    nameInput: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        width: "100%",
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        columnGap: 30,
    },
    inputText: {
        color: "white",
        fontSize: 20,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: 200,
    },
    ingredientsContainer: {
        rowGap: 20,
    },
    ingredientNameRow: {
        flexDirection: "row",
        width: "80%",
        alignItems: "center",
    }
});