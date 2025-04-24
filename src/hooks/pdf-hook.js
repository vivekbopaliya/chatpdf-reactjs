import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export const useUploadPDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/api/v1/pdfs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF uploaded successfully');
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        return toast.error('Please upload a valid PDF file');
      }
      console.log(error)
      toast.error(error.response.data.detail);
      console.error(error);
    },
  });
};

export const useChatWithPDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionData) =>
      api.post('/chat', questionData).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', data.pdf_id] });
      toast.success('Question submitted successfully');
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

export const useGetPDFs = () => {
  return useQuery({
    queryKey: ['pdfs'],
    queryFn: () => api.get('/pdfs').then((res) => res.data),
  });
};

export const useGetConversations = (pdfId) => {
  return useQuery({
    queryKey: ['conversations', pdfId],
    queryFn: () => api.get(`/conversations/${pdfId}`).then((res) => res.data),
    enabled: !!pdfId,
  });
};

export const useDeletePDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pdfId) => api.delete(`/pdfs/${pdfId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF deleted successfully');
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        return toast.error('PDF not found');
      }
      toast.error('Error deleting PDF');
      console.error(error);
    },
  });
};


export const useGetSinglePDF = (pdfId) => {
    return useQuery({
      queryKey: ['pdf', pdfId],
      queryFn: () => api.get(`/pdfs/${pdfId}`).then((res) => res.data),
      enabled: !!pdfId,
    });
  };