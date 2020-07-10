import React from "react";

import './styles.scss';
import useVisualMode from "hooks/useVisualMode";

import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

const EMPTY     = "EMPTY";
const SHOW      = "SHOW";
const CREATE    = "CREATE";
const SAVING    = "SAVING";
const DELETING  = "DELETING";
const CONFIRM   = "CONFIRM";

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
            .then(() => {
                transition(SHOW);
            });
    }

    function cancel() {
        confirm();
    }

    function confirm () {
        transition(CONFIRM);
    }

    function destroy () {
        transition(DELETING);

        props.cancelInterview(props.id)
            .then(() => {
                transition(EMPTY);
            });
    }



    return (
        <article className="appointment">
            <Header time={props.time} />
            { mode === EMPTY && <Empty onAdd={() => transition(CREATE) } />}
            { mode === SAVING && <Status message={"Saving"} />}
            { mode === DELETING && <Status message={"Deleting"} />}
            { mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer.name}
                    onDelete={ cancel }
                    onEdit={props.onEdit}
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
