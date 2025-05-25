import React from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const DateTimePickerWrapper = ({
  value,
  onChange,
  minDate,
  maxDate,
  disableClock,
}) => (
  <DateTimePicker
    value={value}
    onChange={onChange}
    minDate={minDate}
    maxDate={maxDate}
    disableClock={disableClock}
  />
);

export default DateTimePickerWrapper;
