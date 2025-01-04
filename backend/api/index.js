const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const bookings = [];


const allSlots = [
  "11:00 AM",
  "12:00 PM",
  "13:00 PM",
  "14:00 PM",
  "15:00 PM",
  "16:00 PM",
  "17:00 PM",
  "18:00 PM",
  "19:00 PM",
];


app.get("/api/bookings", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required!" });
  }

  const bookedSlots = bookings
    .filter((booking) => booking.date === date)
    .map((booking) => booking.time);

  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

  res.json(availableSlots);
});

//Creating a new booking
app.post("/api/bookings", (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  if (!date || !time || !guests || !name || !contact) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const isSlotBooked = bookings.some(
    (booking) => booking.date === date && booking.time === time
  );

  if (isSlotBooked) {
    return res.status(400).json({ message: "This time slot is already booked!" });
  }

  const newBooking = { id: bookings.length + 1, date, time, guests, name, contact };
  bookings.push(newBooking);

  res.status(201).json({
    message: "Booking created successfully!",
    booking: newBooking,
  });
});


// Update
app.put("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { time, guests, name, contact } = req.body;

  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found!" });
  }

  const existingBooking = bookings[bookingIndex];

  // Checking if the new time slot is already booked by another booking
  const isSlotBooked = bookings.some(
    (booking) =>
      booking.date === existingBooking.date &&
      booking.time === time &&
      booking.id !== bookingId
  );

  if (isSlotBooked) {
    return res.status(400).json({ message: "This time slot is already booked!" });
  }

  // Updating booking details
  bookings[bookingIndex] = {
    ...existingBooking,
    time,
    guests,
    name,
    contact,
  };

  res.json({
    message: "Booking updated successfully!",
    booking: bookings[bookingIndex],
  });
});

// Delete a booking
app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id, 10);

  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found!" });
  }

  const deletedBooking = bookings.splice(bookingIndex, 1)[0];

  res.json({
    message: "Booking deleted successfully!",
    booking: deletedBooking,
  });
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
