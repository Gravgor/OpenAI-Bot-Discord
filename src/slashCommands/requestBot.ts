import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import apiCall from "../api/botRequest"
import { SlashCommand } from "src/types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("code")
        .setDescription("Request code completion for a specific language")
        .addStringOption(option => 
            option.setName("language")
            .setDescription("The language you want code completion for")
            .setRequired(true)
            .addChoices(
                {name: "JavaScript", value: "js"},
                {name: "Python", value: "py"},
                {name: "Go", value: "go"},
                {name: "PHP", value: "php"},
                {name: "Swift", value: "swift"},
                {name: "TypeScript", value: "ts"},
            )
        )
        .addStringOption(option =>
            option.setName("code")
            .setDescription("The code you want code completion for")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("error")
            .setDescription("The problem you are facing")
            .setRequired(true)
        ),
        execute: interaction => {
            let lang = interaction.options.get("language")!.value
            let code = interaction.options.get("code")!.value
            let error = interaction.options.get("error")!.value
            console.log(lang, code)
            let embed = new EmbedBuilder()
                .setTitle("Code Completion")
                .setDescription(`You requested code completion for ${lang}`)
                .setColor("#f2f2f2")
                .setTimestamp()
            interaction.reply({embeds: [embed], ephemeral: true})
            try {
               apiCall(lang, code, error)
               .then((data: any) => {
                let newData = data;
                let errorEmbed = new EmbedBuilder()
                    .setTitle("Code Completion")
                    .setDescription(`There was an error with your request`)
                    .setColor("#f2f2f2")
                    .setTimestamp()
                if(newData.response.status !== 200) return interaction.editReply({embeds: [errorEmbed]})
                let embed = new EmbedBuilder()
                    .setTitle("Code Completion")
                    .setDescription(`Here is the code completion for ${lang}`)
                    .setColor("#f2f2f2")
                    .setTimestamp()
                    .addFields("Code", newData.response.data.code)
               })
            }
            catch (error) {
                interaction.editReply({content: "There was an error with your request"})
            }
        }
}


export default command;