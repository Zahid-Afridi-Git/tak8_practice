import Header from "./components/header";
import Footer from "./components/footer";
import Loader from "./components/loader";
import { useEffect, useState } from "react";
const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    
  }, []);
  //const handleLoad = () => {setLoading(false)}
  return (
    <>
     {loading ? <Loader /> : ""}
      <Header  />
      <section className={`MainSection`}>
        <div class="container">
          <h1 class="Head_2">About Us</h1>
        </div>
      </section>
      <section >
        <div class="container">
          <div class="AboutInfo">
            <div class="imageBorder"><img src="img/about_banner_u.png" alt="About" loading="lazy" /></div>

            <div class="Content">
              <h2 class="Head_2">About TAK8 Car Rental</h2>
              <p class="Pra_1">
                Welcome to TAK8 Car Rental, your premier choice for car rentals
                in East Perth, Western Australia, and beyond. Founded with a
                commitment to providing unparalleled rental experiences, TAK8 is
                dedicated to serving the local community and travelers alike
                with top-notch service, reliability, and convenience.
              </p>
            </div>
          </div>
          <div class="row RowVision">
            <div class="col-md-6">
              <img src="img/icon/vision.svg" alt="Vision" />
              <h3 class="Head_3">Our Vision</h3>
              <p class="Pra_1">
                At TAK8 Car Rental, our vision is clear: to become the go-to
                destination for car rentals in East Perth and throughout Western
                Australia. We aim to set new standards of excellence in the
                industry by offering a wide selection of vehicles, transparent
                pricing, and exceptional customer service.
              </p>
            </div>
            <div class="col-md-6">
              <img src="img/icon/mission.svg" alt="Mission" />
              <h3 class="Head_3">Our Mission</h3>
              <p class="Pra_1">
                TAK8 Car Rental is on a mission to make car rental simple,
                affordable, and enjoyable. Whether you're exploring the sights
                of Perth, embarking on a road trip across Western Australia, or
                in need of temporary transportation, we're here to meet your
                needs with professionalism and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section >
        <div class="container">
          <div class="CustomHeading">
            <h2 class="Head_1">Why Choose US</h2>
            <h3 class="Head_2">Why Choose TAK8 Car Rental?</h3>
            <p class="Pra_1">
              We present many guarantees and advantages when you rent a car with
              us for your trip. Here are some
              <br />
              of the advantages that you will get
            </p>
          </div>
          <div class="row align-items-center RowChoose">
            <div class="col-md-4 ">
              <div class="imageBorder PaddingBottom">
                <img src="img/whychoose.png" alt="Choose" />
              </div>

            </div>
            <div class="col-md-8">
              <ul>
                <li>
                  <span class="Icon ">
                    <img src="img/icon/local.svg" alt="Loacal" />
                  </span>
                  <span class="Text">
                    <span class="Head_4">Local Expertise</span>
                    <span class="Pra_1">
                      As a locally owned and operated business, we understand
                      the unique needs of our customers. Count on us for
                      personalized service, insider tips, and recommendations to
                      make the most of your journey.
                    </span>
                  </span>
                </li>
                <li>
                  <span class="Icon">
                    <img src="img/icon/quality.svg" alt="Quality" />
                  </span>
                  <span class="Text">
                    <span class="Head_4">Quality Fleet</span>
                    <span class="Pra_1">
                      We take pride in our well-maintained fleet of vehicles,
                      ranging from compact cars to spacious SUVs and 7-seaters.
                      Each vehicle is meticulously inspected and cleaned to
                      ensure your safety and comfort on the road.
                    </span>
                  </span>
                </li>
                <li>
                  <span class="Icon">
                    <img src="img/icon/convenience.svg" alt="Convenience" />
                  </span>
                  <span class="Text">
                    <span class="Head_4">Convenience</span>
                    <span class="Pra_1">
                      Located in the heart of WA East Perth, our rental office
                      is easily accessible and conveniently situated for your
                      convenience. Plus, enjoy flexible booking options,
                      extended hours, and hassle-free returns to accommodate
                      your busy schedule.
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
