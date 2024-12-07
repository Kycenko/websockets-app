// ChatComponent.tsx
import React from 'react'
import useChatSocket from './useChatSocket'

interface ChatComponentProps {
	userId: string
	chatId: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, chatId }) => {
	const { messages, sendMessage, newMessage, setNewMessage } = useChatSocket(
		userId,
		chatId
	)

	const handleSendMessage = () => {
		sendMessage(newMessage)
	}

	return (
		<div>
			<div>
				<h3>Chat History</h3>
				{messages.map((message, index) => (
					<div key={index}>
						<strong>{message.creator?.login}:</strong> {message.text}
					</div>
				))}
			</div>
			<div>
				<textarea
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder='Type your message'
				/>
				<button onClick={handleSendMessage}>Send</button>
			</div>
		</div>
	)
}

export default ChatComponent
