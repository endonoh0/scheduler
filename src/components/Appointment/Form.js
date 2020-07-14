import React, { useState } from "react";

import InterviewerList from ".././InterviewerList";
import Button from ".././Button";

export default function Form(props) {
    const { value, onCancel, onSave, interviewers } = props;
    const [ name, setName ] = useState(props.name || "");
    const [ interviewer, setInterviewer ] = useState(value || null);
    const [ error, setError ] = useState("");

    const reset = () => {
        setName("");
        setInterviewer(null);
    }

    const cancel = () => {
        reset();
        onCancel();
    }

    const validate = () => {

        if (name === "" && !interviewer) {
            setError("Student name and interviewer are required");
            return;
        }

        if (name === "") {
            setError("Student cannot be blank");
            return;
        }

        if (!interviewer) {
            setError("Interviewer cannot be blank");
            return;
        }

        setError("");
        onSave(name, interviewer);
    }

    return (
        <main className="appointment__card appointment__card--create">
            <section className="appointment__card-left">
                <form autoComplete="off" onSubmit={event => event.preventDefault()}>
                    <input
                        className="appointment__create-input text--semi-bold"
                        name="name"
                        type="text"
                        placeholder="Enter Student Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        data-testid="student-name-input"
                    />
                </form>
                <section className="appointment__validation">{error}</section>
                <InterviewerList interviewers={interviewers} value={interviewer} onChange={setInterviewer} />
            </section>
            <section className="appointment__card-right">
                <section className="appointment__actions">
                    <Button danger onClick={cancel}>Cancel</Button>
                    <Button confirm onClick={validate}>Save</Button>
                </section>
            </section>
        </main>
    );
}
