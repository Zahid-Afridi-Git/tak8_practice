import Header from "../components/header";
import mainStore from "../../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import moment from "moment";
import { useLocation } from "react-router-dom";

const TopCars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const {
    getAllCars,
    userBooking,
    setUserBooking,
    visitedRoutes,
    setVisitedRoutes,
    futureBookings,
    setSelectedRoute,
    getCarImg
  } = mainStore();
  
  const routeTo = (routeTo) => {
    
    setSelectedRoute(routeTo);
    navigate(routeTo);
  };
  const [allCarsList, setAllCarsList] = useState([]);
  //   const carBookingCounts = futureBookings.reduce((acc, booking) => {
  //     acc[booking.car] = (acc[booking.car] || 0) + 1;
  //     return acc;
  //   }, {});
  //  const top3Cars = Object.entries(carBookingCounts)
  //   .sort((a, b) => b[1] - a[1]) // Sort by count descending
  //   .slice(0, 3) // Get top 3
  //   .map(([car, count]) => ({ car, count }));

  // console.log(top3Cars);

  const topBookedCars = () => {
    return allCarsList.slice(0, 3);
  }
  const fromfind = searchParams.get("find");
  console.log('fromfind', fromfind);

  useEffect(() => {
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
          console.log("utureCar.pickUpDate", futureCar.pickUpDate);
          console.log("futureCar.pickUpTime", futureCar.pickUpTime);
          console.log("futurePickUp", futurePickUp);
          console.log("futureReturn", futureReturn);
          // const currentPickUp = new Date(`${userBooking.booking.pickUpDate} ${userBooking.booking.pickUpTime}`);
          // const currentReturn = new Date(`${userBooking.booking.returnDate} ${userBooking.booking.returnTime}`);
          const currentPickUp = new Date(moment(`${userBooking.booking.pickUpDate} ${userBooking.booking.pickUpTime}`, "YYYY-MM-DD hh:mm A").toDate());
          const currentReturn = new Date(moment(`${userBooking.booking.returnDate} ${userBooking.booking.returnTime}`, "YYYY-MM-DD hh:mm A").toDate());
          console.log("currentPickUp", currentPickUp);
          console.log("currentReturn", currentReturn);
          // Check for overlapping
          return futurePickUp <= currentReturn && futureReturn >= currentPickUp;
        }).length;
        console.log("overlappingCount", overlappingCount);
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
    let booking = { ...userBooking };
    booking.car = { ...car, type: type };
    setUserBooking(booking);
    navigate(`/booking?id=${car._id}`);
  };

  // const getCarImg = (car) => {
  //   if (car.name === "Suzuki Swift") {
  //     return "img/cars/suzuki_swift.png";
  //   } else if (car.name === "Mazda CX3") {
  //     return "img/cars/mazda_cx3.png";
  //   }
  //   else if (car.name === "Mazda CX8") {
  //     return "img/cars/mazda_cx8.png";
  //   } else if (car.name === "Toyota Camry") {
  //     return "img/cars/toyota_camry.png";
  //   } else if (car.name === "Toyota Hilux") {
  //     return "img/cars/hilux.png";
  //   } else if (car.name === "Toyota Corolla") {
  //     return "img/cars/toyota_corrolla.png";
  //   } else if (car.name === "Outlander") {
  //     return "img/cars/mitsubishi_out.png";
  //   } else if (car.name === "Tesla Model 3") {
  //     return "img/cars/car_6.png";
  //   }
  // };


  return (
    <>

      <div class="CustomHeading1">

        {/* <h2 class="Head_1">TAK8, Just Make It!</h2> */}
        <h3 class="Head_2"><span class="colorRed">Explore</span> our <span class="colorYellow">best-selling</span> rental cars</h3>
        <p class="Pra_1">
          chosen by customers for their comfort, reliability, and value!
        </p>
      </div>

      <section>
        <div class="container">
          {/* <Stepper /> */}
          <div class="row">
            {topBookedCars().map((car) => (
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
          <div class="row pt-4">
            <div class="Button text-center">
              <a href="#" onClick={() => routeTo("/carslist")} class="BtnFill">
                More Cars
              </a>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TopCars;
