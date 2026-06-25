"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">إدارة المحادثات</h2>
          {!loading && (
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
              الإجمالي: {chats.length} محادثة
            </span>
          )}
        </div>
        <button onClick={fetchChats} className="bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold px-4 py-2 rounded shadow-sm hover:bg-green-100 transition-colors">
          تحديث المحادثات
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-secondary)] overflow-hidden">
        <div className="p-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
          ) : chats.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لا توجد محادثات نشطة حالياً.</p>
          ) : (
            <div className="space-y-4">
              {chats.map(chat => (
                <div key={chat.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">المشاركين: {chat.participants?.join("، ") || "غير معروف"}</h4>
                      <span className="text-xs text-gray-400">
                        {chat.lastMessageTimestamp?.toDate ? chat.lastMessageTimestamp.toDate().toLocaleString('ar-EG') : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage || "لا توجد رسائل"}</p>
                  </div>
                  <div>
                    {/* Since this is a simple CMS, we can just show an alert or redirect to a details page in the future. */}
                    <button onClick={() => alert("سيتم إضافة نافذة المراسلة في التحديث القادم لضمان التسليم اليوم.")} className="bg-[var(--color-primary)] text-white px-4 py-2 rounded font-bold hover:bg-green-800 transition-colors">
                      عرض المراسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
