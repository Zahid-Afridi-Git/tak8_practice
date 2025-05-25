import Header from "../components/header";
import mainStore from "../../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import moment from "moment";
import { useLocation } from "react-router-dom";
import Loader from '../components/loader';
const Cars = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const makeRoundTime = (time) => {
    // Parse the input time
    let parsedTime = moment(time, "hh:mm A");

    // Check if minutes are greater than 0 and round up
    if (parsedTime.minute() > 0) {
      parsedTime = parsedTime.add(1, "hour").minute(0).second(0);
    } else {
      parsedTime = parsedTime.minute(0).second(0);
    }

    // Return the formatted rounded time
    return parsedTime.format("hh:mm A");
  }
  const {
    getAllCars,
    userBooking,
    setUserBooking,
    visitedRoutes,
    setVisitedRoutes,
    futureBookings,
    getCarImg
  } = mainStore();
  const [allCarsList, setAllCarsList] = useState([]);

  const fromfind = searchParams.get("find");
  console.log('fromfind', fromfind);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    initializeCars();
  }, []);

  const initializeCars = async () => {
    const updatedRoutes = [...visitedRoutes];
    updatedRoutes.push("car");
    setVisitedRoutes(updatedRoutes);
    const startDate = moment(userBooking.booking.pickUpDate);
    const endDate = moment(userBooking.booking.returnDate);

    userBooking.booking.driverAge = 21;
    const inclusiveDays = endDate.diff(startDate, "days");
    const res = await getAllCars();
    if (res) {
      const bookedCars = res.map((car) => {

        const rates = car.rates;
        const unlimited_rates = car.unlimedRates;
        // car.type === "limited"
        //   ? car.rates
        //   : car.unlimedRates;

        const rate = rates.find(
          (rate) =>
            inclusiveDays >= rate.minDays &&
            (rate.maxDays === null || inclusiveDays <= rate.maxDays)
        );
        const unlimited_rate = unlimited_rates.find(
          (rate) =>
            inclusiveDays >= rate.minDays &&
            (rate.maxDays === null || inclusiveDays <= rate.maxDays)
        );
        if (fromfind == 1) {
          if (rate) {
            car.defaultRatePerDay = rate.rate * inclusiveDays;
          }
          if (unlimited_rate) {
            car.defaultUnlimitedRatePerDay = unlimited_rate.rate * inclusiveDays;
          }
        }
        userBooking.booking.pickUpTime = makeRoundTime(userBooking.booking.pickUpTime);
        userBooking.booking.returnTime = makeRoundTime(userBooking.booking.returnTime);
        console.log("userBooking", userBooking.booking);
        // Count overlapping bookings for the car
        const overlappingCount = futureBookings.filter((futureCar) => {
          // Check if the car IDs match
          if (futureCar.car?._id !== car._id) {
            return false;
          }
          const futurePickUp = new Date(moment(`${futureCar.pickUpDate} ${futureCar.pickUpTime}`, "YYYY-MM-DD hh:mm A").toDate());
          const futureReturn = new Date(moment(`${futureCar.returnDate} ${futureCar.returnTime}`, "YYYY-MM-DD hh:mm A").toDate());
          // const futureReturn = new Date(`${futureCar.returnDate} ${futureCar.returnTime}`);
          // console.log("utureCar.pickUpDate", futureCar.pickUpDate);
          // console.log("futureCar.pickUpTime", futureCar.pickUpTime);
          // console.log("futurePickUp", futurePickUp);
          // console.log("futureReturn", futureReturn);
          // const currentPickUp = new Date(`${userBooking.booking.pickUpDate} ${userBooking.booking.pickUpTime}`);
          // const currentReturn = new Date(`${userBooking.booking.returnDate} ${userBooking.booking.returnTime}`);
          const currentPickUp = new Date(moment(`${userBooking.booking.pickUpDate} ${userBooking.booking.pickUpTime}`, "YYYY-MM-DD hh:mm A").toDate());
          const currentReturn = new Date(moment(`${userBooking.booking.returnDate} ${userBooking.booking.returnTime}`, "YYYY-MM-DD hh:mm A").toDate());
          // console.log("currentPickUp", currentPickUp);
          // console.log("currentReturn", currentReturn);
          // Check for overlapping
          return futurePickUp <= currentReturn && futureReturn >= currentPickUp;
        }).length;
        //console.log("overlappingCount", overlappingCount);
        return {
          ...car,
          overlappingCount, // Add overlapping count
          isSold: overlappingCount >= car.totalQuantity ? true : false,
        };
      });


      setAllCarsList(bookedCars);
    }
    console.log("initializeCars ~ res:", res);
  };

  const onSelectingCar = (car, type) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let booking = { ...userBooking };
    booking.car = { ...car, type: type };
    
    setUserBooking(booking);
    navigate(`/booking?id=${car._id}`);
  };


  return (

    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section className={`MainSection`}>
        <div class="container">
          <h1 class="Head_2">Cars</h1>
        </div>
      </section>
      <section >
        <div class="container">
          {/* <Stepper /> */}
          <div class="row">
            {allCarsList.map((car) => (
              <div class="col-md-4">
                <div class="CarBox">
                  <div class="Image">
                    <img src={getCarImg(car)} alt="car" />
                    {car.isAutomatic ? (
                      <span class="Tag Red">Automatic</span>
                    ) : (
                      <span class="Tag Yellow">Manual</span>
                    )}
                    {/* <span class="Tag Red" onClick={() => setPopupOpen(true)}>Details</span> */}
                    <span class="Feature">
                      <img src="img/icon/carseat.svg" alt="Icon" /> {car.seats} Seats  |
                      <img src="img/icon/bags.svg" alt="Icon" /> {car.bags} Bags
                    </span>
                  </div>
                  <div class="Content">
                    <div class="Heading">
                      <h4 class="Head_3">{car.name}</h4>
                      {/* <img src="img/icon/carseat.svg" alt="Icon" /> {car.seats}{" "}
                      Seats
                      <img src="img/icon/bags.svg" alt="Icon" /> {car.bags} Bags */}
                      <div class="Features">
                        {/* <img src="img/icon/air_conditioning.svg" alt="Icon" />
                        <img src="img/icon/gps_navigation.svg" alt="Icon" />
                        <img src="img/icon/bluetooth.svg" alt="Icon" />
                        <img src="img/icon/camera.svg" alt="Icon" />
                        <img src="img/icon/cruise_control.svg" alt="Icon" /> */}
                      </div>
                    </div>
                    <div className="PriceMain">
                      <div class="Price">
                        <div><h5 >${car.defaultRatePerDay}</h5> <span className="rate-label">7+ Days Rate</span></div>


                        <p>150KM / Day</p>
                        <a
                          onClick={() => {
                            onSelectingCar(car, "limited");
                          }}
                          class={`BtnBorderY cursor-pointer ${car.isSold ? "disabled-link" : ""
                            }`}
                        >
                          {car.isSold ? "Sold Out" : "Select"}
                        </a>
                      </div>
                      <div class="Price">
                        <div><h5 >${car.defaultUnlimitedRatePerDay}</h5> <span className="rate-label">7+ Days Rate</span></div>

                        <p>Unlimited KM</p>
                        <a
                          onClick={() => {
                            onSelectingCar(car, "unlimited");
                          }}
                          class={`BtnFill cursor-pointer ${car.isSold ? "disabled-link" : ""
                            }`}
                        >
                          {car.isSold ? "Sold Out" : "Select"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Cars;
