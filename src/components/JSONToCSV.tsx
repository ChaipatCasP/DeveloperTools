import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Download, Copy, FileSpreadsheet, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface JSONField {
  key: string;
  type: string;
  selected: boolean;
}

export default function JSONToCSV() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [fields, setFields] = useState<JSONField[]>([]);
  const [customDelimiter, setCustomDelimiter] = useState(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flattenNested, setFlattenNested] = useState(true);

  // Parse JSON and extract fields
  const parseJSON = () => {
    try {
      const data = JSON.parse(jsonInput);
      let parsedData = Array.isArray(data) ? data : [data];
      
      if (parsedData.length === 0) {
        toast.error('JSON ไม่มีข้อมูล');
        return;
      }

      // Extract all possible fields from all objects
      const allFields = new Set<string>();
      
      const extractFields = (obj: any, prefix = '') => {
        Object.keys(obj).forEach(key => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const value = obj[key];
          
          if (value !== null && typeof value === 'object' && !Array.isArray(value) && flattenNested) {
            extractFields(value, fullKey);
          } else {
            allFields.add(fullKey);
          }
        });
      };

      parsedData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          extractFields(item);
        }
      });

      // Create field objects
      const fieldList: JSONField[] = Array.from(allFields).map(key => ({
        key,
        type: getFieldType(parsedData, key),
        selected: true
      }));

      setFields(fieldList);
      toast.success(`พบ ${fieldList.length} ฟิลด์จาก ${parsedData.length} รายการ`);
    } catch (error) {
      toast.error('JSON ไม่ถูกต้อง กรุณาตรวจสอบรูปแบบ');
      setFields([]);
    }
  };

  // Get field type from sample data
  const getFieldType = (data: any[], fieldPath: string): string => {
    for (const item of data.slice(0, 5)) { // Check first 5 items
      const value = getNestedValue(item, fieldPath);
      if (value !== undefined && value !== null) {
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') return 'object';
        return 'string';
      }
    }
    return 'unknown';
  };

  // Get nested value using dot notation
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  };

  // Convert JSON to CSV
  const convertToCSV = () => {
    try {
      const data = JSON.parse(jsonInput);
      let parsedData = Array.isArray(data) ? data : [data];
      
      const selectedFields = fields.filter(f => f.selected);
      if (selectedFields.length === 0) {
        toast.error('กรุณาเลือกฟิลด์อย่างน้อย 1 ฟิลด์');
        return;
      }

      const headers = selectedFields.map(f => f.key);
      const rows: string[][] = [];

      // Add headers if required
      if (includeHeaders) {
        rows.push(headers);
      }

      // Process each data item
      parsedData.forEach(item => {
        const row = selectedFields.map(field => {
          const value = getNestedValue(item, field.key);
          return formatCSVValue(value);
        });
        rows.push(row);
      });

      // Convert to CSV string
      const csvContent = rows
        .map(row => 
          row.map(value => 
            // Escape values that contain delimiter, quotes, or newlines
            value.includes(customDelimiter) || value.includes('"') || value.includes('\n')
              ? `"${value.replace(/"/g, '""')}"` 
              : value
          ).join(customDelimiter)
        )
        .join('\n');

      setCsvOutput(csvContent);
      toast.success('แปลง JSON เป็น CSV สำเร็จ!');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการแปลง JSON');
    }
  };

  // Format value for CSV
  const formatCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Toggle field selection
  const toggleField = (index: number) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { ...field, selected: !field.selected } : field
    ));
  };

  // Select/Deselect all fields
  const toggleAllFields = (selected: boolean) => {
    setFields(prev => prev.map(field => ({ ...field, selected })));
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvOutput);
      toast.success('คัดลอก CSV ไปยัง Clipboard แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Download CSV
  const downloadCSV = () => {
    if (!csvOutput) return;
    
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ดาวน์โหลดไฟล์ CSV แล้ว!');
  };

  // Clear all
  const clearAll = () => {
    setJsonInput('');
    setCsvOutput('');
    setFields([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            JSON to CSV Converter
          </CardTitle>
          <CardDescription>
            แปลงข้อมูล JSON เป็นไฟล์ CSV พร้อมตัวเลือกการกำหนดค่า
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* JSON Input */}
          <div className="space-y-2">
            <Label>JSON Input</Label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="วาง JSON data ที่นี่... เช่น [{'name': 'John', 'age': 30}, {'name': 'Jane', 'age': 25}]"
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          {/* Parse Button */}
          <div className="flex gap-2">
            <Button onClick={parseJSON} className="gap-2">
              <Settings className="w-4 h-4" />
              วิเคราะห์ JSON
            </Button>
            <Button onClick={clearAll} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              ล้างข้อมูล
            </Button>
          </div>

          {/* Configuration */}
          {fields.length > 0 && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field Selection */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>เลือกฟิลด์ ({fields.filter(f => f.selected).length}/{fields.length})</Label>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => toggleAllFields(true)} 
                        variant="ghost" 
                        size="sm"
                      >
                        เลือกทั้งหมด
                      </Button>
                      <Button 
                        onClick={() => toggleAllFields(false)} 
                        variant="ghost" 
                        size="sm"
                      >
                        ยกเลิกทั้งหมด
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto border rounded-md p-3 space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.key} className="flex items-center space-x-3">
                        <Checkbox
                          id={`field-${index}`}
                          checked={field.selected}
                          onCheckedChange={() => toggleField(index)}
                        />
                        <div className="flex-1 min-w-0">
                          <Label 
                            htmlFor={`field-${index}`} 
                            className="cursor-pointer truncate block"
                            title={field.key}
                          >
                            {field.key}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {field.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Label>ตัวเลือกการแปลง</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-headers"
                        checked={includeHeaders}
                        onCheckedChange={(checked: boolean) => setIncludeHeaders(checked)}
                      />
                      <Label htmlFor="include-headers" className="cursor-pointer">
                        รวม Header Row
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flatten-nested"
                        checked={flattenNested}
                        onCheckedChange={(checked: boolean) => setFlattenNested(checked)}
                      />
                      <Label htmlFor="flatten-nested" className="cursor-pointer">
                        แยก Nested Objects (dot notation)
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delimiter">Delimiter</Label>
                      <Input
                        id="delimiter"
                        value={customDelimiter}
                        onChange={(e) => setCustomDelimiter(e.target.value)}
                        placeholder="เช่น , ; |"
                        className="w-20"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <Button onClick={convertToCSV} className="gap-2 w-full">
                <FileSpreadsheet className="w-4 h-4" />
                แปลงเป็น CSV
              </Button>
            </>
          )}

          {/* CSV Output */}
          {csvOutput && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>CSV Output</Label>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="ghost" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      คัดลอก
                    </Button>
                    <Button onClick={downloadCSV} variant="ghost" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด CSV
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={csvOutput}
                  readOnly
                  className="min-h-[200px] font-mono text-sm bg-muted/50"
                />
                <div className="text-xs text-muted-foreground">
                  {csvOutput.split('\n').length} แถว, ขนาด {csvOutput.length.toLocaleString()} ตัวอักษร
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}