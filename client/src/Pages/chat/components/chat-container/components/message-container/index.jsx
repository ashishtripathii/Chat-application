import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from 'moment';
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

import { getColor } from "@/lib/utils";

const MessageContainer = () => {
    const scrollRef = useRef();
    const { selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
        setSelectedChatMessages,
        setIsDownloading,
        setFileDownloadProgress
    } = useAppStore();
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {

        const getMessages = async () => {
            try {
                const response = await apiClient.post
                    (
                        GET_ALL_MESSAGES_ROUTE,
                        {
                            id: selectedChatData._id,
                        },
                        { withCredentials: true }
                    );
                console.log("All Messages from DB :", response.data.messages)

                if (response.data.messages) {

                    setSelectedChatMessages(response.data.messages);
                }
            }
            catch (error) {
                console.log(error);
            }

        }

        const getChannelMessges = async () => {
            try {
                const response = await apiClient.get
                    (
                        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
                        { withCredentials: true }
                    );
                console.log("All Messages from DB :", response.data.messages)

                if (response.data.messages) {

                    setSelectedChatMessages(response.data.messages);
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        if (selectedChatData._id) {
            if (selectedChatType === 'contacts') getMessages();
            else if (selectedChatType === 'channel') getChannelMessges();
        }


    }, [selectedChatData,
        selectedChatType,
        setSelectedChatMessages]);

    const checkImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|heic)$/i;

        return imageRegex.test(filePath);

    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }

    }, [selectedChatMessages]);


    const downloadFile = async (url) => {
        setIsDownloading(true);
        setFileDownloadProgress(0);
        const response = await apiClient.get(`${HOST}/${url}`,
            {
                responseType: "blob",

                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percentCompleted = Math.round((loaded * 100) / total);
                    setFileDownloadProgress(percentCompleted);
                }
            });

        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownloading(false);
        setFileDownloadProgress(0);
    }

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
            const showDate = messageDate !== lastDate;

            lastDate = messageDate;

            return (
                <div key={index}>
                    {showDate &&
                        (
                            <div
                                className='text-center text-gray-500 my-2 '>
                                {moment(message.timestamp).format("LL")}
                            </div>
                        )}
                    {
                        selectedChatType === 'contact' && renderDMMessages(message)
                    }
                    {
                        selectedChatType === 'channel' && renderChannelMessages(message)
                    }
                </div>
            )
        })
    }


    const renderDMMessages = (message) => {
        return (<div
            className={`${message.sender === selectedChatData._id ?
                "text-left" : "text-right"
                }`}>
            {
                message.messageType === 'text' && (
                    <div
                        className={`${message.sender !== selectedChatData._id ?
                            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50  "
                            : "bg-[#2a2b33]/5 text-white/50 border-[#ffffff]/20"} 
             border inline-block p-4 rounded my-1 max-w-[50%] break-words `
                        }>
                        {message.content}
                    </div>
                )}
            {
                message.messageType === 'file' && (
                    <div
                        className={`${message.sender !== selectedChatData._id ?
                            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50  "
                            : "bg-[#2a2b33]/5 text-white/50 border-[#ffffff]/20"} 
             border inline-block p-4 rounded my-1 max-w-[50%] break-words `
                        }>
                        {

                            checkImage(message.fileUrl)
                                ?
                                <div className="cursor-pointer"
                                    onClick={() => {
                                        setShowImage(true);
                                        setImageURL(message.fileUrl);
                                    }}
                                >
                                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                                </div>
                                :
                                <div className="flex items-center  justify-center gap-4">
                                    <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3 ">
                                        <MdFolderZip />
                                    </span>
                                    <span>
                                        {message.fileUrl.split("/").pop()}
                                    </span >
                                    <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "

                                        onClick={() => downloadFile(message.fileUrl)}
                                    >
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>

                        }
                    </div>
                )
            }
            <div className="text-xs text-gray-600">
                {moment(message.timestamp).format("LT")}
            </div>


        </div>)

    }

    // const renderChannelMessages = (message) => {

    //     return (
    //         <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
    //             {
    //                 message.messageType === 'text' && (
    //                     <div
    //                         className={`${message.sender._id !== userInfo.id ?
    //                             "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50  "
    //                             : "bg-[#2a2b33]/5 text-white/50 border-[#ffffff]/20"} 
    //          border inline-block p-4 rounded my-1 max-w-[50%] break-words `
    //                         }>
    //                         {message.content}
    //                     </div>
    //                 )}
    //             {
    //                 message.sender._id !== userInfo.id ? (
    //                     <div className="flex items-center justify-start gap-3 ">
    //                         <Avatar className='h-8 w-18 rounded-full overflow-hidden'>
    //                             {
    //                                 message.sender.image && (
    //                                     <AvatarImage
    //                                         src={`${HOST}/${message.sender.image}`}
    //                                         alt='Profile'
    //                                         className='object-cover w-full h-full'
    //                                     />
    //                                 )}

    //                             <AvatarFallback
    //                                 className={`uppercase h-8 w-8  text-lg  
    //                                     flex items-center justify-center rounded-full 
    //                                     ${getColor(message.sender.color
    //                                 )} `}>

    //                                 {
    //                                     message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()}
    //                             </AvatarFallback>
    //                         </Avatar>
    //                         <span className="text-sm text-white/60 ">
    //                             {`
    //                             ${message.sender.firstName}
    //                             ${message.sender.lastName}
    //                             `
    //                             }
    //                         </span>
    //                         <span className="text-sm text-white/60 ">
    //                             {moment(message.timestamp).format("LT")}
    //                         </span>
    //                     </div>
    //                 ) : (
    //                     <div className="text-sm text-white/60 mt-1 ">
    //                         {moment(message.timestamp).format("LT")}
    //                     </div>
    //                 )
    //             }
    //         </div>
    //     )
    // }
    const renderChannelMessages = (message) => {
        const sender = message.sender || {}; // fallback
        const isMyMessage = sender?._id === userInfo?.id;

        return (
            <div className={`mt-5 ${!isMyMessage ? "text-left" : "text-right"}`}>
                {
                    message.messageType === 'text' && (
                        <div
                            className={`${!isMyMessage ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                                : "bg-[#2a2b33]/5 text-white/50 border-[#ffffff]/20"} 
                                border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                        >
                            {message.content}
                        </div>
                    )
                }
                {
                    message.messageType === 'file' && (
                        <div
                            className={`${message.sender === userInfo.id ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50  "
                                : "bg-[#2a2b33]/5 text-white/50 border-[#ffffff]/20"} 
             border inline-block p-4 rounded my-1 max-w-[50%] break-words `
                            }>
                            {

                                checkImage(message.fileUrl)
                                    ?
                                    <div className="cursor-pointer"
                                        onClick={() => {
                                            setShowImage(true);
                                            setImageURL(message.fileUrl);
                                        }}
                                    >
                                        <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                                    </div>
                                    :
                                    <div className="flex items-center  justify-center gap-4">
                                        <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3 ">
                                            <MdFolderZip />
                                        </span>
                                        <span>
                                            {message.fileUrl.split("/").pop()}
                                        </span >
                                        <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "

                                            onClick={() => downloadFile(message.fileUrl)}
                                        >
                                            <IoMdArrowRoundDown />
                                        </span>
                                    </div>

                            }
                        </div>
                    )
                }

                {
                    !isMyMessage ? (
                        <div className="flex items-center justify-start gap-3">
                            <Avatar className='h-8 w-8 rounded-full overflow-hidden'>
                                {
                                    sender?.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${sender.image}`}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <AvatarFallback
                                            className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(sender?.color)}`}
                                        >
                                            {sender?.firstName?.[0] || sender?.email?.[0] || "?"}
                                        </AvatarFallback>
                                    )
                                }
                            </Avatar>

                            <span className="text-sm text-white/60">
                                {(sender?.firstName || "") + " " + (sender?.lastName || "")}
                            </span>

                            <span className="text-sm text-white/60">
                                {moment(message.timestamp).format("LT")}
                            </span>
                        </div>
                    ) : (
                        <div className="text-sm text-white/60 mt-1">
                            {moment(message.timestamp).format("LT")}
                        </div>
                    )
                }
            </div>
        );
    };


    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:[65vw] lg:w-[80vw] w-full">
            {
                renderMessages()
            }
            <div ref={scrollRef} />
            {
                showImage
                &&
                (<div className="fixed z-[1000] top-0 left-0
                   h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col
                   ">
                    <div>
                        <img src={`${HOST}/${imageURL}`}
                            className="h-[80vh] w-full object-contain" />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-5">
                        <button onClick={() => downloadFile(imageURL)} className="bg-black/20 p-3 text-2xl rounded-full hoer:bg-black/50 cursor-pointer transition-all duration-300 ">
                            <IoMdArrowRoundDown />
                        </button>

                        <button onClick={() => {
                            setShowImage(false);
                            setImageURL(null);
                        }} className="bg-black/20 p-3 text-2xl rounded-full hoer:bg-black/50 cursor-pointer transition-all duration-300 ">
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default MessageContainer
