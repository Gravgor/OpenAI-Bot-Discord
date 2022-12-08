import { Configuration, OpenAIApi} from "openai";

const config = new Configuration({
    apiKey: process.env.API,
})

const openai = new OpenAIApi(config);


export default async function apiCall(value: any, value1: any, value2: any){
   try{
    const response = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: `\n ${value} \n ${value1} \n ${value2} \n`,
        temperature: 0.5,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }).then((data) => {
            return data;
      })
   } catch (error) {
         return error;
   }
    

}