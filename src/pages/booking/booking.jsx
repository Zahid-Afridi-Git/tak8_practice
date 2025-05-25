import Header from "../components/header";
import Loader from '../components/loader';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import mainStore from "../../store/store";
import Summary from "../components/summary";
import { useEffect, useState } from "react";
import moment from "moment";
import Footer from "../components/footer";
import Stepper from "../components/stepper";
import { timeOptions, driverAge } from "../../utils/constants";

const validationSchema = Yup.object().shape({
  pickUpLocation: Yup.string().required("Pick-up location is required"),
  returnLocation: Yup.string().required("Drop-off location is required"),
  pickUpDate: Yup.date()
    .required(" Pick-up date is required")
    .typeError("Invalid date format"),
  pickUpTime: Yup.string().required("Pick-up time is required"),
  returnDate: Yup.date()
    .required("Return date is required")
    .typeError("Invalid date format"),
  returnTime: Yup.string().required("Return time is required"),
  driverAge: Yup.number()
    .min(21, "Driver must be at least 21 years old")
    .typeError("Driver age must be a number")
    .required("Driver age is required"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms"),
});

const Booking = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const { userBooking, setUserBooking, visitedRoutes, setVisitedRoutes } =
    mainStore();

  const [initialValues, setInitialValues] = useState(userBooking.booking);

  useEffect(() => {
    const updatedRoutes = [...visitedRoutes];
    updatedRoutes.push("booking");
    setVisitedRoutes(updatedRoutes);
    findRate();
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const [toastMessage, setToastMessage] = useState(false);

  useEffect(() => {
    setInitialValues(userBooking.booking);
  }, [userBooking]);
  const changeLocation = (e, setFieldValue) => {
    //console.log("returnLocation", e.target.name);
    if (e.target.name === "returnLocation") {
      userBooking.booking.returnLocation = e.target.value
    }
    if (e.target.name === "pickUpLocation") {
      userBooking.booking.pickUpLocation = e.target.value
    }

    setUserBooking({ ...userBooking });
    setFieldValue(e.target.name, e.target.value);


  };

  const onSelectingPickUpDate = (e, setFieldValue) => {
    setFieldValue("pickUpDate", e.target.value);
    userBooking.booking.pickUpDate = e.target.value;
    const pickUpDateTime = moment(
      `${e.target.value}T${moment().format("hh:mm")}`
    );
    const returnDateTime = pickUpDateTime.add(7, "days");
    setFieldValue("returnDate", returnDateTime.format("YYYY-MM-DD"));
    //setFieldValue("returnTime", returnDateTime.format("HH:mm"));

    findRate();
  };
  const onSelectingPickUpTime = (e, setFieldValue) => {
    setFieldValue("pickUpTime", e.target.value);
    userBooking.booking.pickUpTime = e.target.value;
    findRate();
  };
  const onSelectingReturnTime = (e, setFieldValue) => {
    setFieldValue("returnTime", e.target.value);
    userBooking.booking.returnTime = e.target.value;
    findRate();
  };

  const onSelectingReturnDate = (e, setFieldValue, values) => {
    setFieldValue("returnDate", e.target.value);
    userBooking.booking.returnDate = e.target.value;
    findRate();
  };

  const findRate = () => {
    // console.log(userBooking.booking.pickUpDate,userBooking.booking.pickUpTime);
    // console.log(userBooking.booking.returnDate,userBooking.booking.returnTime);

    const startDateTime = moment(`${userBooking.booking.pickUpDate} ${userBooking.booking.pickUpTime}`, "YYYY-MM-DD hh:mm A");
    const endDateTime = moment(`${userBooking.booking.returnDate} ${userBooking.booking.returnTime}`, "YYYY-MM-DD hh:mm A");
    console.log('startDateTime', startDateTime, 'endDateTime', endDateTime);
    const durationInHours = endDateTime.diff(startDateTime, "hours");
    //console.log('durationInHours',durationInHours);
    // console.log('durationInHours',durationInHours);
    const inclusiveDays = durationInHours < 24 ? 1 : Math.ceil(durationInHours / 24);
    console.log('userBooking', userBooking);

    const rates =
      userBooking.car.type === "limited"
        ? userBooking.car.rates
        : userBooking.car.unlimedRates;

    const rate = rates.find(
      (rate) =>
        inclusiveDays >= rate.minDays &&
        (rate.maxDays === null || inclusiveDays <= rate.maxDays)
    );

    if (rate) {
      setUserBooking({ ...userBooking, rate: rate, days: inclusiveDays });
    }
  };

  const handleSubmit = async (values, validateForm) => {
    //chekc Overlapping

    const formValidated = await validateForm();
    console.log("handleSubmit ~ formValidated:", formValidated);
    if (Object.keys(formValidated).length) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    let booking = { ...userBooking };
    booking.booking = values;
    setUserBooking(booking);

    navigation("/rental-form");
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Book Your Car</h1>
        </div>
        {toastMessage && (
          <div id="toast-container" class="toast-container">Reservations are full. Kindly select an alternative date and time.</div>
        )}
      </section>

      <section class="BookingSection">
        <div class="container">
          <Stepper />
          <div class="row">
            <div class="col-md-7">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, validateForm, setFieldValue }) => (
                  <Form class="SearchForm" action="rental.html">
                    <div class="form-grid">
                      <div class="form-field location-field">
                        <label for="PickupLocation" class="form-label">
                          <i class="fas fa-map-marker-alt"></i>Pickup Location

                        </label>

                        <div className={`input-container tooltip-wrapper ${errors.pickUpLocation ? 'error' : ''}`}
                          data-tooltip={errors.pickUpLocation ? 'Drop-off location is required' : ''}>
                          <Field
                            key="asd123"
                            name="pickUpLocation"
                            as="select"
                            className={`form-control ${errors.pickUpLocation && touched.pickUpLocation
                              ? "error"
                              : ""
                              }`}
                            onChange={(e) =>
                              changeLocation(e, setFieldValue)
                            }
                            value={userBooking.booking.pickUpLocation}
                          >
                            <option value="">Select Location</option>
                            <option value="East Perth">East Perth</option>
                            <option value="Crown Plaza">Crown Plaza</option>
                            <option value="Perth Airport">Perth Airport</option>
                          </Field>

                        </div>
                      </div>
                      <div class="form-field datetime-field">
                        <label for="PickupDateTime" class="form-label">
                          Pickup Date & Time
                        </label>
                        <div class="datetime-group">
                          <div class="input-container">
                            <Field
                              name="pickUpDate"
                              type="date"
                              className={`form-control ${errors.pickUpDate && touched.pickUpDate
                                ? "error"
                                : "form-control"
                                }`}
                              onChange={(e) =>
                                onSelectingPickUpDate(e, setFieldValue)
                              }
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div class="input-container time-input">
                            <Field
                              name="pickUpTime"
                              as="select"
                              className={`form-control ${errors.pickUpTime && touched.pickUpTime
                                ? "error"
                                : "form-control"
                                }`}
                              onChange={(e) =>
                                onSelectingPickUpTime(e, setFieldValue)
                              }
                            >
                              {timeOptions.map((time) => (
                                <option value={time.value}>{time.label}</option>
                              ))}
                            </Field>
                          </div>
                        </div>
                      </div>
                      <div class="form-field location-field">
                        <label for="returnLocation" class="form-label">
                          <i class="fas fa-map-marker-alt"></i>Drop-off Location

                        </label>
                        <div className={`input-container tooltip-wrapper ${errors.returnLocation ? 'error' : ''}`}
                          data-tooltip={errors.returnLocation ? 'Drop-off location is required' : ''}>
                          <Field
                            name="returnLocation"
                            as="select"
                            className={`form-control ${errors.returnLocation && touched.returnLocation
                              ? "error"
                              : ""
                              }`}
                            onChange={(e) =>
                              changeLocation(e, setFieldValue)
                            }
                            value={userBooking.booking.returnLocation}
                          >
                            <option value="">Select Location</option>
                            <option value="East Perth">East Perth</option>
                            <option value="Crown Plaza">Crown Plaza</option>
                            <option value="Perth Airport">Perth Airport</option>
                          </Field>

                        </div>
                      </div>
                      <div class="form-field datetime-field">
                        <label for="PickupDateTime" class="form-label">
                          Drop-off Date & Time
                        </label>
                        <div class="datetime-group">
                          <div class="input-container">
                            <Field
                              name="returnDate"
                              type="date"
                              placeholder="Return Date"
                              className={`form-control ${errors.returnDate && touched.returnDate
                                ? "error"
                                : "form-control"
                                }`}
                              onChange={(e) =>
                                onSelectingReturnDate(e, setFieldValue, values)
                              }
                              min={userBooking.booking.pickUpDate}
                            />
                          </div>
                          <div class="input-container time-input">
                            <Field
                              name="returnTime"
                              as="select"
                              placeholder="Pickup Time"
                              className={`form-control ${errors.returnTime && touched.returnTime
                                ? "error"
                                : "form-control"
                                }`}
                              onChange={(e) =>
                                onSelectingReturnTime(e, setFieldValue, values)
                              }

                            >
                              {timeOptions.map((time) => (
                                <option value={time.value}>{time.label}</option>
                              ))}
                            </Field>
                          </div>
                        </div>
                      </div>

                      <div class="form-field">
                        <label for="DriverAge" class="form-label">
                          Driver's Age
                        </label>
                        <div class="input-container">
                          <Field
                            name="driverAge"
                            as="select"
                            className={`form-control ${errors.driverAge && touched.driverAge
                              ? "error"
                              : "form-control"
                              }`}
                          >
                            {driverAge.map((time) => (
                              <option value={time.value}>{time.label}</option>
                            ))}
                          </Field>
                        </div>
                      </div>
                    </div>
                    <div class="CheckBox">
                      <Field
                        name="agreeToTerms"
                        type="checkbox"
                        className={`form-check-input ${errors.agreeToTerms && touched.agreeToTerms
                          ? "error"
                          : ""
                          }`}
                      ></Field>
                      <label class="form-check-label" for="agreeToTerms">
                        I agree to the
                      </label>
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="anchor"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default navigation
                          window.open("/privacy-policy", "_blank");
                        }}
                      > Privacy Policy</a>
                    </div>
                    <button
                      class="BtnFill"
                      type="submit"
                      onClick={() => handleSubmit(values, validateForm)}
                    >
                      Next
                    </button>
                  </Form>
                )}
              </Formik>
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

export default Booking;
