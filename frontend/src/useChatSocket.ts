// useChatSocket.ts
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const useChatSocket = (userId: string, chatId: string) => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [messages, setMessages] = useState<any[]>([])
	const [newMessage, setNewMessage] = useState<string>('')

	useEffect(() => {
		// Подключение к серверу
		const socketInstance = io('http://localhost:7778', {
			query: { userId, chatId }
		})

		setSocket(socketInstance)

		// Обработчик получения истории сообщений
		socketInstance.on('chatHistory', (data) => {
			setMessages(data.messages)
		})

		// Обработчик нового сообщения
		socketInstance.on('newMessage', (message) => {
			setMessages((prevMessages) => [...prevMessages, message])
		})

		// Отсоединение при размонтировании компонента
		return () => {
			socketInstance.disconnect()
		}
	}, [userId, chatId])

	const sendMessage = (text: string) => {
		if (socket && text) {
			socket.emit('sendMessage', { chatId, text })
			setNewMessage('')
		}
	}

	return { messages, sendMessage, newMessage, setNewMessage }
}

export default useChatSocket
