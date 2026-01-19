import React from "react";
import { DashboardStatistic } from "../../../domain/entities/Dashboard";
import {
  StatsGrid,
  StatItem,
  GlassCard,
  CardContentStyled,
  ContentBox,
  TextBox,
  TitleText,
  ValueText,
  ChangeBox,
  TrendIcon,
  IconBox,
  FarmIcon,
  UserIcon,
  CropIcon,
  AlertIcon,
  UpIcon,
  DownIcon,
} from "./StatsCards.styles";

// Función simple para obtener icono
const getStatIcon = (category: DashboardStatistic["category"]) => {
  switch (category) {
    case "farms":
      return <FarmIcon />;
    case "users":
      return <UserIcon />;
    case "crops":
      return <CropIcon />;
    case "alerts":
      return <AlertIcon />;
    default:
      return <CropIcon />;
  }
};

// Componente tarjeta simple
const StatCard = React.memo<{ stat: DashboardStatistic }>(({ stat }) => (
  <StatItem item xs={12} sm={6} md={3}>
    <GlassCard>
      <CardContentStyled>
        <ContentBox>
          <TextBox>
            <TitleText>{stat.title}</TitleText>
            <ValueText>{stat.value}</ValueText>

            <ChangeBox isPositive={stat.changeType === "positive"}>
              <TrendIcon>
                {stat.changeType === "positive" ? <UpIcon /> : <DownIcon />}
              </TrendIcon>
              <span>{stat.change}</span>
            </ChangeBox>
          </TextBox>

          <IconBox>{getStatIcon(stat.category)}</IconBox>
        </ContentBox>
      </CardContentStyled>
    </GlassCard>
  </StatItem>
));

StatCard.displayName = "StatCard";

interface StatsCardsProps {
  stats: DashboardStatistic[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <StatsGrid container spacing={2}>
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </StatsGrid>
  );
};
