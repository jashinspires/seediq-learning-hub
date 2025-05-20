
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { toast } from "sonner";

// Predefined color options
const colorOptions = [
  { name: "Default Blue", value: "#0284c7" },
  { name: "Purple", value: "#9b87f5" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Indigo", value: "#6366f1" },
];

const ThemeColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#0284c7");
  const [customColor, setCustomColor] = useState<string>("#0284c7");

  // Apply the color theme when the selected color changes
  useEffect(() => {
    applyThemeColor(selectedColor);
  }, [selectedColor]);

  const applyThemeColor = (color: string) => {
    // Convert hex to HSL for CSS variables
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    const lPercent = Math.round(l * 100);
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${32}%`);
    document.documentElement.style.setProperty('--accent', `${h} ${s}% ${32}%`);
    document.documentElement.style.setProperty('--ring', `${h} ${s}% ${32}%`);
    
    // Save to localStorage for persistence
    localStorage.setItem('seediq-theme-color', color);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
    toast.success("Theme color updated!");
  };

  // Load saved color on initial render
  useEffect(() => {
    const savedColor = localStorage.getItem('seediq-theme-color');
    if (savedColor) {
      setSelectedColor(savedColor);
      setCustomColor(savedColor);
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          aria-label="Change theme color"
        >
          <Palette size={20} />
          <span 
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full" 
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Theme Color</h4>
          
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-full aspect-square rounded-md transition-all ${
                  selectedColor === color.value ? 'ring-2 ring-offset-2 ring-ring' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorSelect(color.value)}
                title={color.name}
                aria-label={`Select ${color.name} theme color`}
              />
            ))}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="custom-color" className="text-xs font-medium">
              Custom Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                id="custom-color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 p-0 border-none"
              />
              <Button 
                className="flex-1"
                onClick={() => handleColorSelect(customColor)}
              >
                Apply Custom Color
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColorPicker;
