// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Booking from "../pages/booking/booking";
import Cars from "../pages/booking/cars";
import CarsList from "../pages/booking/carslist";
import CarDetails from "../pages/booking/carDetails";
import RentalForm from "../pages/booking/rentalForm";
import Extras from "../pages/booking/extras";
import ThankYou from "../pages/booking/thankYou";
import Services from "../pages/services";
import AboutUs from "../pages/aboutUs";
import ContactUs from "../pages/contactUs";
import Payment from "../pages/booking/payment";
import TermsCondition from "../pages/terms";
import PrivacyPolicy from "../pages/privacy";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/carslist" element={<CarsList />} />
      <Route path="/car-details" element={<CarDetails />} />
      <Route path="/rental-form" element={<RentalForm />} />
      <Route path="/extras" element={<Extras />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/truck-utes" element={<Cars />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/terms-conditions" element={<TermsCondition />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      
    </Routes>
  );
};

export default AppRoutes;
