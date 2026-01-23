import { Grid } from "@mui/material";
import {
  StatsGrid,
  StatsCard,
  StatsCardContent,
  StatsContentBox,
  StatsTextBox,
  StatsValue,
  StatsLabel,
  StatsIconBox,
} from "../../../../../shared/presentation/styles/Stats.styles";

import { People, Person, Warning, CheckCircle } from "@mui/icons-material";

export const WorkersStats = ({
  totalWorkers,
  entriesCount,
  exitsCount,
  absentsCount,
}: {
  totalWorkers: number;
  entriesCount: number;
  exitsCount: number;
  absentsCount: number;
}) => {
  return (
    <StatsGrid container spacing={2} mb={3}>
      {/* Total Trabajadores */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsIconBox bgcolor="#2563eb">
                <People />
              </StatsIconBox>

              <StatsTextBox>
                <StatsValue>{totalWorkers}</StatsValue>
                <StatsLabel>Total Trabajadores</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      {/* Entradas Registradas */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsIconBox bgcolor="#16a34a">
                <CheckCircle />
              </StatsIconBox>

              <StatsTextBox>
                <StatsValue color="#22c55e">{entriesCount}</StatsValue>
                <StatsLabel>Entradas Registradas</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      {/* Salidas Registradas */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsIconBox bgcolor="#7c3aed">
                <Person />
              </StatsIconBox>

              <StatsTextBox>
                <StatsValue color="#a78bfa">{exitsCount}</StatsValue>
                <StatsLabel>Salidas Registradas</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>

      {/* Ausentes */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard>
          <StatsCardContent>
            <StatsContentBox>
              <StatsIconBox bgcolor="#4b5563">
                <Warning />
              </StatsIconBox>

              <StatsTextBox>
                <StatsValue color="#ef4444">{absentsCount}</StatsValue>
                <StatsLabel>Ausentes</StatsLabel>
              </StatsTextBox>
            </StatsContentBox>
          </StatsCardContent>
        </StatsCard>
      </Grid>
    </StatsGrid>
  );
};
