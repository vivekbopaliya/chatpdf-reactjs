import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoaderCircle, User } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/header/header";
import AiLogo from "../AiLogo.jpg";
import TextBox from "../components/pdf/chat-with-pdf";
import PDFListDrawer from "../components/drawer/pdf-list";
import { useGetSinglePDF } from "../hooks/pdf-hook";
import { useGetConversations } from "../hooks/chat-hook";

const HomePage = () => {
  const { pdfId } = useParams();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const isNewPdf = !pdfId; 

  const {
    data: pdfInfo,
    isPending: isPdfLoading,
    error: pdfError,
  } = useGetSinglePDF(isNewPdf ? null : pdfId);

  const {
    data: conversations,
    isPending: isConversationsLoading,
  } = useGetConversations(isNewPdf ? null : pdfId);

  useEffect(() => {
    if (!isNewPdf && pdfError) {
      toast.error("PDF not found");
      navigate("/auth");
    }
  }, [pdfError, navigate, isNewPdf]);

  useEffect(() => {
      if (conversations && conversations.length > 0) {
      const latestConversation = conversations[0];
      setChatHistory(latestConversation.conversation);
    } else {
      setChatHistory([]);
    }
  }, [conversations, isNewPdf]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  if (!isNewPdf && (isPdfLoading || isConversationsLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (!isNewPdf && !pdfInfo) {
    return null; 
  }

  return (
    <div className="flex flex-col h-screen">
      <PDFListDrawer />

      <Header pdfInfo={isNewPdf ? { title: "New PDF" } : pdfInfo} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-6 w-10/12 mx-auto">
            {isNewPdf ? (
           <></>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-6 mb-11 mt-4 sm:text-lg text-base px-3 py-2 justify-start items-start"
                >
                  <main className="flex justify-center items-center">
                    <p className="text-gray-900 opacity-80">{message.user}</p>
                  </main>
                  <main className="flex gap-6 justify-center items-center">
                    <img
                      src={AiLogo}
                      alt="AI logo"
                      className="w-16 h-16 object-contain"
                    />
                    <p className="font-medium">{message.ai}</p>
                  </main>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
      <TextBox
        setChatHistory={setChatHistory}
      />
    </div>
  );
};

export default HomePage;