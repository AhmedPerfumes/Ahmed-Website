// This file simulates a data access layer (like an ORM or API client)

import { mockProducts, mockFaqs } from "../integrations/MockDB.js";

// --- Helper function to simulate network delay ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Product Model ---
export const Product = {
  list: async (sort = "") => {
    console.log("Fetching mock product list...");
    await delay(500);
    return [...mockProducts];
  },
  create: async (data) => {
    console.log("Simulating product creation with data:", data);
    await delay(500);
    return { id: `prod_${Date.now()}`, ...data };
  },
  update: async (id, data) => {
    console.log(`Simulating update for product ${id} with data:`, data);
    await delay(500);
    return { id, ...data };
  },
  delete: async (id) => {
    console.log(`Simulating deletion of product ${id}`);
    await delay(500);
    return { success: true };
  },
};

// --- Mock FAQ Model ---
export const FAQ = {
  list: async (sort = "") => {
    console.log("Fetching mock FAQ list...");
    await delay(500);
    return [...mockFaqs];
  },
  create: async (data) => {
    console.log("Simulating FAQ creation with data:", data);
    await delay(500);
    return { id: `faq_${Date.now()}`, ...data };
  },
  update: async (id, data) => {
    console.log(`Simulating update for FAQ ${id} with data:`, data);
    await delay(500);
    return { id, ...data };
  },
  delete: async (id) => {
    console.log(`Simulating deletion of FAQ ${id}`);
    await delay(500);
    return { success: true };
  },
};

// --- Mock Conversation and Message Models (with basic functionality) ---
export const Conversation = {
  list: async () => {
    console.log("Fetching mock conversation list...");
    await delay(500);
    return []; // Return empty for now
  },
  create: async (data) => {
    console.log("Simulating conversation creation:", data);
    await delay(100);
    return { id: `conv_${Date.now()}`, ...data };
  }
};

export const Message = {
  list: async () => {
    console.log("Fetching mock message list...");
    await delay(500);
    return []; // Return empty for now
  },
  create: async (data) => {
    console.log("Simulating message creation:", data);
    await delay(100);
    return { id: `msg_${Date.now()}`, ...data };
  }
};