import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
// import Strategy from "passport-activedirectory";

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://www.example.com/oauth2/token',
      clientID: "",
      clientSecret: "",
      callbackURL: 'http://127.0.0.1:3000/auth/example/callback',
	  redirect_uri: 'http://127.0.0.1:3000/auth/example/callback',
	  response_type: 'code'
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // handle the authenticated user's profile
    return { ...profile, accessToken };
  }
}
