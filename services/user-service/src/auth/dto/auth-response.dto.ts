/**
 * Authentication Response DTO
 */

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
  };
}

