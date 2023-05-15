require('dotenv').config();

const { waterfall } = require('./utils');
const { getGoogleEvents } = require('./google');
const {
  getTwitchEvents,
  createTwitchEvent,
  removeTwitchEvent,
} = require('./twitch');
const {
  getDiscordEvents,
  getDiscordEventsById,
  createOrUpdateDiscordEvent,
  deleteOrKeepDiscordEvent,
} = require('./discord');


const platform = process.argv.slice(2)[0];

async function sync() {
  const googleEvents = await getGoogleEvents();

  if (!platform || platform === 'twitch') {
    const twitchEvents = await getTwitchEvents();
    await waterfall(twitchEvents?.segments || [], removeTwitchEvent);
    await waterfall(googleEvents, createTwitchEvent);
  }

  if (!platform || platform === 'discord') {
    const googleEventsIds = googleEvents.map(event => event.uid);
    const discordEvents = await getDiscordEvents();
    const discordEventsById = getDiscordEventsById(discordEvents);
    await waterfall([...discordEventsById.entries()], async (event) => {
      await deleteOrKeepDiscordEvent(event, googleEventsIds);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
    await waterfall(googleEvents, async (event) => {
      await createOrUpdateDiscordEvent(event, discordEventsById);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  }
}

sync();
