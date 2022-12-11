import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "src/types";

import { Configuration, OpenAIApi} from "openai";

const config = new Configuration({
    apiKey: process.env.API,
})

const openai = new OpenAIApi(config);



const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("code")
        .setDescription("Request code completion for a specific language")
        .addStringOption(option => 
            option.setName("language")
            .setDescription("The language you want code completion for")
            .setRequired(true)
            .addChoices(
                {name: "JavaScript", value: "Javascript"},
                {name: "Python", value: "Python"},
                {name: "Go", value: "Go"},
                {name: "PHP", value: "PHP"},
                {name: "Swift", value: "Swift"},
                {name: "TypeScript", value: "TypeScript"},
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
                async function call(){
                    const response = await openai.createCompletion({
                        model: "code-davinci-002",
                        prompt: `\n ${error} \n ${code} \n`,
                        temperature: 0.5,
                        max_tokens: 256,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                        })
                        .then((data) => {
                            console.log(data.data.choices)
                            if(data.data.choices[0].text === ''){
                                let embed = new EmbedBuilder()
                                    .setTitle("Code Completion")
                                    .setDescription(`We couldn't find any problem solving for provided code`)
                                    .setColor("#f2f2f2")
                                    .setTimestamp()
                                interaction.editReply({embeds: [embed]})
                            }
                            const responseBot = data.data.choices[0].text?.replace(/\\n/g, "\n") && data.data.choices[0].text?.replace('&', "") && data.data.choices[0].text?.replace('<code>', "") && data.data.choices[0].text?.replace('</code>', "")
                            let embed = new EmbedBuilder()
                                .setTitle("Code Completion")
                                .setDescription(`Here is the code completion for ${lang}`)
                                .setColor("#f2f2f2")
                                .setTimestamp()
                                .addFields([
                                  {name: "Code", value: `\`\`\`\n${responseBot}\`\`\``}
                                ])
                            interaction.editReply({embeds: [embed]})
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    }
                call()
            } catch (error) {
                console.log(error)
            }
        }
}


export default command;