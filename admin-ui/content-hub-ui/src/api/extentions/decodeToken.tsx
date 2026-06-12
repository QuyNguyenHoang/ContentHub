import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  roles: string;
}

interface JwtClaims {
  sub?: string;
  email?: string;
  firstName?: string;
  role?: string;
  roles?: string;

  [key: string]: any;
}

export const decodeToken = (token: string): TokenPayload | null => {
  if (!token?.trim()) {
    return null;
  }

  try {
    const claims = jwtDecode<JwtClaims>(token);

    return {
      userId:
        claims.sub ??
        claims[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ??
        "",

      userName:
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
        claims.unique_name ??
        claims.userName ??
        "",

      email: claims.email ?? "",

      firstName: claims.firstName ?? "",

      roles: claims.role || claims.roles || "",
    };
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};
