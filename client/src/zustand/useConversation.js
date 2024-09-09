import { create } from 'zustand';

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (data) => set({ selectedConversation: data }), 
    messages: [],
    setMessages: (messages) => set({ messages }),
}));


export default useConversation;