import { Injectable } from '@nestjs/common'
import { Chat } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async create(userIds: string[], chatName: string): Promise<Chat> {
		const users = await this.prisma.user.findMany({
			where: { id: { in: userIds } }
		})
		if (users.length !== userIds.length) {
			throw new Error('One or more users do not exist')
		}

		return this.prisma.chat.create({
			data: {
				name: chatName,
				members: {
					create: userIds.map((id) => ({
						userId: id
					}))
				}
			},
			include: {
				members: true
			}
		})
	}

	async getAll(userId: string): Promise<Chat[]> {
		return this.prisma.chat.findMany({
			where: {
				members: {
					some: { id: userId }
				}
			},
			include: {
				members: true,
				messages: true
			}
		})
	}
}
