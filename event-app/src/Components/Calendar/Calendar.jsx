import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from 'date-fns';
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";  // Import React Icons
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const { data } = await axios.get('/calendar-events');
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load calendar events');
      console.error("Error loading calendar events:", err);
    } finally {
      setLoading(false);
    }
  }

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
    <div key={`empty-${index}`} style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #ccc' }}></div>
  ));

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div style={{ padding: '16px', margin: 'auto', maxWidth: '1024px' }}>
      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => setCurrentMonth(prevMonth => addMonths(prevMonth, -1))} style={{ padding: '8px', cursor: 'pointer' }}>
            <BsCaretLeftFill style={{ width: '20px', height: '20px' }} />
          </button>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(prevMonth => addMonths(prevMonth, 1))} style={{ padding: '8px', cursor: 'pointer' }}>
            <BsFillCaretRightFill style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} style={{ padding: '8px', fontWeight: 'bold', backgroundColor: 'white', border: '1px solid #ccc' }}>{day}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {emptyCells.concat(daysInMonth.map(date => (
            <div key={date.toISOString()} style={{
              padding: '8px', position: 'relative', minHeight: '100px', backgroundColor: 'white', border: '1px solid #ccc',
              display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start'
            }}>
              <div style={{ fontWeight: 'bold' }}>{format(date, "dd")}</div>
              <div style={{ position: 'absolute', top: '32px', left: '8px', right: '8px' }}>
                {events.filter(event => format(new Date(event.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                  .map(event => (
                    <Link key={event.id} to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        color: 'white', backgroundColor: '#007bff', borderRadius: '4px', padding: '4px',
                        fontWeight: 'bold', fontSize: 'small', textAlign: 'center', marginBottom: '4px'
                      }}>
                        {event.title.toUpperCase()}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
