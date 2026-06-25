"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, orderBy, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "Chats"), orderBy("lastMessageTimestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: any[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      setChats(fetched);
    } catch (error) {
      console.error("Error fetching chats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;
    if (activeChat) {
      const q = query(
        collection(db, "Chats", activeChat.id, "messages"),
        orderBy("timestamp", "asc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: any[] = [];
        snapshot.forEach((docSnap) => fetched.push({ id: docSnap.id, ...docSnap.data() }));
        setMessages(fetched);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const text = newMessage.trim();
    setNewMessage("");

    try {
      // Add message
      await addDoc(collection(db, "Chats", activeChat.id, "messages"), {
        sender: "admin",
        text: text,
        timestamp: serverTimestamp(),
      });

      // Update last message in Chat doc
      await updateDoc(doc(db, "Chats", activeChat.id), {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
      });

      fetchChats(); // Refresh chat list to bump it up
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">إدارة المحادثات</h2>
          {!loading && (
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
              الإجمالي: {chats.length} محادثة
            </span>
          )}
        </div>
        <button onClick={fetchChats} className="bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold px-4 py-2 rounded shadow-sm hover:bg-green-100 transition-colors">
          تحديث
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-secondary)] overflow-hidden flex-1 flex flex-col md:flex-row">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-l border-gray-200 flex flex-col h-full bg-gray-50">
          <div className="p-4 bg-[var(--color-primary)] text-white font-bold">المحادثات النشطة</div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
            ) : chats.length === 0 ? (
              <p className="text-center text-gray-500 py-10">لا توجد محادثات.</p>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 border-b cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                >
                  <h4 className="font-bold text-gray-900">{chat.userName || chat.participants?.join("، ") || "المزارع"}</h4>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  <span className="text-xs text-gray-400">
                    {chat.lastMessageTimestamp?.toDate ? chat.lastMessageTimestamp.toDate().toLocaleString('ar-EG') : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-full md:w-2/3 flex flex-col h-full">
          {activeChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <h3 className="font-bold text-lg">{activeChat.userName || "المزارع"}</h3>
                <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-500 hover:text-gray-800">إغلاق</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">لا توجد رسائل سابقة. ابدأ المحادثة.</p>
                ) : (
                  messages.map(msg => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${isAdmin ? 'bg-[var(--color-primary)] text-white rounded-tl-none' : 'bg-white border rounded-tr-none text-gray-800'}`}>
                          <p>{msg.text}</p>
                          <span className={`text-[10px] mt-1 block ${isAdmin ? 'text-gray-200' : 'text-gray-400'}`}>
                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString('ar-EG') : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك للمزارع..." 
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button type="submit" disabled={!newMessage.trim()} className="bg-[var(--color-primary)] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50">
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p>اختر محادثة للبدء في التواصل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
