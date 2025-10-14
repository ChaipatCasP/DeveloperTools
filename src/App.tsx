import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { CompareCode } from './components/CompareCode';
import { FormatSQL } from './components/FormatSQL';
import { FormatJSON } from './components/FormatJSON';
import { CaseConverter } from './components/CaseConverter';
import { Code2, Database, Braces, CaseSensitive, ArrowLeftRight } from 'lucide-react';
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="compare" className="gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Compare Code</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="sql" className="gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Format SQL</span>
              <span className="sm:hidden">SQL</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <Braces className="w-4 h-4" />
              <span className="hidden sm:inline">Format JSON</span>
              <span className="sm:hidden">JSON</span>
            </TabsTrigger>
            <TabsTrigger value="case" className="gap-2">
              <CaseSensitive className="w-4 h-4" />
              <span className="hidden sm:inline">Case Converter</span>
              <span className="sm:hidden">Case</span>
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
