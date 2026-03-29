import {jwtDecode} from "jwt-decode";

export interface TokenPayLoad {
  userId?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  roles?: string;
}

export const DecodeToken = {
  accessToken: (): TokenPayLoad | null => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token); // 'any' để map các claim
      return {
        userId: decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.userName,
        email: decoded.email,
        firstName: decoded.firstName,
        roles: decoded.roles,
      };
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  },
};