// handle the chat messages
import { Message } from "@/lib/validators/message"
import { nanoid } from "nanoid"
import { ReactNode, createContext, useState } from "react"

export const MessagesContext = createContext<{
    messages: Message[]
    isMessageUpdating: boolean
    addMessage: (message: Message) => void
    removeMessage: (id: string) => void
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void
    setIsMessageUpdating: (isUpdating: boolean) => void
}>({
    // fallback values
    messages: [],
    isMessageUpdating: false,
    addMessage: () => { },
    removeMessage: () => { },
    updateMessage: () => { },
    setIsMessageUpdating: () => { },
})

// define the provider
export function MessagesProvider({ children }: { children: ReactNode }) {
     const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false)
        const [messages, setMessages] = useState<Message[]>([
            {
                id: nanoid(),
                text: 'Hello, how can I help you?',
                isUserMessage: false,
            },
        ])
    
    // handle addMessage
    const addMessage = (message: Message) => { 
        setMessages((prev) => [...prev, message])
    }

    // handle removeMessage
    const removeMessage = (id: string) => { 
        setMessages((prev) => prev.filter((message) => message.id !== id)) // filter out the message with the id
    }
   
    // handle updateMessage
    // adds the chunks to the existing array of messages
    // gets a current copy of messages, then inserts the new text 
    const updateMessage = (
        id: string,
        updateFn: (prevText: string) => string
    ) => { 
        setMessages((prev) =>
            prev.map((message) => {
            if (message.id === id) {
                return {...message, text: updateFn(message.text) } // on id match updates message.text
            }
            return message // if id does not match, it will return the message
            })
        )
    }   


    return (
        <MessagesContext.Provider value={{
            messages,
            isMessageUpdating,
            addMessage,
            removeMessage,
            updateMessage,            
            setIsMessageUpdating,
        }} >
            {children}
        </MessagesContext.Provider>
    )
}