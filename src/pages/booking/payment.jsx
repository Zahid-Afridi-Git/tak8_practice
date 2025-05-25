import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout";

// Load your Stripe public key
// const stripePromise = loadStripe(
//   "pk_test_51QRpwbHk1E1eWgTxzY0eYzSb99KUKXDDArqT5gRfRiAtHXyHbqXes4TBGqgfWODlH6sTuSEwJLvEv4F7LAXCVv5F00QeJOsXQi"
// );
const stripePromise = loadStripe(
  "pk_live_51QRpwbHk1E1eWgTx4QONVULo1kC4IAiCHab1M7dSRVJUywFiPwatJ94Gj2DOdozes1BQcw8F9yaaZ9v3r2X88Lfn00pQOjJ3xQ"
);

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
      
    </Elements>
  );
};

export default Payment;
