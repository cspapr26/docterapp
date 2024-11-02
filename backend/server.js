const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const connectWithRetry = () => {
  mongoose.connect('mongodb://mongo:27017/appointments', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err);
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  date: Date,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    console.log("Fetched appointments:", appointments); // Log fetched appointments
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    console.log("Received appointment data:", req.body); // Log incoming data
    const appointment = new Appointment(req.body);
    await appointment.save();
    console.log("Saved appointment:", appointment); // Log saved appointment
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});