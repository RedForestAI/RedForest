
"use client";

import NavBar from "@/components/NavBar";

const Dashboard = () => {
  
  const navLinks = [
    { id: 1, link: "account", title: "Account" },
  ];

  // Sample data for assignments
  const assignments = [
    { title: "Assignment 1", courseId: "COURSE101", deadline: "2023-12-01", progress: 60, completed: false },
    { title: "Assignment 2", courseId: "COURSE102", deadline: "2023-12-15", progress: 100, completed: true },
    // Add more assignments here
  ];

  return (
    <div>
      <NavBar links={navLinks}/>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Assignments</h1>
        <div>
          {assignments.map((assignment, index) => (
            <div key={index} className="bg-grey p-4 rounded-md shadow-md mb-4">
              <h2 className="font-bold text-lg">{assignment.title} (Course ID: {assignment.courseId})</h2>
              <p>Deadline: {assignment.deadline}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
              </div>
              <p className="mt-2">{assignment.completed ? 'Completed' : 'In Progress'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
