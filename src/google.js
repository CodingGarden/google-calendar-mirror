const axios = require('axios');
const ical = require('ical');

const {
  GOOGLE_CALENDAR_ID,
} = process.env;

async function getGoogleEvents() {
  const { data } = await axios.get(`https://calendar.google.com/calendar/ical/${GOOGLE_CALENDAR_ID}/public/basic.ics`);
  const rightNow = Date.now() - (24 * 60 * 60 * 1000);
  const events = ical.parseICS(data);
  const futureEvents = Object.values(events)
    .filter((event) => {
      return event.type === 'VEVENT' && event.start.getTime() > rightNow;
    });
  futureEvents.forEach((event) => {
    event.summary = event.summary.replace(/Coding Garden Live Stream - /, '').trim();
    const shortenedSummary = event.summary.slice(0, 97);
    if (event.summary !== shortenedSummary) {
      event.summary += '...';
    }
  });
  return futureEvents;
}

module.exports = {
  getGoogleEvents,
};

