import { Logger } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { User } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { SocketUser } from 'src/common/decorators/socket-user.decorator'
import { ConnectedUserService } from 'src/connected-user/connected-user.service'
import { MessageService } from 'src/message/message.service'
import { UserService } from 'src/user/user.service'

@WebSocketGateway(7778, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	constructor(
		private connectedUserService: ConnectedUserService,
		private messageService: MessageService,
		private userService: UserService
	) {}
	logger = new Logger('ChatGateway')

	async onModuleInit(): Promise<void> {
		this.logger.log('ChatGateway initialized')
		await this.connectedUserService.deleteAll()
	}

	async handleConnection(socket: Socket): Promise<void> {
		try {
			const userId = socket.handshake.query.userId as string
			const chatId = socket.handshake.query.chatId as string
			if (userId) {
				this.connectedUserService.create(userId, socket.id)
				this.logger.log(
					`Client connected: ${socket.id} - User ID: ${userId} - Chat ID: ${chatId}`
				)
			}

			const user = await this.userService.getById(userId)
			socket.data.user = user
			socket.join(chatId)

			const messages = await this.messageService.getChatMessages(chatId)
			socket.emit('chatHistory', { messages })

			socket.emit('connected', { socketId: socket.id })
		} catch (error) {
			this.logger.error(error.message)
			socket.disconnect()
		}
	}

	async handleDisconnect(socket: Socket): Promise<void> {
		try {
			await this.connectedUserService.delete(socket.id)
			this.logger.log(`Client disconnected: ${socket.id}`)
		} catch (error) {
			this.logger.error(error.message)
		}
	}

	@SubscribeMessage('joinChat')
	private async joinChat(
		@MessageBody() chatId: string,
		@ConnectedSocket() socket: Socket
	): Promise<void> {
		socket.join(chatId)
		this.logger.log(`Client joined chat: ${chatId}`)
	}

	@SubscribeMessage('sendMessage')
	async sendMessage(
		@SocketUser() user: User,
		@MessageBody() { chatId, text }: { chatId: string; text: string }
	) {
		try {
			if (!chatId || !text) {
				throw new Error('chatId and text are required')
			}

			const newMessage = await this.messageService.create(user.id, chatId, text)

			this.server.emit('newMessage', newMessage)
			this.logger.log(`Client ID: ${user.login} send message: ${text}`)

			return newMessage
		} catch (error) {
			this.logger.error(error.message)
			return { error: error.message }
		}
	}
}
