"use client"
import { MessagesContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useContext } from 'react'
import MarkdownLite from './MarkdownLite'

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement>{
  
}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
    const { messages } = useContext(MessagesContext)
    const inverseMessage = [...messages].reverse() // reverse the messages array


    return (
        <div
            {...props}
            className={cn(
                'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch',
                className
            )}>
            <div className='flex-1 flex-grow' /> {/* empty div to push messages to the top */}
            {inverseMessage.map((message) => (
                <div key={message.id} className='chat-message'>
                    <div className={cn('flex items-end', {
                        'justify-end': message.isUserMessage, // if message is user message, justify to the end

                    })}>
                        <div className={cn('flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden', {
                            'order-1 items-end': message.isUserMessage,
                            'order-2 items-start': !message.isUserMessage
                        }
                        )}>
                            <p className={cn('px-4 py-2 rounded-lg', {
                                'bg-blue-600 text-white': message.isUserMessage,
                                'bg-gray-200 text-gray-900': !message.isUserMessage,

                            })}>
                            
                                <MarkdownLite text={message.text} />
                            </p>
                            
                        
                        
                        </div>
                    </div>
                </div>
            ))}
            ChatMessages
        </div>)
}

export default ChatMessages