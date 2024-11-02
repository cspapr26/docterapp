import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use backend service name in Docker or localhost during local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientName: '', doctorName: '', date: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments`);
      console.log("Fetched appointments:", response.data); // Log fetched data
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure date is in a valid format for MongoDB
    const formattedDate = new Date(form.date);

    try {
      console.log("Submitting form data:", form); // Log form data before submission
      await axios.post(`${API_URL}/api/appointments`, { ...form, date: formattedDate });
      setForm({ patientName: '', doctorName: '', date: '' });
      fetchAppointments(); // Fetch updated list after booking
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div>
      <h1>Doctor's Office Appointments</h1>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Patient Name" 
          value={form.patientName} 
          onChange={(e) => setForm({ ...form, patientName: e.target.value })} 
          required
        />
        <input 
          placeholder="Doctor Name" 
          value={form.doctorName} 
          onChange={(e) => setForm({ ...form, doctorName: e.target.value })} 
          required
        />
        <input 
          type="date" 
          value={form.date} 
          onChange={(e) => setForm({ ...form, date: e.target.value })} 
          required
        />
        <button type="submit">Book Appointment</button>
      </form>

      <h2>Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              {appt.patientName} with Dr. {appt.doctorName} on {new Date(appt.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;