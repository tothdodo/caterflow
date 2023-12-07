import { ContainType } from "../generated";

type ContainTypeDisplayNames = {
    [key in keyof typeof ContainType]: string;
};

const ContainTypeDisplayNamesMap: ContainTypeDisplayNames = {
    NUMBER_0: "Default",
    NUMBER_1: "Plus",
    NUMBER_2: "Minus",
};

// Helper function to get display names
export function getContainTypeDisplayName(value: number): string | undefined {
    const key = Object.keys(ContainType).find(
        (k) => ContainType[k as keyof typeof ContainType] === value
    ) as keyof typeof ContainType;

    return ContainTypeDisplayNamesMap[key];
}