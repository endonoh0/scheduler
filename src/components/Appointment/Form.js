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

    const save = () => {
        // Validation
        (name === "" && !interviewer) ?
            setError("Student name and interviewer are required") :
        (name === "") ?
            setError("Student name is required") :
        (!interviewer) ?
            setError("Selected an interviewer") :
        onSave(name, interviewer)
    }

    return (
        <main className="appointment__card appointment__card--create">
            <section className="appointment__card-left">
                <form autoComplete="off" onSubmit={event => event.preventDefault()}>
                    <input
                        className="appointment__create-input text--semi-bold"
                        name="name"
                        value={name}
                        type="text"
                        placeholder="Enter Student Name"
                        onChange={(event) => setName(event.target.value)}
                    />
                </form>
                <section className="appointment__validation">{error}</section>
                <InterviewerList interviewers={interviewers} value={interviewer} onChange={setInterviewer} />
            </section>
            <section className="appointment__card-right">
                <section className="appointment__actions">
                    <Button danger onClick={cancel}>Cancel</Button>
                    <Button confirm onClick={save}>Save</Button>
                </section>
            </section>
        </main>
    );
}
