// Dashboard.js
import { Container, Typography } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Assignment from '../components/Assignment';

const assignments = [
  {
    id: 1,
    title: 'Assignment 1',
    progress: 50,
    completion: 'Incomplete',
    dueDate: '2023-12-15',
  },
  {
    id: 2,
    title: 'Assignment 2',
    progress: 100,
    completion: 'Complete',
    dueDate: '2023-12-20',
  },
  // Add more assignments as needed
];

// Sort assignments by due date in ascending order
assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

const Dashboard = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="lg" style={{ marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          My Assignments
        </Typography>
         {assignments.map((assignment) => (
          <Assignment
            id={assignment.id}
            title={assignment.title}
            progress={assignment.progress}
            completion={assignment.completion}
            dueDate={assignment.dueDate}
          />
        ))}
      </Container>
    </div>
  );
};

export default Dashboard;
