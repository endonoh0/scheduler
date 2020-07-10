export function getAppointmentsForDay(state, day) {
    const appointmentArr = [];
    const days           = state.days;
    const filteredDay    = days.filter(state => state.name === day)[0];

    if (!filteredDay) return appointmentArr;

    for (const id of filteredDay.appointments) {
        appointmentArr.push(state.appointments[id]);
    }
    // console.log('appointmentarr', appointmentArr);
    return appointmentArr;
}

// const [state, setState] = useState({
//     day: "Monday",
//     days: [],
//     appointments: {},
//     interviewers: {},
// });

// "interview": {
//     "student": "Archie Cohen",
//         "interviewer": 4
// }
export function getInterview(state, interview) {
    if (!interview) return null;

    const student       = interview.student;
    const interviewID   = interview.interviewer;
    const interviewer   = state.interviewers[interviewID];

    return { student, interviewer };
}

export function getInterviewersForDay(state, day) {
    const interviewArr  = [];
    const days          = state.days;
    const filteredDay   = days.filter(state => state.name === day)[0];

    if (!filteredDay) return interviewArr;

    for (const id of filteredDay.interviewers) {
            interviewArr.push(state.interviewers[id]);
        }

    // console.log(interviewArr)
    return interviewArr;
}
