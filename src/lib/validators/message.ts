// message schema to validate message data
// messages must match this schema to be sent to the server
// helps prevent abuse and invalid data
import { z } from "zod";

export const MessageSchema = z.object({
    id: z.string(),
    isUserMessage: z.boolean(),
    text: z.string(),
})

// array validator
export const MessageArraySchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>