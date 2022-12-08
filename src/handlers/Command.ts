import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import fs from "fs";
import path from "path";
import { SlashCommand } from "src/types";


function slashHandler(client: Client){
    const slashCommands: SlashCommandBuilder[] = [];
    fs.readdirSync(path.join(__dirname, '../slashCommands')).forEach(file => {
        let command : SlashCommand = require(`../slashCommands/${file}`).default
        slashCommands.push(command.command)
        client.slashCommands.set(command.command.name, command)
    })

    const rest = new REST({version: '10'}).setToken(process.env.DISCORDTOKEN!);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data: any) => {
        console.log("Successfully registered application commands.");
    })
    .catch(console.error);
}


export default slashHandler;