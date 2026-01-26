// src/middleware/SecurityManager.ts
import { NextRequest } from 'next/server';
import { RouteConfig } from '@/type/router';

export class SecurityManager {
  // 허용된 관리자 IP (예시)
  private readonly WHITELISTED_IPS = (process.env.WHITELIST_IPS || '').split(',');

  public checkSecurity(req: NextRequest, config: RouteConfig): boolean {
    if (!config.security) return true;

    // 1. IP Whitelist 체크
    if (config.security.enableIpWhitelist) {
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      // 로컬 테스트 환경 고려하여 ::1 등 처리 필요할 수 있음
      if (!this.WHITELISTED_IPS.includes(ip.split(',')[0].trim())) {
        return false;
      }
    }

    // 2. 추가적인 인가 로직 확장 가능 (예: Header Token 검사)
    
    return true;
  }
}