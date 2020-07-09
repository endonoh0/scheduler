import React, { useEffect } from "react";

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

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={(event) => transition(CREATE)} />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer.name}
                    onDelete={props.onDelete}
                    onEdit={props.onEdit}
                />
            )}
            {mode === CREATE && (
                <Form
                    interviewers={[]}
                    onCancel={back}
                />
            )}
        </article>
    )
}
