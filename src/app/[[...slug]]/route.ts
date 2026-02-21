// src/app/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AppRouter } from '@/router/AppRouter';
import { SecurityManager } from '@/middleware/SecurityManager';
import { Logger } from '@/middleware/Logger';

// 싱글톤 인스턴스
const router = new AppRouter();
const securityManager = new SecurityManager();
const logger = Logger.getInstance();

async function handleRequest(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    // 1. 라우트 매칭
    const route = router.findRoute(pathname);

    // 2-2. 일치하는 경로 없음 -> Error.html 반환
    if (!route) return serveErrorHtml(404);

    // 2-4-1-2. 보안 체크
    if (!securityManager.checkSecurity(req, route)) {
      logger.log(req, 403);
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 3. Proxy 요청 구성
    const targetUrl = router.buildTargetUrl(route, pathname, req.nextUrl.search);

    // 헤더 복사 (Host 헤더 주의: 타겟 서버에 맞게 조정 필요할 수 있음)
    const headers = new Headers(req.headers);
    headers.set('host', new URL(route.targetHost).host); 

    headers.delete('x-invoke-path');
    headers.delete('x-invoke-query');
    headers.delete('x-middleware-invoke');

    //Client IP 추출 (Vercel 환경 고려)
    // req.ip는 Next.js가 감지한 IP이며, 없으면 x-forwarded-for 헤더에서 가져옴
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 표준 프록시 헤더 명시적 주입. [X-Forwarded-For: 클라이언트 IP (표준)] [X-Real-IP: Nginx 등에서 많이 쓰는 실제 IP 헤더]
    headers.set('X-Forwarded-For', clientIp);
    headers.set('X-Real-IP', clientIp);

    // 4. 실제 요청 전달 (Fetch)
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore: Next.js fetch extends standard fetch
      duplex: 'half', // Streaming body support for Node.js
    });

    // 5. 응답 생성 및 반환
    const resBody = response.body;
    
    // 2-4-3. 로깅
    logger.log(req, response.status, parseInt(response.headers.get('content-length') || '0'));

    return new NextResponse(resBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    // 2-6. 에러 핸들링
    logger.error(`Proxy Error on ${pathname}`, error);
    return serveErrorHtml(500);
  }
}

// 2-2. 정적 에러 HTML 서빙 헬퍼
function serveErrorHtml(status: number) {
  try {
    const errorPagePath = path.join(process.cwd(), 'public', 'error.html');
    const html = fs.readFileSync(errorPagePath, 'utf-8');
    return new NextResponse(html, { 
      status, 
      headers: { 'Content-Type': 'text/html' } 
    });
  } catch (e) {
    return new NextResponse('Internal Server Error (Missing error.html)', { status: 500 });
  }
}

// 모든 메서드에 대해 핸들러 적용
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
// 필요한 메서드 추가...