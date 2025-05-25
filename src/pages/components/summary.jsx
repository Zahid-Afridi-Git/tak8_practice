import { useMemo } from "react";
import mainStore from "../../store/store";
import moment from "moment";

const Summary = () => {
  const { userBooking,getCarImg } = mainStore();

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

  const formatDateTime = (date, time) => {
   
   
    
    return moment(`${date} ${time}`).format("DD MMM YYYY hh:mm A");//+ ` ${time}`;
  };
  const calculateDays = (fromDate, toDate) => {
    const date1 = moment(fromDate);
    const date2 = moment(toDate);

    // Calculate the difference in days
    const diffInDays = date2.diff(date1, 'days');
    return diffInDays;
  };

  return (
    <>
      <div class="Summary">
        <h2 class="Head_3 colorRed">Rental Summary</h2>
        <p class="Pra_x">
          * Prices may change depending on the length of the rental and the price
          of your rental car.
        </p>
        <div class="Details">
          <div class="Image">
            <img src={getCarImg(userBooking.car)} alt="car" />
          </div>
          <div class="Name">
            <h3 class="Head_5">{userBooking.car.name } </h3>
            <h4 class="Head_6 colorYellow">{userBooking.car.type == "limited" ? "150 KM / Day" :"Unlimited KM" } </h4>
            <div class="Icon">
              {/* <div class="Features">
                <img src="img/icon/air_conditioning.svg" alt="Icon" />
                <img src="img/icon/gps_navigation.svg" alt="Icon" />
                <img src="img/icon/bluetooth.svg" alt="Icon" />
                <img src="img/icon/camera.svg" alt="Icon" />
                <img src="img/icon/cruise_control.svg" alt="Icon" />
              </div>
              <div class="Rating">
                <img src="img/icon/star.svg" alt="Star" />
                <img src="img/icon/star.svg" alt="Star" />
                <img src="img/icon/star.svg" alt="Star" />
                <img src="img/icon/star.svg" alt="Star" />
                <img src="img/icon/star_unfill.svg" alt="Star" />
              </div> */}
            </div>
          </div>
        </div>
        <div class="Price">
          <div class="subSummarySection">
            <p>
              Pickup Location <span>{userBooking.booking.pickUpLocation}</span>
            </p>
            <p>
              Drop-off Location <span>{userBooking.booking.returnLocation}</span>
            </p>
            <p>
              Pickup Date & Time{" "}
              <span>

                {formatDateTime(
                  userBooking.booking.pickUpDate,
                  userBooking.booking.pickUpTime
                )}
              </span>
            </p>
            <p>
              Return Date & Time{" "}
              <span>
                {" "}
                {formatDateTime(
                  userBooking.booking.returnDate,
                  userBooking.booking.returnTime
                )}
              </span>
            </p>
            <p>
              Rental Period <span>{userBooking.days} day(s)</span>
            </p>
            <p>
              Daily Rate <span>${userBooking?.rate?.rate?.toFixed(2)}</span>
            </p>
            
            {userBooking?.booking?.pickUpLocation?.toLowerCase().includes("air") || userBooking?.booking?.returnLocation?.toLowerCase().includes("air") ? <p>
              Airport Charges <span>${AirPortAmount.toFixed(2)}</span>
            </p> : ""}

            <p class="colorRed summaryTotal">
              Total Rental Cost<span>${calculateRate.toFixed(2)}</span>
            </p>
          </div>
          {parseFloat(calculateExtra) > 0 ? <div class="subSummarySection">
            {userBooking.extras.map((extra, index) => (
              <p>
                {extra.title}
                <span key={index}>

                  <span>${extra.title === "Damage Waiver" || extra.title === "Child Seat" ? parseFloat(extra.price * (userBooking.days || 1)).toFixed(2) : parseFloat(extra.price).toFixed(2)}</span>

                </span>
              </p>
            ))}

            <p class="colorRed summaryTotal">
              Total Add-On Cost<span>
                ${parseFloat(calculateExtra).toFixed(2)}
              </span>

            </p>
          </div> : ""}

          <div class="subSummarySection">
            <p class="colorRed summaryTotal">
              GST <span>${parseFloat(taxAmount).toFixed(2)}</span>
            </p>
          </div>

          {userBooking.payment_type == 'card' ? (<div class="subSummarySection"><p class="colorYellow">
            1% Discount <span>${parseFloat(discountAmount).toFixed(2)}</span>
          </p></div>) : (<div></div>)

          }
        </div>
        <div class="TotalPrice">
          <div class="Head">
            <h5 class="colorYellow">Total (Incl GST)</h5><span></span>

          </div>
          {userBooking.payment_type == 'card' ? (<div class="makeFlex"><h5 class="Head_3 strikeHeading colorRed">${parseFloat(totalPayment).toFixed(2)}</h5>&nbsp;<h5 class="Head_3">${parseFloat(totalPayment - discountAmount).toFixed(2)}</h5></div>) : (<h5 class="Head_3">${totalPayment.toFixed(2)}</h5>)

          }

        </div>
        <p class="Pra_x">The price includes a rental discount and 10% GST.</p>
      </div>
    </>
  );
};

export default Summary;
