import Header from "./components/header";
import Footer from "./components/footer";
import Loader from './components/loader';

import { useEffect, useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const defaultForm = {
    first_name: "",
    last_name: "",
    contact_no: "",
    email: "",
    message: "",
  }
  const [formData, setFormData] = useState(defaultForm);

  const [status, setStatus, ,] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Contact TAK8 | Perth Car Rental Support";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Need help with your Perth car rental? Contact TAK8 for fast support, quotes, and friendly service.');
    }
    
    // Set or create Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Talk to TAK8 – Perth Car Hire Help');
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Reach out to our Perth team for quick answers, quotes, or friendly support');
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');

    setTimeout(() => setLoading(false), 500);
  }, []);
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setErrors({ ...errors, [e.target.id]: "" }); // Clear error on change
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.contact_no.trim()) newErrors.contact_no = "Contact number is required";
    if (!formData.message.trim()) newErrors.message = "Comments are required";

    return newErrors;

  }
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {

      const emailEndpoint = "https://api.tak8.com.au/email/send";


      const customerEmailData = {
        to: 'ammad@anata.digital',
        subject: "New Contact Form Submission from " + formData.first_name + " " + formData.last_name,
        html: `<!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Contact Form Submission</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      background: #ffffff;
                      margin: 20px auto;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      background: #e02935;
                      color: white;
                      padding: 15px;
                      border-radius: 8px 8px 0 0;
                  }
                  .content {
                      padding: 20px;
                      color: #333;
                      line-height: 1.6;
                  }
                  .footer {
                      text-align: center;
                      padding: 15px;
                      font-size: 12px;
                      color: #777;
                  }
                  .details {
                      background: #f9f9f9;
                      padding: 15px;
                      border-radius: 5px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h2>New Contact Form Submission</h2>
                  </div>
                  <div class="content">
                      <p><strong>A new contact form submission has been received:</strong></p>
                      <div class="details">
                          <p><strong>First Name:</strong> `+ formData.first_name + `</p>
                          <p><strong>Last Name:</strong> `+ formData.last_name + `</p>
                          <p><strong>Contact Number:</strong> `+ formData.contact_no + `</p>
                          <p><strong>Email:</strong> `+ formData.email + `</p>
                          <p><strong>Message:</strong> `+ formData.message + `</p>
                      </div>
                      <p>Please follow up with the customer as soon as possible.</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2025 Your Company | Internal Notification</p>
                  </div>
              </div>
          </body>
          </html>
          `
      };


      try {
        setLoading(true);
        const response = await axios.post(emailEndpoint, customerEmailData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        setIsEmailSent(true);
        setFormData(defaultForm);
        setTimeout(() => setIsEmailSent(false), 5000);
        console.log("Email sent successfully:", response.data);
        
      } catch (error) {
        console.error(
          "Error sending email:",
          error.response ? error.response.data : error.message
        );
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
    }


  };
  return (
    <>
      {loading ? <Loader /> : ""}
      <Header />
      <section class="MainSection">
        <div class="container">
          <h1 class="Head_2">Contact Us</h1>

        </div>
      </section>
      <section>
        <div class="container">
          <div class="row ContactRow">
            <div class="col-md-5">
              <div class="CustomHeading">
                <h2 class="Head_1">GET IN TOUCH</h2>

                <p class="Pra_1">
                  For customized rental solutions, please email us or give us a call—we're happy to assist you!
                </p>
              </div>
              <ul class="ContactInfo">
                <li>
                  <img src="img/icon/call.svg" alt="Call" />
                  +61 893 415 334
                </li>
                <li>
                  <img src="img/icon/mail.svg" alt="Mail" />
                  info@tak8.com.au
                </li>
                <li>
                  <img src="img/icon/pin.svg" alt="Pin" />
                  17 Regal Place East Perth
                </li>
                <li>
                  <img src="img/icon/date.svg" alt="Date" />
                  Mon - Fri: 9:00 AM - 5:00 PM
                </li>
              </ul>
              <ul class="ContactIcon">
                {/* <li>
                  <a href="#">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M12.4651 15.4973C12.4651 13.6862 12.4725 11.9066 12.4591 10.1272C12.4563 9.75911 12.4156 9.38175 12.3249 9.02576C11.9373 7.50438 10.241 7.60136 9.55104 8.29289C9.1237 8.72117 8.92928 9.22175 8.93337 9.82842C8.945 11.5851 8.93557 13.3419 8.93447 15.0986C8.93447 15.2243 8.93447 15.35 8.93447 15.5003H5.56543V5.41296H8.91137V6.79021C9.11474 6.55038 9.26782 6.37215 9.41855 6.19172C10.7773 4.5652 14.6983 4.60999 15.5833 7.82626C15.7476 8.43158 15.8362 9.05496 15.8468 9.68209C15.8805 11.5551 15.8591 13.4288 15.8583 15.3024C15.8583 15.3587 15.8483 15.4151 15.8404 15.4976L12.4651 15.4973Z" />
                      <path d="M0.333984 15.4956V5.40686H3.67159V15.4956H0.333984Z" />
                      <path d="M0.13379 2.25639C0.134733 1.21217 0.922298 0.489987 2.04982 0.499731C3.13427 0.509161 3.92624 1.26231 3.92404 2.28248C3.92184 3.27609 3.10975 4.01132 2.00345 4.02154C0.91774 4.03144 0.133004 3.2904 0.13379 2.25639Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg width="20" height="16" viewBox="0 0 20 16">
                      <path d="M6.32802 12.2533C4.6042 12.0976 3.45315 11.2264 2.80805 9.61269C3.38468 9.68097 3.91917 9.69551 4.47224 9.54219C2.2167 8.96722 1.41589 6.95076 1.51749 5.79345C2.02731 6.05112 2.55609 6.2221 3.18646 6.23738C2.23823 5.54737 1.69565 4.66338 1.55356 3.55576C1.4481 2.72864 1.61356 1.94366 2.04056 1.19991C4.08721 3.60858 6.67165 4.93872 9.8075 5.1489C9.79407 4.76829 9.76186 4.40939 9.77217 4.05178C9.81634 2.50814 11.0094 1.02433 12.5073 0.642604C13.9112 0.284441 15.1435 0.600947 16.2044 1.59212C16.2572 1.64126 16.3641 1.67071 16.435 1.65617C17.1655 1.50713 17.8683 1.24528 18.5183 0.880029C18.5648 0.854078 18.6132 0.831624 18.6957 0.789845C18.4084 1.67329 17.8704 2.32151 17.1416 2.8317C17.8479 2.76416 18.5138 2.56391 19.1626 2.29704L19.2029 2.34176C18.8987 2.69808 18.6097 3.06894 18.2854 3.40594C18.0278 3.673 17.7239 3.89404 17.45 4.14583C17.3893 4.20104 17.3346 4.3008 17.3344 4.38012C17.3302 8.28034 15.7943 11.4138 12.6198 13.6981C11.2806 14.6625 9.75082 15.1835 8.11516 15.3987C6.56913 15.6011 5.04611 15.504 3.54702 15.0729C2.60585 14.8014 1.70749 14.399 0.878282 13.8775C0.850303 13.8563 0.823456 13.8336 0.797852 13.8096C1.80719 13.9031 2.76903 13.8357 3.71377 13.5703C4.66238 13.3051 5.55031 12.8577 6.32802 12.2533Z" />
                    </svg>
                  </a>
                </li> */}
                <li>
                  <a href="https://www.facebook.com/people/TAK8/61558749323910/" target="_blank">
                    <svg width="8" height="16" viewBox="0 0 8 16">
                      <path d="M7.288 5.46165L7.0273 8.02992C6.53665 8.02992 6.07571 8.02992 5.61491 8.02917C5.56272 8.02917 5.51082 8.01552 5.45847 8.01192C5.10102 7.98747 5.07072 8.02077 5.07117 8.37612C5.07407 10.6861 5.07562 12.9964 5.07582 15.307C5.07582 15.367 5.06892 15.4256 5.06427 15.5H2.1522C2.1462 15.4004 2.1372 15.3164 2.1372 15.2324C2.1364 13.0884 2.1367 10.9444 2.1381 8.80032C2.1381 8.63532 2.16015 8.46897 2.1681 8.30322C2.1774 8.10147 2.1018 8.00217 1.87605 8.01178C1.49311 8.02797 1.10896 8.01627 0.711914 8.01627V5.4852C1.10311 5.4852 1.46056 5.478 1.8177 5.48775C2.0577 5.49435 2.1489 5.41815 2.1477 5.1564C2.1465 4.45741 2.11995 3.74987 2.2158 3.06137C2.41245 1.64944 3.02174 0.804797 4.58578 0.638449C5.45997 0.545 6.34436 0.545 7.2598 0.5V3.09692C6.9781 3.09692 6.7258 3.08717 6.47456 3.09932C6.15281 3.11432 5.82956 3.13067 5.51172 3.17957C5.29497 3.21287 5.14902 3.37337 5.13867 3.59792C5.11227 4.16521 5.10267 4.73326 5.08932 5.30115C5.08437 5.51205 5.24742 5.47365 5.37072 5.4735C5.90441 5.47275 6.43826 5.466 6.97195 5.46165C7.066 5.4609 7.1599 5.46165 7.288 5.46165Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/tak8_australia/" target="_blank">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M4.33749 0.5H11.6573C11.7046 0.508716 11.7517 0.520587 11.7994 0.525846C12.2092 0.570927 12.6109 0.661089 12.9819 0.837356C14.5978 1.60193 15.4629 2.88178 15.4857 4.67119C15.5143 6.88617 15.4929 9.1019 15.4923 11.3172C15.4923 11.8947 15.3996 12.4592 15.1538 12.9814C14.3952 14.5932 13.1176 15.4591 11.3348 15.4836C9.11081 15.5145 6.88486 15.4927 4.65981 15.4902C3.79757 15.4891 2.99873 15.2567 2.29577 14.7555C1.10413 13.9057 0.507106 12.7362 0.5038 11.2731C0.49819 9.08702 0.498791 6.90095 0.505604 4.71492C0.506355 4.43346 0.521382 4.1454 0.58164 3.87176C0.955812 2.17371 1.98952 1.08936 3.66413 0.622921C3.88277 0.561761 4.11268 0.539972 4.33749 0.5ZM7.99791 14.1622C9.08096 14.1622 10.1641 14.1622 11.2472 14.1622C11.59 14.1622 11.9285 14.1274 12.254 14.0112C13.4411 13.5879 14.16 12.5659 14.1624 11.2778C14.1665 9.09213 14.1698 6.90631 14.1569 4.72063C14.1549 4.39424 14.1092 4.05313 14.0056 3.74508C13.6018 2.54623 12.563 1.83184 11.2676 1.83019C9.08677 1.82748 6.90605 1.82328 4.72533 1.83605C4.39895 1.838 4.05768 1.88263 3.74948 1.98632C2.56084 2.38408 1.83805 3.41103 1.83324 4.69193C1.82502 6.89228 1.82467 9.09268 1.83219 11.2931C1.83399 12.2699 2.22469 13.0599 3.01616 13.6391C3.52573 14.0121 4.10712 14.164 4.73405 14.1628C5.822 14.1608 6.90996 14.1606 7.99791 14.1622Z" />
                      <path d="M7.99978 11.8596C5.87947 11.8632 4.13274 10.1164 4.13379 7.99536C4.13484 5.87431 5.88308 4.12697 8.00189 4.13283C10.1207 4.13869 11.8521 5.86814 11.8602 7.9898C11.8683 10.1077 10.1241 11.8559 7.99978 11.8596ZM10.5273 7.99326C10.5231 6.59575 9.38662 5.46151 7.99392 5.46572C6.59641 5.46993 5.46233 6.60627 5.46653 7.99912C5.47059 9.39663 6.60678 10.5307 7.99978 10.5267C9.39744 10.5226 10.5315 9.38596 10.5273 7.99326Z" />
                      <path d="M12.0204 3.01075C12.5573 3.00924 13.004 3.45538 12.9971 3.98746C12.9902 4.51955 12.5533 4.95336 12.0237 4.95442C11.4879 4.95547 11.0404 4.50798 11.0459 3.97695C11.0492 3.72028 11.1532 3.47517 11.3355 3.29444C11.5177 3.11371 11.7637 3.01183 12.0204 3.01075Z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-7">
              <form class="BookingFrom" onSubmit={handleSubmit}>
                <div class="Form">
                  <div class="MainField">
                    <label for="first_name" class="form-label">
                      First Name
                    </label>
                    <div className={`input-container tooltip-wrapper ${errors.first_name ? 'error' : ''}`}
                      data-tooltip={errors.first_name }>

                      <input
                        type="text"
                        class="form-control"
                        id="first_name"
                        placeholder="Enter First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="MainField">
                    <label for="last_name" class="form-label">
                      Last Name
                    </label>
                    <div className={`input-container tooltip-wrapper ${errors.last_name ? 'error' : ''}`}
                      data-tooltip={errors.last_name }>
                      <input
                        type="text"
                        class="form-control"
                        id="last_name"
                        placeholder="Enter Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="MainField">
                    <label for="email" class="form-label">
                      Email
                    </label>
                    <div className={`input-container tooltip-wrapper ${errors.email ? 'error' : ''}`}
                      data-tooltip={errors.email }>
                      <input
                        type="text"
                        class="form-control"
                        id="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="MainField">
                    <label for="contact_no" class="form-label">
                      Contact Number
                    </label>
                    <div className={`input-container tooltip-wrapper ${errors.contact_no ? 'error' : ''}`}
                      data-tooltip={errors.contact_no }>
                      <input
                        type="tel"
                        class="form-control"
                        id="contact_no"
                        placeholder="Enter Contact Number"
                        value={formData.contact_no}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div class="MainField">
                    <label for="message" class="form-label">
                      Comments
                    </label>
                    <div className={`input-container tooltip-wrapper ${errors.message ? 'error' : ''}`}
                      data-tooltip={errors.message }>
                      <textarea
                        class="form-control"
                        id="message"
                        placeholder="Enter Comments"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <button class="BtnFill">Send Message</button>
                  
                  {(isEmailSent ? <div id="toast-container" class="toast-container">
                    Thank you for reaching out to us. We will get back to you shortly.
                    </div> : "")}
                </div>


              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
