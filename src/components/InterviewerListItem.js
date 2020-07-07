import React from 'react';
import classNames from 'classnames';

import './InterviewerListItem.scss';

export default function InterviewerListItem(props) {
    const {name, avatar, selected, setInterviewer } = props;

    const interviewClass = classNames({
        'interviewers__item': true,
        'interviewers__item-image': avatar,
        'interviewers__item--selected': selected
    });

    return (
        <li className={interviewClass} onClick={setInterviewer}>
            <img
                className="interviewers__item-image"
                src={avatar}
                alt={name}
            />
                {selected && name}
        </li>
    );
}
