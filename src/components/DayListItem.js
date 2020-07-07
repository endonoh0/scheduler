import React from 'react';
import classNames from 'classnames';

import './DayListItem.scss';

export default function DayListItem(props) {
    const { name, spots, selected, setDay } = props;

    const dayClass = classNames('day-list__item', {
        'day-list__item--selected': selected,
        'day-list__item--full': !spots
    });

    const formatSpots = (spot) => {
        return (
            !spot ? 'no spots remaining' :
             spot === 1 ? `${spot} spot remaining` : `${spot} spots remaining`
        );
    }

    return (
        <li className={dayClass} onClick={() => setDay(name)}>
            <h2 className="text--regular">{name}</h2>
            <h3 className="text--light">{formatSpots(spots)}</h3>
        </li>
    )
}
