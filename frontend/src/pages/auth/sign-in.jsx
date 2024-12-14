import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset errors
    setError('');
    setFieldErrors({ username: '', password: '' });

    let hasError = false;
    const newFieldErrors = {};

    if (!username.trim()) {
      newFieldErrors.username = 'Email is required';
      hasError = true;
    }
    if (!password.trim()) {
      newFieldErrors.password = 'Password is required';
      hasError = true;
    }

    setFieldErrors(newFieldErrors);

    if (hasError) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Save JWT
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId',data.user.id);

      // Display success message
      toast.success('Login successful', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Extract user role from the JWT or response
      const userRole = data.user.role; // assuming `data.role` is returned with the response
      console.log(userRole)
      // Redirect based on role
      if (userRole === 'Admin') {
        setTimeout(() => {
          navigate('/dashboard/home');
        }, 3000);
      } else if (userRole === 'User') {
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 3000);
      } else {
        setError('Invalid role');
      }
      
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="flex justify-center items-center">
          <img
            src="/img/logo.svg"
            height={220} width={220}
            className="mx-auto"
          />
        </div>
        <div className="text-center">
          <Typography variant="h3" className="font-bold mb-4 mt-3">Sign In</Typography>
          <Typography variant="medium" color="blue-gray" className="font-normal">Enter your Username and Password to Sign In.</Typography>
        </div>
        <form onSubmit={handleLogin} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-4/5">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your Username
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Username"
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${fieldErrors.username ? 'border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!fieldErrors.username}
            />
            {fieldErrors.username && (
              <Typography variant="small" color="red" className="-mt-3">
                {fieldErrors.username}
              </Typography>
            )}

            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${fieldErrors.password ? 'border-red-500' : ''}`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <Typography variant="small" color="red" className="-mt-3">
                {fieldErrors.password}
              </Typography>
            )}
          </div>
          <div className="flex items-end justify-end gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          {error && (
            <Typography variant="small" color="red" className="text-center mt-4">
              {error}
            </Typography>
          )}
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up-admin" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </section>
  );
}

export default SignIn;
