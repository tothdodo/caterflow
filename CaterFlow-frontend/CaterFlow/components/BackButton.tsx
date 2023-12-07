import { TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


export const BackButton = ({ navigation }) => {
    return (
        <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                    name={"arrow-left"} size={30}
                    color="#920941" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    backButtonContainer: {
        alignSelf: 'flex-start',
        marginTop: 20,
        zIndex: 1,
    },
});