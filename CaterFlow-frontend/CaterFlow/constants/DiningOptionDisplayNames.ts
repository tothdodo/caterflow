import { DiningOption } from "../generated";

type DiningOptionDisplayNames = {
    [key in keyof typeof DiningOption]: string;
};

const DiningOptionDisplayNamesMap: DiningOptionDisplayNames = {
    NUMBER_0: "HERE",
    NUMBER_1: "TAKE AWAY",
};

// Helper function to get display names
export function getDiningOptionDisplayName(value: number): string | undefined {
    const key = Object.keys(DiningOption).find(
        (k) => DiningOption[k as keyof typeof DiningOption] === value
    ) as keyof typeof DiningOption;

    return DiningOptionDisplayNamesMap[key];
}