import { createParser } from "eventsource-parser";
import { Readable } from "readable-stream";
import fetch from "node-fetch";
import { TextEncoder, TextDecoder } from "util";

async function OpenAIStream(payload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify(payload),
    });

    const stream = new Readable({
        async read() {
          // Use an arrow function to have access to the correct context
          const onParse = (event) => {
            if (event.type === "event") {
              const data = event.data;
              if (data === "[DONE]") {
                this.push(null);
                return;
              }
              try {
                const json = JSON.parse(data);
                const text = json.choices[0].delta?.content || "";
                console.log(text);
      
                if (counter < 2 && (text.match(/\n/) || []).length) {
                  return;
                }
                const queue = encoder.encode(text);
                this.push(queue);
                counter++;
              } catch (error) {
                this.emit("error", error); // Now 'this' refers to the stream instance
              }
            }
          };
      
          const parser = createParser(onParse);
          for await (const chunk of res.body) {
            const decodedChunk = decoder.decode(chunk);
            console.log("Received chunk:", decodedChunk);
            parser.feed(decodedChunk);
          }
        },
      });
      

    return stream;
  } catch (error) {
    console.error(error);
  }
}

export default OpenAIStream