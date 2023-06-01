// chat header, will have a green dot
import { FC } from 'react'

interface ChatHeaderProps {
  
}

const ChatHeader: FC<ChatHeaderProps> = ({}) => {
    return <div className='w-full flex gap-3 justify-start items-center text-zinc-800'>
        <div className='flex flex-col items-start text-sm'>
            <p className='text-xs'>Chat with</p>
            <div className='flex gap-1.5 items-center'>
                {/* green dot */}
                <p className='w-3 h-3 rounded-full bg-green-500' />
                <p className='font-medium'>BookBuddy support</p>
            </div>
        </div>
    </div>
}

export default ChatHeader