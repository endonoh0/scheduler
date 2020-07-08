import React, {useState, useEffect} from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from "components/Appointment";

const appointments = [
    {
        id: 1,
        time: "12pm",
    },
    {
        id: 2,
        time: "1pm",
        interview: {
            student: "Lydia Miller-Jones",
            interviewer: {
                id: 1,
                name: "Sylvia Palmer",
                avatar: "https://i.imgur.com/LpaY82x.png",
            }
        }
    },
    {
        id: 3,
        time: "2pm",
        interview: {
            student: "David Lee Jones",
            interviewer: {
                id: 2,
                name: "Robby Dango",
                avatar: "https://i.imgur.com/LpaY82x.png",
            }
        }
    },
    {
        id: 4,
        time: "3pm",
    },
    {
        id: 5,
        time: "4pm",
        interview: {
            student: "Jacky Chance",
            interviewer: {
                id: 3,
                name: "Jason Borne",
                avatar: "https://i.imgur.com/LpaY82x.png",
            }
        }
    }
];

export default function Application(props) {
    const setDay = day => setState({...state, day}); // setDay("Monday");

    // Remove the state dependency
    const setDays = days => setState(prev => ({...prev, days}));

    const [ state, setState ] = useState({
        day: "Monday",
        days: [],
        appointments:  {}
    });

    // const setDays = day =>
  useEffect(() => {
    axios.get("api/days")
        .then(res => {
            const daysData = res.data;

            setDays(daysData);
        })
        .catch(err => console.log(err));
  }, []);

  const appointment = appointments.map(appointment => {
      return (
          <Appointment
            key={appointment.id}
            {...appointment}
          />
      )
  })

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
