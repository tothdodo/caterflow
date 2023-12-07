import { SubOrderStatus } from "../generated";

type OrderStatusDisplayNames = {
    [key in keyof typeof SubOrderStatus]: string;
};

const SubOrderStatusDisplayNamesMap: OrderStatusDisplayNames = {
    NUMBER_0: "In progress",
    NUMBER_1: "Ready"
};

export function getSubOrderStatusDisplayName(value: number): string | undefined {
    const key = Object.keys(SubOrderStatus).find(
        (k) => SubOrderStatus[k as keyof typeof SubOrderStatus] === value
    ) as keyof typeof SubOrderStatus;

    return SubOrderStatusDisplayNamesMap[key];
}