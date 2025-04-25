import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
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
  // Check if the user is on the new PDF page or an existing PDF page
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
      // Redirect to auth page if the PDF is not found
      // This is a fallback in case the user tries to access a PDF directly
      navigate("/auth");
    }
  }, [pdfError, navigate, isNewPdf]);

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      // Latest conversation is the first one in the array
      // As conversations are sorted by date in descending order
      const latestConversation = conversations[0];
      setChatHistory(latestConversation.conversation);
    } else {
      setChatHistory([]);
    }
  }, [conversations, isNewPdf]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  if (!isNewPdf && (isPdfLoading || isConversationsLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 sm:h-10 sm:w-10" />
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
          <div className="space-y-6 w-11/12 sm:w-10/12 mx-auto">
            {isNewPdf ? (
              <></>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 mb-8 mt-3 text-sm sm:text-lg px-2 sm:px-3 py-2 justify-start items-start"
                >
                  <main className="flex w-full">
                    <p className="text-gray-900 opacity-80">{message.user}</p>
                  </main>
                  <main className="flex gap-4 sm:gap-6 justify-start items-start sm:items-center w-full">
                    <img
                      src={AiLogo}
                      alt="AI logo"
                      className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
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
      <TextBox setChatHistory={setChatHistory} />
    </div>
  );
};

export default HomePage;