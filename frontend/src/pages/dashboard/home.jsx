import React, {useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  Input,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  projectsTableData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {

  const [totalMembers, setTotalMembers] = useState('Loading...');
  const [logs, setLogs] = useState([]);
  
  const fetchMemberCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch member count');
      }
      const data = await response.json();
      return data.totalMembers;
      console.log(data);
    } catch (err) {
      console.error('Error fetching member count:', err);
      return 0;
    }
  };


  const TABLE_HEAD = ["Member", "Action", "Details", "Timestamp"];

  useEffect(() => {
    const fetchData = async () => {
      const count = await fetchMemberCount(); // Fetch member count
      setTotalMembers(count.toLocaleString()); // Format and update state
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array ensures it runs only once after the component mounts


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/logs',{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        setLogs(data); // Update state with fetched logs
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };
    fetchLogs(); 
  }, []); 


  function convertToDayAndTime(timestamp) {
    const date = new Date(timestamp);
  
    // Get day of the week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = daysOfWeek[date.getUTCDay()];
  
    // Get hours and minutes
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  
    // Format time as `hours:minutes AM/PM`
    const time = `${hours}:${minutes} ${period}`;
  
    return `${day}, ${time}`;
  }
  

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, value, footer, }) => (
          <StatisticsCard
            key={title}
            value= {totalMembers}
            title= 'Total Member count'
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}

          />
        ))}
      </div>
      <div className="mb-4 gap-6 xl:grid-cols-3">
      <Card className="h-full w-full overflow-scroll border border-gray-300 px-6">
      <div className="mt-3 underline font-bold">
              <Typography
                    variant="medium"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    Activity Logs
                  </Typography>
        </div>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(({ username, action, createdAt, details }, index) => {
              const isLast = index === logs.length - 1;
              const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";
 
              return (
                <tr key={name} className="hover:bg-gray-50">
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {username}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {action}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {details}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {convertToDayAndTime(createdAt.toLocaleString())}
                    </Typography>
                  </td>
                </tr>
              );
            })}



          </tbody>
        </table>
      </Card>
      </div>
    </div>
  );
}

export default Home;
