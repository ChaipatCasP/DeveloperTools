import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Search, Copy, RefreshCw, Zap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface RegexFlag {
  flag: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [flags, setFlags] = useState<RegexFlag[]>([
    { flag: 'g', name: 'Global', description: 'หาทุกผลลัพธ์', enabled: true },
    { flag: 'i', name: 'Case Insensitive', description: 'ไม่สนใจตัวพิมพ์เล็ก-ใหญ่', enabled: false },
    { flag: 'm', name: 'Multiline', description: 'โหมดหลายบรรทัด', enabled: false },
    { flag: 's', name: 'Dotall', description: '. จับ newline ด้วย', enabled: false },
    { flag: 'u', name: 'Unicode', description: 'รองรับ Unicode', enabled: false },
    { flag: 'y', name: 'Sticky', description: 'จับจาก lastIndex', enabled: false }
  ]);

  const commonPatterns = [
    { name: 'Email', pattern: '[\\w\\.-]+@[\\w\\.-]+\\.[\\w]+', description: 'รูปแบบ Email' },
    { name: 'Phone (TH)', pattern: '0[0-9]{1,2}-?[0-9]{3}-?[0-9]{4}', description: 'เบอร์โทรไทย' },
    { name: 'URL', pattern: 'https?:\\/\\/[\\w\\.-]+\\.[\\w]+(\\/.+)?', description: 'URL/Website' },
    { name: 'IP Address', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', description: 'IP Address' },
    { name: 'Thai ID', pattern: '[0-9]{1}-?[0-9]{4}-?[0-9]{5}-?[0-9]{2}-?[0-9]{1}', description: 'เลขบัตรประชาชน' },
    { name: 'Date (DD/MM/YYYY)', pattern: '\\b(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-](19|20)?\\d\\d\\b', description: 'วันที่ DD/MM/YYYY' },
    { name: 'HTML Tags', pattern: '<\\/?.+?>', description: 'HTML Tags' },
    { name: 'Hex Colors', pattern: '#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}', description: 'รหัสสี Hex' }
  ];

  // Test regex pattern
  const testRegex = () => {
    if (!pattern.trim()) {
      setMatches([]);
      setIsValid(true);
      setErrorMessage('');
      return;
    }

    try {
      const flagString = flags.filter(f => f.enabled).map(f => f.flag).join('');
      const regex = new RegExp(pattern, flagString);
      setIsValid(true);
      setErrorMessage('');

      if (!testString.trim()) {
        setMatches([]);
        return;
      }

      const results: RegexMatch[] = [];
      
      if (flags.find(f => f.flag === 'g')?.enabled) {
        // Global mode - find all matches
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Single match mode
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(results);
      
      if (results.length > 0) {
        toast.success(`พบ ${results.length} ผลลัพธ์`);
      }
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : 'รูปแบบ Regex ไม่ถูกต้อง');
      setMatches([]);
    }
  };

  // Auto-test when pattern or string changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      testRegex();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [pattern, testString, flags]);

  // Toggle flag
  const toggleFlag = (flagName: string) => {
    setFlags(prev => prev.map(flag => 
      flag.flag === flagName 
        ? { ...flag, enabled: !flag.enabled }
        : flag
    ));
  };

  // Use common pattern
  const useCommonPattern = (commonPattern: string) => {
    setPattern(commonPattern);
  };

  // Copy pattern to clipboard
  const copyPattern = async () => {
    const flagString = flags.filter(f => f.enabled).map(f => f.flag).join('');
    const fullPattern = `/${pattern}/${flagString}`;
    
    try {
      await navigator.clipboard.writeText(fullPattern);
      toast.success('คัดลอก Pattern แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Copy matches
  const copyMatches = async () => {
    const matchText = matches.map((match, index) => 
      `${index + 1}. "${match.match}" (position: ${match.index})`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(matchText);
      toast.success('คัดลอกผลลัพธ์แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Clear all
  const clearAll = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setIsValid(true);
    setErrorMessage('');
  };

  // Highlight matches in test string
  const highlightMatches = (text: string) => {
    if (!matches.length) return text;
    
    let result = '';
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      // Add text before match
      result += text.slice(lastIndex, match.index);
      // Add highlighted match
      result += `<mark class="bg-yellow-200 px-1 rounded" title="Match ${index + 1}">${match.match}</mark>`;
      lastIndex = match.index + match.match.length;
    });
    
    // Add remaining text
    result += text.slice(lastIndex);
    return result;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Regex Tester
          </CardTitle>
          <CardDescription>
            ทดสอบและสร้าง Regular Expression patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pattern Input */}
          <div className="space-y-2">
            <Label>Regex Pattern</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="พิมพ์ regex pattern เช่น \d{3}-\d{3}-\d{4}"
                  className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                />
                {!isValid && (
                  <div className="absolute top-full left-0 mt-1 text-xs text-red-600">
                    {errorMessage}
                  </div>
                )}
              </div>
              <Button onClick={copyPattern} variant="outline" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <Label>Flags</Label>
            <div className="flex flex-wrap gap-2">
              {flags.map(flag => (
                <Button
                  key={flag.flag}
                  onClick={() => toggleFlag(flag.flag)}
                  variant={flag.enabled ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  title={flag.description}
                >
                  {flag.flag.toUpperCase()} - {flag.name}
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Pattern: /{pattern}/{flags.filter(f => f.enabled).map(f => f.flag).join('')}
            </div>
          </div>

          {/* Common Patterns */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              รูปแบบที่ใช้บ่อย
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {commonPatterns.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => useCommonPattern(item.pattern)}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto p-2 text-left"
                  title={item.description}
                >
                  <div>
                    <div className="font-medium text-xs">{item.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Test String */}
          <div className="space-y-2">
            <Label>Test String</Label>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="วางข้อความที่ต้องการทดสอบที่นี่..."
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          {/* Test Button and Actions */}
          <div className="flex gap-2">
            <Button onClick={testRegex} className="gap-2">
              <Zap className="w-4 h-4" />
              ทดสอบ
            </Button>
            <Button onClick={clearAll} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              ล้างข้อมูล
            </Button>
          </div>

          {/* Results */}
          {testString && (
            <div className="space-y-4">
              <Separator />
              
              {/* Match Summary */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Label>ผลลัพธ์</Label>
                  <Badge variant={matches.length > 0 ? "default" : "secondary"}>
                    {matches.length} matches
                  </Badge>
                  {isValid && (
                    <Badge variant="outline" className="text-green-600">
                      Valid Pattern
                    </Badge>
                  )}
                </div>
                
                {matches.length > 0 && (
                  <Button onClick={copyMatches} variant="ghost" size="sm" className="gap-2">
                    <Copy className="w-4 h-4" />
                    คัดลอกผลลัพธ์
                  </Button>
                )}
              </div>

              {/* Highlighted Text */}
              {matches.length > 0 && (
                <div className="space-y-2">
                  <Label>ข้อความที่ไฮไลต์</Label>
                  <div 
                    className="p-3 border rounded-md bg-muted/30 font-mono text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightMatches(testString) }}
                  />
                </div>
              )}

              {/* Match Details */}
              {matches.length > 0 && (
                <div className="space-y-2">
                  <Label>รายละเอียดการจับคู่</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {matches.map((match, index) => (
                      <div key={index} className="border rounded-md p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded">
                            {match.match}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Position: {match.index}
                          </span>
                        </div>
                        
                        {match.groups.length > 0 && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Groups: </span>
                            {match.groups.map((group, groupIndex) => (
                              <span 
                                key={groupIndex}
                                className="font-mono bg-blue-100 px-1 py-0.5 rounded mr-1"
                              >
                                ${groupIndex + 1}: "{group}"
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No matches */}
              {matches.length === 0 && isValid && testString && (
                <div className="text-center py-6 text-muted-foreground">
                  ไม่พบผลลัพธ์ที่ตรงกับ pattern
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}