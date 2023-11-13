// Assignment.tsx

import React from 'react';
import { Paper, Typography, LinearProgress, Badge, Box } from '@mui/material';

interface AssignmentProps {
  title: string;
  progress: number;
  completion: string;
  dueDate: string;
}

const Assignment: React.FC<AssignmentProps> = ({ title, progress, completion, dueDate }) => {
  return (
    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="h6">{title}</Typography>
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
