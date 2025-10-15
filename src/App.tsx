import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { CompareCode } from './components/CompareCode';
import { FormatSQL } from './components/FormatSQL';
import { FormatJSON } from './components/FormatJSON';
import { CaseConverter } from './components/CaseConverter';
import CSVToJSON from './components/CSVToJSON';
import { Code2, Database, Braces, CaseSensitive, ArrowLeftRight, FileJson } from 'lucide-react';
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
              <span className="hidden md:inline">Compare Code</span>
              <span className="md:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="sql" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Database className="w-4 h-4" />
              <span className="hidden md:inline">Format SQL</span>
              <span className="md:hidden">SQL</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Braces className="w-4 h-4" />
              <span className="hidden md:inline">Format JSON</span>
              <span className="md:hidden">JSON</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FileJson className="w-4 h-4" />
              <span className="hidden md:inline">CSV to JSON</span>
              <span className="md:hidden">CSV</span>
            </TabsTrigger>
            <TabsTrigger value="case" className="flex-1 gap-2 text-xs sm:text-sm whitespace-nowrap">
              <CaseSensitive className="w-4 h-4" />
              <span className="hidden md:inline">Case Converter</span>
              <span className="md:hidden">Case</span>
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
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  );
}
