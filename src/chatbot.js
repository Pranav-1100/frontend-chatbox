import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 80vh;
  max-height: 600px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  overflow: hidden;
`;

const MessagesContent = styled.div`
  flex-grow: 1;
  color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
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
  padding: 10px;
  border-radius: 10px;
  outline: none;
  transition: background 0.2s ease;

  &:hover {
    background: #1d7745;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  padding: 10px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background: ${({ isUser }) => (isUser ? 'linear-gradient(120deg, #248a52, #257287)' : 'rgba(0, 0, 0, 0.3)')};
  color: ${({ isUser }) => (isUser ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  position: relative;
  margin: ${({ isUser }) => (isUser ? '10px 10px 10px 0' : '10px 0 10px 10px')};
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: ${({ isUser }) => (isUser ? '0 10px 0 0' : '0 0 0 10px')};
`;

const DetailsForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAskingForDetails, setIsAskingForDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ fullName: '', email: '', roomId: null, nights: 1 });

  const scrollbarRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      addBotMessage("Hi there, how can I help?");
    }, 1000);
  }, []);

  const addMessage = (content, role = 'user') => {
    setMessages((prevMessages) => [...prevMessages, { role, content }]);
    updateScrollbar();
  };

  const addBotMessage = (content) => {
    addMessage(content, 'assistant');
  };

  const updateScrollbar = () => {
    setTimeout(() => {
      if (scrollbarRef.current) {
        scrollbarRef.current.scrollToBottom();
      }
    }, 100);
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

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        userId: '123', // replace with actual user ID
        message: input,
      });

      const botMessage = { role: 'assistant', content: response.data.response };
      setMessages([...messages, newMessage, botMessage]);

      if (response.data.askForDetails) {
        setIsAskingForDetails(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' };
      setMessages([...messages, newMessage, errorMessage]);
    }

    setInput('');
  };

  const handleBookingDetailsSubmit = async (event) => {
    event.preventDefault();
    const { fullName, email } = bookingDetails;

    if (fullName && email) {
      try {
        const response = await axios.post('http://localhost:3000/api/chat', {
          userId: '123', // replace with actual user ID
          message: `Booking details: ${fullName}, ${email}`,
          roomId: bookingDetails.roomId,
          fullName: bookingDetails.fullName,
          email: bookingDetails.email,
          nights: bookingDetails.nights,
        });

        const botMessage = { role: 'assistant', content: response.data.response };
        setMessages([...messages, botMessage]);
        setIsAskingForDetails(false);
      } catch (error) {
        console.error('Error sending booking details:', error);
        const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' };
        setMessages([...messages, errorMessage]);
      }
    } else {
      alert('Please fill in all the details');
    }
  };

  return (
    <ChatContainer>
      <MessagesContent>
        <Scrollbar ref={scrollbarRef} style={{ width: '100%', height: '100%' }}>
          <div>
            {messages.map((msg, index) => (
              <Message key={index} isUser={msg.role === 'user'}>
                {!msg.isUser && <ProfileImage isUser={msg.role === 'user'} src={msg.role === 'user' ? "https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/images.jpg" : "https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/download.jpg" } />}
                <MessageBubble isUser={msg.role === 'user'}>
                  {msg.role === 'user' ? 'User: ' : 'Bot: '}
                  {formatMessageContent(msg.content)}
                </MessageBubble>
                {msg.isUser && <ProfileImage isUser={msg.role === 'user'} src={msg.role === 'user' ? "https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/images.jpg" : "https://raw.githubusercontent.com/Pranav-1100/Pranav-1100/main/assets/download.jpg"} />}
              </Message>
            ))}
          </div>
        </Scrollbar>
      </MessagesContent>
      {isAskingForDetails ? (
        <DetailsForm onSubmit={handleBookingDetailsSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={bookingDetails.fullName}
            onChange={(e) => setBookingDetails({ ...bookingDetails, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={bookingDetails.email}
            onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
            required
          />
          <MessageSubmit type="submit">Submit</MessageSubmit>
        </DetailsForm>
      ) : (
        <MessageBox>
          <MessageInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <MessageSubmit onClick={sendMessage}>Send</MessageSubmit>
        </MessageBox>
      )}
    </ChatContainer>
  );
};

export default Chatbot;
