import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Members } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};


const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        roles: ["Admin"], // Only admins can see this
        element: <Home />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Members",
        path: "/members",
        roles: ["Admin",], 
        element: <Members />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Add User",
        path: "/add-user",
        roles: ["Admin",], // Both admins and users can see this
        element: <SignUp />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        roles: ["Admin", "User"], // Both admins and users can see this
        element: <Profile />,
      },
    ],
  },
];


export default routes;
