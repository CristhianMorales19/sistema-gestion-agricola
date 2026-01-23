import React from "react";
import { Grid } from "@mui/material";
import {
  StatsGrid,
  StatsCard,
  StatsCardContent,
  StatsContentBox,
  StatsTextBox,
  StatsValue,
  StatsLabel,
} from "./AbsenceStats.styles";

interface AbsenceStatsProps {
  stats: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
  };
}

export const AbsenceStats: React.FC<AbsenceStatsProps> = ({ stats }) => {
  return (
    <StatsGrid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsTextBox>
                <StatsValue>{stats.total}</StatsValue>
                <StatsLabel>Total Ausencias</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsTextBox>
                <StatsValue color="#fbbf24">{stats.pendientes}</StatsValue>
                <StatsLabel>Pendientes</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsTextBox>
                <StatsValue color="#10b981">{stats.aprobadas}</StatsValue>
                <StatsLabel>Aprobadas</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsTextBox>
                <StatsValue color="#ef4444">{stats.rechazadas}</StatsValue>
                <StatsLabel>Rechazadas</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>
    </StatsGrid>
  );
};
