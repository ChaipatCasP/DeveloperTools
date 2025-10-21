import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Copy, RefreshCw, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['MD5', 'SHA1', 'SHA256']);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [fileName, setFileName] = useState('');

  const algorithms = [
    { name: 'MD5', description: 'Message Digest 5 (128-bit)', color: 'bg-red-100 text-red-800' },
    { name: 'SHA1', description: 'Secure Hash Algorithm 1 (160-bit)', color: 'bg-orange-100 text-orange-800' },
    { name: 'SHA256', description: 'Secure Hash Algorithm 256 (256-bit)', color: 'bg-green-100 text-green-800' },
    { name: 'SHA512', description: 'Secure Hash Algorithm 512 (512-bit)', color: 'bg-blue-100 text-blue-800' },
    { name: 'SHA3', description: 'Secure Hash Algorithm 3 (256-bit)', color: 'bg-purple-100 text-purple-800' },
  ];

  // Generate hashes
  const generateHashes = () => {
    if (!inputText.trim()) {
      setHashResults([]);
      return;
    }

    const results: HashResult[] = [];

    selectedAlgorithms.forEach(algorithm => {
      let hash = '';
      
      try {
        switch (algorithm) {
          case 'MD5':
            hash = CryptoJS.MD5(inputText).toString();
            break;
          case 'SHA1':
            hash = CryptoJS.SHA1(inputText).toString();
            break;
          case 'SHA256':
            hash = CryptoJS.SHA256(inputText).toString();
            break;
          case 'SHA512':
            hash = CryptoJS.SHA512(inputText).toString();
            break;
          case 'SHA3':
            hash = CryptoJS.SHA3(inputText, { outputLength: 256 }).toString();
            break;
        }

        if (hash) {
          results.push({
            algorithm,
            hash,
            length: hash.length
          });
        }
      } catch (error) {
        console.error(`Error generating ${algorithm} hash:`, error);
      }
    });

    setHashResults(results);
    
    if (results.length > 0) {
      toast.success(`สร้าง Hash สำเร็จ ${results.length} อัลกอริทึม`);
    }
  };

  // Auto-generate when input changes
  useEffect(() => {
    if (autoGenerate) {
      generateHashes();
    }
  }, [inputText, selectedAlgorithms, autoGenerate]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('ไฟล์ใหญ่เกินไป (จำกัดที่ 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setInputText(result);
      setFileName(file.name);
      toast.success(`อ่านไฟล์ ${file.name} สำเร็จ`);
    };
    reader.readAsText(file);
  };

  // Toggle algorithm selection
  const toggleAlgorithm = (algorithm: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm) 
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    );
  };

  // Copy hash to clipboard
  const copyHash = async (hash: string, algorithm: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.success(`คัดลอก ${algorithm} hash แล้ว!`);
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Copy all hashes
  const copyAllHashes = async () => {
    const allHashes = hashResults.map(result => 
      `${result.algorithm}: ${result.hash}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(allHashes);
      toast.success('คัดลอกทุก Hash แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Clear all
  const clearAll = () => {
    setInputText('');
    setHashResults([]);
    setFileName('');
  };

  // Get algorithm info
  const getAlgorithmInfo = (name: string) => {
    return algorithms.find(alg => alg.name === name);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Hash Generator
          </CardTitle>
          <CardDescription>
            สร้าง Hash checksums ด้วยอัลกอริทึมที่หลากหลาย
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-3">
            <Label>เลือกอัลกอริทึม Hash</Label>
            <div className="flex flex-wrap gap-2">
              {algorithms.map(algorithm => (
                <Button
                  key={algorithm.name}
                  onClick={() => toggleAlgorithm(algorithm.name)}
                  variant={selectedAlgorithms.includes(algorithm.name) ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  {algorithm.name}
                  {selectedAlgorithms.includes(algorithm.name) && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      ✓
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              เลือกแล้ว: {selectedAlgorithms.length} อัลกอริทึม
            </div>
          </div>

          {/* Input Methods */}
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">ข้อความ</TabsTrigger>
              <TabsTrigger value="file">ไฟล์</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>ข้อความที่ต้องการสร้าง Hash</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="พิมพ์ข้อความที่ต้องการสร้าง Hash..."
                  className="min-h-[120px] font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  ความยาว: {inputText.length.toLocaleString()} ตัวอักษร
                </div>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>อัปโหลดไฟล์</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-hash"
                    accept=".txt,.json,.xml,.csv,.log"
                  />
                  <Button asChild variant="outline" className="cursor-pointer">
                    <label htmlFor="file-upload-hash" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      เลือกไฟล์ข้อความ
                    </label>
                  </Button>
                  {fileName && (
                    <span className="text-sm text-muted-foreground">
                      ไฟล์: {fileName}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  รองรับไฟล์ข้อความ (TXT, JSON, XML, CSV, LOG) ขนาดไม่เกิน 10MB
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">สร้าง Hash อัตโนมัติ</span>
            </label>
            
            {!autoGenerate && (
              <Button onClick={generateHashes} className="gap-2">
                <Shield className="w-4 h-4" />
                สร้าง Hash
              </Button>
            )}
            
            <Button onClick={clearAll} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              ล้างข้อมูล
            </Button>
          </div>

          {/* Hash Results */}
          {hashResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>ผลลัพธ์ Hash</Label>
                <Button onClick={copyAllHashes} variant="ghost" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  คัดลอกทั้งหมด
                </Button>
              </div>
              
              <div className="space-y-3">
                {hashResults.map((result, index) => {
                  const algorithmInfo = getAlgorithmInfo(result.algorithm);
                  return (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={algorithmInfo?.color}>
                            {result.algorithm}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {algorithmInfo?.description}
                          </span>
                        </div>
                        <Button
                          onClick={() => copyHash(result.hash, result.algorithm)}
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          คัดลอก
                        </Button>
                      </div>
                      
                      <div className="font-mono text-sm bg-muted/50 p-3 rounded break-all">
                        {result.hash}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        ความยาว: {result.length} ตัวอักษร
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {selectedAlgorithms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              กรุณาเลือกอัลกอริทึม Hash อย่างน้อย 1 ตัว
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}