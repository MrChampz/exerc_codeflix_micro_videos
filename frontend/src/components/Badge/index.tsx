import { Chip, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import theme from "../../theme";

type ChipColor = 'primary' | 'secondary' | 'default';
type Color = ChipColor | 'error' | 'success';

interface BadgeProps {
  label: string;
  color: Color;
};

const badgeTheme = createMuiTheme({
  palette: {
    primary: theme.palette.success,
    secondary: theme.palette.error,
  }
});

const Badge: React.FC<BadgeProps> = (props) => {
  let [color, setColor] = useState(props.color as ChipColor);
  let [useCustomTheme, setUseCustomTheme] = useState(false);
  
  useEffect(() => {
    switch (props.color) {
      case 'success': setColor('primary'); setUseCustomTheme(true); break;
      case 'error':   setColor('secondary'); setUseCustomTheme(true); break;
      default: break;
    }
  }, []);

  const renderChip = () => (
    <Chip label={ props.label } color={ color } />
  );

  return useCustomTheme ? (
    <MuiThemeProvider theme={ badgeTheme }>
      { renderChip() }
    </MuiThemeProvider>
  ) : renderChip();
};

export const BadgeActive: React.FC = () => {
  return (
    <Badge label="Ativo" color="success" />
  )
}

export const BadgeInactive: React.FC = () => {
  return (
    <Badge label="Inativo" color="error" />
  )
}

export default Badge;