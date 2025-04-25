import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import axios from "axios";

const DEFAULT_ROUTE = "/auth";

// This hook is used to register a new user
export const useRegisterUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data) => axios.post(`${process.env.BACKEND_URL ? process.env.BACKEND_URL : "http://localhost:8000/api/v1"}${DEFAULT_ROUTE}/register`, data).then((res) => res.data),
      onSuccess: () => {
        toast.success('Registration successful, please login');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };


  // This hook is used to login a user
  export const useLoginUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data) => axios.post(`${process.env.BACKEND_URL ? process.env.BACKEND_URL : "http://localhost:8000/api/v1"}${DEFAULT_ROUTE}/login`, data,{
        withCredentials: true,
            }).then((res) => res.data),
      onSuccess: () => {
        toast.success('Login successful');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };


  // This hook is used to logout a user
  export const useLogoutUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: () => api.post(`${DEFAULT_ROUTE}/logout`).then((res) => res.data),
      onSuccess: () => {
        toast.success('Logout successful.');
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.removeQueries()
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };



  // This hook is used to get the current user
  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: () => api.get(`${DEFAULT_ROUTE}/me`).then((res) => res.data),
    });
  };
  