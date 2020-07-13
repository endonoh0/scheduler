import React from 'react';
import PropTypes from 'prop-types';

import InterviewerListItem from './InterviewerListItem';
import './InterviewerList.scss';

InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

export default function InterviewerList(props) {
    const { value, onChange } = props;

    const InterviewerList = props.interviewers.map((interviewer) => {
        return (
            <InterviewerListItem
                key={interviewer.id}
                name={interviewer.name}
                avatar={interviewer.avatar}
                selected={interviewer.id === value}
                setInterviewer={() => onChange(interviewer.id)}
            />
        );
    });

    return (
        <section className="interviewers">
            <h4 className="interviewers__header text--light">Interviewer</h4>
            <ul className="interviewers__list">
                {InterviewerList}
            </ul>
        </section>
    );
}
