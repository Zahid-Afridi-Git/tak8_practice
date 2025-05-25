import { useEffect, useState } from "react";
import Header from "../components/header";
import mainStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import Summary from "../components/summary";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import Loader from '../components/loader';
import { useMemo } from "react";
const Extras = () => {
  const [loading, setLoading] = useState(true);

  const {
    getAllExtras,
    userBooking,
    setUserBooking,
    visitedRoutes,
    setVisitedRoutes,
  } = mainStore();
  console.log("extras", userBooking.extras);
  const [allExtras, setAllExtras] = useState([]);
  const navigate = useNavigate();
  const calculateExtra = useMemo(() => {
    return userBooking.extras.reduce((acc, extra) => {
      const isMultiplierApplicable = extra.title === "Damage Waiver" || extra.title === "Child Seat";
      const price = isMultiplierApplicable ? extra.price * (userBooking.days || 1) : extra.price;
      return acc + price;
    }, 0);
  }, [userBooking]);
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
  const [selectedExtras, setSelectedExtras] = useState(userBooking.extras);

  useEffect(() => {
    initializeExtras();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    let booking = { ...userBooking };
    booking.extras = selectedExtras;
    setUserBooking(booking);
  }, [selectedExtras]);

  const initializeExtras = async () => {
    const updatedRoutes = [...visitedRoutes];
    updatedRoutes.push("extras");
    setVisitedRoutes(updatedRoutes);

    const extras = await getAllExtras();
    if (extras) {
      setAllExtras(extras);
    }
  };

  const onSelectingExtra = (e, extra) => {
    const { checked } = e.target;

    const index = selectedExtras.findIndex((ext) => ext._id === extra._id);
    const updatedExtras = [...selectedExtras];

    if (checked && index === -1) {
      updatedExtras.push(extra);
    } else if (!checked && index > -1) {
      updatedExtras.splice(index, 1);
    }


    setSelectedExtras(updatedExtras);
  };

  const onSubmititngExtras = () => {
    let booking = { ...userBooking };
    booking.payment_type = "card";
    setUserBooking(booking);
    navigate("/payment");
  };
  const onSubmititngPayAtCounter = () => {
    let booking = { ...userBooking };
    booking.payment_type = "counter";
    setUserBooking(booking);
    navigate("/payment");
  };

  return (
    <>
    {loading ? <Loader /> : ""}
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Extras</h1>
          <p class="Head_6"></p>
        </div>
      </section>
      <section class="BookingSection">
        <div class="container">
          <Stepper />
          <div class="row">
            <div class="col-md-7">
              <form class="SearchForm" action="thankyou.html">

                <div class="CeckBoxMain">
                  {allExtras.map((extra) => (
                    <div class="CheckBox redBottomLine">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        onClick={(e) => onSelectingExtra(e, extra)}
                        id={extra._id}
                        checked={userBooking.extras.some((item) => item.title === extra.title)}
                      />
                     
                      <span class="roundImage">
                        {extra.title == 'Damage Waiver'
                          ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="7" fill="white"></circle>
                            <polygon points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="white"></polygon>
                          </svg>

                          : ""
                        }
                        {extra.title == 'Child Seat'
                          ? <svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path fill="var(--ci-primary-color, #ffffff)" d="M425.39,200.035A184.3,184.3,0,0,0,290.812,91.289L317.568,48.48,290.432,31.52,255.127,88.008A184.046,184.046,0,0,0,86.61,200.035a71.978,71.978,0,0,0,0,143.93,184.071,184.071,0,0,0,338.78,0,71.978,71.978,0,0,0,0-143.93Zm27.152,99.975a39.77,39.77,0,0,1-27.76,11.961l-20.725.394-8.113,19.074a152.066,152.066,0,0,1-279.887,0l-8.114-19.074-20.725-.394a39.978,39.978,0,0,1,0-79.942l20.725-.394,8.114-19.074a152.067,152.067,0,0,1,279.887,0l8.113,19.074,20.725.394a39.974,39.974,0,0,1,27.76,67.981Z" class="ci-primary"/>
                          <rect width="40" height="40" x="168" y="232" fill="var(--ci-primary-color, #ffffff)" class="ci-primary"/>
                          <rect width="40" height="40" x="304" y="232" fill="var(--ci-primary-color, #ffffff)" class="ci-primary"/>
                          <path fill="var(--ci-primary-color, #ffffff)" d="M256,384a80,80,0,0,0,80-80H176A80,80,0,0,0,256,384Z" class="ci-primary"/>
                        </svg>
                          : ""
                        }
                        {extra.title == 'Extend Area of Use'
                          ?<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.0156C19.2447 16.5445 20 17.2392 20 18C20 19.6568 16.4183 21 12 21C7.58172 21 4 19.6568 4 18C4 17.2392 4.75527 16.5445 6 16.0156" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M17 8.44444C17 11.5372 12 17 12 17C12 17 7 11.5372 7 8.44444C7 5.35165 9.23858 3 12 3C14.7614 3 17 5.35165 17 8.44444Z" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="12" cy="8" r="1" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                          : ""
                        }
                      </span>
                      <div class="makeGrid d-flex">
                        <div
                          class="form-check-label cursor-pointer"
                          for={extra._id}
                        >
                          {extra.title} - ${extra.price} {extra.title == 'Damage Waiver' || extra.title == 'Child Seat' ? " per day" : " flat free"}
                          <div className="tooltip-container">
                            <img src="img/icon/info.svg" alt="Check" height="20px" />
                            <span className="tooltip-text">{extra.description}</span>
                          </div>
                        </div>

                        {/* <label class="descriptionLabel" >
                          {extra.description}
                        </label> */}
                      </div>
                    </div>

                  ))}
                </div>
                <div class="PaymentButtons">
                  <button class="BtnBorderY" onClick={() => onSubmititngPayAtCounter()}>
                    Pay At Counter @ <b>${totalPayment.toFixed(2)}</b>
                  </button>
                  &nbsp;
                  <button class="BtnFill" onClick={() => onSubmititngExtras()}>
                    Pay Now  @ <b>${(totalPayment - discountAmount).toFixed(2)}</b>
                  </button>
                </div>

              </form>
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

export default Extras;
