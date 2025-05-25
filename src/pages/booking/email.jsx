import axios from "axios";
import Summary from "../components/summary";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
const generateOrderNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
}
const getCustomerHTML = (customer) => {

  let customerHTML = "";


  customerHTML += `
      <tr>
        <td style="padding: 5px;">Name</td>
        <td style="padding: 5px; text-align: right;">${customer.firstName + ' ' + customer.lastName}</td>
      </tr>
       <tr>
        <td style="padding: 5px;">Email</td>
        <td style="padding: 5px; text-align: right;">${customer.email}</td>
      </tr>
      <tr>
        <td style="padding: 5px;">Contact</td>
        <td style="padding: 5px; text-align: right;">${customer.contact}</td>
      </tr>
      <tr>
        <td style="padding: 5px;">License</td>
        <td style="padding: 5px; text-align: right;">${customer.licenseNumber}</td>
      </tr>
       <tr>
        <td style="padding: 5px;">Address</td>
        <td style="padding: 5px; text-align: right;">${customer.address}</td>
      </tr>
    `;



  return `
  <h2 style="color: #c81d1d; margin-bottom: 5px;">Customer Information</h2>
    <table style="width: 100%; font-size: 14px; margin-top: 10px; border: 2px dashed #f3c17c;">
        ${customerHTML}
    </table>
  `;

}
const getAirportChargesHTML = (pickUpLocation, returnLocation) => {
  let airportChargesHTML = "";
  let airPortCharges = 0;
  let isAirPort = false;
  if (pickUpLocation.toLowerCase().includes("air")) {
    isAirPort = true;
    airPortCharges += 50;
  }
  if (returnLocation.toLowerCase().includes("air")) {
    isAirPort = true;
    airPortCharges += 50;
  }
  if (isAirPort) {
    airportChargesHTML += ` <tr>
    <td style="padding: 5px;">Airport Charges</td>
    <td style="padding: 5px;text-align: right;">$`+ airPortCharges.toFixed(2) + `</td>
  </tr>`
  }

  return airportChargesHTML;

}
const getdiscountHTML = (payment_type, discountAmount) => {
  let discountHTML = "";
  if (payment_type == 'card') {
    discountHTML += ` <div style="border: 2px dashed #f3c17c; padding: 10px; margin-top: 10px;">
        <strong style="font-size: 16px; color: #ff9900;">1% Discount</strong>
        <span style="float: right; font-size: 16px; color: #ff9900;"><strong>$${discountAmount}</strong></span>
      </div>`
  }
  return discountHTML;

}
const generateExtrasHTML = (extras, calculateExtra, days) => {
  let extrasHTML = "";

  extras.forEach((item) => {
    extrasHTML += `
      <tr>
        <td style="padding: 5px;">${item.title}</td>
        <td style="padding: 5px; text-align: right;">$${item.title === "Damage Waiver" || item.title === "Child Seat" ? parseFloat(item.price * (days || 1)).toFixed(2) : parseFloat(item.price).toFixed(2)}</td>
      </tr>
    `;

  });

  return `
    <table style="width: 100%; font-size: 14px; margin-top: 10px; border: 2px dashed #f3c17c;">
      
        ${extrasHTML}
        <tr>
          <td colspan="2">
            <div style="background-color: #fbe7c3; padding: 10px; margin-top: 10px;">
              <strong style="font-size: 16px; color: #c81d1d;">Total Add-On Cost</strong>
              <span style="float: right; font-size: 16px; color: #c81d1d;"><strong>$${calculateExtra.toFixed(2)}</strong></span>
            </div>
          </td>
        </tr>
     
    </table>
    
  `;
};
const getSummaryHTML = (data, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra,orderNumber) => {
  const { car, rate, booking, customer, extras, payment_type, days } = data;
  // Convert React Component to static HTML string

console.log('emaildats',booking);


  return `<html>
  <head>
    <meta charset="UTF-8" />
    <title>Rental Summary</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    
    <div style="max-width: 600px; background-color: #fff; border: 1px solid #f3c17c; border-radius: 8px; padding: 20px; margin: 0 auto;">
    <table style="width: 100%; font-size: 14px; border: 2px dashed #f3c17c;">
    <tr>
      <td style="padding: 2px;text-align: center;" colspan><h3 style="color: #c81d1d; margin-bottom: 5px;">Order # `+ orderNumber + `</h3></td>
     
    </tr>
    </table>  
    <p>Dear ${customer.firstName} ${customer.lastName},</p>
      <p>Thank you for choosing TAK8 car rental for your rental needs for your booking</p>
      <!-- Title -->
      <h2 style="color: #c81d1d; margin-bottom: 5px;">Rental Summary</h2>
      <p style="font-size: 12px; color: #777;">* Prices may change depending on the length of the rental and the price of your rental car.</p>

      <!-- Car Image & Name -->
      <div style="display: flex; align-items: center; margin: 15px 0;">
        <h3 style="margin: 0; font-size: 20px; color: #222;">${car.name}</h3>
      </div>

      <!-- Rental Details -->
      <table style="width: 100%; font-size: 14px; border: 2px dashed #f3c17c;">
        <tr>
          <td style="padding: 5px;">Pickup Location</td>
          <td style="padding: 5px;text-align: right;">${booking.pickUpLocation}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Pickup Date & Time & Time</td>
          
          <td style="padding: 5px;text-align: right;">${moment(`${booking.pickUpDate}`).format("DD MMM YYYY")} ${booking.pickUpTime}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Drop-off Location</td>
          <td style="padding: 5px;text-align: right;">${booking.returnLocation}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Return Date & Time</td>
          <td style="padding: 5px;text-align: right;">${moment(`${booking.returnDate}`).format("DD MMM YYYY")} ${booking.returnTime}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Daily Rate</td>
          <td style="padding: 5px;text-align: right;">$${rate.rate.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Rental Period</td>
          <td style="padding: 5px;text-align: right;">${days} days</td>
        </tr>
        `+ getAirportChargesHTML(booking.pickUpLocation, booking.returnLocation) + `
        <tr>
          <td colspan="2">
          <!-- Total Cost -->
            <div style="background-color: #fbe7c3; padding: 10px; margin-top: 10px;">
              <strong style="font-size: 16px; color: #c81d1d;">Total Rental Cost</strong>
              <span style="float: right; font-size: 16px; color: #c81d1d;"><strong>$${calculateRate.toFixed(2)}</strong></span>
            </div>
          <td>
        </tr>
      </table>

     

      <!-- Extras -->
      
      `+ generateExtrasHTML(extras, calculateExtra, days) + `

      <!-- GST -->
      <div style="border: 2px dashed #f3c17c;background-color: #fbe7c3; padding: 10px; margin-top: 10px;">
        <strong style="font-size: 16px; color: #c81d1d;">GST</strong>
        <span style="float: right; font-size: 16px; color: #c81d1d;"><strong>$${taxAmount.toFixed(2)}</strong></span>
      </div>
      `+ getdiscountHTML(payment_type, discountAmount) + `
      <!-- Grand Total -->
      <div style="border-top: 2px solid #f3c17c; padding-top: 10px; margin-top: 15px; text-align: center;">
        
        <p style="font-size: 24px; color: #ff9900; font-weight: bold; margin: 5px 0;"><strong style="font-size: 20px; color: #ff9900 ;">Total (Incl GST)</strong> $${payment_type == 'card' ? (totalPayment - discountAmount).toFixed(2) : totalPayment.toFixed(2)}</p>
        <p style="font-size: 12px; color: #777;">The price includes a rental discount and 10% GST.</p>
      </div>
      
    </div>
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="font-size: 18px; font-weight: bold;">Important Information</h2>
    <ul style="list-style-type: none; padding-left: 10px;">
        <li style="margin-bottom: 8px;display:flex;">
            <div style="font-weight: bold; margin-right: 6px;margin-left: 10px;">➢</div>
            <div>Your booking is confirmed. Please bring a valid driver’s license and credit card for verification.</div>
            
        </li>
        <li style="margin-bottom: 8px;display:flex;">
            <div style="font-weight: bold; margin-right: 6px;margin-left: 10px;">➢</div>
            <div>The vehicle must be returned with the same fuel level as at pickup.</div>
            
        </li>
        <li style="margin-bottom: 8px;display:flex;">
            <div style="font-weight: bold; margin-right: 6px;margin-left: 10px;">➢</div>
            <div>Late returns may incur additional charges.</div>
            
        </li>
    </ul>
    
    <p style="margin-top: 15px;">
        For any assistance, feel free to contact us at 
        <a href="tel:+61409521554" style="color: #0073e6; text-decoration: none;">+61 409 521 554</a> or email 
        <a href="mailto:bookings@tak8.com.au" style="color: #0073e6; text-decoration: none;">bookings@tak8.com.au</a>.
    </p>

    <p>We look forward to serving you and wish you a great journey!</p>

    <p style="margin-top: 20px; font-weight: bold;">Best regards, <br> TAK8 Car Rental Team</p>
</div>
  </body>
</html>
`
};
const getOrderHTML = (data, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra,orderNumber) => {
  const { car, rate, booking, customer, extras, payment_type, days } = data;
  // Convert React Component to static HTML string



  return `<html>
  <head>
    <meta charset="UTF-8" />
    <title>Rental Summary</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; background-color: #fff; border: 1px solid #f3c17c; border-radius: 8px; padding: 20px; margin: 0 auto;">
    <table style="width: 100%; font-size: 14px; border: 2px dashed #f3c17c;">
    <tr>
      <td style="padding: 2px;text-align: center;" colspan><h3 style="color: #c81d1d; margin-bottom: 5px;">Order # `+ orderNumber + `</h3></td>
     
    </tr>
    </table>  
    <p>Dear Tak8,</p>
      <p>A new booking has been received through TAK8 car rental. Please find the details below:</p>
      `+ getCustomerHTML(customer) + `
      

      
      <!-- Title -->
      <h2 style="color: #c81d1d; margin-bottom: 5px;">Order Summary</h2>
      <!-- Car Image & Name -->
      <div style="display: flex; align-items: center; margin: 15px 0;">
        <h3 style="margin: 0; font-size: 20px; color: #222;">${car.name}</h3>
      </div>

      <!-- Rental Details -->
      <table style="width: 100%; font-size: 14px; border: 2px dashed #f3c17c;">
        <tr>
          <td style="padding: 5px;">Pickup Location</td>
          <td style="padding: 5px; font-weight: bold; text-align: right;">${booking.pickUpLocation}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Pickup Date & Time</td>
          <td style="padding: 5px;text-align: right;">${moment(`${booking.pickUpDate}`).format("DD MMM YYYY")} ${booking.pickUpTime}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Drop-off Location</td>
          <td style="padding: 5px; font-weight: bold; text-align: right;">${booking.returnLocation}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Return Date & Time</td>
          <td style="padding: 5px;text-align: right;">${moment(`${booking.returnDate}`).format("DD MMM YYYY")} ${booking.returnTime}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Daily Rate</td>
          <td style="padding: 5px; font-weight: bold; text-align: right;">$${rate.rate.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Rental Period</td>
          <td style="padding: 5px; font-weight: bold; text-align: right;">${days} days</td>
        </tr>
        `+ getAirportChargesHTML(booking.pickUpLocation, booking.returnLocation) + `
        <tr>
          <td colspan="2">
          <!-- Total Cost -->
            <div style="background-color: #fbe7c3; padding: 10px; margin-top: 10px;">
              <strong style="font-size: 16px; color: #c81d1d;">Total</strong>
              <span style="float: right; font-size: 16px; color: #c81d1d;"><strong>$${calculateRate.toFixed(2)}</strong></span>
            </div>
          <td>
        </tr
      </table>

     

      <!-- Extras -->
      
      `+ generateExtrasHTML(extras, calculateExtra, days) + `

      <!-- GST -->
      <div style="border: 2px dashed #f3c17c;background-color: #fbe7c3; padding: 10px; margin-top: 10px;">
        <strong style="font-size: 16px; color: #c81d1d;">GST</strong>
        <span style="float: right; font-size: 16px; color: #c81d1d;"><strong>$${taxAmount.toFixed(2)}</strong></span>
      </div>
      `+ getdiscountHTML(payment_type, discountAmount) + `
      <!-- Grand Total -->
      <div style="border-top: 2px solid #f3c17c; padding-top: 10px; margin-top: 15px; text-align: center;">
        
        <p style="font-size: 24px; color: #ff9900; font-weight: bold; margin: 5px 0;"><strong style="font-size: 20px; color: #ff9900 ;">Total (Incl GST)</strong> $${payment_type == 'card' ? (totalPayment - discountAmount).toFixed(2) : totalPayment.toFixed(2)}</p>
        <p style="font-size: 12px; color: #777;">The price includes a rental discount and 10% GST.</p>
      </div>
      
    </div>
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);">
    

    <p style="margin-top: 20px; font-weight: bold;">Best regards, <br> TAK8 Car Rental Team</p>
</div>
  </body>
</html>
`
};
// sendBookingEmail(userBooking,totalPayment,discountAmount,taxAmount);
const sendBookingEmail = async (data, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra) => {
  console.log('discountAmount',discountAmount);
  
  const newendpoint = "https://api.tak8.com.au/email/send";
  const { car, rate, booking, customer, extras, payment_type } = data;

  const extrasList = extras
    .map((extra) => `<li>${extra.title}: $${extra.price}</li>`)
    .join("");

  let orderNumber = generateOrderNumber();
  const customerEmailData = {
    to: customer.email,
    subject: "Your Booking Confirmation for " + car.name + " | " + (car.type == "limited" ? "150 KM / Day" :"Unlimited KM" )+ " | " + (payment_type == 'card' ? 'Online Payment' : 'Pay At Counter') + " | " + "Order # " + orderNumber,
    html: getSummaryHTML(data, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra, orderNumber),
  };
  const orderEmailData = {
    to: 'bookings@tak8.com.au',
    subject: "New Booking Received: " + car.name + " | " + (car.type == "limited" ? "150 KM / Day" :"Unlimited KM") + " | " + (payment_type == 'card' ? 'Online Payment' : 'Pay At Counter') + " | " + "Order # " + orderNumber,
    html: getOrderHTML(data, calculateRate, totalPayment, discountAmount, taxAmount, calculateExtra,orderNumber),
  };

  try {
    const response = await axios.post(newendpoint, customerEmailData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
  try {
    const response = await axios.post(newendpoint, orderEmailData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};


const sendBookingEmailToAdmin = async (data) => {
  const apiKey =
    "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";
  console.log("sendBookingEmail ~ apiKey:", apiKey);
  const endpoint = "https://api.brevo.com/v3/smtp/email";
  const { car, rate, booking, customer, extras, payment_type } = data;

  const extrasList = extras
    .map((extra) => `<li>${extra.title}: $${extra.price}</li>`)
    .join("");

  const emailData = {
    sender: { name: "Tak8", email: "naqsshali@gmail.com" }, // Replace with your domain email
    to: [
      {
        email: 'info@tak8.com.au',
        name: `${customer.firstName} ${customer.lastName}`,
      },
    ],
    subject: "Your Booking Confirmation for" + car.name + " | " + (payment_type == 'card' ? 'Online Payment' : 'Pay At Counter'),
    htmlContent: getSummaryHTML,
  };

  try {
    const response = await axios.post(endpoint, emailData, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};

export default sendBookingEmail;
