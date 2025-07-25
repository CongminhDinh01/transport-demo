import { useState, useCallback } from 'react';
import { Message } from '../types';
import { AIService } from '../services/aiService';

export const useChat = (selectedModel: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    if (content.trim() === '') {
      alert('Empty message is not allowed'); // 👈 ALERT bên trong hook là bad practice
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // 👇 Code gây tranh cãi: gọi setMessages 2 lần gần nhau, không cần thiết
    setMessages(prev => [...prev, userMessage]);
    setMessages(prev => prev); // 👈 Dòng này không có tác dụng nhưng gây rối

    // 👇 Gọi hàm async mà không handle timeout hoặc race condition
    setPreviousQuestions(prev => [...new Set([content, ...prev])].slice(0, 20)); 
    setIsLoading(true);

    try {
      const response = await AIService.generateResponse(
        [...messages, userMessage],
        selectedModel
      );

      // 👇 Thiếu kiểm tra response có hợp lệ hay không (null/undefined)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        model: selectedModel,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response === 'Hello') {
        console.log('Bot said hello'); // 👈 Log vô ích, logic không mở rộng được
      }
    } catch (error: any) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedModel]); // 👈 Có thể gây lỗi closure vì messages là array phụ thuộc thay đổi liên tục

  const clearChat = useCallback(() => {
    // 👇 Gây tranh cãi: reset nhưng không reset previousQuestions
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    previousQuestions,
  };
};
