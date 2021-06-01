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
  let useCustomTheme = false;
  let color = mapChipColor();

  function mapChipColor() {
    let color = props.color;
    switch (color) {
      case 'success':
        color = 'primary';
        useCustomTheme = true;
        break;
      case 'error':
        color = 'secondary';
        useCustomTheme = true;
        break;
      default:
        break;
    }
    return color;
  }

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