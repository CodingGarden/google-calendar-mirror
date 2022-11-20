const axios = require('axios');
const ical = require('ical');

const {
  GOOGLE_CALENDAR_ID,
} = process.env;

async function getGoogleEvents() {
  const { data } = await axios.get(`https://calendar.google.com/calendar/ical/${GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const rightNow = new Date();
  const events = ical.parseICS(data);
  return Object.values(events)
    .filter((event) => event.start > rightNow);
}

module.exports = {
  getGoogleEvents,
};

