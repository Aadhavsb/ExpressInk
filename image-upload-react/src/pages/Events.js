import React from "react";
import { useState } from "react";
import Calendar from "react-calendar";
import "./Calendar.css";
import "./Events.css";

const eventInfo = [
  {
    title: "Pathways for Pops: Elevate Your Fatherhood Journey!",
    start_date: "2025-01-24",
    start_time: null,
    location: "Sheraton Suites Akron Cuyahoga Falls Cuyahoga Falls, OH 44221",
  },
  {
    title:
      "Sensory Friendly performance - 'Goodnight Moon' and 'The Runaway Bunny'",
    start_date: "2025-01-26",
    start_time: "11:30am",
    location: "Euclid Ave Cleveland, OH 44115",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-01-26",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title:
      "Workshop: Autism & Caregiving, Your Grief and Joy Matter: A Workshop for Black American Caregivers",
    start_date: "2025-01-27",
    start_time: "6:30pm",
    location: "27333 Center Ridge Road Westlake, OH 44145",
  },
  {
    title: "Rec2Connect Rock Climbing -- Cleveland Rocks!",
    start_date: "2025-01-28",
    start_time: "5:00pm",
    location: "Cleveland Rocks Cleveland, OH 44113",
  },
  {
    title:
      "Share & Support: Balancing Act: How to Cope with an Uneven Mental Load -- In-Person or Virtual",
    start_date: "2025-01-28",
    start_time: "6:30pm",
    location: "27333 Center Ridge Road Westlake, OH 44145",
  },
  {
    title:
      "A Livespecial.com Webinar: The B'nai Mitzvah Process: Adapted + Individualized = Success",
    start_date: "2025-01-28",
    start_time: "7:00pm",
    location: null,
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-02-02",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Shaker Rocks!",
    start_date: "2025-02-04",
    start_time: "5:00pm",
    location: "Shaker Rocks! Shaker Heights, OH 44122",
  },
  {
    title: "Hop on Pop: Dad's Adapted Play & Connect",
    start_date: "2025-02-04",
    start_time: "6:30pm",
    location: "15600 East Bagley Rd. Middleburg Hts., OH 44130",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-02-09",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Cleveland Rocks!",
    start_date: "2025-02-11",
    start_time: "5:00pm",
    location: "Cleveland Rocks Cleveland, OH 44113",
  },
  {
    title: "Behavior Chat: Visual Cues to Help Children Manage Impulses",
    start_date: "2025-02-11",
    start_time: "6:30pm",
    location: "1600 Hampton Rd. Rocky River, OH 44116",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-02-16",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Shaker Rocks!",
    start_date: "2025-02-18",
    start_time: "5:00pm",
    location: "Shaker Rocks! Shaker Heights, OH 44122",
  },
  {
    title:
      "Share & Support: Balancing Act: How to Cope with an Uneven Mental Load -- Virtual Program for Families of Children with Complex Needs",
    start_date: "2025-02-18",
    start_time: "6:30pm",
    location: null,
  },
  {
    title: "Transition Bootcamp -- College and How to Plan For Success",
    start_date: "2025-02-20",
    start_time: "6:30pm",
    location: null,
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-02-23",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Cleveland Rocks!",
    start_date: "2025-02-25",
    start_time: "5:00pm",
    location: "Cleveland Rocks Cleveland, OH 44113",
  },
  {
    title: "Share & Support: LGBTQ+ Caregiver Connect",
    start_date: "2025-02-25",
    start_time: "6:30pm",
    location: null,
  },
  {
    title: "Western Cuyahoga County Resource Fair",
    start_date: "2025-02-27",
    start_time: "4:00pm",
    location: "21016 Hilliard Blvd Rocky River, OH 44116",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-03-02",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Shaker Rocks!",
    start_date: "2025-03-04",
    start_time: "5:00pm",
    location: "Shaker Rocks! Shaker Heights, OH 44122",
  },
  {
    title: "Sensory Friendly performance - 'The Gruffalo's Child'",
    start_date: "2025-03-09",
    start_time: "11:30am",
    location: "Euclid Ave Cleveland, OH 44115",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-03-09",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Cleveland Rocks!",
    start_date: "2025-03-11",
    start_time: "5:00pm",
    location: "Cleveland Rocks Cleveland, OH 44113",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-03-16",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Lorain County Resource Fair",
    start_date: "2025-03-18",
    start_time: "4:00pm",
    location: "1005 N. Abbe Rd. Elyria, OH 44035",
  },
  {
    title: "Rec2Connect Rock Climbing -- Shaker Rocks!",
    start_date: "2025-03-18",
    start_time: "5:00pm",
    location: "Shaker Rocks! Shaker Heights, OH 44122",
  },
  {
    title: "Transition Bootcamp -- Homemaker Personal Care vs Shared Living",
    start_date: "2025-03-20",
    start_time: "6:30pm",
    location: null,
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-03-23",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Rec2Connect Rock Climbing -- Cleveland Rocks!",
    start_date: "2025-03-25",
    start_time: "5:00pm",
    location: "Cleveland Rocks Cleveland, OH 44113",
  },
  {
    title: "Rec2Connect Outdoor Adventure: Winter Hiking Club",
    start_date: "2025-03-30",
    start_time: "1:00pm",
    location: "River Grove Picnic Area Willoughby Hills, OH 44143",
  },
  {
    title: "Eastern Cuyahoga County Resource Fair",
    start_date: "2025-04-02",
    start_time: "4:00pm",
    location:
      "Cuyahoga Community College (Tri-C) East Campus Highland Hills, OH 44122",
  },
  {
    title: "Milestones Annual Benefit",
    start_date: "2025-04-03",
    start_time: "6:00pm",
    location: null,
  },
  {
    title: "2025 Northeast Ohio Transition Expo",
    start_date: "2025-04-26",
    start_time: "9:00am",
    location: "Independence Civic Center Cleveland, OH 44131",
  },
  {
    title: "Transition Bootcamp -- Northeast Ohio Transition EXPO",
    start_date: "2025-04-26",
    start_time: "6:30pm",
    location: "Independence Civic Center Cleveland, OH 44131",
  },
];
const Events = () => {
  const [date, setDate] = useState(new Date());

  function onChange(nextValue) {
    setDate(nextValue);
  }

  // Function to get events for a specific date
  const getEventsForDate = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format the date to YYYY-MM-DD
    return eventInfo.filter((event) => event.start_date === formattedDate);
  };

  const eventsForSelectedDate = getEventsForDate(date);

  // Function to determine if a date has any events
  const hasEvents = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return eventInfo.some((event) => event.start_date === formattedDate);
  };

  return (
    <div className="events-container">
      {/* Events Title and Description */}
      <div className="events-header">
        <h1 className="events-title">Upcoming Events</h1>
        <p className="events-description">
          Discover upcoming events and activities that you and your child can
          participate in!
        </p>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={onChange}
          value={date}
          tileClassName={({ date, view }) =>
            view === "month" && hasEvents(date) ? "highlighted" : null
          }
        />
      </div>

      <p className="selected-date">
        <span className="bold">Selected Date:</span> {date.toDateString()}
      </p>

      <div className="events-list">
        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map((event, index) => (
              <li key={index}>
                <strong>{event.title}</strong>
                {event.start_time && <span> at {event.start_time}</span>}
                {event.location && <span> - {event.location}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events scheduled on this day.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
