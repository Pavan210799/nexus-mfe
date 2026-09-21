import { getUsers, setUsers, getNotifications, setNotifications } from "./storage";

const extraNames = [
  "Aisha Rahman",
  "Rohan Mehta",
  "Sneha Iyer",
  "Arjun Patel",
  "Meera Shah",
  "Vikram Rao",
  "Nisha Gupta",
  "Karan Singh",
  "Priya Nair",
  "Rahul Verma",
  "Ananya Das",
  "Siddharth Jain",
  "Kavya Reddy",
  "Aman Khanna",
  "Diya Kapoor",
  "Nikhil Bose",
  "Ishita Malhotra",
  "Harsh Vardhan",
  "Pooja Kulkarni",
  "Aditya Menon",
  "Shreya Pillai",
  "Manish Yadav",
  "Tanya Bhatt",
  "Varun Chopra",
  "Riya Sen",
  "Deepak Mishra",
  "Sana Qureshi",
  "Yash Agarwal",
  "Neha Joshi",
  "Mohit Bansal",
  "Aarav Sharma",
  "Fatima Ali",
  "Kunal Desai",
  "Lakshmi Narayan",
  "Omar Farooq",
  "Bhavya Krishnan",
  "Tejas Gowda",
  "Chitra Mohan",
  "Farhan Sheikh",
  "Gaurav Pandey",
  "Hina Chauhan",
  "Ira Banerjee",
  "Jatin Saxena",
  "Komal Gill",
  "Leela Thomas",
  "Mohan Lal",
  "Nandini Rao",
  "Om Prakash",
  "Parul Saxena"
];

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Finance",
  "HR"
];

const roles = ["admin", "moderator", "user"];

function makeEmail(name, index) {
  const parts = name.toLowerCase().split(" ");
  return parts[0] + "." + parts[1] + index + "@company.com";
}

function starterUsers() {
  const pavan = {
    id: "u-1",
    name: "Pavan Kumar",
    email: "pavan@gmail.com",
    password: "123456",
    role: "admin",
    department: "Engineering",
    phone: "9876543210",
    createdAt: "2026-01-10"
  };

  const list = [pavan];

  for (let i = 0; i < extraNames.length; i++) {
    const name = extraNames[i];
    const number = i + 2;
    const role = roles[i % 3];

    list.push({
      id: "u-" + number,
      name: name,
      email: makeEmail(name, number),
      password: "123456",
      role: role,
      department: departments[i % departments.length],
      phone: String(9000000000 + number),
      createdAt:
        "2026-" +
        String((i % 9) + 1).padStart(2, "0") +
        "-" +
        String((i % 27) + 1).padStart(2, "0")
    });
  }

  return list;
}

function starterNotes() {
  return [
    {
      id: "n-1",
      title: "New user joined",
      body: "Priya Nair was added to User Management.",
      read: false,
      createdAt: "2026-09-18T08:00:00.000Z"
    },
    {
      id: "n-2",
      title: "Role change",
      body: "Rohan Mehta is now a moderator.",
      read: false,
      createdAt: "2026-09-17T16:20:00.000Z"
    },
    {
      id: "n-3",
      title: "Weekly report",
      body: "Analytics for this week are ready to view.",
      read: false,
      createdAt: "2026-09-17T11:05:00.000Z"
    },
    {
      id: "n-4",
      title: "Password hint",
      body: "First admin login is pavan@gmail.com.",
      read: true,
      createdAt: "2026-09-16T09:12:00.000Z"
    },
    {
      id: "n-5",
      title: "Team update",
      body: "Design department added 4 new members.",
      read: true,
      createdAt: "2026-09-15T14:40:00.000Z"
    },
    {
      id: "n-6",
      title: "System",
      body: "Dark theme is available from the header toggle.",
      read: true,
      createdAt: "2026-09-14T10:00:00.000Z"
    },
    {
      id: "n-7",
      title: "Security check",
      body: "All admin sessions look healthy this week.",
      read: false,
      createdAt: "2026-09-13T18:22:00.000Z"
    },
    {
      id: "n-8",
      title: "Hiring pipeline",
      body: "Support requested 3 extra seats for next month.",
      read: true,
      createdAt: "2026-09-12T12:10:00.000Z"
    }
  ];
}

export function seedIfEmpty() {
  const version = localStorage.getItem("mfd-seed-version");

  if (version !== "3") {
    if (version !== "2") {
      setUsers(starterUsers());
    }
    setNotifications(starterNotes());
    localStorage.setItem("mfd-seed-version", "3");
  }
}
