import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as functions from "firebase-functions";

import removeStoredUserData from "./deleteUser";
import {stripeCancelSubscriptionAPI, stripeSubscriptionAPI} from "./stripe";

dotenv.config();

const app = express();
app.use(cors());

export const deleteUser = functions
    .region("europe-west3")
    .firestore
    .document("users/{user}")
    .onUpdate(removeStoredUserData);

app.post("/subscribe", stripeSubscriptionAPI);
app.post("/cancel-subscription", stripeCancelSubscriptionAPI);
export const stripePayment = functions.region("europe-west3").https.onRequest(app);
