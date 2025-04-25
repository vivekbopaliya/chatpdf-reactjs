
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { useLoginUser, useRegisterUser } from "../../hooks/auth-hook";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: registerUser, isPending: isUserRegistering } = useRegisterUser();
  const { mutateAsync: loginUser, isPending: isUserLoging } = useLoginUser();

  const isLoading = isUserRegistering || isUserLoging;
  const [registerData, setRegisterData] = useState({
    email: '',
    full_name: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!registerData.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (registerData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      await registerUser(registerData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(loginData);
      navigate('/pdf/new');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <CardContent className="pt-6 max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="login" 
            className="rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-200"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-200"
          >
            Register
          </TabsTrigger>
        </TabsList>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-6 text-sm" role="alert">
            <span>{error}</span>
          </div>
        )}

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="border-gray-300 "
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="border-gray-300 "
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isUserLoging}
              className="w-full bg-black hover:bg-gray-800 text-white transition-colors duration-200 flex gap-3"
            >
              Login
              {isLoading && <LoaderCircle className="animate-spin" />}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="John Doe"
                value={registerData.full_name}
                onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="*******"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>
            <Button 
              type="submit" 
              disabled={isUserRegistering}
              className="w-full bg-black hover:bg-gray-800 text-white transition-colors duration-200 flex gap-3"
            >
              Register
              {isLoading && <LoaderCircle className="animate-spin" />}

            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};

export default AuthForm;