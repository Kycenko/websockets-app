import { Module } from '@nestjs/common'

import { ChatModule } from './chat/chat.module'
import { ConnectedUserModule } from './connected-user/connected-user.module'

import { PrismaService } from 'prisma/prisma.service'
import { UserModule } from './user/user.module'
import { MessageModule } from './message/message.module';

@Module({
	imports: [ChatModule, ConnectedUserModule, UserModule, MessageModule],
	controllers: [],
	providers: [PrismaService]
})
export class AppModule {}
