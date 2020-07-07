import React from "react";
import classNames from 'classnames';

import "./Button.scss";

export default function Button(props) {
    const { onClick, disabled, confirm, danger } = props;

    const buttonClass = classNames('button', {
        'button--confirm': confirm,
        'button--danger': danger
    });

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={buttonClass}
        >
            {props.children}
        </button>
    );
}
