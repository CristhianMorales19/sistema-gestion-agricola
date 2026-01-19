import React from "react";
import { DashboardCondition } from "../../../domain/entities/Dashboard";
import {
  GlassCard,
  CardContentStyled,
  HeaderBox,
  CloudIcon,
  TitleText,
  ConditionsGrid,
  ConditionItemGrid,
  ConditionItemBox,
  IconBox,
  TempIcon,
  HumidityIcon,
  RainIcon,
  WindIcon,
  ConditionValue,
  ConditionLabel,
} from "./ConditionsPanel.styles";

// Función para obtener icono
const getConditionIcon = (type: DashboardCondition["type"]) => {
  switch (type) {
    case "temperature":
      return <TempIcon />;
    case "humidity":
      return <HumidityIcon />;
    case "rain":
      return <RainIcon />;
    case "wind":
      return <WindIcon />;
    default:
      return <RainIcon />;
  }
};

// Componente memoizado para cada condición
const ConditionItem = React.memo<{ condition: DashboardCondition }>(
  ({ condition }) => (
    <ConditionItemGrid item xs={6} sm={4} md={2}>
      <ConditionItemBox>
        <IconBox>{getConditionIcon(condition.type)}</IconBox>
        <ConditionValue>
          {condition.value}
          {condition.unit}
        </ConditionValue>
        <ConditionLabel>{condition.label}</ConditionLabel>
      </ConditionItemBox>
    </ConditionItemGrid>
  ),
);

ConditionItem.displayName = "ConditionItem";

interface ConditionsPanelProps {
  conditions: DashboardCondition[];
}

export const ConditionsPanel = ({ conditions }: ConditionsPanelProps) => {
  return (
    <GlassCard>
      <CardContentStyled>
        <HeaderBox>
          <CloudIcon />
          <TitleText>Condiciones Actuales</TitleText>
        </HeaderBox>

        <ConditionsGrid container spacing={2}>
          {conditions.map((condition) => (
            <ConditionItem key={condition.id} condition={condition} />
          ))}
        </ConditionsGrid>
      </CardContentStyled>
    </GlassCard>
  );
};
