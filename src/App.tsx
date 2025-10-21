import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { CompareCode } from './components/CompareCode';
import { FormatSQL } from './components/FormatSQL';
import { FormatJSON } from './components/FormatJSON';
import { CaseConverter } from './components/CaseConverter';
import CSVToJSON from './components/CSVToJSON';
import Base64EncoderDecoder from './components/Base64EncoderDecoder';
import JSONToCSV from './components/JSONToCSV';
import HashGenerator from './components/HashGenerator';
import RegexTester from './components/RegexTester';
import ColorTools from './components/ColorTools';
import TextDiff from './components/TextDiff';
import QRCodeGenerator from './components/QRCodeGenerator';
import { Code2, Database, Braces, CaseSensitive, ArrowLeftRight, FileJson, FileText, FileSpreadsheet, Shield, Search, Palette, GitCompare, QrCode } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Code2 className="w-10 h-10 text-primary" />
            <h1 className="text-primary">Developer Tools</h1>
          </div>
          <p className="text-muted-foreground">เครื่องมือสำหรับนักพัฒนา - จัดการโค้ดและข้อมูลได้อย่างง่ายดาย</p>
        </div>

        <Tabs defaultValue="compare" className="w-full">
          <TabsList className="flex w-full h-auto overflow-x-auto">
            <TabsTrigger value="compare" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden lg:inline">Compare Code</span>
              <span className="lg:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="sql" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Database className="w-4 h-4" />
              <span className="hidden lg:inline">Format SQL</span>
              <span className="lg:hidden">SQL</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Braces className="w-4 h-4" />
              <span className="hidden lg:inline">Format JSON</span>
              <span className="lg:hidden">JSON</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FileJson className="w-4 h-4" />
              <span className="hidden lg:inline">CSV to JSON</span>
              <span className="lg:hidden">CSV→JSON</span>
            </TabsTrigger>
            <TabsTrigger value="json-csv" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden lg:inline">JSON to CSV</span>
              <span className="lg:hidden">JSON→CSV</span>
            </TabsTrigger>
            <TabsTrigger value="base64" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FileText className="w-4 h-4" />
              <span className="hidden lg:inline">Base64</span>
              <span className="lg:hidden">Base64</span>
            </TabsTrigger>
            <TabsTrigger value="hash" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">Hash Generator</span>
              <span className="lg:hidden">Hash</span>
            </TabsTrigger>
            <TabsTrigger value="regex" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Regex Tester</span>
              <span className="lg:hidden">Regex</span>
            </TabsTrigger>
            <TabsTrigger value="color" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Palette className="w-4 h-4" />
              <span className="hidden lg:inline">Color Tools</span>
              <span className="lg:hidden">Color</span>
            </TabsTrigger>
            <TabsTrigger value="case" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <CaseSensitive className="w-4 h-4" />
              <span className="hidden lg:inline">Case Converter</span>
              <span className="lg:hidden">Case</span>
            </TabsTrigger>
            <TabsTrigger value="diff" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <GitCompare className="w-4 h-4" />
              <span className="hidden lg:inline">Text Diff</span>
              <span className="lg:hidden">Diff</span>
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <QrCode className="w-4 h-4" />
              <span className="hidden lg:inline">QR Code</span>
              <span className="lg:hidden">QR</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  Compare Code
                </CardTitle>
                <CardDescription>
                  เปรียบเทียบโค้ดหรือข้อความสองฝั่ง เพื่อหาความแตกต่างระหว่างบรรทัด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompareCode />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sql" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Format SQL
                </CardTitle>
                <CardDescription>
                  จัดรูปแบบ SQL Query ให้อ่านง่ายและเป็นระเบียบ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormatSQL />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Braces className="w-5 h-5" />
                  Format JSON
                </CardTitle>
                <CardDescription>
                  จัดรูปแบบ JSON ให้สวยงาม หรือย่อให้กระทัดรัด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormatJSON />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv" className="mt-6">
            <CSVToJSON />
          </TabsContent>

          <TabsContent value="json-csv" className="mt-6">
            <JSONToCSV />
          </TabsContent>

          <TabsContent value="base64" className="mt-6">
            <Base64EncoderDecoder />
          </TabsContent>

          <TabsContent value="hash" className="mt-6">
            <HashGenerator />
          </TabsContent>

          <TabsContent value="regex" className="mt-6">
            <RegexTester />
          </TabsContent>

          <TabsContent value="color" className="mt-6">
            <ColorTools />
          </TabsContent>

          <TabsContent value="case" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CaseSensitive className="w-5 h-5" />
                  Text Case Converter
                </CardTitle>
                <CardDescription>
                  แปลงข้อความเป็นรูปแบบต่างๆ เช่น UPPER CASE, lower case, camelCase และอื่นๆ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CaseConverter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diff" className="mt-6">
            <TextDiff />
          </TabsContent>

          <TabsContent value="qrcode" className="mt-6">
            <QRCodeGenerator />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  );
}
