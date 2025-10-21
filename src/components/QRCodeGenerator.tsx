import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { QrCode, Download, RefreshCw, Copy, Wifi, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeLib from 'qrcode';

// QR Code options interface
interface QRCodeOptions {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  color: {
    dark: string;
    light: string;
  };
  margin: number;
}

export default function QRCodeGenerator() {
  const [activeTab, setActiveTab] = useState('text');
  const [qrText, setQrText] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);
  
  // WiFi fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  
  // Contact fields
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  
  // Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate QR code content based on active tab
  const getQRContent = () => {
    switch (activeTab) {
      case 'text':
        return qrText;
      case 'url':
        return qrText.startsWith('http') ? qrText : `https://${qrText}`;
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${qrText}`;
      case 'phone':
        return `tel:${qrText}`;
      case 'sms':
        return `sms:${qrText}`;
      case 'contact':
        return `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL:${contactPhone}
EMAIL:${contactEmail}
ORG:${contactOrg}
END:VCARD`;
      case 'event':
        return `BEGIN:VEVENT
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DTSTART:${eventStartDate.replace(/[-:]/g, '')}
DTEND:${eventEndDate.replace(/[-:]/g, '')}
DESCRIPTION:${eventDescription}
END:VEVENT`;
      case 'location':
        const coords = qrText.split(',');
        return `geo:${coords[0]?.trim()},${coords[1]?.trim()}`;
      default:
        return qrText;
    }
  };
  
  // Generate QR code
  useEffect(() => {
    const content = getQRContent();
    if (!content || !canvasRef.current) return;
    
    const generateQRCode = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        await QRCodeLib.toCanvas(canvas, content, {
          width: qrSize,
          margin: margin,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: errorCorrection,
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('ไม่สามารถสร้าง QR Code ได้');
      }
    };

    generateQRCode();
  }, [activeTab, qrText, wifiSSID, wifiPassword, wifiSecurity, wifiHidden, 
      contactName, contactPhone, contactEmail, contactOrg,
      eventTitle, eventLocation, eventStartDate, eventEndDate, eventDescription,
      qrSize, errorCorrection, foregroundColor, backgroundColor, margin]);
  
  // Download QR code
  const downloadQRCode = async (format: 'png' | 'jpg' | 'svg') => {
    const content = getQRContent();
    if (!content) return;
    
    try {
      if (format === 'svg') {
        // Generate SVG
        const svgString = await QRCodeLib.toString(content, {
          type: 'svg',
          width: qrSize,
          margin: margin,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: errorCorrection,
        });
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Generate PNG/JPG from canvas
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qrcode.${format}`;
          link.click();
          URL.revokeObjectURL(url);
        }, mimeType, 0.9);
      }
      
      toast.success(`ดาวน์โหลด QR Code (${format.toUpperCase()}) แล้ว!`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('ไม่สามารถดาวน์โหลดได้');
    }
  };
  
  // Copy QR code as image
  const copyQRCode = async () => {
    if (!canvasRef.current) return;
    
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        toast.success('คัดลอก QR Code แล้ว!');
      });
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกได้');
    }
  };
  
  // Generate sample data
  const generateSample = () => {
    switch (activeTab) {
      case 'text':
        setQrText('สวัสดี! นี่คือ QR Code ตัวอย่าง');
        break;
      case 'url':
        setQrText('https://www.google.com');
        break;
      case 'wifi':
        setWifiSSID('MyWiFi');
        setWifiPassword('password123');
        break;
      case 'email':
        setQrText('example@email.com');
        break;
      case 'phone':
        setQrText('+66-2-123-4567');
        break;
      case 'sms':
        setQrText('+66-81-234-5678');
        break;
      case 'contact':
        setContactName('John Doe');
        setContactPhone('+66-81-234-5678');
        setContactEmail('john@example.com');
        setContactOrg('Example Company');
        break;
      case 'event':
        setEventTitle('Meeting');
        setEventLocation('Conference Room A');
        setEventStartDate('2024-12-01T10:00');
        setEventEndDate('2024-12-01T11:00');
        setEventDescription('Team meeting');
        break;
      case 'location':
        setQrText('13.7563, 100.5018'); // Bangkok coordinates
        break;
    }
  };
  
  // Clear form
  const clearForm = () => {
    setQrText('');
    setWifiSSID('');
    setWifiPassword('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactOrg('');
    setEventTitle('');
    setEventLocation('');
    setEventStartDate('');
    setEventEndDate('');
    setEventDescription('');
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            สร้าง QR Code สำหรับข้อความ URL WiFi รายชื่อ และอื่นๆ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex w-full h-auto flex-wrap justify-start gap-1 p-1">
                  <TabsTrigger value="text" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <QrCode className="w-4 h-4" />
                    <span>Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <QrCode className="w-4 h-4" />
                    <span>URL</span>
                  </TabsTrigger>
                  <TabsTrigger value="wifi" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <Wifi className="w-4 h-4" />
                    <span>WiFi</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>Phone</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>SMS</span>
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>Contact</span>
                  </TabsTrigger>
                  <TabsTrigger value="event" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Event</span>
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label>ข้อความ</Label>
                    <Textarea
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="ป้อนข้อความที่ต้องการสร้าง QR Code..."
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="wifi" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SSID</Label>
                      <Input
                        value={wifiSSID}
                        onChange={(e) => setWifiSSID(e.target.value)}
                        placeholder="ชื่อ WiFi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>รหัสผ่าน</Label>
                      <Input
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="รหัสผ่าน WiFi"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>ประเภทความปลอดภัย</Label>
                    <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WPA">WPA/WPA2</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="nopass">ไม่มีรหัสผ่าน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="example@email.com"
                      type="email"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="space-y-2">
                    <Label>เบอร์โทรศัพท์</Label>
                    <Input
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="+66-2-123-4567"
                      type="tel"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="sms" className="space-y-4">
                  <div className="space-y-2">
                    <Label>เบอร์โทรศัพท์ (SMS)</Label>
                    <Input
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="+66-81-234-5678"
                      type="tel"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ชื่อ</Label>
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>โทรศัพท์</Label>
                      <Input
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+66-81-234-5678"
                        type="tel"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>องค์กร</Label>
                      <Input
                        value={contactOrg}
                        onChange={(e) => setContactOrg(e.target.value)}
                        placeholder="บริษัท ABC จำกัด"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="event" className="space-y-4">
                  <div className="space-y-2">
                    <Label>ชื่อกิจกรรม</Label>
                    <Input
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="ชื่อกิจกรรม"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>สถานที่</Label>
                    <Input
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="สถานที่จัดงาน"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>วันเวลาเริ่ม</Label>
                      <Input
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        type="datetime-local"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>วันเวลาสิ้นสุด</Label>
                      <Input
                        value={eventEndDate}
                        onChange={(e) => setEventEndDate(e.target.value)}
                        type="datetime-local"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>รายละเอียด</Label>
                    <Textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="รายละเอียดกิจกรรม"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="space-y-4">
                  <div className="space-y-2">
                    <Label>พิกัด (Latitude, Longitude)</Label>
                    <Input
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="13.7563, 100.5018"
                    />
                    <div className="text-xs text-muted-foreground">
                      ใส่พิกัดในรูปแบบ: latitude, longitude
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2">
                <Button onClick={generateSample} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  ตัวอย่าง
                </Button>
                <Button onClick={clearForm} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  ล้างข้อมูล
                </Button>
              </div>
              
              {/* Customization Options */}
              <div className="space-y-4 border-t pt-4">
                <Label>ตัวเลือกการปรับแต่ง</Label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>ขนาด: {qrSize}px</Label>
                    <Slider
                      value={[qrSize]}
                      onValueChange={(value: number[]) => setQrSize(value[0])}
                      min={128}
                      max={512}
                      step={32}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>สีพื้นหน้า</Label>
                      <div className="flex gap-2">
                        <Input
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          type="color"
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>สีพื้นหลัง</Label>
                      <div className="flex gap-2">
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          type="color"
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Error Correction</Label>
                      <Select value={errorCorrection} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrection(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (~7%) - เหมาะสำหรับสภาพแวดล้อมที่สะอาด</SelectItem>
                          <SelectItem value="M">Medium (~15%) - ใช้งานทั่วไป (แนะนำ)</SelectItem>
                          <SelectItem value="Q">Quartile (~25%) - สภาพแวดล้อมที่มีฝุ่น</SelectItem>
                          <SelectItem value="H">High (~30%) - สภาพแวดล้อมที่เสี่ยงต่อความเสียหาย</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Margin: {margin}px</Label>
                      <Slider
                        value={[margin]}
                        onValueChange={(value: number[]) => setMargin(value[0])}
                        min={0}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ตัวอย่าง QR Code</Label>
                <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto border rounded"
                    style={{ backgroundColor: backgroundColor }}
                  />
                </div>
              </div>
              
              {/* Content Preview */}
              {getQRContent() && (
                <div className="space-y-2">
                  <Label>เนื้อหาใน QR Code</Label>
                  <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap break-all">
                      {getQRContent()}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">
                      {getQRContent().length} ตัวอักษร
                    </Badge>
                    <Badge variant="outline">
                      Error Correction: {errorCorrection}
                    </Badge>
                    <Badge variant={getQRContent().length > 1000 ? "destructive" : getQRContent().length > 500 ? "secondary" : "default"}>
                      {getQRContent().length > 1000 ? "ข้อมูลมากเกินไป" : 
                       getQRContent().length > 500 ? "ข้อมูลค่อนข้างมาก" : "ข้อมูลปกติ"}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Download Options */}
              {getQRContent() && (
                <div className="space-y-3">
                  <Label>ดาวน์โหลด / คัดลอก</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => downloadQRCode('png')} className="gap-2">
                      <Download className="w-4 h-4" />
                      PNG
                    </Button>
                    <Button onClick={() => downloadQRCode('jpg')} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      JPG
                    </Button>
                    <Button onClick={() => downloadQRCode('svg')} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      SVG
                    </Button>
                    <Button onClick={copyQRCode} variant="outline" className="gap-2">
                      <Copy className="w-4 h-4" />
                      คัดลอก
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}