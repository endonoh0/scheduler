import React, {useState, useEffect} from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from "components/Appointment";

import {
    getAppointmentsForDay,
    getInterview,
    getInterviewersForDay} from "../helpers/selectors";

export default function Application(props) {
    const [ state, setState ] = useState({
        day: "Monday",
        days: [],
        appointments:  {},
        interviewers: {},
    });

    const setDay = day => setState({ ...state, day });

    function cancelInterview(id) {
        const appointment = {
            ...state.appointments[id],
            interview: null
        }
        return axios.delete(`api/appointments/${id}`)
            .then(() => {
                setState({
                    ...state, appointment
                });
            });
    }

    function bookInterview(id, interview) {
        const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
        };

        const appointments = {
            ...state.appointments,
            [id]: appointment
        };

        // update the appointment
        return axios.put(`api/appointments/${id}`, { interview })
            .then(() => {
                setState({
                    ...state,
                    appointments
                });
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
      const interview      = getInterview(state, appointment.interview);
      const interviewers   = getInterviewersForDay(state, state.day);

      return (
        <Appointment
          key={ appointment.id }
          { ...appointment }
          interview={ interview }
          interviewers={ interviewers }
          bookInterview={ bookInterview }
          cancelInterview={ cancelInterview }
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
