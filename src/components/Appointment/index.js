import React from "react";

import './styles.scss';
import useVisualMode from "hooks/useVisualMode";

import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

const EMPTY               = "EMPTY";
const SHOW                = "SHOW";
const CREATE              = "CREATE";
const SAVING              = "SAVING";
const DELETING            = "DELETING";
const CONFIRM             = "CONFIRM";
const EDIT                = "EDIT";
const ERROR_SAVE          = "ERROR_SAVE";
const ERROR_DELETE        = "ERROR_DELETE";

export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };

        transition(SAVING);

        props.bookInterview(props.id, interview)
            .then(() => transition(SHOW))
            .catch(() => transition(ERROR_SAVE, true));
    }

    function cancel() {
        confirm();
    }

    function confirm () {
        transition(CONFIRM);
    }

    function destroy () {
        transition(DELETING, true);

        props.cancelInterview(props.id)
            .then(() => transition(EMPTY))
            .catch(() => transition(ERROR_DELETE, true));
    }

    function edit () {
        transition(EDIT);
    }

    return (
        <article className="appointment">
            <Header time={props.time} />
            { mode === EMPTY && <Empty onAdd={() => transition(CREATE) } />}
            { mode === SAVING && <Status message={"Saving"} />}
            { mode === DELETING && <Status message={"Deleting"} />}
            { mode === ERROR_SAVE && <Error message="Oops ... something went wrong" onClose={back}/>}
            { mode === ERROR_DELETE && <Error message="Oops ... something went wrong" onClose={back}/>}
            { mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer.name}
                    onDelete={ cancel }
                    onEdit={ edit }
                />
            )}
            { mode === EDIT && (
                <Form
                    name={props.interview.student}
                    value={props.interview.interviewer.id}
                    interviewers={props.interviewers}
                    onCancel={ back }
                    onSave={ save }
                />
            )}
            { mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={back}
                    onSave={save}
                />
            )}
            { mode === CONFIRM && (
                <Confirm
                    message="Are you sure you want to delete?"
                    onConfirm={destroy}
                    onCancel={back}
                />
            )}
        </article>
    )
}
