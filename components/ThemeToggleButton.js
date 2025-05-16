// components/ThemeToggleButton.js
import { useTheme } from '../context/ThemeContext';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}