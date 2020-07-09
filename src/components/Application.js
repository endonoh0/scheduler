import React, {useState, useEffect} from "react";
import axios from "axios";

// Styles
import "components/Application.scss";
// Components
import DayList from 'components/DayList';
import Appointment from "components/Appointment";
// Helper Functions
import {
    getAppointmentsForDay,
    getInterview,
    getInterviewersForDay} from "../helpers/selectors";

export default function Application(props) {
    const setDay = day => setState({ ...state, day });

    // For now it logs the value, later it will change the local state
    function bookInterview(id, interview) {
        console.log(id, interview);
    }

    const [ state, setState ] = useState({
        day: "Monday",
        days: [],
        appointments:  {},
        interviewers: {},
    });

  useEffect(() => {
    Promise.all([
        Promise.resolve(axios.get("api/days")),
        Promise.resolve(axios.get("api/appointments")),
        Promise.resolve(axios.get("api/interviewers")),
    ]).then((all) => {
        const days          = all[0].data;
        const appointments  = all[1].data;
        const interviewers  = all[2].data;

        setState(prev => ({
            ...prev,
            days: days,
            appointments: appointments,
            interviewers: interviewers
        }));
    });
  });

  const appointment = getAppointmentsForDay(state, state.day).map(appointment => {
      const interview      = getInterview(state, appointment.interview);
      const interviewers   = getInterviewersForDay(state, state.day);

      return (
        <Appointment
          key={ appointment.id }
          { ...appointment }
          interview={ interview }
          interviewers={ interviewers }
          bookInterview={bookInterview}
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
                days={ state.days }
                day={ state.day }
                setDay={ setDay }
            />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { appointment }

        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
