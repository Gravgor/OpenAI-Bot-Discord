import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "src/types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("pinsg")
        .setDescription("Replies with pong!"),
        execute: interaction => {
            interaction.reply({content: "Pong!", ephemeral: true})
        },
        cooldown: 5
}


export default command;