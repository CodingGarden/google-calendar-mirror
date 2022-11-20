const axios = require('axios');

const {
  DISCORD_TOKEN,
  DISCORD_GUILD_ID,
} = process.env;

async function getDiscordEvents() {
  const { data } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/scheduled-events`, {
    headers: {
      authorization: `Bot ${DISCORD_TOKEN}`,
    },
  });
  return data;
}

const getDiscordEventsById = (events) => events.reduce((map, event) => {
  const match = event.description.match(/\[(\w{26}@google\.com)\]/);
  if (!match) return map;
  map.set(match[1], event);
  return map;
}, new Map());

async function createOrUpdateDiscordEvent(event, discordEvents) {
  if (discordEvents.has(event.uid)) {
    await axios.patch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/scheduled-events/${discordEvents.get(event.uid).id}`, {
      name: event.summary,
      scheduled_start_time: event.start.toISOString(),
      scheduled_end_time: event.end.toISOString(),
      description: `[${event.uid}]`,
    }, {
      headers: {
        authorization: `Bot ${DISCORD_TOKEN}`,
      },
    });
  } else {
    await axios.post(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/scheduled-events`, {
      name: event.summary,
      scheduled_start_time: event.start.toISOString(),
      scheduled_end_time: event.end.toISOString(),
      privacy_level: 2,
      entity_type: 3,
      description: `[${event.uid}]`,
      entity_metadata: {
        location: 'https://twitch.tv/codinggarden',
      },
    }, {
      headers: {
        authorization: `Bot ${DISCORD_TOKEN}`,
      },
    });
  }
}

const deleteOrKeepDiscordEvent = async ([id, event], googleEventsIds) => {
  if (!googleEventsIds.includes(id)) {
    await axios.delete(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/scheduled-events/${event.id}`, {
      headers: {
        authorization: `Bot ${DISCORD_TOKEN}`,
      },
    });
  }
}

module.exports = {
  getDiscordEvents,
  getDiscordEventsById,
  createOrUpdateDiscordEvent,
  deleteOrKeepDiscordEvent,
};

