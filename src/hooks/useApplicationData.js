import React, { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
    switch (action.type) {
        case SET_DAY:
            return { ...state,  ...action.payload}
        case SET_APPLICATION_DATA:
            return { ...state, ...action.payload }
        case SET_INTERVIEW: {
            return { ...state, ...action.appointment}
        }
        default:
            throw new Error(
                `Tried to reduce with unsupported action type: ${action.type}`
            );
    }
}

export default function useApplicationData() {
    const [state, dispatch] = useReducer(
        reducer,
        {
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {},
    });

    const setDay = day => dispatch({ type: SET_DAY, payload: {day} });

    function cancelInterview(id) {
        const appointment = {
            ...state.appointments[id],
            interview: null
        }
        console.log('cancelId', id);
        return axios.delete(`api/appointments/${id}`)
            .then(() => {
                dispatch({
                    type: SET_INTERVIEW,
                    payload: { appointment }
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
                dispatch({
                    type: SET_INTERVIEW,
                    payload: { appointments }
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

            dispatch({
                type: SET_APPLICATION_DATA,
                payload: {
                    days: days,
                    appointments: appointments,
                    interviewers: interviewers
                }
            })
        });
    }, [state.appointments, state.day]);

    return { state, setDay, bookInterview, cancelInterview };
}
