// src/features/parcel-management/pages/ParcelManagementPage.tsx
import React from "react";
import { Box } from "@mui/material";
import { ParcelManagementView } from "../presentation";
import { useAuth0 } from "@auth0/auth0-react";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../shared/presentation/styles/LoadingSpinner.styles";

export const ParcelManagementPage = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return <ParcelManagementView />;
};

export default ParcelManagementPage;
