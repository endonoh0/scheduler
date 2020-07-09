import React, {useState, useEffect} from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "../helpers/selectors";

export default function Application(props) {
    const setDay = day => setState({...state, day});

    const [ state, setState ] = useState({
        day: "Monday",
        days: [],
        appointments:  {}
    });

  useEffect(() => {
    Promise.all([
        Promise.resolve(axios.get("api/days")),
        Promise.resolve(axios.get("api/appointments")),
        // Promise.resolve(axios.get("api/interviewers")),
    ]).then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;

        setState(prev => ({...prev, days: days, appointments: appointments}))
    })
  })

  const appointment = getAppointmentsForDay(state, state.day).map(appointment => {
      return (
        <Appointment
          key={appointment.id}
          {...appointment}
        />
      );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
            <DayList
                days={state.days}
                day={state.day}
                setDay={setDay}
            />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointment}

        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
