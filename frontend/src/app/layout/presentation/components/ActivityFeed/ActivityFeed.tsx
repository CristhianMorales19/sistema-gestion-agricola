import React from "react";
import { DashboardActivity } from "../../../domain/entities/Dashboard";
import {
  GlassCard,
  CardContentStyled,
  HeaderBox,
  TitleIcon,
  TitleText,
  ActivityList,
  ActivityItem,
  ItemIcon,
  StatusIndicator,
  ActivityText,
  ActivityTime,
} from "./ActivityFeed.styles";

import { ListItemText } from "@mui/material";

// Componente memoizado para cada actividad
const ActivityListItem = React.memo<{ activity: DashboardActivity }>(
  ({ activity }) => (
    <ActivityItem status={activity.status}>
      <ItemIcon>
        <StatusIndicator status={activity.status} />
      </ItemIcon>
      <ListItemText
        primary={<ActivityText>{activity.text}</ActivityText>}
        secondary={<ActivityTime>{activity.time}</ActivityTime>}
      />
    </ActivityItem>
  ),
);

ActivityListItem.displayName = "ActivityListItem";

interface ActivityFeedProps {
  activities: DashboardActivity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <GlassCard>
      <CardContentStyled>
        <HeaderBox>
          <TitleIcon />
          <TitleText>Actividad Reciente</TitleText>
        </HeaderBox>

        <ActivityList>
          {activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </ActivityList>
      </CardContentStyled>
    </GlassCard>
  );
};
