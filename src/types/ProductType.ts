export type ProductType = {
    id: string;
    price: number | null;   
    name: string;
    quantity?: string | 1;
    image: string;
    description: string | null;
    currency?: string;
}