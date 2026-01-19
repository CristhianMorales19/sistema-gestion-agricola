import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeToggle } from "../../../../../app/providers/components/ThemeToggle";
import {
  LogoContentBox,
  LogoContainer,
  LogoBox,
  LogoIcon,
  BrandTitle,
  BrandSubtitle,
  LogoTextContainer,
  ThemeToggleContainer,
} from "./TopBar.styles";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar = ({ onToggleSidebar }: TopBarProps) => {
  return (
    <LogoContainer>
      <LogoContentBox>
        <IconButton onClick={onToggleSidebar} size="small">
          <MenuIcon />
        </IconButton>

        <LogoBox>
          <LogoIcon />
        </LogoBox>

        <LogoTextContainer>
          <BrandTitle variant="h6">AgroManager</BrandTitle>
          <BrandSubtitle variant="caption">Management Suite</BrandSubtitle>
        </LogoTextContainer>
      </LogoContentBox>

      <ThemeToggleContainer>
        <ThemeToggle showLabel={false} size="small" />
      </ThemeToggleContainer>
    </LogoContainer>
  );
};
