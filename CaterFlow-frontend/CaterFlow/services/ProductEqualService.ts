import { CreateSubOrderItem } from "../generated";

export const groupItemsByIngredients = (items: CreateSubOrderItem[]): CreateSubOrderItem[] => {
  const groupedItems: Map<string, CreateSubOrderItem> = new Map();

  items.forEach((item) => {
    const { id, ingredients } = item.product ?? {};

    if (!id) {
      return;
    }

    const key = `${id}-${JSON.stringify(ingredients)}`;

    if (groupedItems.has(key)) {
      groupedItems.get(key)!.amount! += item.amount ?? 0;
    } else {
      groupedItems.set(key, { ...item });
    }
  });

  return Array.from(groupedItems.values());
};