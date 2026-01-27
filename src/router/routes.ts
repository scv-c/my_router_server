// src/router/routes.ts
import { RouteConfig } from '@/type/router';

// 2-4-1. 신규 서비스 오픈 시 이곳에 정의
export const routes: RouteConfig[] = [  
  {
    path: '/api/prag',
    targetHost: process.env.PERRAG_API_SERVICE_HOST || "",
    targetPort: parseInt(process.env.PERRAG_API_SERVICE_PORT || ''),
    stripPath: true, // /blog 경로를 그대로 뒤단 서버로 넘길지 여부
    security: {
      enableIpWhitelist: false, // 보안 옵션 예시
    }
  },
  {
    path: '/project-a', // 이 경로로 들어오면
    targetHost: process.env.PROJECT_A_HOST || "", // .env에서 관리
    targetPort: parseInt(process.env.PROJECT_A_PORT || '8080'),    
    stripPath: true, // /blog 경로를 그대로 뒤단 서버로 넘길지 여부
    security: {
      enableIpWhitelist: false, // 보안 옵션 예시
    },
  },
  {
    path: '/prag',
    targetHost: process.env.PERRAG_WEB_SERVICE_HOST || "",
    targetPort: parseInt(process.env.PERRAG_WEB_SERVICE_PORT || ''),
    stripPath: true, // /blog 경로를 그대로 뒤단 서버로 넘길지 여부
    security: {
      enableIpWhitelist: false, // 보안 옵션 예시
    },
  },
  // N개의 도메인 추가 가능...
];