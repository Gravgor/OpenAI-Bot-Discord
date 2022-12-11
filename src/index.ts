import { Client, GatewayIntentBits, ActivityType, Collection } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import slashHandler from "./handlers/Command";
import eventHandler from "./handlers/Event";
import { SlashCommand } from "./types";

/* Config */
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates]});
client.slashCommands = new Collection<string, SlashCommand>()

/* Events */

client.on("ready", () => {
    if(!client.user || !client.application){
        return;
    }
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{
            name: "Communicate with the OpenAI Chat GPT-3",
            type: ActivityType.Watching
        }]
    })
})



/* Commands */

slashHandler(client);


/* Handlers */

eventHandler(client)

/* Login */

client.login(process.env.DISCORDTOKEN);

