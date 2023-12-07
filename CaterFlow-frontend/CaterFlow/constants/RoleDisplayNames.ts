import { Role } from "../generated";

type RoleDisplayNames = {
    [key in keyof typeof Role]: string;
};

const RoleDisplayNamesMap: RoleDisplayNames = {
    NUMBER_0: "Administrator",
    NUMBER_1: "Manager",
    NUMBER_2: "Waiter",
    NUMBER_3: "FlowManagerBot",
    NUMBER_4: "NewComer",
};

export function getRoleDisplayName(value: number): string | undefined {
    const key = Object.keys(Role).find(
        (k) => Role[k as keyof typeof Role] === value
    ) as keyof typeof Role;

    return RoleDisplayNamesMap[key];
}