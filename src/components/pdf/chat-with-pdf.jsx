import React, { useState } from "react";
import { SendHorizontal, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useChatWithPDF } from "../../hooks/chat-hook";

const TextBox = ({setChatHistory}) => {
  const [question, setQuestion] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(undefined);
  const { pdfId } = useParams();
  const { mutate: sendQuestion, isPending: chatLoading } = useChatWithPDF();

  const handleSendQuestion = () => {
    if (!question.trim()) return;

    sendQuestion(
      {
        question,
        pdf_id: pdfId,
        conversation_id: currentConversationId,
      },
      {
        onSuccess: (data) => {

          const updatedChatHistory = [
            {
              user: question,
              ai: data.answer,
              timestamp: new Date().toISOString(),
            },
          ];
          setChatHistory((prev) => [...prev, ...updatedChatHistory]);
          setCurrentConversationId(data.conversation_id);
          setQuestion("");
        },
        onError: () => {
          toast.error("Failed to get a response. Please try again.");
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="relative w-screen flex sm:pb-12 pb-9 bg-gray-50 justify-center items-center">
      <div className="relative sm:w-4/5 w-11/12">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={chatLoading}
          placeholder="Ask a question..."
          className="disabled:bg-gray-300 disabled:cursor-not-allowed disabled:bg-opacity-35 w-full bg-[#FFFFFF] border shadow-sm border-[#E4E8EE] placeholder:text-[#6E7583] text-sm sm:px-9 px-6 sm:py-4 py-3 focus:outline-none rounded-md"
        />

        <div className="absolute text-[#6E7583] inset-y-0 right-0 flex items-center sm:pr-6 pr-4 hover:text-black cursor-pointer">
          <button
            onClick={handleSendQuestion}
            disabled={!question.trim() || chatLoading}
            className="absolute right-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {chatLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              <SendHorizontal className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
