import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function FormatSQL() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatSQL = () => {
    if (!input.trim()) {
      toast.error('กรุณากรอกข้อมูล SQL');
      return;
    }

    try {
      let formatted = input.trim();
      
      // รายการ keywords ที่ต้องการแปลงเป็นตัวพิมพ์ใหญ่
      const keywords = [
        'SELECT', 'DISTINCT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
        'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'USING',
        'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
        'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'DELETE',
        'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE',
        'AS', 'ASC', 'DESC',
        'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
        'WITH', 'RECURSIVE',
        'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'COALESCE', 'NULLIF',
        'CAST', 'CONVERT', 'SUBSTRING', 'CONCAT', 'TRIM', 'UPPER', 'LOWER',
        'DECLARE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION'
      ];

      // แปลง keywords เป็นตัวพิมพ์ใหญ่
      keywords.sort((a, b) => b.length - a.length); // จัดเรียงจากยาวไปสั้น
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });

      // ลบช่องว่างและบรรทัดว่างเพิ่มเติม
      formatted = formatted.replace(/\s+/g, ' ').trim();

      // จัดรูปแบบด้วย line breaks และ indentation
      formatted = formatted
        // Main clauses
        .replace(/\bSELECT\b/g, '\nSELECT\n    ')
        .replace(/\bFROM\b/g, '\nFROM\n    ')
        .replace(/\bWHERE\b/g, '\nWHERE\n    ')
        .replace(/\bGROUP BY\b/g, '\nGROUP BY\n    ')
        .replace(/\bHAVING\b/g, '\nHAVING\n    ')
        .replace(/\bORDER BY\b/g, '\nORDER BY\n    ')
        .replace(/\bLIMIT\b/g, '\nLIMIT ')
        .replace(/\bOFFSET\b/g, '\nOFFSET ')
        
        // Joins
        .replace(/\bLEFT JOIN\b/g, '\nLEFT JOIN\n    ')
        .replace(/\bRIGHT JOIN\b/g, '\nRIGHT JOIN\n    ')
        .replace(/\bINNER JOIN\b/g, '\nINNER JOIN\n    ')
        .replace(/\bOUTER JOIN\b/g, '\nOUTER JOIN\n    ')
        .replace(/\bFULL JOIN\b/g, '\nFULL JOIN\n    ')
        .replace(/\bCROSS JOIN\b/g, '\nCROSS JOIN\n    ')
        .replace(/\bJOIN\b/g, '\nJOIN\n    ')
        .replace(/\bON\b/g, 'ON ')
        
        // Logical operators in WHERE/HAVING
        .replace(/\bAND\b/g, '\n    AND ')
        .replace(/\bOR\b/g, '\n    OR ')
        
        // Set operations
        .replace(/\bUNION ALL\b/g, '\n\nUNION ALL\n\n')
        .replace(/\bUNION\b/g, '\n\nUNION\n\n')
        .replace(/\bINTERSECT\b/g, '\n\nINTERSECT\n\n')
        .replace(/\bEXCEPT\b/g, '\n\nEXCEPT\n\n')
        
        // CTE (Common Table Expressions)
        .replace(/\bWITH\b/g, 'WITH\n    ')
        
        // CASE statements
        .replace(/\bCASE\b/g, 'CASE\n        ')
        .replace(/\bWHEN\b/g, 'WHEN ')
        .replace(/\bTHEN\b/g, ' THEN ')
        .replace(/\bELSE\b/g, '\n        ELSE ')
        .replace(/\bEND\b/g, '\n    END')
        
        // Commas - แยกบรรทัดสำหรับรายการใน SELECT
        .replace(/,\s*/g, ',\n    ')
        
        // INSERT/UPDATE/DELETE
        .replace(/\bINSERT INTO\b/g, 'INSERT INTO ')
        .replace(/\bVALUES\b/g, '\nVALUES\n    ')
        .replace(/\bUPDATE\b/g, 'UPDATE ')
        .replace(/\bSET\b/g, '\nSET\n    ')
        .replace(/\bDELETE FROM\b/g, 'DELETE FROM ')
        
        // ทำความสะอาดช่องว่างเกิน
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      setOutput(formatted);
      toast.success('จัดรูปแบบ SQL สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการจัดรูปแบบ');
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
          <label className="text-sm">SQL Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="วาง SQL query ที่นี่..."
            className="min-h-[400px] font-mono"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm">SQL Output</label>
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
        <Button onClick={formatSQL} className="gap-2">
          <Wand2 className="w-4 h-4" />
          จัดรูปแบบ SQL
        </Button>
        <Button onClick={() => { setInput(''); setOutput(''); }} variant="outline">
          ล้างข้อมูล
        </Button>
      </div>
    </div>
  );
}
