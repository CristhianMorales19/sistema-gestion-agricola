import React from "react";
import {
  GlassCard,
  CardContentStyled,
  HeaderBox,
  SecurityIcon,
  TitleText,
  PermissionChip,
  DotIcon,
  PermissionsContainer,
} from "./PermissionsPanel.styles";

interface PermissionsPanelProps {
  user: any;
}

export const PermissionsPanel: React.FC<PermissionsPanelProps> = ({ user }) => {
  const permissionsCount = user?.roles?.[0]?.permissions?.length || 11;

  return (
    <GlassCard>
      <CardContentStyled>
        <HeaderBox>
          <SecurityIcon />
          <TitleText>Permisos Actuales ({permissionsCount})</TitleText>
        </HeaderBox>

        <PermissionsContainer>
          <PermissionChip
            icon={<DotIcon />}
            label="ACCESO TOTAL - Administrador"
          />
        </PermissionsContainer>
      </CardContentStyled>
    </GlassCard>
  );
};
