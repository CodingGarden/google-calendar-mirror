const axios = require('axios');

const {
  TWITCH_CHANNEL_ID,
  TWITCH_CATEGORY_ID,
  TWITCH_OAUTH_TOKEN,
  TWITCH_CLIENT_ID,
} = process.env;

async function getTwitchEvents() {
  const { data } = await axios.get('https://api.twitch.tv/helix/schedule', {
    params: {
      broadcaster_id: TWITCH_CHANNEL_ID,
    },
    headers: {
      authorization: `Bearer ${TWITCH_OAUTH_TOKEN}`,
      'client-id': TWITCH_CLIENT_ID,
    },
  });
  // TODO: handle pagination...
  return data.data;
}

async function removeTwitchEvent(event) {
  await axios.delete('https://api.twitch.tv/helix/schedule/segment', {
    params: {
      broadcaster_id: TWITCH_CHANNEL_ID,
      id: event.id,
    },
    headers: {
      authorization: `Bearer ${TWITCH_OAUTH_TOKEN}`,
      'client-id': TWITCH_CLIENT_ID,
    },
  });
}

async function createTwitchEvent(event) {
  const create = {
    start_time: event.start,
    timezone: 'UTC',
    is_recurring: false,
    duration: ((event.end - event.start) / 1000 / 60).toString(),
    category_id: TWITCH_CATEGORY_ID,
    title: event.summary,
  };
  await axios.post('https://api.twitch.tv/helix/schedule/segment', create, {
    params: {
      broadcaster_id: TWITCH_CHANNEL_ID,
    },
    headers: {
      authorization: `Bearer ${TWITCH_OAUTH_TOKEN}`,
      'client-id': TWITCH_CLIENT_ID,
    },
  });
}

module.exports = {
  getTwitchEvents,
  createTwitchEvent,
  removeTwitchEvent,
};

