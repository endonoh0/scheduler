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
    const [ state, setState ] = useState({
        day: "Monday",
        days: [],
        appointments:  {},
        // interviewers: {},
    });

    const setDay = day => setState({ ...state, day });

    function bookInterview(id, interview) {
        console.log(id, interview);

        const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
        };

        const appointments = {
            ...state.appointments,
            [id]: appointment
        };

        setState({
            ...state,
            appointments
        });
    }

  useEffect(() => {
    Promise.all([
        Promise.resolve(axios.get("api/days")),
        Promise.resolve(axios.get("api/appointments")),
        Promise.resolve(axios.get("api/interviewers")),
    ]).then((all) => {
        const days          = all[0].data;
        const appointments  = all[1].data;
        const interviewers  = all[2].data;

        setState(prev => {
            return {
                ...prev,
                days: days,
                appointments: appointments,
                interviewers: interviewers
            }
        });
    });
  }, []);



  const appointments =  getAppointmentsForDay(state, state.day).map(appointment => {
    // console.log(appointment)
    //   console.log(appointment.id)
      const interview      = getInterview(state, appointment.interview);
    //   console.log(interview);
      const interviewers   = getInterviewersForDay(state, state.day);
    // console.log('interviewers', interviewers);
      return (
        <Appointment
          key={ appointment.id} // 1
          { ...appointment }
          interview={interview}
          interviewers={interviewers}
          bookInterview={ bookInterview }
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
        { appointments }

        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
