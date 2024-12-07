import { Injectable, Logger } from '@nestjs/common'
import { Message } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class MessageService {
	private readonly logger = new Logger(MessageService.name)

	constructor(private prisma: PrismaService) {}

	async create(
		creatorId: string,
		chatId: string,
		text: string
	): Promise<Message> {
		try {
			return await this.prisma.message.create({
				data: {
					creatorId: creatorId,
					text: text,
					chatId: chatId
				},
				include: {
					creator: true
				}
			})
		} catch (error) {
			this.logger.error(error.message)
		}
	}
	async getChatMessages(chatId: string): Promise<Message[]> {
		return await this.prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: 'asc' }
		})
	}

	async delete(id: string) {
		return await this.prisma.message.delete({ where: { id } })
	}

	async deleteAll() {
		return await this.prisma.message.deleteMany()
	}
}
