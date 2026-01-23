import React, { useMemo } from "react";
import { Parcel } from "../../../domain/entities/Parcel";
import { Grid } from "@mui/material";
import {
  StatsCard,
  StatsCardContent,
  StatsContentBox,
  StatsTextBox,
  StatsTitle,
  StatsValue,
  StatsSubtitle,
  StatsIconBox,
  CheckCircleIconStyled,
  GrassIconStyled,
} from "./ParcelManagementView.styles";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export const StatsCardComponent = ({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatsCardProps) => (
  <StatsCard>
    <StatsCardContent>
      <StatsContentBox>
        <StatsTextBox>
          <StatsTitle>{title}</StatsTitle>
          <StatsValue>{value}</StatsValue>
          {subtitle && <StatsSubtitle>{subtitle}</StatsSubtitle>}
        </StatsTextBox>
        <StatsIconBox color={color}>{icon}</StatsIconBox>
      </StatsContentBox>
    </StatsCardContent>
  </StatsCard>
);

interface ParcelStatsProps {
  parcels: Parcel[];
}

export const ParcelStats = ({ parcels }: ParcelStatsProps) => {
  const stats = useMemo(() => {
    const totalParcelas = parcels.length;
    const parcelasActivas = parcels.filter(
      (p) => !p.estado || p.estado === "activo" || p.estado === "disponible",
    ).length;
    const areaTotal = parcels.reduce(
      (sum, p) => sum + (p.areaHectareas || 0),
      0,
    );
    return { totalParcelas, parcelasActivas, areaTotal };
  }, [parcels]);

  return (
    <Grid container spacing={2} height="100%">
      <Grid item xs={12}>
        <StatsCardComponent
          title="Parcelas Activas"
          value={stats.parcelasActivas}
          icon={<CheckCircleIconStyled />}
          color="#10b981"
          subtitle={`de ${stats.totalParcelas} totales`}
        />
      </Grid>

      <Grid item xs={12}>
        <StatsCardComponent
          title="Área Total"
          value={`${stats.areaTotal.toFixed(1)} ha`}
          icon={<GrassIconStyled />}
          color="#f59e0b"
          subtitle={`Promedio: ${(stats.areaTotal / stats.totalParcelas || 0).toFixed(1)} ha`}
        />
      </Grid>
    </Grid>
  );
};
