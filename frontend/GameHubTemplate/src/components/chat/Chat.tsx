import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
    sender: string;
    content: string;
    timestamp: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const stompClient = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!username) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                client.subscribe('/topic/messages', (message) => {
                    const newMessage: ChatMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMessage]);
                });
            },
            onDisconnect: () => setIsConnected(false),
        });

        stompClient.current = client;
        client.activate();

        return () => {
            client.deactivate();
            setIsConnected(false);
        };
    }, [username]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !stompClient.current) return;

        const message: ChatMessage = {
            sender: username,
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        stompClient.current.publish({
            destination: '/app/chat',
            body: JSON.stringify(message)
        });

        setInputMessage('');
    };

    if (!username) {
        return (
            <div className="auth-container">
                <h2>Choose a Username</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    setUsername(formData.get('username')!.toString().trim());
                }}>
                    <input
                        name="username"
                        placeholder="Enter username..."
                        required
                        minLength={3}
                    />
                    <button type="submit">Join Chat</button>
                </form>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat Room</h2>
                <div className="connection-status">
                    <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
                    {isConnected ? 'Connected' : 'Connecting...'}
                </div>
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === username ? 'own-message' : ''}`}>
                        <div className="message-header">
                            <span className="sender">{msg.sender}</span>
                            <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="message-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected}>
                    {isConnected ? 'Send' : 'Connecting...'}
                </button>
            </form>
        </div>
    );
};

export default Chat;