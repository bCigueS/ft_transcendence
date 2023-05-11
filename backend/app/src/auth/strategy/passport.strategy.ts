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
      clientID: "u-s4t2ud-704cf07ea6e80884e9ce5b36b9470e76c543cb217ac6880065a2964b1e6475cf",
      clientSecret: "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",
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