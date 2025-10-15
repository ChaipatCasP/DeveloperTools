import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Upload, Download, Copy, Trash2, Plus, Layers, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface CSVData {
  headers: string[];
  rows: any[][];
  parsed: any[];
}

interface GroupConfig {
  id: string;
  name: string;
  groupBy: string;
  fields: string[];
  nested?: GroupConfig[];
}

export default function CSVToJSON() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupConfigs, setGroupConfigs] = useState<GroupConfig[]>([]);
  const [previewMode, setPreviewMode] = useState<'table' | 'json'>('table');

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('กรุณาเลือกไฟล์ CSV เท่านั้น');
      return;
    }

    setLoading(true);
    
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          const data = results.data as any[][];
          if (data.length === 0) {
            toast.error('ไฟล์ CSV ว่างเปล่า');
            return;
          }

          const headers = data[0] as string[];
          const rows = data.slice(1);
          
          // Create objects from CSV data
          const parsed = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });

          setCsvData({ headers, rows, parsed });
          toast.success(`อ่านไฟล์ CSV สำเร็จ (${parsed.length} แถว)`);
        } catch (error) {
          toast.error('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        toast.error('เกิดข้อผิดพลาดในการ parse CSV: ' + error.message);
        setLoading(false);
      }
    });
  }, []);

  // Add new group configuration
  const addGroupConfig = () => {
    if (!csvData) return;
    
    const newConfig: GroupConfig = {
      id: Date.now().toString(),
      name: csvData.headers[0], // Use groupBy field as name
      groupBy: csvData.headers[0],
      fields: [csvData.headers[0]]
    };
    
    setGroupConfigs([...groupConfigs, newConfig]);
  };

  // Update group configuration
  const updateGroupConfig = (id: string, updates: Partial<GroupConfig>) => {
    setGroupConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  // Remove group configuration
  const removeGroupConfig = (id: string) => {
    setGroupConfigs(configs => configs.filter(config => config.id !== id));
  };

  // Toggle field in group config
  const toggleField = (configId: string, field: string) => {
    setGroupConfigs(configs =>
      configs.map(config => {
        if (config.id !== configId) return config;
        
        const fields = config.fields.includes(field)
          ? config.fields.filter(f => f !== field)
          : [...config.fields, field];
          
        return { ...config, fields };
      })
    );
  };

  // Generate grouped JSON
  const generateGroupedJSON = () => {
    if (!csvData || groupConfigs.length === 0) return;

    try {
      let result: any = {};

      groupConfigs.forEach(config => {
        if (config.fields.length === 0) return;

        // Group data by the selected field
        const grouped = csvData.parsed.reduce((acc, item) => {
          const groupKey = item[config.groupBy];
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }

          // Create object with only selected fields
          const filteredItem: any = {};
          config.fields.forEach(field => {
            filteredItem[field] = item[field];
          });
          
          acc[groupKey].push(filteredItem);
          return acc;
        }, {});

        result[config.name] = grouped;
      });

      const jsonOutput = JSON.stringify(result, null, 2);
      setOutput(jsonOutput);
      toast.success('สร้าง JSON สำเร็จ!');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการสร้าง JSON');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success('คัดลอกไปยัง Clipboard แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Copy all JSON data to clipboard
  const copyAllJSONToClipboard = async () => {
    if (!csvData) return;
    
    try {
      const allJSON = JSON.stringify(csvData.parsed, null, 2);
      await navigator.clipboard.writeText(allJSON);
      toast.success('คัดลอก JSON ทั้งหมดไปยัง Clipboard แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Download JSON
  const downloadJSON = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ดาวน์โหลดไฟล์ JSON แล้ว!');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            CSV to JSON Converter
          </CardTitle>
          <CardDescription>
            อัปโหลดไฟล์ CSV, เลือกฟิลด์ที่ต้องการ, และจัดกลุ่มข้อมูลเป็น JSON ที่มีโครงสร้างหลายชั้น
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>อัปโหลดไฟล์ CSV</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button
                asChild
                variant="outline"
                className="cursor-pointer"
                disabled={loading}
              >
                <label htmlFor="csv-upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {loading ? 'กำลังอ่านไฟล์...' : 'เลือกไฟล์ CSV'}
                </label>
              </Button>
              
              {csvData && (
                <Badge variant="secondary">
                  {csvData.parsed.length} แถว, {csvData.headers.length} คอลัมน์
                </Badge>
              )}
            </div>
          </div>

          {/* CSV Preview */}
          {csvData && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>ตัวอย่างข้อมูล CSV</Label>
                {previewMode === 'json' && (
                  <Button 
                    onClick={copyAllJSONToClipboard} 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    คัดลอก JSON ทั้งหมด
                  </Button>
                )}
              </div>
              
              {/* Tabs for different view formats */}
              <div className="border rounded-md overflow-hidden">
                <div className="flex border-b">
                  <button
                    onClick={() => setPreviewMode('table')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      previewMode === 'table'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    ตาราง
                  </button>
                  <button
                    onClick={() => setPreviewMode('json')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      previewMode === 'json'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    JSON
                  </button>
                </div>
                
                <div className="p-3 bg-muted/30 overflow-auto max-h-64">
                  {previewMode === 'table' ? (
                    <div className="font-mono text-sm">
                      <div className="flex gap-4 font-semibold border-b pb-2 mb-2">
                        {csvData.headers.map((header, idx) => (
                          <span key={idx} className="min-w-24 truncate">
                            {header}
                          </span>
                        ))}
                      </div>
                      {csvData.rows.slice(0, 3).map((row, idx) => (
                        <div key={idx} className="flex gap-4 py-1">
                          {row.map((cell, cellIdx) => (
                            <span key={cellIdx} className="min-w-24 truncate text-muted-foreground">
                              {cell || '-'}
                            </span>
                          ))}
                        </div>
                      ))}
                      {csvData.rows.length > 3 && (
                        <div className="text-center text-muted-foreground text-xs mt-2">
                          ... และอีก {csvData.rows.length - 3} แถว
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-muted-foreground">
                        {JSON.stringify(csvData.parsed.slice(0, 3), null, 2)}
                      </pre>
                      {csvData.parsed.length > 3 && (
                        <div className="text-center text-muted-foreground text-xs mt-2 border-t pt-2">
                          ... และอีก {csvData.parsed.length - 3} objects
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Group Configuration Section */}
          {csvData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>การตั้งค่าการจัดกลุ่มข้อมูล</Label>
                <Button onClick={addGroupConfig} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่มกลุ่ม
                </Button>
              </div>

              {groupConfigs.map((config, index) => (
                <Card key={config.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <Label>กลุ่มที่ {index + 1}</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroupConfig(config.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>จัดกลุ่มตาม</Label>
                        <Select
                          value={config.groupBy}
                          onValueChange={(value: string) => updateGroupConfig(config.id, { groupBy: value, name: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/100 backdrop-blur-none border shadow-lg z-50" style={{backgroundColor: 'white'}}>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>เลือกฟิลด์ที่ต้องการ</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {csvData.headers.map((header) => (
                            <div key={header} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${config.id}-${header}`}
                                checked={config.fields.includes(header)}
                                onCheckedChange={() => toggleField(config.id, header)}
                              />
                              <Label
                                htmlFor={`${config.id}-${header}`}
                                className="text-sm cursor-pointer truncate"
                                title={header}
                              >
                                {header}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          เลือกแล้ว: {config.fields.length} ฟิลด์
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {groupConfigs.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={generateGroupedJSON} className="gap-2">
                    <FileJson className="w-4 h-4" />
                    สร้าง JSON
                  </Button>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Output Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>JSON Output</Label>
              {output && (
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="ghost" size="sm" className="gap-2">
                    <Copy className="w-4 h-4" />
                    คัดลอก
                  </Button>
                  <Button onClick={downloadJSON} variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="ผลลัพธ์ JSON จะแสดงที่นี่หลังจากสร้างกลุ่มข้อมูล..."
              className={`font-mono text-sm bg-muted/50 transition-all duration-300 ${
                output ? 'min-h-[400px]' : 'min-h-[200px]'
              }`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}