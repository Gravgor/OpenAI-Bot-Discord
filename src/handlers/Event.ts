import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../types";

function eventHandler(client: Client) {
    let eventsDir = join(__dirname, "../events");
    readdirSync(eventsDir).forEach(async (file) => {
        let event : BotEvent = require(`../events/${file}`).default
        event.once ? client.once(event.name, (...args) => event.execute(...args, client)) : client.on(event.name, (...args) => event.execute(...args, client));
        console.log(`Loaded event ${event.name}`)
    })
}

export default eventHandler;