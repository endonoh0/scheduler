const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW"

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW }

export default function reducer(state, action) {
    switch (action.type) {
        case SET_DAY:
            return { ...state, ...action.payload }
        case SET_APPLICATION_DATA:
            return { ...state, ...action.payload }
        case SET_INTERVIEW: {
            return { ...state, ...action.appointment }
        }
        default:
            throw new Error(
                `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
}
