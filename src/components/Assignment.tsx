import React from 'react';
import { Paper, Typography, LinearProgress, Badge, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom

interface AssignmentProps {
  id: number; // Add an id prop for each assignment
  title: string;
  progress: number;
  completion: string;
  dueDate: string;
}

const Assignment: React.FC<AssignmentProps> = ({ id, title, progress, completion, dueDate }) => {
  const assignmentLink = `/user/assignments/${id}`; // Define the assignment-specific link

  return (
    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
      {/* Wrap the Assignment component with a Link */}
      <Link component={RouterLink} to={assignmentLink} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Typography variant="h6">{title}</Typography>
      </Link>
      <Badge
        color={completion === 'Complete' ? 'primary' : 'secondary'}
        badgeContent={completion}
        style={{ marginLeft: '32px' }}
      >
      </Badge>
      <LinearProgress variant="determinate" value={progress} color="primary" style={{ marginTop: '16px' }} />
      <Typography variant="caption" color="textSecondary">
        Due Date: {dueDate}
      </Typography>
    </Paper>
  );
};

export default Assignment;
