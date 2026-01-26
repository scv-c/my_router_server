// src/type/router.d.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface SecurityOptions {
  enableIpWhitelist?: boolean; // IP 화이트리스트 활성화 여부
  requiredAuthHeader?: string; // 특정 헤더가 필요한지
}

export interface RouteConfig {
  path: string;          // 라우팅 경로 (예: /service-a)
  targetHost: string;    // 대상 호스트 (예: http://my-home.ddns.net)
  targetPort?: number;   // 대상 포트
  stripPath?: boolean;   // 경로 제거 여부 (기본 true)
  security?: SecurityOptions; // 2-4-1-2. 보안 확장 설정
}

export interface ProxyResponse {
  status: number;
  body: any;
  headers: Headers;
}