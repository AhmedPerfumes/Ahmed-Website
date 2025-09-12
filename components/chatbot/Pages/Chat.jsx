import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message, FAQ, Product } from "../Entities";
import { InvokeLLM } from "../integrations/Core.js";
import { Send, Bot, User, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "../Components/chat/ChatMessage.jsx";
import ProductCard from "../Components/chat/ProductCard.jsx";
import QuickActions from "../Components/chat/QuickActions.jsx";
import LanguageSelector from "../Components/chat/LanguageSelector.jsx";

// A simple local search function to find candidate products
const findCandidateProducts = (query, products) => {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  if (queryWords.length === 0) return products.slice(0, 20);

  const scoredProducts = products.map(product => {
    let score = 0;
    const productText = [
      product.name,
      product.profile,
      product.top_notes,
      product.heart_notes,
      product.base_notes
    ].join(' ').toLowerCase();

    queryWords.forEach(word => {
      if (productText.includes(word)) {
        score++;
      }
    });
    return { ...product, score };
  });

  return scoredProducts
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState(null);
  const [language, setLanguage] = useState("en");
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMaximized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    const welcomeMessage = {
      id: `msg_${Date.now()}`,
      sender_type: "bot",
      content: "Welcome to Ahmed Al Maghribi Luxury Fragrances! How may I assist you today?",
      timestamp: new Date().toISOString(),
      message_type: "text"
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (content = inputValue) => {
    if (!content.trim()) return;
    const userMessage = { id: `msg_${Date.now()}`, sender_type: "customer", content, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    try {
      const botResponse = await getBotResponse(content, newMessages);
      const botMessage = {
        id: `msg_${Date.now() + 1}`,
        sender_type: "bot",
        content: botResponse.content,
        timestamp: new Date().toISOString(),
        message_type: botResponse.type || "text",
        metadata: botResponse.metadata,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error handling message:", error);
    }
    setIsLoading(false);
  };

  const getBotResponse = async (userMessage, currentMessages) => {
    const lowerUserMessage = userMessage.toLowerCase();
    const isRecommendationRequest = conversationContext === 'recommendation' || lowerUserMessage.includes("recommend") || lowerUserMessage.includes("fragrance") || lowerUserMessage.includes("scent") || lowerUserMessage.includes("smell") || lowerUserMessage.includes("woody") || lowerUserMessage.includes("floral") || lowerUserMessage.includes("fresh") || lowerUserMessage.includes("oud");
    
    if (isRecommendationRequest) {
      setConversationContext('recommendation');
      const allProducts = await Product.list();
      
      const candidateProducts = findCandidateProducts(userMessage, allProducts);
      const productKnowledgeBase = candidateProducts.map(p => `Name: ${p.name}, Profile: ${p.profile}, Notes: ${p.top_notes}, ${p.heart_notes}, ${p.base_notes}`).join('\n');
      const history = currentMessages.slice(-4).map(m => `${m.sender_type}: ${m.content}`).join('\n');

      const prompt = `You are a direct and efficient perfume recommendation engine.
      CONVERSATION HISTORY:
      ---
      ${history}
      ---
      CANDIDATE PERFUMES:
      ---
      ${productKnowledgeBase}
      ---
      TASK:
      1. Analyze the user's latest request from the history.
      2. Find the best 1-2 matching perfumes from the CANDIDATE PERFUMES list.
      3. Respond with a very brief, one-sentence introductory phrase.
      4. You MUST include the exact names of your chosen perfumes in your response.
      RULES:
      - DO NOT ask clarifying questions.
      - Be direct and provide a recommendation.`;

      const aiResponseText = await InvokeLLM({ prompt });
      
      const recommendedProducts = allProducts.filter(p =>
        aiResponseText.toLowerCase().includes(p.name.toLowerCase())
      );

      if (recommendedProducts.length > 0) {
        return {
          content: aiResponseText,
          type: "product_recommendation",
          metadata: { products: recommendedProducts.slice(0, 2) }
        };
      } else {
        return { content: aiResponseText || "I'm sorry, I couldn't find a specific match for your request." };
      }
    }

    setConversationContext(null);

    try {
      const prompt = `You are a polite, luxury customer service assistant. The customer's message is: "${userMessage}"`;
      const response = await InvokeLLM({ prompt });
      return { content: response, type: "text" };
    } catch (aiError) {
      console.error("Error with AI response:", aiError);
      return { content: "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment." };
    }
  };

  const handleQuickAction = (action) => {
    const actions = {
      track_order: { en: "I'd like to track my order" },
      product_recommendation: { en: "Can you recommend some fragrances for me?" },
      contact_support: { en: "I need to contact customer support" },
      store_locations: { en: "Where are your store locations?" }
    };
    handleSendMessage(actions[action]['en']);
  };

  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        height: isMaximized ? '50%' : '70px',
        width: isMaximized ? '400px' : '70px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        zIndex: 1050,
        transition: 'all 0.3s ease-in-out',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isMaximized ? '#e3e2d5' : 'transparent',
      }}
    >
      {/* Header and Toggle Button */}
      <div 
        onClick={toggleMaximized}
        style={{
          backgroundColor: isMaximized ? 'rgba(255, 255, 255, 0.95)' : 'linear-gradient(to bottom right, #c0a062, #a18650)',
          backdropFilter: 'blur(10px)',
          borderBottom: isMaximized ? '1px solid rgba(192, 160, 98, 0.2)' : 'none',
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '1.5rem',
          boxShadow: isMaximized ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          height: '70px', // Fixed height for header/icon
          color: isMaximized ? '#44403c' : 'white',
        }}
        className="d-flex align-items-center"
      >
        <div style={{ display: isMaximized ? 'flex' : 'none', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(to bottom right, #c0a062, #a18650)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}>
            <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#44403c', marginBottom: 0 }}>Ahmed Al Maghribi</h1>
            <p style={{ fontSize: '0.875rem', color: '#a18650', fontWeight: '500', margin: 0 }}>Luxury Fragrance Assistant</p>
          </div>
        </div>
        <div style={{ display: isMaximized ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
        </div>
        <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
          {isMaximized ? (
            <ChevronDown style={{ width: '1.5rem', height: '1.5rem', color: '#44403c' }} />
          ) : (
            <ChevronUp style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          )}
        </div>
      </div>

      {/* Main Chat Content (Conditionally Rendered) */}
      <AnimatePresence>
        {isMaximized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              padding: '1rem 0',
              overflowY: 'auto',
              borderTop: '1px solid rgba(192, 160, 98, 0.2)',
            }}
          >
            <div style={{ padding: '0 1rem' }}>
              <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    language={language}
                  />
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem 1rem 1rem 0', padding: '1.5rem 1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(192, 160, 98, 0.2)', maxWidth: '20rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#c0a062', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bot style={{ width: '1rem', height: '1rem', color: 'white' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#d4b87a', borderRadius: '9999px', animation: 'bounce 1s infinite' }}></div>
                          <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#d4b87a', borderRadius: '9999px', animation: 'bounce 1s infinite', animationDelay: '0.1s' }}></div>
                          <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#d4b87a', borderRadius: '9999px', animation: 'bounce 1s infinite', animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="mt-auto">
              <QuickActions onAction={handleQuickAction} language={language} />
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(192, 160, 98, 0.2)',
                padding: '1rem',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}>
                <div className="mx-auto" style={{ maxWidth: '48rem' }}>
                  <div className="d-flex" style={{ gap: '0.75rem' }}>
                    <div style={{ flex: '1', position: 'relative' }}>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Type your message here..."}
                        style={{
                          width: '100%',
                          paddingRight: '3rem',
                          paddingTop: '1.5rem',
                          paddingBottom: '1.5rem',
                          fontSize: '1.125rem',
                          borderRadius: '1.5rem',
                          border: '1px solid rgba(192, 160, 98, 0.3)',
                          outline: 'none',
                          boxShadow: '0 0 0 1px transparent',
                          backgroundColor: 'white',
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !inputValue.trim()}
                      style={{
                        background: 'linear-gradient(to right, #c0a062, #a18650)',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}