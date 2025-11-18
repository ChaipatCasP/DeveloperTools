import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

import {
  Shuffle,
  RotateCcw,
  Trophy,
  Grid3X3,
  Volume2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface BingoCell {
  number: number;
  isMarked: boolean;
}

interface BingoCard {
  id: string;
  name: string;
  cells: BingoCell[][];
  isWinner: boolean;
}

export default function BingoGame() {
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [gameStarted, setGameStarted] = useState(true); // เริ่มเกมทันที

  // สร้างการ์ดอัตโนมัติเมื่อเปิดเกม
  useEffect(() => {
    // สร้างการ์ดบิงโกโดยตรงใน useEffect
    const cells: BingoCell[][] = [];
    const usedNumbers = new Set<number>();

    // สร้าง 5 แถว x 5 คอลัมน์ (5x5 grid)
    for (let row = 0; row < 5; row++) {
      cells[row] = [];
      for (let col = 0; col < 5; col++) {
        // ตำแหน่งกลาง (แถวที่ 3, คอลัมน์ที่ 3) เป็น FREE
        if (row === 2 && col === 2) {
          cells[row][col] = { number: 0, isMarked: true };
          continue;
        }

        // สร้างเลขในช่วงที่เหมาะสม
        let min, max;
        switch (col) {
          case 0:
            min = 1;
            max = 15;
            break; // B
          case 1:
            min = 16;
            max = 30;
            break; // I
          case 2:
            min = 31;
            max = 45;
            break; // N
          case 3:
            min = 46;
            max = 60;
            break; // G
          case 4:
            min = 61;
            max = 75;
            break; // O
          default:
            min = 1;
            max = 75;
        }

        let number;
        do {
          number = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(number));

        usedNumbers.add(number);
        cells[row][col] = { number, isMarked: false };
      }
    }

    const newCard: BingoCard = {
      id: Math.random().toString(36).substr(2, 9),
      name: "ผู้เล่น",
      cells,
      isWinner: false,
    };

    setCards([newCard]);
  }, []);

  // สร้างการ์ดบิงโก
  const generateBingoCard = useCallback((name: string): BingoCard => {
    const cells: BingoCell[][] = [];
    const usedNumbers = new Set<number>();

    // สร้าง 5 แถว x 5 คอลัมน์ (5x5 grid)
    for (let row = 0; row < 5; row++) {
      cells[row] = [];
      for (let col = 0; col < 5; col++) {
        // ตำแหน่งกลาง (แถวที่ 3, คอลัมน์ที่ 3) เป็น FREE
        if (row === 2 && col === 2) {
          cells[row][col] = { number: 0, isMarked: true };
          continue;
        }

        // สร้างเลขในช่วงที่เหมาะสม
        let min, max;
        switch (col) {
          case 0:
            min = 1;
            max = 15;
            break; // B
          case 1:
            min = 16;
            max = 30;
            break; // I
          case 2:
            min = 31;
            max = 45;
            break; // N
          case 3:
            min = 46;
            max = 60;
            break; // G
          case 4:
            min = 61;
            max = 75;
            break; // O
          default:
            min = 1;
            max = 75;
        }

        let number;
        do {
          number = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(number));

        usedNumbers.add(number);
        cells[row][col] = { number, isMarked: false };
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      cells,
      isWinner: false,
    };
  }, []);

  // สร้างการ์ดใหม่ (รีเซ็ตและสุ่มใหม่)
  const resetAndNewCard = () => {
    const newCard = generateBingoCard("ผู้เล่น");
    setCards([newCard]);
    toast.success("สร้างการ์ดใหม่แล้ว! พร้อมเล่น!", { icon: "🎲" });
  };

  // สร้างการ์ดใหม่
  const markCell = (cardId: string, row: number, col: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;

        const newCells = [...card.cells];
        const cell = newCells[row][col];

        // ช่อง FREE (number === 0) ไม่สามารถกดได้
        if (cell.number === 0) return card;

        // สลับสถานะ mark
        newCells[row] = [...newCells[row]];
        newCells[row][col] = { ...cell, isMarked: !cell.isMarked };

        const updatedCard = { ...card, cells: newCells };

        // ตรวจสอบการชนะ
        if (checkWin(updatedCard)) {
          updatedCard.isWinner = true;

          // แจ้งเตือนการชนะ
          toast.success("🎉 BINGO! คุณชนะแล้ว! 🎉", {
            icon: "🏆",
            duration: 3000,
          });

          // เล่นเสียงฉลอง
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance("Bingo! You win!");
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
          }
        }

        return updatedCard;
      })
    );
  };

  // ตรวจสอบการชนะ
  const checkWin = (card: BingoCard): boolean => {
    const cells = card.cells;

    // ตรวจสอบแถวนอน
    for (let row = 0; row < 5; row++) {
      if (cells[row].every((cell) => cell.isMarked)) {
        return true;
      }
    }

    // ตรวจสอบแถวตั้ง
    for (let col = 0; col < 5; col++) {
      if (cells.every((row) => row[col].isMarked)) {
        return true;
      }
    }

    // ตรวจสอบเส้นทแยงมุม
    if (cells.every((row, index) => row[index].isMarked)) {
      return true;
    }

    if (cells.every((row, index) => row[4 - index].isMarked)) {
      return true;
    }

    return false;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Bingo Game
            <Button
              onClick={resetAndNewCard}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              การ์ดใหม่
            </Button>
          </CardTitle>
          {/* ข้อมูลเกมและการควบคุม */}
          <div className="flex items-center justify-between"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {" "}
          {/* การ์ดบิงโก */}
          <div className="flex justify-center">
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    className={`relative ${
                      card.isWinner ? "ring-2 ring-yellow-400 bg-yellow-50" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-3">
                        {/* Header B-I-N-G-O (5 คอลัมน์) */}
                        <div className="flex">
                          {["B", "I", "N", "G", "O"].map((letter) => (
                            <div
                              key={letter}
                              className="w-10 h-8 flex items-center justify-center rounded font-bold text-sm"
                              style={{
                                backgroundColor: "#f97316", // สีส้ม
                                color: "white",
                                border: "1px solid #ea580c",
                              }}
                            >
                              {letter}
                            </div>
                          ))}
                        </div>

                        {/* Bingo Grid (5 แถว x 5 คอลัมน์) */}
                        <div className="border-2 border-gray-400 rounded-lg p-1 bg-white shadow-sm">
                          <div className="flex flex-col">
                            {card.cells.map((row, rowIndex) => (
                              <div key={rowIndex} className="flex">
                                {row.map((cell, colIndex) => (
                                  <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() =>
                                      markCell(card.id, rowIndex, colIndex)
                                    }
                                    className={`
                                      w-10 h-10 flex items-center justify-center text-lg font-semibold border border-gray-300 transition-all hover:scale-105 cursor-pointer
                                      ${
                                        rowIndex === 0 && colIndex === 0
                                          ? "rounded-tl-md"
                                          : ""
                                      }
                                      ${
                                        rowIndex === 0 && colIndex === 4
                                          ? "rounded-tr-md"
                                          : ""
                                      }
                                      ${
                                        rowIndex === 4 && colIndex === 0
                                          ? "rounded-bl-md"
                                          : ""
                                      }
                                      ${
                                        rowIndex === 4 && colIndex === 4
                                          ? "rounded-br-md"
                                          : ""
                                      }
                                      ${
                                        cell.isMarked
                                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                                          : "bg-white border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                                      }
                                      ${
                                        cell.number === 0
                                          ? "bg-gray-100 border-gray-400 font-bold"
                                          : ""
                                      }
                                    `}
                                    title={`คลิกเพื่อทำเครื่องหมาย ${
                                      cell.number === 0 ? "FREE" : cell.number
                                    }`}
                                  >
                                    {cell.number === 0 ? "FREE" : cell.number}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                กำลังโหลดการ์ด...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
