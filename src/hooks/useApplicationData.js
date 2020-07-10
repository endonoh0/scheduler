import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
    const [state, setState] = useState({
        day: "Monday",
        days: [],
        appointments: {},
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
            const days = all[0].data;
            const appointments = all[1].data;
            const interviewers = all[2].data;

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

    return { state, setDay, bookInterview, cancelInterview };
}
