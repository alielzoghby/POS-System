import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { JWTTokenValidation } from '../../enums/JWT-token-validation.enum';
import { StorageConstant } from '../../config/storage.constant';
import { AuthResponse, User } from '../../models/user.model';
import { Mapper } from '../../mapper/base-mapper.mapper';

@Injectable({
  providedIn: 'root',
})
export class JwtDecoderService {
  constructor(
    private jwtHelperService: JwtHelperService,
    private mapper: Mapper
  ) {}

  saveToken(authUSer: string) {
    if (authUSer) {
      localStorage.setItem(StorageConstant.AUTH_USER, authUSer);
    }
  }

  removeCurrentToken() {
    localStorage.removeItem(StorageConstant.AUTH_USER);
  }

  isThereValidToken(): JWTTokenValidation {
    const user = this.getCurrentUserFromJWTToken();
    if (user) {
      if (this.isTokenExpired(user.token)) {
        return JWTTokenValidation.Expired;
      } else {
        return JWTTokenValidation.Valid;
      }
    }
    return JWTTokenValidation.NotFound;
  }

  isTokenExpired(authToken: string) {
    return authToken == null || this.jwtHelperService.isTokenExpired(authToken);
  }

  getDecodedToken() {
    const user = localStorage.getItem(StorageConstant.AUTH_USER);

    if (!user) {
      console.warn('No user token found in local storage');
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing the user token:', error);
      return null;
    }
  }

  getCurrentUserFromJWTToken() {
    const payloadMap = this.getDecodedToken();
    if (payloadMap != null) {
      const modifiedPayload = Object.assign(payloadMap);
      return this.mapper.fromJson(AuthResponse, modifiedPayload);
    }
    return null;
  }

  getTokenJson(token: string) {
    return this.jwtHelperService.decodeToken(token);
  }
}
