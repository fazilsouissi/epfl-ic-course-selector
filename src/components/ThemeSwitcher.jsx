import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Moon, Sun, Monitor } from 'lucide-react';

const ThemeSwitcher = () => {
  const { themePreference, toggleTheme, layout, setLayout } = useTheme();

  const themeLabel =
    themePreference === 'system' ? 'System' : themePreference === 'light' ? 'Light' : 'Dark';

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={layout} 
        onValueChange={setLayout}
      >
        <SelectTrigger className="h-8 text-xs w-[120px] sm:w-[140px]">
          <SelectValue placeholder="Layout" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="compact">Grid View</SelectItem>
          <SelectItem value="kanban">Kanban View</SelectItem>
          <SelectItem value="list">List View</SelectItem>
          <SelectItem value="columns">Columns View</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={`Theme: ${themeLabel}`}
        title={`Theme: ${themeLabel}`}
        className="h-8 w-8"
      >
        {themePreference === 'system' ? (
          <Monitor className="h-4 w-4" />
        ) : themePreference === 'light' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
