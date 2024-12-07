import { IsString, Length } from 'class-validator'

export class ChatDto {
	@IsString()
	@Length(3, 50, {
		message: 'Chat name must be between 3 and 50 characters long'
	})
	name: string
}
