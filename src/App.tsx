import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
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
import BingoGame from './components/BingoGame';
import BingoMaster from './components/BingoMaster';
import { Code2, Database, Braces, CaseSensitive, ArrowLeftRight, FileJson, FileText, FileSpreadsheet, Shield, Search, Palette, GitCompare, QrCode, Gamepad2, Grid3X3, Mic } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeSection, setActiveSection] = React.useState<'tools' | 'games'>('tools');
  const [activeTool, setActiveTool] = React.useState<string>('compare');
  const [activeGame, setActiveGame] = React.useState<string>('bingo');

  // ข้อมูลเครื่องมือ
  const tools = [
    { id: 'compare', name: 'Compare Code', icon: ArrowLeftRight },
    { id: 'sql', name: 'Format SQL', icon: Database },
    { id: 'json', name: 'Format JSON', icon: Braces },
    { id: 'csv', name: 'CSV to JSON', icon: FileJson },
    { id: 'json-csv', name: 'JSON to CSV', icon: FileSpreadsheet },
    { id: 'base64', name: 'Base64', icon: FileText },
    { id: 'hash', name: 'Hash Generator', icon: Shield },
    { id: 'regex', name: 'Regex Tester', icon: Search },
    { id: 'color', name: 'Color Tools', icon: Palette },
    { id: 'case', name: 'Case Converter', icon: CaseSensitive },
    { id: 'diff', name: 'Text Diff', icon: GitCompare },
    { id: 'qrcode', name: 'QR Code', icon: QrCode },
  ];

  // ข้อมูลเกม
  const games = [
    { id: 'bingo', name: 'Bingo Game', icon: Grid3X3 },
    { id: 'bingo-master', name: 'ผู้นำ Bingo', icon: Mic },
  ];

  const getCurrentTool = () => tools.find(tool => tool.id === activeTool);
  const getCurrentGame = () => games.find(game => game.id === activeGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeSection === 'tools' ? (
                  <>
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Developer Tools</h1>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">เครื่องมือสำหรับนักพัฒนา</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Games</h1>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">เกมส์สนุกๆ สำหรับช่วงพักผ่อน</p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Navigation Menu */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {/* Section Selector */}
                <div className="flex gap-2">
                  <Button
                    variant={activeSection === 'tools' ? 'default' : 'outline'}
                    onClick={() => setActiveSection('tools')}
                    className="flex-1 sm:flex-none gap-2 text-base h-12 px-4"
                    size="default"
                  >
                    <Code2 className="w-5 h-5" />
                    <span className="hidden xs:inline font-medium">Tools</span>
                  </Button>
                  <Button
                    variant={activeSection === 'games' ? 'default' : 'outline'}
                    onClick={() => setActiveSection('games')}
                    className="flex-1 sm:flex-none gap-2 text-base h-12 px-4"
                    size="default"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span className="hidden xs:inline font-medium">Games</span>
                  </Button>
                </div>
                
                {/* Tool/Game Selector */}
                <Select 
                  value={activeSection === 'tools' ? activeTool : activeGame}
                  onValueChange={(value) => {
                    if (activeSection === 'tools') {
                      setActiveTool(value);
                    } else {
                      setActiveGame(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[280px] min-w-0 h-12">
                    <SelectValue>
                      <div className="flex items-center gap-3 min-w-0">
                        {activeSection === 'tools' ? (
                          <>
                            {getCurrentTool()?.icon && React.createElement(getCurrentTool()!.icon, { className: "w-5 h-5 flex-shrink-0" })}
                            <span className="truncate text-base font-medium">{getCurrentTool()?.name || 'เลือกเครื่องมือ'}</span>
                          </>
                        ) : (
                          <>
                            {getCurrentGame()?.icon && React.createElement(getCurrentGame()!.icon, { className: "w-5 h-5 flex-shrink-0" })}
                            <span className="truncate text-base font-medium">{getCurrentGame()?.name || 'เลือกเกม'}</span>
                          </>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    className="w-[var(--radix-select-trigger-width)] max-h-[300px] !bg-white border border-gray-200 shadow-xl rounded-md z-[100]"
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    style={{ backgroundColor: 'white !important' }}
                  >
                    {activeSection === 'tools' ? (
                      tools.map((tool) => (
                        <SelectItem 
                          key={tool.id} 
                          value={tool.id}
                          className="!bg-white hover:!bg-gray-100 focus:!bg-blue-50 focus:!text-blue-700 data-[highlighted]:!bg-gray-100 cursor-pointer py-4 px-4 text-base border-0"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {React.createElement(tool.icon, { className: "w-5 h-5 flex-shrink-0 text-gray-500" })}
                            <span className="truncate font-medium">{tool.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      games.map((game) => (
                        <SelectItem 
                          key={game.id} 
                          value={game.id}
                          className="!bg-white hover:!bg-gray-100 focus:!bg-blue-50 focus:!text-blue-700 data-[highlighted]:!bg-gray-100 cursor-pointer py-4 px-4 text-base border-0"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {React.createElement(game.icon, { className: "w-5 h-5 flex-shrink-0 text-gray-500" })}
                            <span className="truncate font-medium">{game.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeSection === 'tools' ? (
          <div>
            {activeTool === 'compare' && (
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
            )}

            {activeTool === 'sql' && (
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
            )}

            {activeTool === 'json' && (
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
            )}

            {activeTool === 'csv' && <CSVToJSON />}
            {activeTool === 'json-csv' && <JSONToCSV />}
            {activeTool === 'base64' && <Base64EncoderDecoder />}
            {activeTool === 'hash' && <HashGenerator />}
            {activeTool === 'regex' && <RegexTester />}
            {activeTool === 'color' && <ColorTools />}
            
            {activeTool === 'case' && (
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
            )}

            {activeTool === 'diff' && <TextDiff />}
            {activeTool === 'qrcode' && <QRCodeGenerator />}
          </div>
        ) : (
          <div>
            {activeGame === 'bingo' && <BingoGame />}
            {activeGame === 'bingo-master' && <BingoMaster />}
            {/* เพิ่มเกมอื่นๆ ได้ในอนาคต */}
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
}
