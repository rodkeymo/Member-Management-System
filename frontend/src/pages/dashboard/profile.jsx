import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Input,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    title: "",
    mobile: "",
    email: "",
    bio: "",
    profilePicture: "/img/bruce-mars.jpeg",
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchMemberData();
    }
  }, [userId]);

  const fetchMemberData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch member data');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching member data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prevData => ({
        ...prevData,
        profilePicture: imageUrl,
      }));
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      toast.success('Profile updated successfully', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              {isEditing ? (
                <div className="relative">
                  <Avatar
                    src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    alt='Avatar'
                    size="xl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <Avatar
                  src={profileData.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  alt="profile"
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
              )}
              <div>
                {isEditing ? (
                  <Input
                    name="username"
                    placeholder="Enter Your Names"
                    value={profileData.username}
                    onChange={handleChange}
                    size="lg"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900 mb-3"
                  />
                ) : (
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {profileData.username || "Username"}
                  </Typography>
                )}
                {isEditing ? (
                  <Input
                    name="title"
                    placeholder="Enter Your Title"
                    value={profileData.title}
                    onChange={handleChange}
                    size="lg"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-3"
                  />
                ) : (
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    {profileData.title || "Enter Title..."}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="mb-12 gap-8 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Mobile
              </Typography>
              {isEditing ? (
                <Input
                  name="mobile"
                  value={profileData.mobile}
                  onChange={handleChange}
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                />
              ) : (
                <Typography>{profileData.mobile || "Enter Mobile Number"}</Typography>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Email
              </Typography>
              {isEditing ? (
                <Input
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                />
              ) : (
                <Typography>{profileData.email || "Enter Email"}</Typography>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Bio
              </Typography>
              {isEditing ? (
                <Input
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                />
              ) : (
                <Typography>{profileData.bio || "Enter Bio info..."}</Typography>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            {isEditing ? (
              <Button onClick={handleSubmit} color="green">
                Save
              </Button>
            ) : (
              <Tooltip content="Edit Profile">
                <PencilIcon
                  className="h-5 w-5 text-blue-gray-500 cursor-pointer"
                  onClick={toggleEdit}
                />
              </Tooltip>
            )}
          </div>
        </CardBody>
      </Card>
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
    </>
  );
}

export default Profile;
