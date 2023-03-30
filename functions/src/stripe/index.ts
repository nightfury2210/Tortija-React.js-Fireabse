import {Request, Response} from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRETKEY ?? "", {
  apiVersion: "2020-08-27",
});

export const stripeSubscriptionAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const {paymentMethod, planID} = req.body;
    const customer = await stripe.customers.create({
      payment_method: paymentMethod.id,
      email: paymentMethod.billing_details.email,
      description: "Subscription",
      shipping: {
        name: paymentMethod.billing_details.name,
        address: paymentMethod.billing_details.address,
      },
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: planID,
        },
      ],
      expand: ["latest_invoice.payment_intent"],
    });

    res.json({subscription: subscription});
  } catch (error) {
    res.status(error.statusCode).send(error.raw.message);
  }
};

export const stripeCancelSubscriptionAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedSubscription = await stripe.subscriptions.del(
        req.body.subscriptionId
    );
    res.send(deletedSubscription);
  } catch (error) {
    res.status(error.statusCode).send(error.raw.message);
  }
};
