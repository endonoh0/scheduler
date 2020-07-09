export function getAppointmentsForDay(state, day) {
    const appointmentArr = [];
    const days = state.days;

    const filteredDay = days.filter(state => state.name === day)[0];

    if (!filteredDay) return appointmentArr;

    for (const id of filteredDay.appointments) {
        appointmentArr.push(state.appointments[id]);
    }
    return appointmentArr;
}

export function getInterview(state, interview) {
    if (!interview) return null;

    const student = interview.student;
    const interviewID = interview.interviewer;
    const interviewer = state.interviewers[interviewID];

    return { student, interviewer };
}
