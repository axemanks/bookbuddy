// the text input
"use client"


import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { Message } from '@/lib/validators/message' // schema from zod
import { MessagesContext } from '@/context/messages'
import { Loader2, CornerDownLeft } from 'lucide-react'
import toast from 'react-hot-toast'

 

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  
}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
    const [input, setInput] = useState<string>('')
    const {
        messages,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating } = useContext(MessagesContext)
    const textareaRef = useRef<null | HTMLTextAreaElement>(null) // for focus the text box

    const {mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            // fetch is handled by useMutation
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [message] }),
            })
            if (!response.ok) {
                throw new Error('Error sending, please try again.')
            }

            return response.body            
        },
        onMutate(message) {
            addMessage(message) // optomistic update - adds the message to the array as soon as Enter is hit
        },
            onSuccess: async (stream) => {
                if (!stream) throw new Error('Stream not found')

                // Handle response message
                const id = nanoid() // assing unique id to each message
                // construct the object
                const responseMessage: Message = {
                    id,
                    isUserMessage: false, 
                    text: '', // set to empty string
                }
                // add the message to the array
                addMessage(responseMessage)

                setIsMessageUpdating(true) // set to true to show the loading indicator


                // convert stream to text to display in client
                const reader = stream.getReader()
                //decode the stream
                const decoder = new TextDecoder()
                let done = false

                

                while (!done) {
                    const { value, done: doneReading } = await reader.read()
                    done = doneReading
                    const chunkValue = decoder.decode(value)
                    updateMessage(id, (prev) => prev + chunkValue) // adds the chunks to the existing array of messages
                }

                // finish
                setIsMessageUpdating(false) // set to false to hide the loading indicator
                setInput('') // clear the input field
                setTimeout(() => {
                    textareaRef.current?.focus() // focus back to the text input
                }, 10) // 10ms delay to prevent flickering as the DOM updates
                

        },
        onError: (_, message) => { 
            
            toast.error('Error sending message, please try again.')
            removeMessage(message.id)
            textareaRef.current?.focus() // refocus the text input to send again
        }
    })
    
    return <div {...props} className={cn('border-t border-zinc-300', className)}>
        <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
            {/* Text Area Auto Size */}
            <TextareaAutosize
                ref={textareaRef}
                rows={2}
                onKeyDown={(e) => { 
                    // !e.shiftKey is to prevent shift+enter from sending message / shift+enter is to go to next line
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault() // prevent page reload
                        // creates a new message object
                        const message: Message = {
                            id: nanoid(), // adds a unique id to each message                            
                            isUserMessage: true, // style for bot/user message
                            text: input
                        }
                        // send the message object
                        sendMessage(message)
                    }
                }}
                maxRows={4} // more than 4 will scroll
                disabled={isLoading} // disables the text input while loading
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus // adds focus back to text input
                placeholder='Write a message...'
                className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
            />

            <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
            <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400'>
                    {isLoading ? (
                        <Loader2 className='w-3 h-3 animate-spin' />
                    ) : (
                        <CornerDownLeft className='w-3 h-3' />
                    )}
                </kbd>
            </div>
            <div aria-hidden='true' className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'/>
      </div>
  </div>
}

export default ChatInput
