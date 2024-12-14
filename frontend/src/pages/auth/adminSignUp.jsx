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

export function AdminSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

     // Check if checkbox is checked
     if (!isChecked) {
      setCheckboxError("You must agree to the Terms and Conditions.");
      return;
    }

    setError(""); // Clear previous errors
    setCheckboxError(""); // Clear checkbox error
    setIsSubmitting(true);

    const roleId = 1; // Default roleId for Admin

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
      toast.success('User registration successful! Redirecting to login...', {
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
      setTimeout(() => {
        navigate('/');
      }, 3000);
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
      <div className="w-2/5 h-3/5 hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="flex justify-center items-center">
          <img
            src="/img/logo.svg"
            height={220} width={220}
            className="mx-auto"
          />
        </div>
        <div className="text-center">
          <Typography variant="h4" className="font-bold mb-4 mt-3">Join Us Today</Typography>
          <Typography variant="medium" className="mb-2 mt-2">Sign up as Admin</Typography>
        </div>
        <form className="mt-1 mb-2 mx-auto w-80 max-w-screen-lg lg:w-4/5" onSubmit={handleRegister}>
          <div className="mb-1 flex flex-col gap-6">
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
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
              Your Email
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
          <Checkbox
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

          {error && (
            <Typography variant="small" color="red" className="text-center text-sm mb-3">
              {error}
            </Typography>
          )}
          
          {checkboxError && (
            <Typography variant="small" color="red" className="text-center text-sm mb-4">
              {checkboxError}
            </Typography>
          )}
          <Button 
            className="mt-6" 
            fullWidth 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
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

export default AdminSignUp;
