'use client'
import { useState } from "react";
import Image from "next/image";
import { ProductType } from "@/types/ProductType"

type ProductImageProps = {
    product: ProductType;
    fill?: boolean;
}
export default function ProductImage({product, fill}: ProductImageProps) {
    const [loading, setLoading] = useState(true);

    // Verificar se o produto tem uma imagem válida
    const productImage = product?.image || '/default-image.jpg'; // Fallback para uma imagem padrão
    const productName = product?.name || 'Produto sem nome'; // Fallback para o nome do produto

    return fill ? (
        <Image 
            src={product.image}
            fill
            alt={product.name}
            className={`object-cover ${
                loading ? 'scale-110 blur-3xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            }`}

            onLoad={() => setLoading(false)}
            priority
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw" 
        />
    ) : (
        <Image 
            src={product.image}
            width={400}
            height={700}
            alt={product.name}
            className={`object-cover ${
                loading ? 'scale-110 blur-3xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            }`}
            onLoad={() => setLoading(false)}
            priority
        />
    );
}