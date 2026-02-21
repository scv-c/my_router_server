// src/router/AppRouter.ts
import { RouteConfig } from '@/type/router';
import { routes } from './routes';

export class AppRouter {
  private routeMap: RouteConfig[];

  constructor() {
    this.routeMap = routes;
  }

  // 2-1. URL Path 기준으로 일치하는 라우트 찾기
  public findRoute(pathname: string): RouteConfig | null {
    // 긴 경로가 우선 매칭되도록 정렬 (예: /api/v1 vs /api)
    const sortedRoutes = this.routeMap.sort((a, b) => b.path.length - a.path.length);
    
    return sortedRoutes.find(route => pathname.startsWith(route.path)) || null;
  }

  public buildTargetUrl(route: RouteConfig, pathname: string, searchParams: string): string {
    const { targetHost, targetPort, path, stripPath = true } = route;
    
    console.log("search값:", searchParams);

    // 대상 경로 계산
    let finalPath = pathname;
    if (stripPath) {
      finalPath = pathname.replace(path, ''); // prefix 제거
    }

    const portStr = targetPort ? `:${targetPort}` : '';
    // 이중 슬래시 방지
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    
    return `${targetHost}${portStr}${cleanPath}${searchParams ? `${searchParams}` : ''}`;
  }
}