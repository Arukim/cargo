const buildMap = (o: any) => Object.keys(o).reduce((m, k) => m.set(k, o[k]), new Map<string, string>());

const orderStatusHelper = {
    Created: "Коммерческое предложение",
    Confirmed: "Подтвержден",
    Finished: "Выполнено"
};

const orderPartStatusHelper = {
    Created: "Создана",
    InWork: "В работе",
    Finished: "Завершена"
};

export const OrderStatusHelper = buildMap(orderStatusHelper);
export const OrderPartStatusHelper = buildMap(orderPartStatusHelper);