import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

     

    setError(""); // Clear previous errors
    setIsSubmitting(true);

    const roleId = 2; // Default roleId for user

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          roleId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
  
        // Handle specific HTTP status codes
        switch (response.status) {
          case 400:
            throw new Error(errorData.message || 'Bad request. Please check your input.');
          case 401:
            throw new Error(errorData.message || 'Unauthorized. Please check your credentials.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(errorData.message || 'An error occurred during registration.');
        }
      }

      // Display success message
      toast.success('User registered successfully', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
      });
      // Clear inputs and redirect to login page
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (err) {
      // Display error message from the error thrown
      setError(err.message || 'Please ensure the details are correct and try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false); // Reset submitting state after the request
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-full sm:w-3/5 flex flex-col items-center justify-center">
        
        <div className="text-center">
          <Typography variant="h4" className="font-bold mb-4 mt-3">Add Members to the System</Typography>
        </div>
        <form className="mt-4 mb-1 mx-auto w-full  max-w-screen-lg lg:w-3/4" onSubmit={handleRegister}>
          <div className="mb-1 flex flex-col gap-6">
          <Typography variant="small" color="blue-gray" className="-mb-2 font-medium">
              Username
            </Typography>
            <Input
              size="lg"
              type="text"
              placeholder="Enter Username "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              type="email"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {error && (
            <Typography variant="small" color="red" className="text-center text-sm mb-3">
              {error}
            </Typography>
          )}
          <Button 
            className="mt-6" 
            fullWidth 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Member...' : 'Add Member'}
          </Button>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
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

export default SignUp;
