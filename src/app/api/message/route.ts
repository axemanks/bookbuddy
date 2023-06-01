import { chatbotPrompt } from '@/helpers/constants/chatbot-prompt'
import { ChatGPTMessage, OpenAIStreamPayload } from '@/lib/openai-stream'
import { MessageArraySchema } from "@/lib/validators/message"
import { OpenAIStream } from "@/lib/openai-stream"


// endpoint: /api/message
export async function POST(req: Request) {
    console.log("POST: /api/message endpoint hit!")
    // get the message
    const { messages } = await req.json()
    // validate the message
    const parsedMessages = MessageArraySchema.parse(messages)
    // generate the outbound message
    const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? "user" : "system",
        content: message.text,
    }))



    // render in reverse order
    outboundMessages.unshift({
        role: 'system',
        content: chatbotPrompt
    })

    // define payload
    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outboundMessages,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    }

    // helper
    const stream = await OpenAIStream(payload)

    return new Response(stream)
}