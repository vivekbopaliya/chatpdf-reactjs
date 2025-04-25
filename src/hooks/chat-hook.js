import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import toast from "react-hot-toast";

const DEFAULT_ROUTE = "/chat";

export const useChatWithPDF = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (questionData) =>
        api.post(`${DEFAULT_ROUTE}/`, questionData).then((res) => res.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['conversations', data.pdf_id] });
      },
      onError: (error) => {
        if (error.response?.status === 400) {
          return toast.error('Question cannot be empty');
        }
        if (error.response?.status === 404) {
          return toast.error('PDF or conversation not found');
        }
        toast.error('Error processing question');
        console.error(error);
      },
    });
  };

  export const useGetConversations = (pdfId) => {
    return useQuery({
      queryKey: ['conversations', pdfId],
      queryFn: () => api.get(`${DEFAULT_ROUTE}/conversations/${pdfId}`).then((res) => res.data),
      enabled: !!pdfId,
    });
  };