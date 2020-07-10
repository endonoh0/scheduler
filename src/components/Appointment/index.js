import React from "react";

import './styles.scss';
import useVisualMode from "hooks/useVisualMode";

import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    // creates a new interviewer object and passes to props.bookInterview
    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        // console.log(props.bookInterview);
        props.bookInterview(props.id, interview);
            // .then(() => transition(SHOW));

        transition(SHOW);
        // console.log(mode)
    }

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && props.interview && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer.name}
                    onDelete={props.onDelete}
                    onEdit={props.onEdit}
                />
            )}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={back}
                    onSave={save}
                />
            )}
        </article>
    )
}
