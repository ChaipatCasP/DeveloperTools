import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Download, Copy, RefreshCw, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

export default function Base64EncoderDecoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [fileData, setFileData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Encode text to Base64
  const encodeToBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      toast.success('เข้ารหัส Base64 สำเร็จ!');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้ารหัส');
      setOutputText('');
    }
  };

  // Decode Base64 to text
  const decodeFromBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      toast.success('ถอดรหัส Base64 สำเร็จ!');
    } catch (error) {
      toast.error('ข้อมูล Base64 ไม่ถูกต้อง');
      setOutputText('');
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1]; // Remove data:type;base64, prefix
      setFileData(base64);
      setFileName(file.name);
      setInputText(base64);
      toast.success(`อ่านไฟล์ ${file.name} สำเร็จ`);
    };
    reader.readAsDataURL(file);
  };

  // Process based on mode
  const processText = () => {
    if (mode === 'encode') {
      encodeToBase64();
    } else {
      decodeFromBase64();
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('คัดลอกไปยัง Clipboard แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Download as file
  const downloadAsFile = () => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'encode' ? 'encoded' : 'decoded'}_output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('ดาวน์โหลดไฟล์แล้ว!');
  };

  // Clear all
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setFileData('');
    setFileName('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Base64 Encoder/Decoder
          </CardTitle>
          <CardDescription>
            เข้ารหัส/ถอดรหัส Base64 สำหรับข้อความและไฟล์
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <Tabs value={mode} onValueChange={(value: any) => setMode(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode (เข้ารหัส)</TabsTrigger>
              <TabsTrigger value="decode">Decode (ถอดรหัส)</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>ข้อความที่ต้องการเข้ารหัส</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="พิมพ์ข้อความที่ต้องการเข้ารหัสเป็น Base64..."
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              {/* File Upload for Encoding */}
              <div className="space-y-2">
                <Label>หรืออัปโหลดไฟล์</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild variant="outline" className="cursor-pointer">
                    <label htmlFor="file-upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      เลือกไฟล์
                    </label>
                  </Button>
                  {fileName && (
                    <span className="text-sm text-muted-foreground">
                      ไฟล์: {fileName}
                    </span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>ข้อมูล Base64 ที่ต้องการถอดรหัส</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="วางข้อมูล Base64 ที่ต้องการถอดรหัส..."
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={processText} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {mode === 'encode' ? 'เข้ารหัส' : 'ถอดรหัส'}
            </Button>
            <Button onClick={clearAll} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              ล้างข้อมูล
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>ผลลัพธ์</Label>
              {outputText && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(outputText)} 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    คัดลอก
                  </Button>
                  <Button 
                    onClick={downloadAsFile} 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              value={outputText}
              readOnly
              placeholder={`ผลลัพธ์การ${mode === 'encode' ? 'เข้ารหัส' : 'ถอดรหัส'}จะแสดงที่นี่...`}
              className={`font-mono text-sm bg-muted/50 transition-all duration-300 ${
                outputText ? 'min-h-[150px]' : 'min-h-[100px]'
              }`}
            />
            {outputText && (
              <div className="text-xs text-muted-foreground">
                ขนาด: {outputText.length.toLocaleString()} ตัวอักษร
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}