import { create } from "zustand";
import axiosInstance from "../axios-interceptor/axios";
const stripeStore = create(() => ({
  createPaymentIntent: async (data) => {
    try {
      const res = await axiosInstance.post("/stripe/createPaymentIntent", data);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  updatePaymentIntent: async (data) => {
    try {
      const res = await axiosInstance.post("/stripe/updatePaymentIntent", data);
      console.log("updatePaymentIntent: ~ res:", res);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  confirmPayment: async (data) => {
    try {
      const res = await axiosInstance.post("/stripe/confirmPayment", data);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  refundStripePayment: async (data) => {
    try {
      const res = await axiosInstance.post("/stripe/refund", data);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },
}));

export default stripeStore;
