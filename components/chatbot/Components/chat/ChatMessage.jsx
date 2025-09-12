import React from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import ProductCard from "./ProductCard.jsx";
import OrderStatusCard from "./OrderStatusCard.jsx";

export default function ChatMessage({ message, language }) {
  const isBot = message.sender_type === "bot";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Bootstrap classes for flexbox and alignment
      className={`d-flex ${isBot ? "justify-content-start" : "justify-content-end"} `}
      style={{ gap: '1rem' }} // Inline style for spacing between elements
    >
      {isBot && (
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(to bottom right, #c0a062, #a18650)',
            borderRadius: '9999px', // Full circle
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', // shadow-lg
            flexShrink: 0,
          }}
        >
          <Bot style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
        </div>
      )}
      
      <div
        className={`
          ${isBot ? "" : "order-last"} 
        `}
        style={{
          maxWidth: '400px' // Equivalent of max-w-md
        }}
      >
        <div
          style={{
            borderRadius: '1.5rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', // shadow-md
            backgroundColor: isBot ? 'white' : 'white',
            border: isBot ? '1px solid rgba(192, 160, 98, 0.2)' : 'none',
            color: isBot ? 'inherit' : 'black',
            borderTopLeftRadius: isBot ? '0.25rem' : '1.5rem', // rounded-tl-sm
            borderTopRightRadius: isBot ? '1.5rem' : '0.25rem' // rounded-tr-sm
          }}
        >
          <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            {message.content}
          </div>
          
          {message.message_type === "product_recommendation" && message.metadata?.products && (
            <div
              style={{
                marginTop: '1rem', // mt-4
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem' // space-y-3
              }}
            >
              {message.metadata.products.map((product, index) => (
                <ProductCard key={index} product={product} language={language} />
              ))}
            </div>
          )}

          {message.message_type === "order_status" && message.metadata?.order && (
            <OrderStatusCard order={message.metadata.order} />
          )}
        </div>
        
        <div
          style={{
            fontSize: '0.75rem', // text-xs
            color: '#94a3b8', // text-slate-400
            marginTop: '0.5rem', // mt-2
            textAlign: isBot ? "left" : "right"
          }}
        >
          {format(new Date(message.timestamp), "HH:mm")}
        </div>
      </div>

      {!isBot && (
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(to bottom right, #475569, #334155)',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        >
          <User style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
        </div>
      )}
    </motion.div>
  );
}