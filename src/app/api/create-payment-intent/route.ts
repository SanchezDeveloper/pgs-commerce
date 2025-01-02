import { auth,  } from '@clerk/nextjs/server';
import { stripe } from "@/lib/stripe";
import { NextResponse } from 'next/server';
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

export async function POST(req: Request) {
    const { userId } = auth();
    const { items, payment_intent_id } = await req.json();

    if (!userId) {
        return new Response("Não Autorizado", { status: 401 });
    }

    // Calculando o valor total
    const total = calculateOrderAmount(items);
    

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
            const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

            if (current_intent) {
                const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
                    amount: total,
                });

                // Procurando o pedido e atualizando os produtos
                const [existing_order, updated_order] = await Promise.all([
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
                                    image: item.image
                                }))
                            }
                        }
                    })
                ]);

                if (!existing_order) {
                    return new NextResponse("Order not found", { status: 404 });
                }

                return NextResponse.json({ paymentIntent: updated_intent }, { status: 200 }) //&& NextResponse.json(
                    //{ orderData: updated_order }, {status: 200}
               // );
            }
        } else {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: total,
                currency: 'brl',
                automatic_payment_methods: { enabled: true }
            });

            orderData.paymentIntentID = paymentIntent.id;

            const newOrder = await prisma.order.create({
                data: orderData
            })

            return Response.json({ paymentIntent }, { status: 200 });
        }
    } catch (error) {
        console.error("Erro ao processar o pagamento ou atualizar o pedido:", error);
        return new Response("Erro interno ao processar pagamento", { status: 500 });
    }
}
