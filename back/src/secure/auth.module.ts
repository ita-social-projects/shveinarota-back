import {  Module } from '@nestjs/common';
import {AuthGoogleModule} from './Google/authGoogle.module'
import {AuthUserModule} from './User/authUser.module'

@Module({
  imports: [
    AuthGoogleModule,
    AuthUserModule
  ],
})

export class AuthMoudle {}
