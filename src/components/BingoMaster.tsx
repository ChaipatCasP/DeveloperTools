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
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ผู้นำ Bingo Game
            </span>
          </CardTitle>
          <p className="text-gray-600 mt-2">ระบบสุ่มเลขและควบคุมเกมบิงโก</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* ส่วนควบคุมหลัก */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col items-center space-y-6">
              {/* ปุ่มสุ่มเลขหลัก */}
              <Button
                onClick={drawNumber}
                disabled={calledNumbers.size === 75}
                className="w-48 h-16 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                <Shuffle className="w-6 h-6 mr-2" />
                {calledNumbers.size === 75 ? 'เลขออกครบแล้ว' : 'สุ่มเลข'}
              </Button>
              
              {/* สถิติและปุ่ม reset */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="px-4 py-2 text-base">
                    เรียกแล้ว: {calledNumbers.size}/75
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-base">
                    เหลือ: {75 - calledNumbers.size}
                  </Badge>
                </div>
                
                <Button 
                  onClick={resetAll} 
                  variant="outline" 
                  className="gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* เลขล่าสุดที่เรียก */}
          {lastNumber && (
            <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
              <p className="text-gray-600 font-medium mb-4">เลขล่าสุดที่เรียก</p>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full text-3xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300">
                <span className="drop-shadow-lg">{getLetterForNumber(lastNumber)}{lastNumber}</span>
              </div>
              <div className="mt-4 flex justify-center">
                <Badge variant="default" className="px-3 py-1 text-sm">
                  เลขที่ {callHistory.length}
                </Badge>
              </div>
            </div>
          )}

          {/* ประวัติการเรียก */}
          {callHistory.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                ประวัติการเรียก ({callHistory.length} เลข)
              </h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {callHistory.map((number, index) => (
                  <Badge
                    key={index}
                    variant={number === lastNumber ? "default" : "secondary"}
                    className={`px-3 py-2 text-sm font-bold transition-all duration-200 ${
                      number === lastNumber 
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {getLetterForNumber(number)}{number}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* ตารางแสดงเลข 1-75 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-gray-800">
              ตารางเลข BINGO
            </h3>
            
            <div className="space-y-4">
              {/* แถว B (1-15) */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <span className="font-semibold text-blue-700">1-15</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                  {Array.from({length: 15}, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                        calledNumbers.has(num)
                          ? 'bg-blue-500 text-white border-blue-600 shadow-md transform scale-110'
                          : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* แถว I (16-30) */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">I</span>
                  </div>
                  <span className="font-semibold text-green-700">16-30</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                  {Array.from({length: 15}, (_, i) => i + 16).map((num) => (
                    <div
                      key={num}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                        calledNumbers.has(num)
                          ? 'bg-green-500 text-white border-green-600 shadow-md transform scale-110'
                          : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* แถว N (31-45) */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <span className="font-semibold text-purple-700">31-45</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                  {Array.from({length: 15}, (_, i) => i + 31).map((num) => (
                    <div
                      key={num}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                        calledNumbers.has(num)
                          ? 'bg-purple-500 text-white border-purple-600 shadow-md transform scale-110'
                          : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* แถว G (46-60) */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="font-semibold text-orange-700">46-60</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                  {Array.from({length: 15}, (_, i) => i + 46).map((num) => (
                    <div
                      key={num}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                        calledNumbers.has(num)
                          ? 'bg-orange-500 text-white border-orange-600 shadow-md transform scale-110'
                          : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* แถว O (61-75) */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">O</span>
                  </div>
                  <span className="font-semibold text-red-700">61-75</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                  {Array.from({length: 15}, (_, i) => i + 61).map((num) => (
                    <div
                      key={num}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${
                        calledNumbers.has(num)
                          ? 'bg-red-500 text-white border-red-600 shadow-md transform scale-110'
                          : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
