import { useLocation } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";
import mainStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Stepper from "../components/stepper";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const {
    getCarById,
    getAllRates,
    userBooking,
    setUserBooking,
    visitedRoutes,
    setVisitedRoutes,
  } = mainStore();
  console.log("CarDetails ~ userBooking:", userBooking);

  const [selectedCar, setSelectedCar] = useState({});
  const [allRates, setAllRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState({});

  useEffect(() => {
    initializeCarDetails();
  }, [userBooking]);

  const initializeCarDetails = async () => {
    const updatedRoutes = [...visitedRoutes];
    updatedRoutes.push("car-details");
    setVisitedRoutes(updatedRoutes);

    if (userBooking.car) {
      setSelectedCar(userBooking.car);
      setSelectedRate(
        Object.keys(userBooking.rate).length
          ? userBooking.rate
          : userBooking.car.type === "limited"
          ? userBooking.car.rates[0]
          : userBooking.car.unlimedRates[0]
      );
      setAllRates(
        userBooking.car.type === "limited"
          ? userBooking.car.rates
          : userBooking.car.unlimedRates
      );
    }
  };

  const getCarImg = (car) => {
    if (car.name === "Suzuki Swift") {
      return "img/cars/suzuki_swift.png";
    } else if (car.name === "Mazda CX3") {
      return "img/cars/mazda_cx3.png";
    }
    else if (car.name === "Mazda CX8") {
      return "img/cars/mazda_cx8.png";
    } else if (car.name === "Toyota Camry") {
      return "img/cars/toyota_camry.png";
    } else if (car.name === "Toyota Hilux") {
      return "img/cars/hilux.png";
    } else if (car.name === "Toyota Corolla") {
      return "img/cars/toyota_corrolla.png";
    } else if (car.name === "Outlander") {
      return "img/cars/mitsubishi_out.png";
    } else if (car.name === "Tesla Model 3") {
      return "img/cars/car_6.png";
    }
  };

  const onSelectingRate = (rate) => {
    setSelectedRate(rate);
  };

  const onSelectingDetails = () => {
    let booking = { ...userBooking };
    booking.rate = selectedRate;
    setUserBooking(booking);

    navigate("/booking");
  };

  return (
    <>
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">
            {selectedCar.name}
          </h1>
        </div>
      </section>
      <section class="DetailsSection">
        <div class="container">
          <Stepper />
          <div class="row">
            <div class="col-md-6">
              <div class="Image">
                <img src={getCarImg(selectedCar)} alt="car" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="Content">
                <div class="Heading">
                  <h2 class="Head_2">{selectedCar.name}</h2>
                  {/* <div class="Rating">
                    <img src="img/icon/star.svg" alt="Star" />
                    <img src="img/icon/star.svg" alt="Star" />
                    <img src="img/icon/star.svg" alt="Star" />
                    <img src="img/icon/star.svg" alt="Star" />
                    <img src="img/icon/star_unfill.svg" alt="Star" />
                  </div> */}
                </div>
                {/* <div class="Features">
                  <img src="img/icon/air_conditioning.svg" alt="Icon" />
                  <img src="img/icon/gps_navigation.svg" alt="Icon" />
                  <img src="img/icon/bluetooth.svg" alt="Icon" />
                  <img src="img/icon/camera.svg" alt="Icon" />
                  <img src="img/icon/cruise_control.svg" alt="Icon" />
                </div> */}
                <div class="Brand">
                  <h3 class="Pra_2">
                    <b>Brand:</b> {selectedCar.brand}
                  </h3>
                  <h3 class="Pra_2">
                    <b>Model:</b> {selectedCar.model}
                  </h3>
                  <h3 class="Pra_2">
                    <b>Daily Free Km:</b> {selectedCar.kmh}
                  </h3>
                </div>
                <p class="Pra_1">{selectedCar.description}</p>
                <div class="Offer">
                  <h4 class="Head_3">Special Offers (Excl. GST):</h4>
                  <p class="Pra_1"><span class="colorRed">*</span> Below rates applied according to selected days</p>
                  <div class="Links">
                    {allRates.map((rate) => (
                      <a title={rate.title+' rate is $'+rate.rate}
                        className={`cursor-pointer ${
                          rate.title === selectedRate.title ? "Active" : ""
                        }`}
                        // onClick={() => onSelectingRate(rate)}
                      >
                        {rate.title}: <b>${rate.rate}</b>
                      </a>
                    ))}
                  </div>
                </div>
                <a
                  class="BtnFill cursor-pointer"
                  onClick={() => onSelectingDetails()}
                >
                  Continue
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CarDetails;
