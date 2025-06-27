import { useForm } from "react-hook-form";
import { Send } from 'lucide-react';
import axiosClient from "../utils/axiosClient";
import { useState, useRef, useEffect } from "react";
import { BotMessageSquare } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How are you"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ]);
     const { register, handleSubmit, reset,formState: {errors} } = useForm();
     const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

     
     let onSubmit=async(data)=>{
           setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
          reset();

        try {
            
            const response = await axiosClient.post("/ai/chat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });

           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
     }

    return (
        <div className="flex flex-col h-screen max-h-[85vh] min-h-[500px]">
              <div className="flex-1 space-y-4 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index}>
                        {
                            msg.role === "model" ? (
                                <>
                                  <div className="chat chat-start">
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                            <BotMessageSquare className="bg-yellow-300 size-10"/>
                                            </div>
                                        </div>
                                        <div className="chat-header">
                                            Aibot
                                        </div>
                                        <div className="chat-bubble">{msg.parts[0].text}</div>
                                </div>
                                </>
                            ):(
                                <>
                                     <div className="chat chat-end">
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                            <CircleUserRound className="bg-yellow-300 size-10"/>
                                            </div>
                                        </div>
                                        <div className="chat-header">
                                            You
                                        </div>
                                        <div className="chat-bubble">{msg.parts[0].text}</div>
                                    </div>
                                </>
                            )
                        }
                  
                 
                    </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="h-13"></div>
              <form 
                onSubmit={handleSubmit(onSubmit)} 
              >
                <div className="h-13 flex justify-evenly -mt-10">
                    <div className=" w-[80%] ">
                         <input {...register("message", { required: true, minLength: 2 })}
                            placeholder="Ask me anything"
                            className="bg-white w-[100%] h-[100%] rounded-4xl input input-bordered text-xl"
                            ></input>
                    </div>
                    <div className="flex items-center">
                        <button type="submit" disabled={errors.message}
                        className="btn rounded-4xl h-13 bg-amber-300 active:bg-amber-500"><Send /></button>
                    </div>
                    
                </div>
            </form>
            
              
        </div>
    );
}

export default ChatAi;