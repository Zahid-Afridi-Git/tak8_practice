import { useEffect } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import mainStore from "../../store/store";
import Footer from "../components/footer";
import moment from "moment";
const ThankYou = () => {
  const { userBooking, setUserBooking, setVisitedRoutes } = mainStore();
  const navigate = useNavigate();

  const GoBackToHome = () => {

    navigate("/");
  };
  const RefreshData = () => {
    setUserBooking({
      car: { rates: [] },
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
    });
    setVisitedRoutes([]);
  }


  useEffect(() => {
    console.log("userBooking", userBooking);
  }, [userBooking]);
  useEffect(() => {
    RefreshData();
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  return (
    <>
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Thank you</h1>
        </div>
      </section>
      <section class="ThankSection">
        <div class="container">
          <img src="img/thankyou.png" alt="Thank You" class="thankyouImg" />
          <h2 class="Head_3">Successfully Submitted</h2>
          <p class="Pra_2">Kindly check your email for further correspondence.</p>
          <a class="BtnFill" onClick={() => GoBackToHome()}>
            Go Back To Home
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ThankYou;
