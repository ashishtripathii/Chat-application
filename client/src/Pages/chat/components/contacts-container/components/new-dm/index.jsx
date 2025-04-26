import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";

import { animationDefaultOptions } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";





const NewDM = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true });

                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                }
                else {
                    setSearchedContacts([]);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const selectNewContacts = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact")
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-[#1c1b1e] border-none mb-2 p-3'>
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                    <DialogHeader>
                        <DialogTitle>Please Select a Contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" className='rounded-lg p-6 bg-[#2c2e3b] 
                        border-none'
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {
                        searchedContacts.length > 0 && (
                            <ScrollArea className='h-[250px]'>
                                <div className="flex flex-col gap-5 ">
                                    {
                                        searchedContacts.map(
                                            contacts =>
                                                <div key={contacts._id}
                                                    onClick={() => selectNewContacts(contacts)}
                                                    className="flex gap-3 items-center cursor-pointer">
                                                    <div className='w-12 h-12 relative'>
                                                        <Avatar className='h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden'>
                                                            {
                                                                contacts.image ? (
                                                                    <AvatarImage
                                                                        src={`${HOST}/${userInfo.image}`}
                                                                        alt='Profile'
                                                                        className='object-cover w-full h-full bg-black roundded-full' />
                                                                ) :
                                                                    (<div className={`uppercase h-12 w-12  text-lg border-[1px] 
                                    flex items-center justify-center rounded-full ${getColor(contacts.color)} `}>
                                                                        {contacts.firstName
                                                                            ?
                                                                            contacts.firstName.split("").shift()
                                                                            :
                                                                            contacts.email.split("").shift()}
                                                                    </div>
                                                                    )}
                                                        </Avatar>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {
                                                                contacts.firstName && contacts.lastName ?
                                                                    `${contacts.firstName} ${contacts.lastName}` :
                                                                    contacts.email
                                                            }
                                                        </span>
                                                        <span className="text-xs">{contacts.email}</span>

                                                    </div>
                                                </div>
                                        )}
                                </div>

                            </ScrollArea>
                        )
                    }

                    {
                        searchedContacts.length == 0 &&
                        <div className='flex-1 md:flex md:mt-0  flex-col justify-center items-center mt-5 duration-1000 transition-all '>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className='text-opacity-80 text-white flex  flex-col gap-5 items-center mt-5 
            lg:text-2xl text-3xl transition-all duration-300  text-center'>
                                <h3 className='popins-medium'>
                                    Hi <span className='text-purple-500'>!</span> Search new
                                    <span className='text-purple-500'> Contacts</span>
                                    <span className='text-purple-500'>.</span>
                                </h3>
                            </div>
                        </div>

                    }
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDM
