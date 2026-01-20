// src/features/parcel-management/pages/ParcelManagementPage.tsx
import React from 'react';
import { Box } from '@mui/material';
import { ParcelManagementView } from '../presentation';
import { useAuth0 } from '@auth0/auth0-react';

export const ParcelManagementPage: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#ffffff'
      }}>
        Cargando...
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
    }}>
      <ParcelManagementView />
    </Box>
  );
};

export default ParcelManagementPage;
