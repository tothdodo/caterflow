import { ProductCreationPlace } from "../generated";

type CreationPlaceDisplayNames = {
    [key in keyof typeof ProductCreationPlace]: string;
};

const CreationPlaceDisplayNamesMap: CreationPlaceDisplayNames = {
    NUMBER_0: "Drink",
    NUMBER_1: "Kitchen",
};

// Helper function to get display names
export function getCreationPlaceDisplayName(value: number): string | undefined {
    const key = Object.keys(ProductCreationPlace).find(
        (k) => ProductCreationPlace[k as keyof typeof ProductCreationPlace] === value
    ) as keyof typeof ProductCreationPlace;

    return CreationPlaceDisplayNamesMap[key];
}