import { useState, useEffect, useRef } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
    sender: string;
    content: string;
    timestamp: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    let [username, setUsername] = useState('');
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
        username = "user";
    }

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Chat Room</h2>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isConnected ? 'green' : 'red',
                        display: 'inline-block',
                        marginRight: '5px'
                    }} />
                    {isConnected ? 'Connected' : 'Connecting...'}
                </div>
            </div>

            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '0.5rem', marginBottom: '1rem' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        marginBottom: '0.75rem',
                        textAlign: msg.sender === username ? 'right' : 'left'
                    }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {msg.sender} <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.75rem' }}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <div style={{
                            display: 'inline-block',
                            backgroundColor: msg.sender === username ? '#dcf8c6' : '#f1f0f0',
                            padding: '0.5rem',
                            borderRadius: '10px',
                            maxWidth: '80%',
                            wordWrap: 'break-word'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!isConnected}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: isConnected ? '#4CAF50' : '#ccc',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: isConnected ? 'pointer' : 'not-allowed'
                    }}
                >
                    {isConnected ? 'Send' : 'Connecting...'}
                </button>
            </form>
        </div>
    );
};

export default Chat;
