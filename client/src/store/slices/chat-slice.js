

export const createChatSlice = (set, get) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        directMessagesContacts: [],
        isUploading: false,
        isDowloading: false,
        fileUploadProgress: 0,
        fileDownloadProgress: 0,
        channels: [],
        setChannels: (channels) => set({ channels }),
        setIsUploading: (isUploading) => set({ isUploading }),
        setIsDownloading: (isDowloading) => set({ isDowloading }),
        setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
        setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
        setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
        setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
        setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
        setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
        addChannels: (channel) => {
            const channels = get().channels;
            set({ channels: [channel, ...channels] })
        },
        closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] }),
        addMessage: (message) => {
            const selectedChatMessages = get().selectedChatMessages;
            const selectedChatType = get().selectedChatType;

            set({
                selectedChatMessages: [
                    ...selectedChatMessages, {
                        ...message,
                        recipient:
                            selectedChatType === 'channel'
                                ? message.reciptient :
                                message.recipient._id,
                        sender: selectedChatType === 'channel'
                            ? message.sender :
                            message.sender._id,
                    },
                ],
            });
        },


    }

);
