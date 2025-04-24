import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import toast from "react-hot-toast";

const DEFAULT_ROUTE = "/auth";

export const useRegisterUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data) => api.post(`${DEFAULT_ROUTE}/register`, data).then((res) => res.data),
      onSuccess: () => {
        toast.success('Registration successful, please login');
      },
      onError: (error) => {
        console.log(error)
        if (error.response?.status === 400) {
          return toast.error('Email already registered, please login');
        }
        toast.error('Error registering user, please try again');
        console.error(error);
      },
    });
  };


  export const useLoginUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data) => api.post(`${DEFAULT_ROUTE}/login`, data).then((res) => res.data),
      onSuccess: () => {
        toast.success('Login successful');
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          return toast.error('Invalid credentials, please provide correct email and password');
        }
        toast.error('Error logining user, please try again');
        console.error(error);
      },
    });
  };


  export const useLogoutUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: () => api.post(`${DEFAULT_ROUTE}/logout`).then((res) => res.data),
      onSuccess: () => {
        toast.success('Logout successful');
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          return toast.error('You are not logged in.');
        }
        toast.error('Error loging out user, please try again');
        console.error(error);
      },
    });
  };



  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: () => api.get(`${DEFAULT_ROUTE}/me`).then((res) => res.data),
    });
  };
  