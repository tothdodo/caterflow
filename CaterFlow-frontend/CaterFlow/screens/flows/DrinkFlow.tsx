import { useUnitContext } from "../../contexts/UnitContext";
import { ProductCreationPlace } from "../../generated"
import { Flow } from "./Flow"

export const DrinkFlow = ({ navigation }) => {
    
    const { unitId } = useUnitContext();

    return (
        <Flow 
            unitId={unitId}
            navigation={navigation}
            place={ProductCreationPlace.NUMBER_0} />
    )
}