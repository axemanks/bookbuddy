// handle stream
import { ParsedEvent, ReconnectInterval, EventSourceParser, createParser } from "eventsource-parser";

export type ChatGPTAgent = "user" | "system" // naming convention from OpenAI

export interface OpenAIStreamMessage { 
    role: ChatGPTAgent
    content: string
}

export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}
 
export interface OpenAIStreamPayload {
    model: string;
    messages: ChatGPTMessage[];
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
    stream: boolean;
    n: number;
}
 
export async function OpenAIStream(payload: OpenAIStreamPayload) {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let counter = 0

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
    })

    // create stream
    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data
                    if (data === '[DONE]') { // [DONE] is end of stream
                        controller.close()
                        return                    
                    }
                    // if not [DONE]
                    try {
                        
                        const json = JSON.parse(data) // get data
                        // console.log("json", json) // testing
                        const text = json.choices[0].delta?.content || '' // extract text
                        console.log("text", text)// testing
                        // end the stream when counter is less than 2 and there is a new line
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return
                        }
                        // otherwise get the data
                        const queue = encoder.encode(text) // encode text
                        controller.enqueue(queue) // enqueue text
                        counter++ // increment counter
                        
                    } catch (error) {
                        controller.error(error)
                        console.log("Error creating stream:", error)
                    }
                }
            }
            const parser = createParser(onParse)
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk))
            }
        },
    })
    return stream
}