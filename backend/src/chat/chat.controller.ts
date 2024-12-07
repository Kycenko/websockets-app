import { Body, Controller, Post } from '@nestjs/common'
import { ChatService } from './chat.service'

@Controller('chats')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Post('create')
	async createChat(
		@Body() createChatDto: { userIds: string[]; chatName: string }
	) {
		const { userIds, chatName } = createChatDto
		return this.chatService.create(userIds, chatName)
	}
}
