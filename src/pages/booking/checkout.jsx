import React, { useMemo, useRef, useState } from "react";
import moment from "moment";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Header from "../components/header";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import stripeStore from "../../store/stripe";
import mainStore from "../../store/store";
import sendBookingEmail from "./email";
import { useNavigate } from "react-router-dom";
import Summary from "../components/summary";
import { useEffect } from "react";

const CheckoutForm = () => {
  // useEffect(() => {
  //   const observer = new MutationObserver(() => {
  //     const offsetContainer = document.querySelector(".OffsetContainer");
  //     if (offsetContainer) {
  //       offsetContainer.style.display = "none";
  //       observer.disconnect(); // Stop observing once found
  //     }
  //   });

  //   observer.observe(document.body, { childList: true, subtree: true });

  //   return () => observer.disconnect();
  // }, []);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const stripeRef = useRef(null);
  const { createPaymentIntent } = stripeStore();
  const { userBooking, createBooking, setUserBooking } = mainStore();
  console.log("CheckoutForm ~ userBooking:", userBooking);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    contact: Yup.string()
      .matches(/^\d+$/, "Contact number must be digits only")
      .min(10, "Contact number must be at least 10 digits")
      .required("Contact is required"),
  });
  const initialValues = userBooking.customer;
  const AirPortAmount = useMemo(() => {
    let airportCharges = 0
    if (userBooking?.booking?.pickUpLocation?.toLowerCase().includes("air")) {
      airportCharges += 50;
    }
    if (userBooking?.booking?.returnLocation?.toLowerCase().includes("air")) {
      airportCharges += 50;
    }
    return airportCharges;

  }, [userBooking]);
  const calculateExtra = useMemo(() => {
    return userBooking.extras.reduce((acc, extra) => {
      const isMultiplierApplicable = extra.title === "Damage Waiver" || extra.title === "Child Seat";
      const price = isMultiplierApplicable ? extra.price * (userBooking.days || 1) : extra.price;
      return acc + price;
    }, 0);
  }, [userBooking]);

  const calculateRate = useMemo(() => {
    return (userBooking.rate.rate * (userBooking.days || 1)) + AirPortAmount;
  }, [userBooking]);
  const taxAmount = useMemo(() => {
    return (calculateRate + parseFloat(calculateExtra)) * 0.10;
  }, [userBooking]);
  const discountAmount = useMemo(() => {
    return ((calculateRate + parseFloat(calculateExtra)) * 0.01).toFixed(2);
  }, [userBooking]);
  const totalPayment = useMemo(() => {
    return calculateRate + parseFloat(calculateExtra) + taxAmount;
  }, [userBooking]);
  const payAtCounter = () => {
    sendBookingEmail(userBooking, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra);
    createBooking(userBooking);
    let defaultUserBooking = {
      car: { rates: [] },
      rate: {},
      booking: {
        pickUpLocation: "East Perth",
        pickUpDate: moment().format("YYYY-MM-DD"),
        pickUpTime: moment().format("HH:mm"),
        returnLocation: "",
        returnDate: moment().add(7, "days").format("YYYY-MM-DD"),
        returnTime: moment().format("HH:mm"),
        driverAge: "",
        agreeToTerms: true,
      },
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        licenseNumber: "",
        address: "",
        comments: "",
      },
      extras: [],
    };
    //setUserBooking(defaultUserBooking);
    navigate("/thank-you");
  };
  const handleSubmit = async (values) => {
    console.log("handleSubmit ~ e:", values);
    // e.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);


    setLoading(true);

    try {

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          email: values.email,
          phone: values.contact,
          name: `${values.firstName} ${values.lastName}`,
        },
      });

      if (!error) {
        try {
          const res = await createPaymentIntent({
            amount: (totalPayment - discountAmount) * 100,
            info: paymentMethod,
          });

          if (res) {
            sendBookingEmail(userBooking, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra);
            createBooking(userBooking);
            navigate("/thank-you");
          }
        } catch (error) {
          setLoading(false);
        }
      } else {
        stripeRef.current.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }

    setLoading(false);
  };
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
    autocomplete: "off",
  };
  return (
    <>
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Book Your Car</h1>
        </div>
      </section>
      <section class="BookingSection">
        <div class="container">
          <Stepper />

          <div className="container py-4">
            <div className="row justify-content-center">
              {userBooking.payment_type == 'card' ? (
                <div className="col-md-7">
                  <div className="card shadow">
                    <div
                      className="card-header text-white text-center"
                      style={{ backgroundColor: "#e02935" }}
                    >
                      <h4 style={{ color: "#fff" }} ref={stripeRef}>
                        Payment Form
                      </h4>
                    </div>
                    <div className="card-body">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                          handleSubmit(values); // Pass customer details and card data to your submit handler
                          setSubmitting(false);
                        }}
                      >
                        {({ isSubmitting ,errors}) => (
                          <Form>
                            {/* First Name and Last Name */}
                            <div className="row mb-3">
                            <div className={`input-container col-md-6 tooltip-wrapper ${errors.firstName ? 'error' : ''}`}
                                data-tooltip={errors.firstName}>
                                <label htmlFor="firstName" className="form-label">
                                  First Name
                                </label>
                                <Field
                                  id="firstName"
                                  name="firstName"
                                  type="text"
                                  className="form-control"
                                />
                              
                              </div>
                              <div className={`input-container col-md-6 tooltip-wrapper ${errors.lastName ? 'error' : ''}`}
                                data-tooltip={errors.lastName}>
                                <label htmlFor="lastName" className="form-label">
                                  Last Name
                                </label>
                                <Field
                                  id="lastName"
                                  name="lastName"
                                  type="text"
                                  className="form-control"
                                />
                              
                              </div>
                            </div>

                            {/* Email and Address */}
                            <div className="row mb-3">
                              <div className={`input-container col-md-6 tooltip-wrapper ${errors.email ? 'error' : ''}`}
                                data-tooltip={errors.email}>

                                <label htmlFor="email" className="form-label">
                                  Email
                                </label>
                                <Field
                                  id="email"
                                  name="email"
                                  type="email"
                                  className="form-control"
                                />

                              </div>
                              <div className={`input-container col-md-6 tooltip-wrapper ${errors.contact ? 'error' : ''}`}
                                data-tooltip={errors.contact}>
                                {/* <label htmlFor="address" className="form-label">
                                Address
                              </label>
                              <Field
                                id="address"
                                name="address"
                                type="text"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                              /> */}
                                <label htmlFor="contact" className="form-label">
                                  Contact
                                </label>
                                <Field
                                  id="contact"
                                  name="contact"
                                  type="text"
                                  className="form-control"
                                />
                               
                              </div>
                            </div>

                            {/* Contact */}
                            {/* <div className="mb-3"></div> */}

                            {/* Stripe Card Elements Section */}
                            <div className="mb-3">
                              <label htmlFor="cardNumber" className="form-label">
                                Card Number
                              </label>
                              <div class="cardField">
                                <CardNumberElement

                                  id="cardNumber"
                                  className="form-control-card"

                                />
                                <div class="cardBrand">
                                  <img src="img/icon-visa.png"></img>
                                  <img src="img/icon-mastercard.png"></img>
                                  <img src="img/icon-amex.png"></img>
                                </div>
                              </div>

                            </div>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label
                                  htmlFor="cardExpiry"
                                  className="form-label"
                                >
                                  Expiry
                                </label>
                                <CardExpiryElement
                                  id="cardExpiry"
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="cardCvc" className="form-label">
                                  CVC
                                </label>
                                <CardCvcElement
                                  id="cardCvc"
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {error && (
                              <div className="alert alert-danger mt-3">
                                {error}
                              </div>
                            )}

                            {/* Submit Button */}
                            <button
                              type="submit"
                              className="BtnFill w-100 mt-4"
                              disabled={loading || !stripe || isSubmitting}
                            >
                              {loading ? "Processing..." : "Pay"}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              ) : (<div className="col-md-4">
                <div className="card shadow">
                  <div
                    className="card-header text-white text-center"
                    style={{ backgroundColor: "#FFA500" }}
                  >
                    <h4 style={{ color: "#fff" }}>Pay at Counter</h4>
                  </div>
                  <div className="card-body text-center">
                    <p>No online payment required.</p>
                    <p>Pay when you pick up the service.</p>
                    <button
                      type="submit"
                      className="BtnFill w-100 mt-4"
                      onClick={() => payAtCounter()}
                    >
                      {loading ? "Processing..." : "Proceed"}
                    </button>
                  </div>
                </div>
              </div>)
              }
              <div className="col-md-5">
                <Summary />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CheckoutForm;
