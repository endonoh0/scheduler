export function getAppointmentsForDay(state, day) {
    const appointmentArr = [];
    const days = state.days;

    const filteredDay = days.filter(state => state.name === day)[0];

    if (!filteredDay) return appointmentArr;

    for (const id of filteredDay.appointments) {
        appointmentArr.push(state.appointments[id]);
    }
    console.log('isArray', Array.isArray(appointmentArr)); // true
    return appointmentArr;
}
