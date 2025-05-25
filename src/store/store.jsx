import { create } from "zustand";
import axiosInstance from "../axios-interceptor/axios";
import moment from "moment";
const loadUserBooking = () => {
  try {
    const stored = localStorage.getItem("userBooking");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};
const loadVisitedRoute = () => {
  try {
    const stored = localStorage.getItem("visitedRoutes");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};
const defaultUserBooking =  {
  car: {},
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
const mainStore = create((set) => ({
  allCars: [],
  selectedRoute: "",
  visitedRoutes: loadVisitedRoute() || [],
  currentRoute: "",
  allBookings: [],
  futureBookings: [],
  userBooking: loadUserBooking() || defaultUserBooking,
  getCarImg: (car) => {
    try {
      if (car.name === "Suzuki Swift") {
        return "img/cars/suzuki_swift.png";
      } else if (car.name === "Mazda CX3") {
        return "img/cars/mazda_cx3.png";
      }
      else if (car.name === "Mazda CX8") {
        return "img/cars/mazda_cx8.png";
      } else if (car.name === "KIA Carnival 8 Seater") {
        return "img/cars/KIA Carnival.png";
      } else if (car.name === "Toyota Hilux") {
        return "img/cars/hilux.png";
      } else if (car.name === "Toyota Corolla") {
        return "img/cars/toyota_corrolla.png";
      } else if (car.name === "Outlander 7 Seater") {
        return "img/cars/mitsubishi_out.png";
      } else if (car.name === "Tesla Model 3") {
        return "img/cars/car_6.png";
      }
    } catch (error) {
      return null;
    }
  },
  getAllCars: async () => {
    try {
      const res = await axiosInstance.get("/cars");
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  getCarById: async (id) => {
    try {
      const res = await axiosInstance.get(`/cars/${id}`);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  getAllRates: async () => {
    try {
      const res = await axiosInstance.get("/rates");
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  getAllExtras: async () => {
    try {
      const res = await axiosInstance.get("/extras");
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },

  getAllBookings: async () => {
    try {
      const res = await axiosInstance.get("/bookings");
      if (res?.data) {
        set({ allBookings: res.data });

        const bookings = res.data.filter((booking) => {
          console.log("bookings ~ booking:", booking.pickUpDate);
          return moment(booking.pickUpDate)
            .utc()
            .isSameOrAfter(moment().utc(), "day");
        });

        set({ futureBookings: res.data });
      }
    } catch (error) {
      return null;
    }
  },

  createBooking: async (data) => {
    try {
      const res = await axiosInstance.post("/bookings", data);
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      return null;
    }
  },


  setSelectedRoute: (route) => {
    set({ selectedRoute: route });
  },

  setUserBooking: (booking) => {
    set({ userBooking: booking });
    // Save to localStorage
    localStorage.setItem('userBooking', JSON.stringify(booking));
  },

  setVisitedRoutes: (routes) => {
    set({ visitedRoutes: routes });
    localStorage.setItem('visitedRoutes', JSON.stringify(routes));
  },
  setCurrentRoute: (routes) => {
    set({ currentRoute: routes });
  },

}));

export default mainStore;
