import React, { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "../reducers/application";

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

    const cancelInterview = (id) => {
        const appointment = {
            ...state.appointments[id],
            interview: null
        }

        return axios.delete(`api/appointments/${id}`)
            .then(() => {
                dispatch({
                    type: SET_INTERVIEW,
                    payload: { appointment }
                });
            }
        );
    }

    const bookInterview = (id, interview) => {
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
            }
        );
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

    // Connect to WebSocket server
    useEffect(() => {
        const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

        webSocket.onopen = (event) => {
            webSocket.send("ping");

            webSocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                // Listen to message and update the specific appointment state
                if (message === SET_INTERVIEW) {
                    const interview = message.interview;

                    dispatch({
                        type: SET_INTERVIEW,
                        payload: { interview }
                    });
                }
            }
        }
    }, [])

    return { state, setDay, bookInterview, cancelInterview };
}
