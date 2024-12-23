import { getAuth } from '@clerk/nextjs/server';
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from 'next/server';
import { ProductType } from '@/types/ProductType';
import prisma from '@/lib/prisma';

const calculateOrderAmount = (items: ProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        const price = item.price ?? 0;
        const quantity = item.quantity ?? 0;
        return acc + price! * quantity!;
    }, 0);
    return totalPrice;
}

export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    const { items, payment_intent_id } = await req.json();

    console.log('userId:', userId);
    if (!userId) {
        console.log("Usuário não autorizado");
        return new NextResponse("Não Autorizado", { status: 401 });
    }

    // Calculando o valor total
    const total = calculateOrderAmount(items);
    console.log("Valor total calculado:", total);

    const orderData = {
        user: { connect: { id: 1 } },
        amount: total,
        currency: 'brl',
        status: 'pending',
        paymentIntentID: payment_intent_id,
        products: {
            create: items.map((item: ProductType) => ({
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
            }))
        }
    };

    try {
        if (payment_intent_id) {
            console.log("Atualizando Payment Intent:", payment_intent_id);
            // Recuperando o Payment Intent atual
            const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

            if (current_intent) {
                // Atualizando o Payment Intent
                const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
                    amount: total,
                });

                // Procurando o pedido e atualizando os produtos
                const [existing_order] = await Promise.all([
                    prisma.order.findFirst({
                        where: { paymentIntentID: payment_intent_id },
                        include: { products: true }
                    }),
                    prisma.order.update({
                        where: { paymentIntentID: payment_intent_id },
                        data: {
                            amount: total,
                            products: {
                                deleteMany: {},
                                create: items.map((item: ProductType) => ({
                                    name: item.name,
                                    description: item.description,
                                    quantity: item.quantity,
                                    price: item.price,
                                    image: item.image,
                                }))
                            }
                        }
                    })
                ]);

                if (!existing_order) {
                    console.log("Pedido não encontrado para o payment_intent_id:", payment_intent_id);
                    return new NextResponse("Pedido não encontrado", { status: 401 });
                }

                console.log("Pagamento atualizado com sucesso:", updated_intent.id);
                return NextResponse.json({ paymentIntent: updated_intent }, { status: 200 });
            }
        } else {
            console.log("Criando novo Payment Intent...");
            // Criando um novo Payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: total,
                currency: 'brl',
                automatic_payment_methods: { enabled: true }
            });

            orderData.paymentIntentID = paymentIntent.id;

            // Opcionalmente, criar o pedido no banco de dados (comentado aqui)
            // const newOrder = await prisma.order.create({
            //     data: orderData
            // });

            console.log("Novo Payment Intent criado com sucesso:", paymentIntent.id);
            return NextResponse.json({ paymentIntent }, { status: 200 });
        }
    } catch (error) {
        console.error("Erro ao processar o pagamento ou atualizar o pedido:", error);
        return new NextResponse("Erro interno ao processar pagamento", { status: 500 });
    }
}
