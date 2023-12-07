import { IngredientDTO } from "../generated";

export interface PaymentSubOrderItem {
    id: number;
    productName: string;
    price: number;
    amount: number;
    ingredients: IngredientDTO[];
}