import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  const isPublicAuthRequest =
    req.url.includes('/api/auth/register/') ||
    req.url.includes('/api/auth/login/');

  if (!token || isPublicAuthRequest) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedRequest);
};