import React, {useEffect, useState } from "react";
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  projectsTableData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function Members() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const TABLE_HEAD = [ "Member", "Email", "Mobile", "Bio" ];
  
    useEffect(() => {
      fetchMembers();
    }, [searchTerm, page]);
  
    const fetchMembers = async () => {
      try {
        const url = `http://localhost:5000/api/members?page=${page}&pageSize=${pageSize}&searchTerm=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setMembers(data.members);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch members');
        setLoading(false);
      }
    };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handlePageChange = (direction) => {
      if (direction === 'prev') {
        setPage(prevPage => prevPage > 1 ? prevPage - 1 : 1);
      } else {
        setPage(prevPage => prevPage < totalPages ? prevPage + 1 : totalPages);
      }
    };
  
    const handlePageSizeChange = (size) => {
      setPageSize(size);
      setPage(1);
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Members list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link to='/dashboard/add-user'>
              <Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(({ username, title, email, mobile, profilePicture, bio }, index) => {
              const isLast = index === members.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={username}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar src={profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={username} size="sm" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {username}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {email}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {title}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {mobile}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {bio}
                      </Typography>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {page} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handlePageChange('prev')}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handlePageChange('next')}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Members;
