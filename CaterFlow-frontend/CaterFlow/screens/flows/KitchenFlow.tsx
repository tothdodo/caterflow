import { Flow } from "./Flow"
import { ProductCreationPlace } from "../../generated"
import { useUnitContext } from "../../contexts/UnitContext";

export const KitchenFlow = ({ navigation }) => {
    
    const { unitId } = useUnitContext();
    
    return (
        <Flow 
            unitId={unitId}
            navigation={navigation}
            place={ProductCreationPlace.NUMBER_1} />
    )
}