import Header from "../components/header";
import mainStore from "../../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopCars from "../components/topcars";
import Footer from "../components/footer";
import Loader from '../components/loader';
import { Formik, Form, Field, ErrorMessage } from "formik";

import moment from "moment";
import { timeOptions } from "../../utils/constants";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showErrorOnPickup, setShowErrorOnPickup] = useState(false);
  const [showErrorOnDropOff, setShowErrorOnDropOff] = useState(false);
  const makeRoundTime = (time) => {
    console.log('time', time);

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
  const GoogleReviews = () => {

    // Dynamically load the Elfsight script
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  };

  const navigate = useNavigate();
  const { userBooking, setUserBooking, getAllBookings, selectedRoute, setSelectedRoute } = mainStore();
  const routeTo = (routeTo) => {
    setSelectedRoute(routeTo);
    navigate(routeTo);
  };
  const [findRide, setFindRide] = useState({
    pickUpLocation: "",
    pickUpDate: moment().format("YYYY-MM-DD"),
    pickUpTime: makeRoundTime(moment().format("HH:mm")),
    returnLocation: "",
    returnDate: moment().add(7, "days").format("YYYY-MM-DD"),
    returnTime: makeRoundTime(moment().format("HH:mm")),
    driverAge: "",
    agreeToTerms: true,
  });

  useEffect(() => {
    getAllBookings();
    GoogleReviews();
    setTimeout(() => setLoading(false), 500);

    // SEO Meta Tags
    // Set document title
    document.title = "Perth Car Rental | Hourly & Affordable Car Hire – TAK8";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'TAK8 offers flexible Perth car rental with hourly and long-term options. Enjoy simple booking, no hidden fees, and a wide range of vehicles.');
    }
    
    // Set or create Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Affordable Perth Car Rental – TAK8');
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Book your Perth car hire with TAK8. Choose hourly or long-term rentals and enjoy transparent pricing with no extra charges.');
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');
  }, []);

  const onInputChange = (e) => {

    const { name, value } = e.target;
    if (name === "pickUpLocation") {
      findRide.returnLocation = value;
    }
    if (name === "pickUpDate") {
      onSelectingPickUpDate(e);
    } else {
      setFindRide({ ...findRide, [name]: value });
    }

  };

  const onSelectingPickUpDate = (e) => {
    const pickUpDateTime = moment(
      `${e.target.value}T${moment().format("hh:mm")}`
    );
    const returnDateTime = pickUpDateTime.add(7, "days");

    setFindRide({
      ...findRide,
      pickUpDate: e.target.value,
      returnDate: moment(returnDateTime).format("YYYY-MM-DD"),
    });
  };
  const validateForm = () => {
    if (findRide.pickUpLocation == "") {
      setShowErrorOnPickup(true);
      return false;
    }
    else {
      setShowErrorOnPickup(false);
    }
    if (findRide.returnLocation == "") {
      setShowErrorOnDropOff(true);// = true;
      return false;
    }
    else {
      setShowErrorOnDropOff(false);
    }

    return true;
  }
  const onFindCar = () => {
    if (!validateForm()) {
      return;
    }
    const booking = { ...userBooking };
    booking.booking = { ...booking.booking, ...findRide };
    setUserBooking(booking);
    navigate("/cars?find=1");
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section class="SearchSection">
        <div class="container">

          <form class="SearchForm">
            <div class="row">

              <div class="form-field location-field col-md-6 mt-2">
                <label for="PickupLocation" class="form-label">
                  <i class="fas fa-map-marker-alt"></i>
                  Pickup Location
                </label>
                <div className={`input-container tooltip-wrapper ${showErrorOnPickup ? 'error' : ''}`}
                  data-tooltip={showErrorOnPickup ? 'Pick-up location is required' : ''}>
                  <select
                    className="form-select"
                    id="PickupLocation"
                    name="pickUpLocation"
                    value={findRide.pickUpLocation}
                    onChange={onInputChange}
                   
                  >
                    <option value="">Select Location</option>
                    <option value="East Perth">East Perth</option>
                    <option value="Crown Plaza">Crown Plaza</option>
                    <option value="Perth Airport">Perth Airport</option>
                  </select>
                </div>
              </div>

              <div class="form-field datetime-field col-md-6 mt-2">
                <label for="PickupTime" class="form-label">
                  <i class="fas fa-calendar-alt"></i>
                  Pickup Date & Time
                </label>
                <div class="datetime-group">
                  <div class="input-container">
                    <input
                      type="date"
                      class="form-control leftAlignText"
                      id="PickupTime"
                      name="pickUpDate"
                      value={findRide.pickUpDate}
                      onChange={onInputChange}
                      min={new Date().toISOString().split("T")[0]}

                    />
                  </div>
                  <div class="input-container time-input">
                    <select
                      class="form-control"
                      name="pickUpTime"
                      onChange={onInputChange}
                      value={findRide.pickUpTime}
                    >
                      {timeOptions.map((time) => (
                        <option value={time.value}>{time.label}</option>
                      ))}
                    </select>

                  </div>
                </div>
              </div>

              <div class="form-field location-field col-md-6 mt-2 ">
                <label for="returnLocation" class="form-label ">
                  <i class="fas fa-map-marker-alt"></i>
                  Drop-off Location
                
                </label>
                <div className={`input-container tooltip-wrapper ${showErrorOnDropOff ? 'error' : ''}`}
                  data-tooltip={showErrorOnDropOff ? 'Drop-off location is required' : ''}>
                  <select
                    class="form-select"
                    id="returnLocation"
                    name="returnLocation"
                    value={findRide.returnLocation}
                    onChange={onInputChange}
                  >
                    <option value="">Select Location</option>
                    <option value="East Perth">East Perth</option>
                    <option value="Crown Plaza">Crown Plaza</option>
                    <option value="Perth Airport">Perth Airport</option>
                  </select>
                </div>
              </div>

              <div class="form-field datetime-field col-md-6 mt-2">
                <label for="DropOffTime" class="form-label">
                  <i class="fas fa-calendar-alt"></i>
                  Drop-off Date & Time
                </label>
                <div class="datetime-group">
                  <div class="input-container">
                    <input
                      type="date"
                      class="form-control"
                      id="returnDate"
                      name="returnDate"
                      value={findRide.returnDate}
                      onChange={onInputChange}
                      min={findRide.pickUpDate}
                    />
                  </div>
                  <div class="input-container time-input">
                    <select
                      class="form-control"
                      name="returnTime"
                      value={findRide.returnTime}
                      onChange={onInputChange}
                    >
                      {timeOptions.map((time) => (
                        <option value={time.value}>{time.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>


            </div>
            <div>&nbsp;</div>
            <div><button class="search-btn" type="button" onClick={() => onFindCar()}>
              Find My Ride
              <i class="fas fa-chevron-right"></i>
            </button></div>
          </form>
        </div>
      </section>

      <section class="HomeSection">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-5">
              <h1>
                <span class="colorRed">Drive</span><span> Your Journey </span>
                <br />
                Leave the Rest to Us!
              </h1>
              <p class="Pra_1">
                We have many types of cars that are ready for you to travel
                anywhere and anytime.
              </p>
              <div class="Button">
                <a href="#" onClick={() => routeTo("/contact-us")} class="BtnFill">
                  Get In Touch
                </a>
                <a href="#" onClick={() => routeTo("/carslist")} class="BtnBorderY">
                  Our Cars
                </a>
              </div>
            </div>
            <div class="col-md-7">
              <img src="img/home_car.png" alt="Car" />
              <img src="img/home_car_mob.png" alt="Car" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <TopCars />
      </section>
      {/* <section class="LogoSection">
        <div class="container">
          <img src="img/logo_1.png" alt="Logo" />
          <img src="img/logo_2.png" alt="Logo" />
          <img src="img/logo_3.png" alt="Logo" />
          <img src="img/logo_4.png" alt="Logo" />
          <img src="img/logo_5.png" alt="Logo" />
          <img src="img/logo_6.png" alt="Logo" />
          <img src="img/logo_7.png" alt="Logo" />
          <img src="img/logo_8.png" alt="Logo" />
        </div>
      </section> */}

      {/* <section class="CarSection">
        <div class="container">
          <div class="CustomHeading">
            <h2 class="Head_1">POPULAR CAR</h2>
            <h3 class="Head_2">Choose Your Suitable Car</h3>
            <p class="Pra_1">
              We present popular cars that are rented by customers to maximize
              your comfort on long trips.
            </p>
          </div>
          <div class="row justify-content-md-center">
            <div class="col-md-4">
              <div class="CarBox">
                <div class="Image">
                  <img src="img/car_1.png" alt="car" />
                  <span class="Tag Red">Automatic</span>
                </div>
                <div class="Content">
                  <div class="Heading">
                    <h4 class="Head_3">Swift</h4>
                    <div class="Features">
                      <img src="img/icon/air_conditioning.svg" alt="Icon" />
                      <img src="img/icon/gps_navigation.svg" alt="Icon" />
                      <img src="img/icon/bluetooth.svg" alt="Icon" />
                      <img src="img/icon/camera.svg" alt="Icon" />
                      <img src="img/icon/cruise_control.svg" alt="Icon" />
                    </div>
                  </div>
                  <div class="Price">
                    <h5>
                      $85<span>/Day</span>
                    </h5>
                    <p>
                      <img src="img/icon/car.svg" alt="Car" />
                      Suzuki 2024
                    </p>
                  </div>
                  <a href="#" class="BtnBorder">
                    Booking Details
                  </a>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="CarBox">
                <div class="Image">
                  <img src="img/car_2.png" alt="car" />
                  <span class="Tag Yellow">Manual</span>
                </div>
                <div class="Content">
                  <div class="Heading">
                    <h4 class="Head_3">Nissan Altima</h4>
                    <div class="Features">
                      <img src="img/icon/air_conditioning.svg" alt="Icon" />
                      <img src="img/icon/gps_navigation.svg" alt="Icon" />
                      <img src="img/icon/bluetooth.svg" alt="Icon" />
                      <img src="img/icon/camera.svg" alt="Icon" />
                      <img src="img/icon/cruise_control.svg" alt="Icon" />
                    </div>
                  </div>
                  <div class="Price">
                    <h5>
                      $120<span>/Day</span>
                    </h5>
                    <p>
                      <img src="img/icon/car.svg" alt="Car" />
                      Nissan 2024
                    </p>
                  </div>
                  <a href="#" class="BtnBorder">
                    Booking Details
                  </a>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="CarBox">
                <div class="Image">
                  <img src="img/car_3.png" alt="car" />
                  <span class="Tag Red">Automatic</span>
                </div>
                <div class="Content">
                  <div class="Heading">
                    <h4 class="Head_3">Lexus</h4>
                    <div class="Features">
                      <img src="img/icon/air_conditioning.svg" alt="Icon" />
                      <img src="img/icon/gps_navigation.svg" alt="Icon" />
                      <img src="img/icon/bluetooth.svg" alt="Icon" />
                      <img src="img/icon/camera.svg" alt="Icon" />
                      <img src="img/icon/cruise_control.svg" alt="Icon" />
                    </div>
                  </div>
                  <div class="Price">
                    <h5>
                      $150<span>/Day</span>
                    </h5>
                    <p>
                      <img src="img/icon/car.svg" alt="Car" />
                      Toyota 2024
                    </p>
                  </div>
                  <a href="#" class="BtnBorder">
                    Booking Details
                  </a>
                </div>
              </div>
            </div>
            <a href="#" class="Button BtnFill">
              See All
            </a>
          </div>
        </div>
      </section> */}

      <section class="ServicesSection">
        <div class="container">
          <div class="CustomHeading">

            <h3 class="Head_2 colorRed">Our Services</h3>
            <div>&nbsp;</div>
            <p class="Pra_1">
              Our service is not only renting a car, but we also provide a
              private chauffeur service that can guide you <br />
              on your trip and also longtrip packages to support your travel
              needs.
            </p>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="ServiceBox">
                <img src="img/service_1.png" class="BoxImg" alt="Service" />
                <div class="Content">
                  <div class="Details">
                    <img src="img/icon/airport.svg" alt="Icon" />
                    <h4 class="Head_3">Perth Airport Service</h4>
                    <p class="Pra_1">
                      At TAK8, we offer unbeatable deals on airport car rentals in Perth. With transparent pricing and no hidden fees, you get great value for your money. Choose from budget-friendly options, all backed by excellent customer service.
                    </p>
                    <a onClick={() => routeTo("/services#airport")} class="BtnFillY">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="ServiceBox">
                <img src="img/service_2.png" class="BoxImg" alt="Service" />
                <div class="Content">
                  <div class="Details">
                    <img src="img/icon/vehical.svg" alt="Icon" />
                    <h4 class="Head_3">Vehicle Rental Services</h4>
                    <p class="Pra_1">
                      Professional vehicle rental services like TAK8 offer benefits for personal and business needs. With a focus on quality, reliability, and customer satisfaction, TAK8 provides the right vehicle solutions and a seamless rental experience.
                    </p>
                    <a onClick={() => routeTo("/services#vrs")} class="BtnFillY">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="ServiceBox">
                <img src="img/service_3.png" class="BoxImg" alt="Service" />
                <div class="Content">
                  <div class="Details">
                    <img src="img/icon/seats.svg" alt="Icon" />
                    <h4 class="Head_3">Special Discounts for Extended Rentals</h4>
                    <p class="Pra_1">
                      These special rates are designed to provide exceptional value for customers planning longer stays or extended travel in East Perth and beyond.
                    </p>
                    <a onClick={() => routeTo("/services#dis")} class="BtnFillY">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="AdvantagesSection">
        <div class="container">
          <div class="CustomHeading">
            <h2 class="Head_1">ADVANTAGES</h2>
            <h3 class="Head_2">Why Choose Us ?</h3>
            <p class="Pra_1">
              We present many guarantees and advantages when you rent a car with
              us for your trip. Here are some
              <br />
              of the advantages that you will get
            </p>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/rent.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Easy Rent</h4>
                  <p class="Pra_1">
                    Rent a car at our rental with an easy and fast process
                    without disturbing your productivity
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/premium.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Premium Quality</h4>
                  <p class="Pra_1">
                    Our cars are always maintained engine health and cleanliness
                    to provide a more comfortable driving experience
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/agent.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Professional Agent</h4>
                  <p class="Pra_1">
                    You can ask your travel companion to escort and guide your
                    journey.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/safety.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Car Safety</h4>
                  <p class="Pra_1">
                    We guarantee the safety of the engine on the car always
                    running well with regular checks on the car engine.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/refund.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Refund</h4>
                  <p class="Pra_1">
                    Our service guarantee provides a money back opportunity if
                    the car does not match the information provided.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="Box">
                <img src="img/icon/live.svg" class="BoxImg" alt="Icon" />
                <div class="Content">
                  <h4 class="Head_5">Live Monitoring</h4>
                  <p class="Pra_1">
                    Our service provides direct customer monitoring to monitor
                    trips in terms of safety and comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="TestimonialsSection">
        <div class="container">
          <div class="CustomHeading">
            <h2 class="Head_1">Testimonials</h2>
            {/* <h3 class="Head_2">What They Say ?</h3> */}
            <p class="Pra_1">
              Here are some comments from our customers, be one of them
            </p>
          </div>

          <div class="elfsight-app-05bae60b-f256-4dc0-a0e0-61ba6b980858" data-elfsight-app-lazy></div>
        </div>
      </section>

      <Footer />

    </>
  );
};

export default Home;
