import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { getColor } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5'
import { apiClient } from '@/lib/api-client';



const ProfileInfo = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const logOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });

            if (response.status == 200) {
                navigate('/auth');
                setUserInfo(null);
            }
        }
        catch (error) {
            console.log(err);
        }
    }

    return (
        <div className='absolute bottom-0 w-full h-16 flex justify-center items-center px-10  bg-[#2a2b33]'>
            <div className="flex gap-3 items-center justify-center">
                <div className='w-12 h-12 relative'>
                    <Avatar className='h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden'>
                        {
                            userInfo.image ?
                                <AvatarImage
                                    src={`${HOST}/${userInfo.image}`}
                                    alt='Profile'
                                    className='object-cover w-full h-full bg-black' />
                                :
                                <div className={`uppercase h-12 w-12  text-lg border-[1px] 
                                flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}>
                                    {userInfo.firstName
                                        ?
                                        userInfo.firstName.split("").shift()
                                        :
                                        userInfo.email.split("").shift()}
                                </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div >
            </div>
            <div className='flex gap-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2
                                className='text-purple-500 text-xl font-medium'
                                onClick={() => navigate("/profile")} />
                        </TooltipTrigger>
                        <TooltipContent
                            className='bg-[#1c1b1e] border-none text-white'>
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp
                                className='text-red-500 text-xl font-medium'
                                onClick={logOut} />
                        </TooltipTrigger>
                        <TooltipContent
                            className='bg-[#1c1b1e] border-none text-white'>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo
