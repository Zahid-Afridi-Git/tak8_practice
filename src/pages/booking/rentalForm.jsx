import Header from "../components/header";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import mainStore from "../../store/store";
import Summary from "../components/summary";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import Loader from '../components/loader';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact: Yup.string().required("Contact is required"),
  licenseNumber: Yup.string()
    .min(6, "License number must be at least 6 characters")
    .max(20, "License number must not exceed 20 characters.")
    .required("License number is required"),
  address: Yup.string().required("Address is required"),
  comments: Yup.string(),
});

const RentalForm = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const { userBooking, setUserBooking, visitedRoutes, setVisitedRoutes } =
    mainStore();

  const initialValues = userBooking.customer;

  useEffect(() => {
    const updatedRoutes = [...visitedRoutes];
    updatedRoutes.push("rental-form");
    setVisitedRoutes(updatedRoutes);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSubmit = async (values, validateForm) => {
    const formValidated = await validateForm();
    if (Object.keys(formValidated).length) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    let booking = { ...userBooking };
    booking.customer = values;
    setUserBooking(booking);

    navigation("/extras");
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Rental Form</h1>
        </div>
      </section>
      <section class="BookingSection">
        <div class="container">
          <Stepper />
          <div class="row">
            <div class="col-md-7">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, values, validateForm }) => (
                  <Form class="SearchForm" action="extras.html">
                    <div class="form-grid">

                      <div class="form-field">
                        <label for="FirstName" class="form-label">
                          First Name
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.firstName ? 'error' : ''}`}
                          data-tooltip={errors.firstName}>
                          <Field
                            name="firstName"
                            placeholder="Enter First Name"
                            className={`form-control ${errors.firstName && touched.firstName
                              ? "error"
                              : ""
                              }`}
                          />

                        </div>

                      </div>

                      <div class="form-field">
                        <label for="LastName" class="form-label">
                          Last Name
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.lastName ? 'error' : ''}`}
                          data-tooltip={errors.lastName}>
                          <Field
                            name="lastName"
                            id="LastName"
                            placeholder="Enter Last Name"
                            className={`form-control ${errors.lastName && touched.lastName ? "error" : ""
                              }`}
                          />

                        </div>
                      </div>
                      <div class="form-field">
                        <label for="Email" class="form-label">
                          Email
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.email ? 'error' : ''}`}
                          data-tooltip={errors.email}>
                          <Field
                            name="email"
                            type="email"
                            id="Email"
                            placeholder="Enter Email"
                            className={`form-control ${errors.email && touched.email ? "error" : ""
                              }`}
                          />

                        </div>
                      </div>
                      <div class="form-field">
                        <label for="ContactNumber" class="form-label">
                          Contact Number
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.contact ? 'error' : ''}`}
                          data-tooltip={errors.contact}>
                          <Field
                            name="contact"
                            type="tel"
                            id="ContactNumber"
                            placeholder="Enter Contact Number"
                            className={`form-control ${errors.contact && touched.contact ? "error" : ""
                              }`}
                          />

                        </div>
                      </div>
                      <div class="form-field">
                        <label for="LicenseNumber" class="form-label">
                          License Number
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.licenseNumber ? 'error' : ''}`}
                          data-tooltip={errors.licenseNumber}>
                          <Field
                            name="licenseNumber"
                            id="LicenseNumber"
                            type="text"
                            placeholder="Enter License Number"
                            className={`form-control ${errors.licenseNumber && touched.licenseNumber
                              ? "error"
                              : ""
                              }`}
                          />

                        </div>
                      </div>
                      <div class="form-field">
                        <label for="Address" class="form-label">
                          Address
                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.address ? 'error' : ''}`}
                          data-tooltip={errors.address}>
                          <Field
                            name="address"
                            class="form-control"
                            id="Address"
                            placeholder="Enter Address"
                            className={`form-control ${errors.address && touched.address ? "error" : ""
                              }`}
                          />

                        </div>
                      </div>
                      <div class="form-field">
                        <label for="Comments" class="form-label">
                          Comments
                        </label>
                        <div class="input-container">
                          <Field
                            name="comments"
                            as="textarea"
                            class="form-control"
                            id="Comments"
                            placeholder="Enter Comments"
                          />

                        </div>
                      </div>
                    </div>
                    <div>&nbsp;</div>
                    <button
                      class="BtnFill"
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => handleSubmit(values, validateForm)}
                    >
                      Next
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div class="col-md-5">
              <Summary />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RentalForm;
