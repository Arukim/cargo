
export interface Customer {
    id: number;
    name: string;
    parts: Part[];
}

export interface BatchOrderPart {
    id: number;
    batchId: number;
    orderPartId: number;
}


export interface OrderPart {
    id: number;
    status: string;
    part: Part;
    order: Order;
    successfulBatchId: number;
    batchOrderParts: BatchOrderPart[];
}

export interface OrderPartQueryResponse {
	id: number;
	order: string;
	customer: string;
	part: string;
}

export interface Part {
    id: number;
    name: string;
    partInfo: PartInfo;
}

export interface PartInfo {
    x: number;
    y: number;
    z: number;
    volume: number;
    surfaceArea: number;
}

export interface Order {
    id: number;
    name: string;
    status: string;
    orderParts: OrderPart[];
    customer: Customer;
}

export interface MagicsStatus {
    modelsCount: number;
    modelsVolume: number;
    orderParts: number[];
}

export interface Batch {
    id: number;
    name: string;
    filename: string;
    orderParts: OrderPart[];
}

export interface NewBatch {
    name: string;
    filename: string;
    orderPartIds: number[]
}

export interface CreateOrderModel {
    name: string;
    files: FileEntity[];
}

export interface FileEntity {
    file: File;
    count: number;
}