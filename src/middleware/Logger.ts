// src/middleware/Logger.ts
import { NextRequest } from 'next/server';

export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // 2-4-3-1. Apache Log Format: %h %l %u %t "%r" %>s %b
  public log(req: NextRequest, status: number, contentLength: number = 0): void {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const date = new Date().toISOString();
    const method = req.method;
    const url = req.nextUrl.pathname;
    
    // 포맷팅
    const logMessage = `${ip} - - [${date}] "${method} ${url} HTTP/1.1" ${status} ${contentLength}`;
    
    console.log(logMessage); // 실제 운영 시에는 파일 스트림이나 외부 로거로 확장 가능
  }

  public error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }
}