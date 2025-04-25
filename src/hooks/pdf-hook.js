import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

const DEFAULT_ROUTE = '/pdf'

// This hook is used to upload a PDF file
export const useUploadPDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`${DEFAULT_ROUTE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF uploaded successfully.');
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        return toast.error('Only PDF files are allowed.');
      }
      console.log(error)
      toast.error(error.response.data.detail);
      console.error(error);
    },
  });
};



// This hook is used to get the list of PDFs
export const useGetPDFs = () => {
  return useQuery({
    queryKey: ['pdfs'],
    queryFn: () => api.get(`${DEFAULT_ROUTE}/pdfs`).then((res) => res.data),
  });
};



// This hook is used to delete a PDF
export const useDeletePDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pdfId) => api.delete(`${DEFAULT_ROUTE}/${pdfId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF deleted successfully. ');
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
      queryFn: () => api.get(`${DEFAULT_ROUTE}/${pdfId}`).then((res) => res.data),
      enabled: !!pdfId,
    });
  };