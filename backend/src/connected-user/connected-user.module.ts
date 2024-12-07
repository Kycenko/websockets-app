import { Module } from '@nestjs/common'

import { PrismaService } from 'prisma/prisma.service'

import { ConnectedUserService } from './connected-user.service'

@Module({
	controllers: [],
	providers: [ConnectedUserService, PrismaService],
	exports: [ConnectedUserService]
})
export class ConnectedUserModule {}
