import * as React from "react";

import { Calendar } from "primereact/calendar";
import "./calender.css";

function Calender() {
  const [date, setDate] = React.useState(null);

  return (
    <div className="card flex justify-content-center style_calender">
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value)}
        inline
        showWeek
      />
    </div>
  );
}

export default Calender;
