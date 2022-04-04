import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";



export async function saveSubscription(subscriptionId: string, customerId: string, createAction) {
    // Buscar o usuário no banco do faunaDB com o CustomersId
    console.log(subscriptionId, customerId)
    try {
        const userRef = await fauna.query(
            q.Select(['ref'],
                q.Get(
                    q.Match(
                        q.Index('user_by_stripe_customer_id'), customerId
                    )
                )
            )
        ).catch((err) => console.error('Error: %s', err))

         // Salvar os dados da subcription no FaunaDB
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const subscriptionData = {
            id: subscription.id,
            userId: userRef,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id
        }

        //console.log(subscriptionData)


        if (createAction) {
            await fauna.query(
                q.Create(
                    q.Collection('subscriptions'),
                    { data: subscriptionData }
                )
            )
        } else {
            await fauna.query(
                q.Replace(
                    q.Select(['ref'],
                        q.Get(
                            q.Match(
                                q.Index('subscription_by_id'), subscriptionId
                            )
                        )
                    ),
                    { data: subscriptionData }
                )
            )
        }

    } catch (error) {
        alert(error)
    }
    


    
    
    
}