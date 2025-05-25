import Header from "./components/header";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import Loader from "./components/loader";
const Services = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">OUR Services</h1>
          {/* <p class="Head_6">OUR Services</p> */}
        </div>
      </section>
      <section class="ServiceSection">
        <div class="container">
          <div class="CustomHeading">
            <h2 class="Head_1">TAK8, Just Make It!</h2>
            <h3 class="Head_2">Services Offered by TAK8 Car Rental</h3>
            <p class="Pra_1">
              We present many guarantees and advantages when you rent a car with
              us for your trip. Here are some <br />
              of the advantages that you will get
            </p>
          </div>
          <div class="row align-items-center">
            <div class="col-md-6">
              <img class="ImgLeft" src="img/our_service_1.png" alt="Services" />
            </div>
            <div class="col-md-6">
              <div class="Content Left" id="vrs">
                <h4 class="Head_3">Vehicle Rental Options</h4>
                <ul>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Compact Cars
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Sedans
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    SUVs
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />7 Seaters
                  </li>
                </ul>
                <p class="Pra_1">
                  We take pride in our well-maintained fleet of vehicles,
                  ranging from compact cars to spacious SUVs and 7-seaters. Each
                  vehicle is meticulously inspected and cleaned to ensure your
                  safety and comfort on the road.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="Content Right">
                <h4 class="Head_3">Flexible Rental Periods</h4>
                <p class="Pra_1">
                  Choose from a variety of rental periods to suit your needs,
                  whether you need a vehicle for a few hours, a day, a week, two
                  weeks, or longer.
                </p>
                <p class="Pra_1">
                  Enjoy competitive rates and flexible booking options for
                  hassle-free rentals.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <img
                class="ImgRight"
                src="img/our_service_2.png"
                alt="Services"
              />
            </div>
            <div class="col-md-6">
              <img class="ImgLeft" src="img/our_service_3.png" alt="Services" />
            </div>
            <div class="col-md-6">
              <div class="Content Left" id="dis">
                <h4 class="Head_3">Special Discounts for Extended Rentals</h4>
                <ul>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Enjoy a cheaper rate for 7-day hires or longer.
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Savings with discounted rates on hires of 14 days or more.
                  </li>
                </ul>
                <p class="Pra_1">
                  These special rates are designed to provide exceptional value
                  for customers planning longer stays or extended travel in East
                  Perth and beyond.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div id="airport" class="Content Right">
                <h4 class="Head_3">Airport After Hour Pickup</h4>
                <p class="Pra_1">
                  Take advantage of our convenient airport after hours pickup
                  available at Perth Airport.
                </p>
                <p class="Pra_1">
                  Save time and skip the lines by arranging for your rental
                  vehicle to be waiting for you upon arrival.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <img
                class="ImgRight"
                src="img/our_service_4.png"
                alt="Services"
              />
            </div>
            <div class="col-md-6">
              <img class="ImgLeft" src="img/our_service_5.png" alt="Services" />
            </div>
            <div class="col-md-6">
              <div class="Content Left">
                <h4 class="Head_3">Additional Services</h4>
                <ul>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Child seat rentals
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    GPS navigation systems
                  </li>
                  <li>
                    <img src="img/icon/check.svg" alt="Check" />
                    Insurance coverage
                  </li>
                </ul>
                <p class="Pra_1">
                  Ensure the safety and comfort of your little ones with our
                  child seat rental options. Never get lost with our optional
                  GPS navigation systems, available for rent with your vehicle.
                  Stay protected on the road with our comprehensive insurance
                  options tailored to your needs.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="Content Right">
                <h4 class="Head_3">Corporate and Business Rentals</h4>
                <p class="Pra_1">
                  We offer special corporate and business rental packages
                  tailored to the unique requirements of your company.
                  Streamline your business travel arrangements with our
                  convenient booking process and dedicated account management
                  services.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <img
                class="ImgRight"
                src="img/our_service_6.png"
                alt="Services"
              />
            </div>
            <div class="col-md-6">
              <img class="ImgLeft" src="img/our_service_7.png" alt="Services" />
            </div>
            <div class="col-md-6">
              <div class="Content Left">
                <h4 class="Head_3">Local Area Expertise</h4>
                <p class="Pra_1">
                  Our team has extensive knowledge of the Perth area and can
                  provide recommendations for attractions, dining options, and
                  other points of interest. Ask us for insider tips to make the
                  most of your time in Western Australia.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="Content Right">
                <h4 class="Head_3">Customer Support</h4>
                <p class="Pra_1">
                  Our friendly and knowledgeable customer support team is
                  available to assist you with any questions or concerns before,
                  during, and after your rental period. Contact us via phone,
                  email, or visit our office in East Perth for personalized
                  assistance.
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <img
                class="ImgRight"
                src="img/our_service_8.png"
                alt="Services"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Services;
