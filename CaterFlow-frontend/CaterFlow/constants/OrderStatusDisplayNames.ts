import { OrderStatus } from "../generated";

type OrderStatusDisplayNames = {
    [key in keyof typeof OrderStatus]: string;
};

const OrderStatusDisplayNamesMap: OrderStatusDisplayNames = {
    NUMBER_0: "In progress",
    NUMBER_1: "Ready",
    NUMBER_2: "Paid",
    NUMBER_3: "Served",
};

export function getOrderStatusDisplayName(value: number): string | undefined {
    const key = Object.keys(OrderStatus).find(
        (k) => OrderStatus[k as keyof typeof OrderStatus] === value
    ) as keyof typeof OrderStatus;

    return OrderStatusDisplayNamesMap[key];
}