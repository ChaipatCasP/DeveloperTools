import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { GitCompare, Copy, RefreshCw, ArrowRight, Plus, Minus, Equal } from 'lucide-react';
import { toast } from 'sonner';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  oldLineNum?: number;
  newLineNum?: number;
  content: string;
  originalContent?: string; // For modified lines
}

interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
}

export default function TextDiff() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showSideBySide, setShowSideBySide] = useState(false);

  // Generate diff
  const diffResult = useMemo(() => {
    if (!originalText && !modifiedText) return { lines: [], stats: { additions: 0, deletions: 0, modifications: 0, unchanged: 0 } };

    let original = originalText.split('\n');
    let modified = modifiedText.split('\n');

    // Apply filters
    if (ignoreWhitespace) {
      original = original.map(line => line.trim());
      modified = modified.map(line => line.trim());
    }

    if (ignoreCase) {
      original = original.map(line => line.toLowerCase());
      modified = modified.map(line => line.toLowerCase());
    }

    const diffLines: DiffLine[] = [];
    const stats: DiffStats = { additions: 0, deletions: 0, modifications: 0, unchanged: 0 };

    // Simple diff algorithm
    let oldIndex = 0;
    let newIndex = 0;
    let oldLineNum = 1;
    let newLineNum = 1;

    while (oldIndex < original.length || newIndex < modified.length) {
      if (oldIndex >= original.length) {
        // Remaining lines are additions
        diffLines.push({
          type: 'added',
          newLineNum: newLineNum++,
          content: modifiedText.split('\n')[newIndex]
        });
        stats.additions++;
        newIndex++;
      } else if (newIndex >= modified.length) {
        // Remaining lines are deletions
        diffLines.push({
          type: 'removed',
          oldLineNum: oldLineNum++,
          content: originalText.split('\n')[oldIndex]
        });
        stats.deletions++;
        oldIndex++;
      } else if (original[oldIndex] === modified[newIndex]) {
        // Lines are identical
        diffLines.push({
          type: 'unchanged',
          oldLineNum: oldLineNum++,
          newLineNum: newLineNum++,
          content: originalText.split('\n')[oldIndex]
        });
        stats.unchanged++;
        oldIndex++;
        newIndex++;
      } else {
        // Try to find if this is a modification or add/delete
        const originalContent = originalText.split('\n')[oldIndex];
        const modifiedContent = modifiedText.split('\n')[newIndex];
        
        // Check if next lines match (indicating this is a modification)
        const nextOriginal = oldIndex + 1 < original.length ? original[oldIndex + 1] : null;
        const nextModified = newIndex + 1 < modified.length ? modified[newIndex + 1] : null;
        
        if (nextOriginal === nextModified && nextOriginal !== null) {
          // This is likely a modification
          diffLines.push({
            type: 'modified',
            oldLineNum: oldLineNum++,
            newLineNum: newLineNum++,
            content: modifiedContent,
            originalContent: originalContent
          });
          stats.modifications++;
          oldIndex++;
          newIndex++;
        } else {
          // Check if current modified line exists later in original
          const foundInOriginal = original.slice(oldIndex + 1).indexOf(modified[newIndex]);
          const foundInModified = modified.slice(newIndex + 1).indexOf(original[oldIndex]);
          
          if (foundInOriginal !== -1 && (foundInModified === -1 || foundInOriginal < foundInModified)) {
            // Current original line was deleted
            diffLines.push({
              type: 'removed',
              oldLineNum: oldLineNum++,
              content: originalContent
            });
            stats.deletions++;
            oldIndex++;
          } else if (foundInModified !== -1) {
            // Current modified line was added
            diffLines.push({
              type: 'added',
              newLineNum: newLineNum++,
              content: modifiedContent
            });
            stats.additions++;
            newIndex++;
          } else {
            // Treat as modification
            diffLines.push({
              type: 'modified',
              oldLineNum: oldLineNum++,
              newLineNum: newLineNum++,
              content: modifiedContent,
              originalContent: originalContent
            });
            stats.modifications++;
            oldIndex++;
            newIndex++;
          }
        }
      }
    }

    return { lines: diffLines, stats };
  }, [originalText, modifiedText, ignoreWhitespace, ignoreCase]);

  // Get line style
  const getLineStyle = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'removed':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'modified':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      default:
        return 'bg-gray-50';
    }
  };

  // Get line icon
  const getLineIcon = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified':
        return <ArrowRight className="w-4 h-4 text-yellow-600" />;
      default:
        return <Equal className="w-4 h-4 text-gray-400" />;
    }
  };

  // Copy diff report
  const copyDiffReport = async () => {
    const report = `Diff Report
==========
Original Lines: ${originalText.split('\n').length}
Modified Lines: ${modifiedText.split('\n').length}

Changes:
+ ${diffResult.stats.additions} additions
- ${diffResult.stats.deletions} deletions
~ ${diffResult.stats.modifications} modifications
= ${diffResult.stats.unchanged} unchanged

Detailed Diff:
${diffResult.lines.map((line, index) => {
  const prefix = line.type === 'added' ? '+' : 
                line.type === 'removed' ? '-' : 
                line.type === 'modified' ? '~' : ' ';
  const lineNum = line.type === 'removed' ? (line.oldLineNum || '') : (line.newLineNum || '');
  return `${prefix} ${lineNum}: ${line.content}`;
}).join('\n')}`;

    try {
      await navigator.clipboard.writeText(report);
      toast.success('คัดลอกรายงาน Diff แล้ว!');
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };

  // Clear all
  const clearAll = () => {
    setOriginalText('');
    setModifiedText('');
  };

  // Swap texts
  const swapTexts = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Text Diff
          </CardTitle>
          <CardDescription>
            เปรียบเทียบข้อความแบบละเอียด แสดงความแตกต่างทีละบรรทัด
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Text</Label>
              <Textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="วางข้อความต้นฉบับที่นี่..."
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground">
                {originalText.split('\n').length} บรรทัด, {originalText.length} ตัวอักษร
              </div>
            </div>

            <div className="space-y-2">
              <Label>Modified Text</Label>
              <Textarea
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                placeholder="วางข้อความที่แก้ไขแล้วที่นี่..."
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground">
                {modifiedText.split('\n').length} บรรทัด, {modifiedText.length} ตัวอักษร
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label>ตัวเลือก</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-whitespace"
                  checked={ignoreWhitespace}
                  onCheckedChange={(checked: boolean) => setIgnoreWhitespace(checked)}
                />
                <Label htmlFor="ignore-whitespace" className="cursor-pointer">
                  ไม่สนใจ Whitespace
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-case"
                  checked={ignoreCase}
                  onCheckedChange={(checked: boolean) => setIgnoreCase(checked)}
                />
                <Label htmlFor="ignore-case" className="cursor-pointer">
                  ไม่สนใจตัวพิมพ์เล็ก-ใหญ่
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-line-numbers"
                  checked={showLineNumbers}
                  onCheckedChange={(checked: boolean) => setShowLineNumbers(checked)}
                />
                <Label htmlFor="show-line-numbers" className="cursor-pointer">
                  แสดงเลขบรรทัด
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="side-by-side"
                  checked={showSideBySide}
                  onCheckedChange={(checked: boolean) => setShowSideBySide(checked)}
                />
                <Label htmlFor="side-by-side" className="cursor-pointer">
                  แสดงแบบเคียงกัน
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={swapTexts} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                สลับข้อความ
              </Button>
              <Button onClick={clearAll} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                ล้างข้อมูล
              </Button>
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          {(originalText || modifiedText) && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>สรุปการเปลี่ยนแปลง</Label>
                <Button onClick={copyDiffReport} variant="ghost" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  คัดลอกรายงาน
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-2">
                  <Plus className="w-3 h-3 text-green-600" />
                  {diffResult.stats.additions} เพิ่ม
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Minus className="w-3 h-3 text-red-600" />
                  {diffResult.stats.deletions} ลบ
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <ArrowRight className="w-3 h-3 text-yellow-600" />
                  {diffResult.stats.modifications} แก้ไข
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Equal className="w-3 h-3 text-gray-600" />
                  {diffResult.stats.unchanged} ไม่เปลี่ยน
                </Badge>
              </div>
            </div>
          )}

          {/* Diff Results */}
          {diffResult.lines.length > 0 && (
            <div className="space-y-2">
              <Label>ผลการเปรียบเทียบ</Label>
              
              {showSideBySide ? (
                // Side by side view
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Original</Label>
                    <div className="border rounded-lg overflow-hidden">
                      {originalText.split('\n').map((line, index) => (
                        <div key={index} className="flex items-center p-2 border-b last:border-b-0 font-mono text-sm">
                          {showLineNumbers && (
                            <span className="w-8 text-xs text-muted-foreground mr-2">
                              {index + 1}
                            </span>
                          )}
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Modified</Label>
                    <div className="border rounded-lg overflow-hidden">
                      {modifiedText.split('\n').map((line, index) => (
                        <div key={index} className="flex items-center p-2 border-b last:border-b-0 font-mono text-sm">
                          {showLineNumbers && (
                            <span className="w-8 text-xs text-muted-foreground mr-2">
                              {index + 1}
                            </span>
                          )}
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Unified diff view
                <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                  {diffResult.lines.map((line, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 border-b last:border-b-0 ${getLineStyle(line.type)}`}
                    >
                      <div className="flex items-center gap-2 mr-3">
                        {getLineIcon(line.type)}
                        {showLineNumbers && (
                          <div className="flex gap-1 text-xs text-muted-foreground">
                            <span className="w-6 text-right">
                              {line.oldLineNum || ''}
                            </span>
                            <span className="w-6 text-right">
                              {line.newLineNum || ''}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 font-mono text-sm">
                        {line.type === 'modified' && line.originalContent ? (
                          <div className="space-y-1">
                            <div className="text-red-600 line-through">
                              {line.originalContent}
                            </div>
                            <div className="text-green-600">
                              {line.content}
                            </div>
                          </div>
                        ) : (
                          <span className={
                            line.type === 'added' ? 'text-green-700' :
                            line.type === 'removed' ? 'text-red-700' :
                            line.type === 'modified' ? 'text-yellow-700' :
                            'text-gray-700'
                          }>
                            {line.content}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No differences */}
          {originalText && modifiedText && diffResult.lines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบความแตกต่าง - ข้อความทั้งสองเหมือนกัน
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}