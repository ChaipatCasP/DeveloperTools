import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Palette, Copy, RefreshCw, Pipette, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

interface ColorFormat {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

interface PaletteColor {
  hex: string;
  name: string;
}

export default function ColorTools() {
  const [inputColor, setInputColor] = useState('#3b82f6');
  const [colorFormats, setColorFormats] = useState<ColorFormat | null>(null);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [gradientStart, setGradientStart] = useState('#3b82f6');
  const [gradientEnd, setGradientEnd] = useState('#ef4444');
  const [gradientDirection, setGradientDirection] = useState('to right');

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // Generate color formats
  const generateColorFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    };
  };

  // Generate color palette
  const generatePalette = (baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: PaletteColor[] = [];

    // Generate different variations
    const variations = [
      { name: 'Original', h: hsl.h, s: hsl.s, l: hsl.l },
      { name: 'Light', h: hsl.h, s: hsl.s, l: Math.min(95, hsl.l + 30) },
      { name: 'Dark', h: hsl.h, s: hsl.s, l: Math.max(5, hsl.l - 30) },
      { name: 'Saturated', h: hsl.h, s: Math.min(100, hsl.s + 20), l: hsl.l },
      { name: 'Desaturated', h: hsl.h, s: Math.max(0, hsl.s - 40), l: hsl.l },
      { name: 'Complement', h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
      { name: 'Triadic 1', h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l },
      { name: 'Triadic 2', h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l },
    ];

    variations.forEach(variation => {
      const hex = hslToHex(variation.h, variation.s, variation.l);
      colors.push({ hex, name: variation.name });
    });

    return colors;
  };

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate random color
  const generateRandomColor = () => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setInputColor(hex);
  };

  // Update formats when input changes
  useEffect(() => {
    if (inputColor && /^#[0-9A-F]{6}$/i.test(inputColor)) {
      const formats = generateColorFormats(inputColor);
      setColorFormats(formats);
      setPalette(generatePalette(inputColor));
    }
  }, [inputColor]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`คัดลอก ${label} แล้ว!`);
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Copy CSS gradient
  const copyGradient = async () => {
    const gradient = `background: linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd});`;
    try {
      await navigator.clipboard.writeText(gradient);
      toast.success('คัดลอก CSS Gradient แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Tools
          </CardTitle>
          <CardDescription>
            เครื่องมือสำหรับจัดการสี แปลงรูปแบบ และสร้างโทนสี
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="converter" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="converter">Color Converter</TabsTrigger>
              <TabsTrigger value="palette">Palette Generator</TabsTrigger>
              <TabsTrigger value="gradient">Gradient Generator</TabsTrigger>
            </TabsList>

            {/* Color Converter */}
            <TabsContent value="converter" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label>เลือกสี</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={inputColor}
                        onChange={(e) => setInputColor(e.target.value)}
                        className="w-16 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={inputColor}
                        onChange={(e) => setInputColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="font-mono"
                      />
                      <Button onClick={generateRandomColor} variant="outline" size="sm" className="gap-2">
                        <Shuffle className="w-4 h-4" />
                        Random
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="w-24 h-24 border rounded-lg shadow-inner"
                    style={{ backgroundColor: inputColor }}
                  />
                </div>

                {colorFormats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(colorFormats).map(([format, value]) => (
                      <div key={format} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium uppercase">{format}</Label>
                          <div className="font-mono text-sm text-muted-foreground">{value}</div>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(value, format)}
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Palette Generator */}
            <TabsContent value="palette" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Base Color:</Label>
                  <input
                    type="color"
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value)}
                    className="w-12 h-8 border rounded cursor-pointer"
                  />
                  <Badge variant="outline" className="font-mono">{inputColor}</Badge>
                </div>

                {palette.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {palette.map((color, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer border rounded-lg overflow-hidden"
                        onClick={() => copyToClipboard(color.hex, color.name)}
                      >
                        <div 
                          className="w-full h-20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-2">
                          <div className="text-sm font-medium">{color.name}</div>
                          <div className="text-xs font-mono text-muted-foreground">{color.hex}</div>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Gradient Generator */}
            <TabsContent value="gradient" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-12 h-8 border rounded cursor-pointer"
                      />
                      <Input
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <select 
                      value={gradientDirection}
                      onChange={(e) => setGradientDirection(e.target.value)}
                      className="w-full h-8 px-2 border rounded text-sm"
                    >
                      <option value="to right">→ To Right</option>
                      <option value="to left">← To Left</option>
                      <option value="to bottom">↓ To Bottom</option>
                      <option value="to top">↑ To Top</option>
                      <option value="to bottom right">↘ To Bottom Right</option>
                      <option value="to bottom left">↙ To Bottom Left</option>
                      <option value="to top right">↗ To Top Right</option>
                      <option value="to top left">↖ To Top Left</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>End Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-12 h-8 border rounded cursor-pointer"
                      />
                      <Input
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Gradient Preview */}
                <div className="space-y-3">
                  <Label>Preview</Label>
                  <div 
                    className="w-full h-32 border rounded-lg"
                    style={{
                      background: `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`
                    }}
                  />
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <code className="font-mono text-sm">
                      background: linear-gradient({gradientDirection}, {gradientStart}, {gradientEnd});
                    </code>
                    <Button onClick={copyGradient} variant="ghost" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      คัดลอก CSS
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}