import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ArrowLeftRight, Plus, Minus, Pencil, Check } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

type DiffLine = {
  line: number;
  left: string;
  right: string;
  type: 'modified' | 'added' | 'removed' | 'unchanged';
};

export function CompareCode() {
  const [leftCode, setLeftCode] = useState('');
  const [rightCode, setRightCode] = useState('');
  const [allLines, setAllLines] = useState<DiffLine[]>([]);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const compareCode = () => {
    const leftLines = leftCode.split('\n');
    const rightLines = rightCode.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const lines: DiffLine[] = [];

    for (let i = 0; i < maxLines; i++) {
      const left = leftLines[i] || '';
      const right = rightLines[i] || '';
      
      let type: 'modified' | 'added' | 'removed' | 'unchanged' = 'unchanged';
      if (left !== right) {
        if (left === '') type = 'added';
        else if (right === '') type = 'removed';
        else type = 'modified';
      }
      
      lines.push({ line: i + 1, left, right, type });
    }

    setAllLines(lines);
  };

  const clearAll = () => {
    setLeftCode('');
    setRightCode('');
    setAllLines([]);
  };

  const displayLines = showUnchanged ? allLines : allLines.filter(line => line.type !== 'unchanged');
  const diffCount = allLines.filter(line => line.type !== 'unchanged').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-3 h-3" />;
      case 'removed':
        return <Minus className="w-3 h-3" />;
      case 'modified':
        return <Pencil className="w-3 h-3" />;
      default:
        return <Check className="w-3 h-3" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'added':
        return <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">{getTypeIcon(type)} เพิ่ม</Badge>;
      case 'removed':
        return <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-200">{getTypeIcon(type)} ลบ</Badge>;
      case 'modified':
        return <Badge variant="outline" className="gap-1 bg-orange-50 text-orange-700 border-orange-200">{getTypeIcon(type)} แก้ไข</Badge>;
      default:
        return <Badge variant="outline" className="gap-1 bg-gray-50 text-gray-600 border-gray-200">{getTypeIcon(type)} เหมือนกัน</Badge>;
    }
  };

  const getRowClass = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50/50';
      case 'removed':
        return 'bg-red-50/50';
      case 'modified':
        return 'bg-orange-50/50';
      default:
        return '';
    }
  };

  const getCellClass = (type: string, side: 'left' | 'right') => {
    if (type === 'unchanged') return 'text-muted-foreground';
    if (type === 'removed' && side === 'left') return 'bg-red-100/50 text-red-900';
    if (type === 'added' && side === 'right') return 'bg-green-100/50 text-green-900';
    if (type === 'modified') return side === 'left' ? 'bg-orange-100/30 text-orange-900' : 'bg-orange-100/30 text-orange-900';
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">ฝั่งซ้าย</label>
          <Textarea
            value={leftCode}
            onChange={(e) => setLeftCode(e.target.value)}
            placeholder="วางโค้ดฝั่งซ้ายที่นี่..."
            className="min-h-[400px] font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm">ฝั่งขวา</label>
          <Textarea
            value={rightCode}
            onChange={(e) => setRightCode(e.target.value)}
            placeholder="วางโค้ดฝั่งขวาที่นี่..."
            className="min-h-[400px] font-mono"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={compareCode} className="gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          เปรียบเทียบ
        </Button>
        <Button onClick={clearAll} variant="outline">
          ล้างข้อมูล
        </Button>
      </div>

      {allLines.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3>ผลการเปรียบเทียบ ({diffCount} บรรทัดที่แตกต่าง)</h3>
            <div className="flex items-center gap-2">
              <Switch
                id="show-unchanged"
                checked={showUnchanged}
                onCheckedChange={setShowUnchanged}
              />
              <Label htmlFor="show-unchanged" className="text-sm cursor-pointer">
                แสดงบรรทัดที่เหมือนกัน
              </Label>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">บรรทัด</TableHead>
                    <TableHead className="w-[120px]">สถานะ</TableHead>
                    <TableHead>ฝั่งซ้าย</TableHead>
                    <TableHead>ฝั่งขวา</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                        ไม่พบความแตกต่าง
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayLines.map((line, index) => (
                      <TableRow key={index} className={getRowClass(line.type)}>
                        <TableCell className="text-center font-mono text-muted-foreground">
                          {line.line}
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(line.type)}
                        </TableCell>
                        <TableCell className={`font-mono text-sm ${getCellClass(line.type, 'left')}`}>
                          <div className="break-all whitespace-pre-wrap">
                            {line.left || <span className="text-muted-foreground italic">(ว่างเปล่า)</span>}
                          </div>
                        </TableCell>
                        <TableCell className={`font-mono text-sm ${getCellClass(line.type, 'right')}`}>
                          <div className="break-all whitespace-pre-wrap">
                            {line.right || <span className="text-muted-foreground italic">(ว่างเปล่า)</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
