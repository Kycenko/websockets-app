import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { ConnectedUserService } from 'src/connected-user/connected-user.service'
import { MessageService } from 'src/message/message.service'
import { UserService } from 'src/user/user.service'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller';

@Module({
	providers: [
		ChatGateway,
		ChatService,
		PrismaService,
		ConnectedUserService,
		MessageService,
		UserService
	],
	controllers: [ChatController]
})
export class ChatModule {}
