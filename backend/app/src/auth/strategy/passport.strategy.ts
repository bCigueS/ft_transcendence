import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
// import Strategy from "passport-activedirectory";

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42Gaurd') {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth2/token',
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLEINT_SECRET}`,
	  callbackURL: 'http://127.0.0.1:3000/auth/forty-two/callback',
	  response_type: 'code',
	  scope: ['public']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) : Promise<any> 
  {
	console.log("validate");
	console.log(accessToken);
	console.log(refreshToken);
	console.log(profile);
    // handle the authenticated user's profile
    // return { ...profile, accessToken };
  }
} 