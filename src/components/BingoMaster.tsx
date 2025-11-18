import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Mic, RotateCcw, Shuffle } from "lucide-react";
import { toast } from "sonner";

export default function BingoMaster() {
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [callHistory, setCallHistory] = useState<number[]>([]);

  // สุ่มเลข 1-75
  const drawNumber = () => {
    const remainingNumbers = [];
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.has(i)) {
        remainingNumbers.push(i);
      }
    }

    if (remainingNumbers.length === 0) {
      toast.warning("เลขออกครบทั้งหมดแล้ว!", { icon: "🎉" });
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const drawnNumber = remainingNumbers[randomIndex];

    setCalledNumbers((prev) => new Set([...prev, drawnNumber]));
    setLastNumber(drawnNumber);
    setCallHistory((prev) => [...prev, drawnNumber]);

    // หาตัวอักษร B-I-N-G-O
    const letter = getLetterForNumber(drawnNumber);

    // แจ้งเตือน
    // toast.success(`${letter}${drawnNumber}`, {
    //   icon: "🎯",
    //   duration: 4000,
    //   description: `เลขที่ ${callHistory.length + 1}`,
    // });

    // เล่นเสียง
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${letter} ${drawnNumber}`
      );
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // หาตัวอักษรตามเลข
  const getLetterForNumber = (number: number): string => {
    if (number >= 1 && number <= 15) return "B";
    if (number >= 16 && number <= 30) return "I";
    if (number >= 31 && number <= 45) return "N";
    if (number >= 46 && number <= 60) return "G";
    if (number >= 61 && number <= 75) return "O";
    return "";
  };

  // รีเซ็ตทั้งหมด
  const resetAll = () => {
    setCalledNumbers(new Set());
    setLastNumber(null);
    setCallHistory([]);
    toast.info("รีเซ็ตเกมใหม่แล้ว!", { icon: "🔄" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            ผู้นำ Bingo Game
            
            <Button onClick={resetAll} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ส่วนควบคุม */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
            <div className="flex items-center gap-4">

              <Badge variant="secondary">
                เรียกแล้ว: {calledNumbers.size}/75
              </Badge>

              <Badge variant="secondary">
                เหลือ: {75 - calledNumbers.size}
              </Badge>

               <Button
                onClick={drawNumber}
                disabled={calledNumbers.size === 75}
                className="gap-2 text-lg px-8 py-6"
                size="lg"
              >
                <Shuffle className="w-5 h-5" />
                สุ่มเลข
              </Button>
            </div>

          </div>

          {/* เลขล่าสุด */}
          {lastNumber && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-4xl font-bold shadow-lg">
                {/* {getLetterForNumber(lastNumber)} */}
                {lastNumber}
              </div>
              <p className="mt-2 text-muted-foreground">เลขล่าสุด</p>
            </div>
          )}

          {/* ประวัติการเรียก */}
          {callHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">ประวัติการเรียก:</h3>
              <div className="flex flex-wrap gap-2">
                {callHistory.map((number, index) => (
                  <Badge
                    key={index}
                    variant={number === lastNumber ? "default" : "secondary"}
                    // className="px-3 py-1"
                    className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-4xl font-bold shadow-lg"
                  >
                    {/* {getLetterForNumber(number)} */}
                    {number}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          
        </CardContent>
      </Card>
    </div>
  );
}
