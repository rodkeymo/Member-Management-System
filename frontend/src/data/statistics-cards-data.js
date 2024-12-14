import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

// Function to fetch member count
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

// Statistics Cards Data
export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Users",
    value: '', // Temporary placeholder value
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
];

// Update `value` dynamically
export const updateStatisticsCardsData = async () => {
  const totalMembers = await fetchMemberCount();
  statisticsCardsData[0].value = totalMembers.toLocaleString(); // Dynamically update with fetched count
};

export default statisticsCardsData;
