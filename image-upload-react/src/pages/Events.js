import React from "react";
import { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import "./Events.css";

const Events = () => {
    const [date, setDate] = useState(new Date());

    function onChange(nextValue) {
        setDate(nextValue);
      }

    return (
        <div className='app'>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
    );
};

export default Events;