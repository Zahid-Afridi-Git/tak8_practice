import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { useEffect } from "react";
import mainStore from "./store/store";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

function App() {
  const { getAllCars } = mainStore();

  useEffect(() => {
    getAllCars();
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
