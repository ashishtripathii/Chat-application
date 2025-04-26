import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannels } = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apiClient(GET_ALL_CONTACTS_ROUTE, { withCredentials: true });
                setAllContacts(response.data.contacts);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        getData();
    }, []);

    const createChannel = async () => {
        try {
            console.log(channelName);
            console.log(selectedContacts);
            console.log("CREATE_CHANNEL_ROUTE:", CREATE_CHANNEL_ROUTE);

            // Check that a channel name is provided and at least one contact is selected
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value),
                }, { withCredentials: true });

                // why this below line is not working
                console.log(response.status);
                if (response.status === 201) {

                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannels(response.data.channel);
                }
            } else {
                alert("Please provide a channel name and select at least one contact.");
            }
        } catch (error) {
            console.log(error);
            console.log("Error creating channel:", error);
        }
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-[#1c1b1e] border-none mb-2 p-3">
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new Channel.</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">No result found</p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
