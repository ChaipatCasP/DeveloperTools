import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Copy, ArrowUp, ArrowDown, CaseSensitive } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type ConversionType = 'uppercase' | 'lowercase' | 'titlecase' | 'camelcase' | 'snakecase' | null;

export function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeConversion, setActiveConversion] = useState<ConversionType>(null);

  const convertToUpperCase = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล');
      return;
    }
    setOutput(input.toUpperCase());
    setActiveConversion('uppercase');
    toast.success('แปลงเป็นตัวพิมพ์ใหญ่แล้ว');
  };

  const convertToLowerCase = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล');
      return;
    }
    setOutput(input.toLowerCase());
    setActiveConversion('lowercase');
    toast.success('แปลงเป็นตัวพิมพ์เล็กแล้ว');
  };

  const convertToTitleCase = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล');
      return;
    }
    const titleCase = input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    setOutput(titleCase);
    setActiveConversion('titlecase');
    toast.success('แปลงเป็น Title Case แล้ว');
  };

  const convertToCamelCase = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล');
      return;
    }
    const camelCase = input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setOutput(camelCase);
    setActiveConversion('camelcase');
    toast.success('แปลงเป็น camelCase แล้ว');
  };

  const convertToSnakeCase = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล');
      return;
    }
    const snakeCase = input
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    setOutput(snakeCase);
    setActiveConversion('snakecase');
    toast.success('แปลงเป็น snake_case แล้ว');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('คัดลอกแล้ว');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setActiveConversion(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="กรอกข้อความที่ต้องการแปลง..."
            className="min-h-[400px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm">Output</label>
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
            className="min-h-[400px] bg-muted/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={convertToUpperCase} 
          variant={activeConversion === 'uppercase' ? 'default' : 'outline'}
          className="gap-2"
        >
          <ArrowUp className="w-4 h-4" />
          UPPER CASE
        </Button>
        <Button 
          onClick={convertToLowerCase} 
          variant={activeConversion === 'lowercase' ? 'default' : 'outline'}
          className="gap-2"
        >
          <ArrowDown className="w-4 h-4" />
          lower case
        </Button>
        <Button 
          onClick={convertToTitleCase} 
          variant={activeConversion === 'titlecase' ? 'default' : 'outline'}
          className="gap-2"
        >
          <CaseSensitive className="w-4 h-4" />
          Title Case
        </Button>
        <Button 
          onClick={convertToCamelCase} 
          variant={activeConversion === 'camelcase' ? 'default' : 'outline'}
        >
          camelCase
        </Button>
        <Button 
          onClick={convertToSnakeCase} 
          variant={activeConversion === 'snakecase' ? 'default' : 'outline'}
        >
          snake_case
        </Button>
        <Button onClick={clearAll} variant="outline">
          ล้างข้อมูล
        </Button>
      </div>
    </div>
  );
}
