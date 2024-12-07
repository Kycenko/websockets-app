import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class ConnectedUserService {
	constructor(private prisma: PrismaService) {}
	logger = new Logger(ConnectedUserService.name)
	async create(userId: string, socketId: string) {
		try {
			return await this.prisma.connectedUser.create({
				data: { userId, socketId }
			})
		} catch (error) {
			this.logger.error(error.message)
		}
	}

	async delete(socketId: string) {
		try {
			return await this.prisma.connectedUser.delete({
				where: { socketId }
			})
		} catch (error) {
			this.logger.error(error.message)
		}
	}

	async deleteAll() {
		try {
			return await this.prisma.connectedUser.deleteMany()
		} catch (error) {
			this.logger.error(error.message)
		}
	}
}
