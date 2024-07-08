import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import authService from './authService';

const bounce = keyframes`
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
`;

const thinkingAnimation = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  height: 80vh;
  max-height: 600px;
  background: linear-gradient(135deg, #044f48, #2a7561);
  border-radius: 20px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 16px;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const MessagesContent = styled.div`
  flex-grow: 1;
  color: rgba(255, 255, 255, 0.5);
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
`;

const MessageInput = styled.input`
  flex-grow: 1;
  background: none;
  border: none;
  outline: none;
  padding: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
`;

const MessageSubmit = styled.button`
  color: #fff;
  background: #248a52;
  border: none;
  font-size: 14px;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 5px;
  outline: none;
  transition: background 0.2s ease;

  &:hover {
    background: #1d7745;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  ${({ isUser }) => isUser && 'flex-direction: row-reverse;'}
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background: ${({ isUser }) => (isUser ? 'linear-gradient(120deg, #248A52, #257287)' : 'rgba(0, 0, 0, 0.3)')};
  color: ${({ isUser }) => (isUser ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  position: relative;
  margin: ${({ isUser }) => (isUser ? '0 0 0 10px' : '0 10px 0 0')};
  animation: ${bounce} 500ms linear both;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: ${({ isUser }) => (isUser ? '0 0 0 10px' : '0 10px 0 0')};
`;

const ThinkingDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 3px;
  animation: ${thinkingAnimation} 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAskingForDetails, setIsAskingForDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ fullName: '', email: '', roomId: null, nights: 1 });
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      addBotMessage("Hi there, how can I help you with your hotel booking?");
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const username = authService.getUsername();
      console.log('Auth check - Token:', token, 'Username:', username);
      console.log('Local Storage - user:', localStorage.getItem('user'));
      console.log('Local Storage - token:', localStorage.getItem('token'));
      if (!token || !username) {
        console.log('User not authenticated, redirecting to login');
        // Implement your redirect logic here
      }
    };
    checkAuth();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (content, role = 'user') => {
    setMessages((prevMessages) => [...prevMessages, { role, content }]);
  };

  const addBotMessage = (content) => {
    setIsThinking(true);
    setTimeout(() => {
      addMessage(content, 'assistant');
      setIsThinking(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatMessageContent = (content) => {
    if (content.includes('available room options') || content.includes('Booking details')) {
      return content.split('\n').map((item, index) => (
        <div key={index}>
          {item.trim() !== '' && <div>{formatBoldText(item)}</div>}
        </div>
      ));
    }
    return formatBoldText(content);
  };

  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part
    );
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
  
    const username = authService.getUsername();
    const token = authService.getToken();
    console.log('Attempting to send message. Username:', username, 'Token exists:', !!token);
  
    if (!username || !token) {
      console.log('User not authenticated, redirecting to login');
      // Implement your redirect logic here, e.g.:
      // history.push('/login');
      addBotMessage('Please log in to continue.');
      return;
    }
  
    addMessage(input);
    setInput('');
    setIsThinking(true);
  
    try {
      console.log('Sending message - Token:', token.substring(0, 10) + '...', 'Username:', username);
  
      const response = await axios.post('http://localhost:3000/api/chat', {
        userId: username,
        message: input,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Message sent successfully. Response:', response.data);
  
      if (response.data && response.data.response) {
        addBotMessage(response.data.response);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      
      if (error.response && error.response.status === 401) {
        console.log('Authentication failed. Redirecting to login.');
        // Implement your redirect logic here, e.g.:
        // history.push('/login');
        addBotMessage('Your session has expired. Please log in again.');
      } else {
        addBotMessage('Sorry, something went wrong. Please try again later.');
      }
    } finally {
      setIsThinking(false);
    }
  };
  
  const handleBookingDetailsSubmit = async (event) => {
    event.preventDefault();
    const { fullName, email } = bookingDetails;

    if (fullName && email) {
      setIsThinking(true);
      try {
        const token = authService.getToken();
        const username = authService.getUsername();

        const response = await axios.post('http://localhost:3000/api/chat', {
          userId: username,
          message: `Booking details: ${fullName}, ${email}`,
          roomId: bookingDetails.roomId,
          fullName: bookingDetails.fullName,
          email: bookingDetails.email,
          nights: bookingDetails.nights,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.response) {
          addBotMessage(response.data.response);
          setIsAskingForDetails(false);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error sending booking details:', error);
        addBotMessage('Sorry, something went wrong. Please try again .');
      } finally {
        setIsThinking(false);
      }
    } else {
      alert('Please fill in all the details');
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <UserName>User Chat</UserName>
        <ChatTitle>Hotel Booking Chatbot</ChatTitle>
      </ChatHeader>
      <MessagesContent>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.role === 'user'}>
            {msg.role !== 'user' && (
              <ProfileImage
                isUser={false}
                src="https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/download.jpg"
                alt="Bot"
              />
            )}
            
            {msg.role === 'user' && (
              <ProfileImage
                isUser={true}
                src="https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/images.jpg"
                alt="User"
              />
            )}
            <MessageBubble isUser={msg.role === 'user'}>
              {formatMessageContent(msg.content)}
            </MessageBubble>
          </Message>
        ))}
        {isThinking && (
          <ThinkingDots>
            <Dot />
            <Dot />
            <Dot />
          </ThinkingDots>
        )}
        <div ref={messagesEndRef} />
      </MessagesContent>
      {isAskingForDetails ? (
        <MessageBox>
          <MessageInput
            type="text"
            placeholder="Full Name"
            value={bookingDetails.fullName}
            onChange={(e) => setBookingDetails({ ...bookingDetails, fullName: e.target.value })}
            required
          />
          <MessageInput
            type="email"
            placeholder="Email"
            value={bookingDetails.email}
            onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
            required
          />
          <MessageSubmit onClick={handleBookingDetailsSubmit}>Submit</MessageSubmit>
        </MessageBox>
      ) : (
        <MessageBox>
          <MessageInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <MessageSubmit onClick={sendMessage}>Send</MessageSubmit>
        </MessageBox>
      )}
    </ChatContainer>
  );
};

export default Chatbot;