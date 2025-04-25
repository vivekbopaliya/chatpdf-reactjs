import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { useGetCurrentUser } from "../hooks/auth-hook";
import AuthForm from "../components/auth/auth-form";

const AuthPage = () => {
    const navigate = useNavigate();
    const { data: user, isLoading: userLoading } = useGetCurrentUser();

    useEffect(() => {
      if (user && !userLoading) {
        // User is logged in, redirect to the new PDF page
        navigate('/pdf/new');
      }
    }, [user, userLoading, navigate]);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md border-none shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              ChatPDF
            </CardTitle>
            <p className="text-center text-gray-600 mt-1">
              Upload and chat with your PDFs
            </p>
          </CardHeader>
          <AuthForm />
        </Card>
      </div>
    );
  };


export default AuthPage;