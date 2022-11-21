# Google Calendar -> Twitch & Discord Schedule Mirror

Update a Twitch schedule and add Discord events based on a Google calendar link.

This script will:
* Remove all upcoming events on your Twitch Schedule
* Create an upcoming event on your Twitch Schedule for every upcoming event on the given Google calendar
* Find Discord events that have `[EVENT_UID]` in their description and edit them according to the Google calendar
* Create Discord events for the Google calendar events that were not found
* Delete Discord events that have `[EVENT_UID]`s that are not in the Google calendar (old deleted events, probably)

> This node.js script requires at least [Node.js version 14](https://nodejs.org/en/).

| VARIABLE | DESCRIPTION |
|-|-|
| GOOGLE_CALENDAR_ID | Google calendar ID. It will look like this: fdjrq4spg16jkpg6ahg41v3510@group.calendar.google.com |
| TWITCH_CHANNEL_ID | The channel ID to sync to |
| TWITCH_CATEGORY_ID | The category to set for every scheduled stream |
| TWITCH_OAUTH_TOKEN | Must have `channel:manage:schedule` scope for the channel you are syncing to |
| TWITCH_CLIENT_ID | Your twitch client id |
| DISCORD_TOKEN | Your Discord bot token (the bot should have the `Manage Events` permission) |
| DISCORD_GUILD_ID | The server ID to add the events to |

## Install Dependencies

```sh
npm install
```

## Run

```sh
npm start
```
