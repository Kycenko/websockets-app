import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.user.findMany()
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async getByLogin(login: string) {
		return this.prisma.user.findUnique({ where: { login } })
	}

	async update(id: string, data: any) {
		return this.prisma.user.update({ where: { id }, data })
	}

	async delete(id: string) {
		return this.prisma.user.delete({ where: { id } })
	}
}
