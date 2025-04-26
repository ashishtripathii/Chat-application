import { useAppStore } from '@/store'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { RiCloseFill } from 'react-icons/ri';
import { getColor } from '@/lib/utils';
import { HOST } from '@/utils/constants';

const ChatHeader = () => {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
            <div className="flex gap-5 items-center w-full justify-between ">
                <div className="flex gap-3 items-center justify-center">
                    <div className='w-12 h-12 relative'>
                        {
                            selectedChatType === 'contact' ? (<Avatar className='h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden'>
                                {
                                    selectedChatData.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${userInfo.image}`}
                                            alt='Profile'
                                            className='object-cover w-full h-full'
                                             />
                                    ) :
                                        (
                                        <div 
                                        className={`uppercase h-12 w-12  text-lg border-[1px] 
                                        flex items-center justify-center rounded-full 
                                        ${getColor(selectedChatData.color
                                        )} `}>

                                            {selectedChatData.firstName
                                                ?
                                                selectedChatData.firstName.split("").shift()
                                                :
                                                selectedChatData.email.split("").shift()}
                                        </div>
                                        )}
                            </Avatar>
                            ) : (<div
                                className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>)
                        }

                    </div>
                    <div>
                        {
                            selectedChatType === 'channel' && selectedChatData.name
                        }
                        {
                            selectedChatType === 'contact' && selectedChatData.firstName ?
                                `${selectedChatData.firstName}  ${selectedChatData.lastName}` : selectedChatData.email
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5"></div>
                <button className='text-neutral-500 focus:border-none focus:outline-none
                 focus:text-white duration-300 transition-all'
                    onClick={closeChat}
                >
                    <RiCloseFill className='text-3xl' />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader