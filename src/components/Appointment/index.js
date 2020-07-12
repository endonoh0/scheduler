import React, {useEffect} from "react";

import useVisualMode from "hooks/useVisualMode";

import './styles.scss';

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
    const { interview, id, time, interviewers, bookInterview, cancelInterview } = props;

    const { mode, transition, back } = useVisualMode(
        interview ? SHOW : EMPTY
    );

    useEffect(() => {
        if (interview && mode === EMPTY) {
            transition(SHOW);
        }
        if (interview === null && mode === SHOW) {
            transition(EMPTY);
        }
    }, [interview, transition, mode]);

    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };

        transition(SAVING);

        bookInterview(id, interview)
            .then(() => transition(SHOW))
            .catch(() => transition(ERROR_SAVE, true));
    }

    function destroy() {
        transition(DELETING, true);
        cancelInterview(id)
            .then(() => transition(EMPTY))
            .catch(() => transition(ERROR_DELETE, true));
    }

    function cancel() {
        transition(CONFIRM);
    }

    function edit () {
        transition(EDIT);
    }

    return (
        <article className="appointment">
            <Header time={time} />
            { mode === EMPTY && <Empty onAdd={() => transition(CREATE) } />}
            { mode === SAVING && <Status message={"Saving"} />}
            { mode === DELETING && <Status message={"Deleting"} />}
            { mode === ERROR_SAVE && <Error message="Oops ... something went wrong" onClose={back}/>}
            { mode === ERROR_DELETE && <Error message="Oops ... something went wrong" onClose={back}/>}
            { mode === SHOW && interview && (
                <Show
                    student={ interview.student }
                    interviewer={ interview.interviewer.name }
                    onDelete={cancel}
                    onEdit={ edit }
                />
            )}
            { mode === EDIT && (
                <Form
                    name={ interview.student }
                    value={ interview.interviewer.id }
                    interviewers={ interviewers }
                    onCancel={ back }
                    onSave={ save }
                />
            )}
            { mode === CREATE && (
                <Form
                    interviewers={ interviewers }
                    onCancel={ back }
                    onSave={ save }
                />
            )}
            { mode === CONFIRM && (
                <Confirm
                    message="Are you sure you want to delete?"
                    onConfirm={ destroy }
                    onCancel={ back }
                />
            )}
        </article>
    )
}
