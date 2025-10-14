import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Copy, Wand2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function FormatJSON() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatJSON = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      toast.success('จัดรูปแบบ JSON สำเร็จ');
    } catch (error) {
      toast.error('รูปแบบ JSON ไม่ถูกต้อง');
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      toast.success('ย่อ JSON สำเร็จ');
    } catch (error) {
      toast.error('รูปแบบ JSON ไม่ถูกต้อง');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('คัดลอกแล้ว');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">JSON Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "value", "array": [1, 2, 3]}'
            className="min-h-[400px] font-mono"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm">JSON Output</label>
            {output && (
              <Button onClick={copyToClipboard} variant="ghost" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                คัดลอก
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="ผลลัพธ์จะแสดงที่นี่..."
            className="min-h-[400px] font-mono bg-muted/50"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={formatJSON} className="gap-2">
          <Wand2 className="w-4 h-4" />
          จัดรูปแบบ (Format)
        </Button>
        <Button onClick={minifyJSON} variant="outline" className="gap-2">
          <Minimize2 className="w-4 h-4" />
          ย่อ (Minify)
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); }} variant="outline">
          ล้างข้อมูล
        </Button>
      </div>
    </div>
  );
}
