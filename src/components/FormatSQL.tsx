import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Wand2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { format as formatSQL } from 'sql-formatter';

type FormatStyle = 'compact' | 'standard' | 'expanded';
type KeywordCase = 'upper' | 'lower' | 'capitalize';
type IndentStyle = 'spaces' | 'tabs';
type DatabasePreset = 'none' | 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';

interface FormatOptions {
  style: FormatStyle;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  indentSize: number;
}

const databasePresets: Record<DatabasePreset, Partial<FormatOptions>> = {
  none: {},
  mysql: {
    keywordCase: 'upper',
    style: 'standard',
    indentStyle: 'spaces',
    indentSize: 2
  },
  postgresql: {
    keywordCase: 'lower',
    style: 'expanded',
    indentStyle: 'spaces',
    indentSize: 4
  },
  sqlserver: {
    keywordCase: 'upper',
    style: 'standard',
    indentStyle: 'spaces',
    indentSize: 4
  },
  oracle: {
    keywordCase: 'upper',
    style: 'expanded',
    indentStyle: 'spaces',
    indentSize: 2
  }
};

export function FormatSQL() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<DatabasePreset>('oracle');
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    style: 'expanded',
    keywordCase: 'upper',
    indentStyle: 'spaces',
    indentSize: 2
  });

  const getIndent = (level: number = 1): string => {
    const size = formatOptions.indentSize;
    const char = formatOptions.indentStyle === 'tabs' ? '\t' : ' ';
    return formatOptions.indentStyle === 'tabs' 
      ? char.repeat(level)
      : char.repeat(level * size);
  };

  const formatKeyword = (keyword: string): string => {
    switch (formatOptions.keywordCase) {
      case 'lower':
        return keyword.toLowerCase();
      case 'capitalize':
        return keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      default:
        return keyword.toUpperCase();
    }
  };

  const handleFormatSQL = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล SQL');
      return;
    }

    try {
      // กำหนด options สำหรับ sql-formatter
      const formatterOptions = {
        language: 'sql' as const,
        keywordCase: formatOptions.keywordCase as 'upper' | 'lower',
        indentStyle: 'standard' as const,
        tabWidth: formatOptions.indentSize,
        useTabs: formatOptions.indentStyle === 'tabs',
        linesBetweenQueries: formatOptions.style === 'expanded' ? 2 : 1,
      };

      // ใช้ sql-formatter library
      let formatted = formatSQL(input.trim(), formatterOptions);

      // ปรับแต่งเพิ่มเติมตาม style preference
      if (formatOptions.style === 'compact') {
        // Compact: ลดช่องว่างและบรรทัดใหม่
        formatted = formatted
          .replace(/\n\s*\n/g, '\n')  // ลดบรรทัดว่างส่วนเกิน
          .replace(/\n\s+/g, '\n')    // ลดเยื้องส่วนเกิน
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join(' ');
      } else if (formatOptions.style === 'expanded') {
        // Expanded: เพิ่มช่องว่างและแยกบรรทัดมากขึ้น
        formatted = formatted
          .replace(/\bFROM\b/g, '\n\nFROM')
          .replace(/\bWHERE\b/g, '\n\nWHERE')
          .replace(/\bGROUP BY\b/g, '\n\nGROUP BY')
          .replace(/\bHAVING\b/g, '\n\nHAVING')
          .replace(/\bORDER BY\b/g, '\n\nORDER BY')
          .replace(/\bJOIN\b/g, '\n\nJOIN')
          .replace(/\bLEFT JOIN\b/g, '\n\nLEFT JOIN')
          .replace(/\bRIGHT JOIN\b/g, '\n\nRIGHT JOIN')
          .replace(/\bINNER JOIN\b/g, '\n\nINNER JOIN');
      }

      // ทำความสะอาดผลลัพธ์สุดท้าย
      formatted = formatted
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      setOutput(formatted);
      toast.success('จัดรูปแบบ SQL สำเร็จ');
    } catch (error) {
      console.error('SQL formatting error:', error);
      toast.error('เกิดข้อผิดพลาดในการจัดรูปแบบ SQL');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('คัดลอกแล้ว');
  };

  return (
    <div className="space-y-6">
      {/* Format Options Panel */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4" />
            ตัวเลือกการจัดรูปแบบ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 min-w-0">
            <div className="flex-1 min-w-0 space-y-1">
              <Label htmlFor="preset" className="text-xs truncate block">Preset</Label>
              <Select
                value={selectedPreset}
                onValueChange={(value: DatabasePreset) => {
                  setSelectedPreset(value);
                  if (value !== 'none') {
                    const preset = databasePresets[value];
                    setFormatOptions((prev: FormatOptions) => ({ ...prev, ...preset }));
                  }
                }}
              >
                <SelectTrigger id="preset" className="h-6 text-xs min-w-0">
                  <SelectValue placeholder="เลือก" />
                </SelectTrigger>
                <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                  <SelectItem value="none">ไม่ใช้</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlserver">SQL Server</SelectItem>
                  <SelectItem value="oracle">Oracle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <Label htmlFor="formatStyle" className="text-xs truncate block">Style</Label>
              <Select
                value={formatOptions.style}
                onValueChange={(value: FormatStyle) =>
                  setFormatOptions((prev: FormatOptions) => ({ ...prev, style: value }))
                }
              >
                <SelectTrigger id="formatStyle" className="h-6 text-xs min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <Label htmlFor="keywordCase" className="text-xs truncate block">Keywords</Label>
              <Select
                value={formatOptions.keywordCase}
                onValueChange={(value: KeywordCase) =>
                  setFormatOptions((prev: FormatOptions) => ({ ...prev, keywordCase: value }))
                }
              >
                <SelectTrigger id="keywordCase" className="h-6 text-xs min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                  <SelectItem value="upper">UPPERCASE</SelectItem>
                  <SelectItem value="lower">lowercase</SelectItem>
                  <SelectItem value="capitalize">Capitalize</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <Label htmlFor="indentStyle" className="text-xs truncate block">Indent</Label>
              <Select
                value={formatOptions.indentStyle}
                onValueChange={(value: IndentStyle) =>
                  setFormatOptions((prev: FormatOptions) => ({ ...prev, indentStyle: value }))
                }
              >
                <SelectTrigger id="indentStyle" className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                  <SelectItem value="spaces">Spaces</SelectItem>
                  <SelectItem value="tabs">Tabs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <Label htmlFor="indentSize" className="text-xs truncate block">Size</Label>
              <Select
                value={formatOptions.indentSize.toString()}
                onValueChange={(value: string) =>
                  setFormatOptions((prev: FormatOptions) => ({ ...prev, indentSize: parseInt(value) }))
                }
              >
                <SelectTrigger id="indentSize" className="h-6 text-xs min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL Input</label>
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder="วาง SQL query ที่นี่..."
            className={`font-mono text-sm transition-all duration-300 ${
              output ? 'min-h-[200px]' : 'min-h-[300px]'
            }`}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">SQL Output</label>
            {output && (
              <Button onClick={copyToClipboard} variant="ghost" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                คัดลอก
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="ผลลัพธ์จะแสดงที่นี่..."
            className={`font-mono text-sm bg-muted/50 transition-all duration-300 ${
              output ? 'min-h-[400px]' : 'min-h-[200px]'
            }`}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFormatSQL} className="gap-2">
          <Wand2 className="w-4 h-4" />
          จัดรูปแบบ SQL
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); }} variant="outline">
          ล้างข้อมูล
        </Button>
        <Button 
          onClick={() => {
            setSelectedPreset('none');
            setFormatOptions({
              style: 'standard',
              keywordCase: 'upper',
              indentStyle: 'spaces',
              indentSize: 4
            });
          }}
          variant="outline"
        >
          รีเซ็ต
        </Button>
      </div>
    </div>
  );
}
