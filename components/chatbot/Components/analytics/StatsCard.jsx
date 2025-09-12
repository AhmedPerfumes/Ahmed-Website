import React, { useState, useEffect } from "react";
import { Conversation, Message } from "@/Entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageCircle, Users, Clock, TrendingUp } from "lucide-react";

import StatsCard from "@/Components/analytics/StatsCard.jsx";

export default function Analytics() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [conversationData, messageData] = await Promise.all([
        Conversation.list(),
        Message.list()
      ]);
      
      setConversations(conversationData);
      setMessages(messageData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = () => {
    const categories = {};
    conversations.forEach(conv => {
      categories[conv.category] = (categories[conv.category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value
    }));
  };

  const getLanguageData = () => {
    const languages = {};
    conversations.forEach(conv => {
      languages[conv.language] = (languages[conv.language] || 0) + 1;
    });
    
    return Object.entries(languages).map(([name, value]) => ({
      name: name === 'ar' ? 'Arabic' : 'English',
      value
    }));
  };

  const COLORS = ['#c0a062', '#a18650', '#d4b87a', '#846d44', '#e0c891', '#f0e6d2'];

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[var(--brand-background)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--brand-text-dark)] mb-2">Analytics Dashboard</h1>
          <p className="text-[var(--brand-text-light)]">Monitor your chatbot performance and customer insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Conversations"
            value={conversations.length}
            icon={MessageCircle}
            trend="+12% this week"
          />
          <StatsCard
            title="Total Messages"
            value={messages.length}
            icon={Users}
            trend="+8% this week"
          />
          <StatsCard
            title="Active Chats"
            value={conversations.filter(c => c.status === 'active').length}
            icon={Clock}
            trend="Live count"
          />
          <StatsCard
            title="Resolved Issues"
            value={conversations.filter(c => c.status === 'resolved').length}
            icon={TrendingUp}
            trend="+15% this week"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/70">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[var(--brand-text-dark)]">Conversation Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--brand-text-light)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--brand-text-light)' }} />
                  <Tooltip cursor={{fill: 'rgba(192, 160, 98, 0.1)'}} />
                  <Bar dataKey="value" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[var(--brand-text-dark)]">Language Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getLanguageData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="var(--brand-background)"
                  >
                    {getLanguageData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card className="shadow-lg border-0 bg-white/70">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[var(--brand-text-dark)]">Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.slice(0, 5).map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between p-4 bg-[var(--brand-surface)] rounded-xl">
                  <div>
                    <p className="font-semibold text-[var(--brand-text-dark)]">{conversation.customer_name}</p>
                    <p className="text-sm text-[var(--brand-text-light)] truncate max-w-md">{conversation.last_message}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                      conversation.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {conversation.status}
                    </span>
                    <span className="text-xs text-[var(--brand-text-light)]">
                      {conversation.language === 'ar' ? '🇦🇪' : '🇺🇸'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}