"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface Advice {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: any;
  isApproved: boolean;
}

export default function AdvicePage() {
  const { user } = useAuth();
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdvices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "Advice"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Advice[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Advice);
      });
      setAdvices(fetched);
    } catch (error) {
      console.error("Error fetching advices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvices();
  }, []);

  const handleAddAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newAdvice = {
        userId: user?.uid || "admin",
        userName: "المدير العام",
        content,
        timestamp: Timestamp.now(),
        isApproved: true // Admin posts are auto-approved
      };
      const docRef = await addDoc(collection(db, "Advice"), newAdvice);
      setAdvices([{ id: docRef.id, ...newAdvice }, ...advices]);
      setContent("");
      alert("تمت إضافة النصيحة بنجاح!");
    } catch (error) {
      console.error("Error adding advice", error);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "Advice", id), { isApproved: !currentStatus });
      setAdvices(advices.map(a => a.id === id ? { ...a, isApproved: !currentStatus } : a));
    } catch (error) {
      console.error("Error toggling approval", error);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه النصيحة؟")) return;
    try {
      await deleteDoc(doc(db, "Advice", id));
      setAdvices(advices.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting advice", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">إدارة النصائح</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">إضافة نصيحة جديدة</h3>
            <form onSubmit={handleAddAdvice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">محتوى النصيحة</label>
                <textarea 
                  required 
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                  className="w-full border rounded p-2 h-32 focus:ring-[var(--color-primary)]" 
                  placeholder="اكتب نصيحة للمزارعين..."
                ></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold py-2 rounded hover:bg-green-800 transition-colors">
                {isSubmitting ? "جاري النشر..." : "نشر باسم المدير العام"}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-secondary)] overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold">قائمة النصائح</h3>
              <button onClick={fetchAdvices} className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-100">تحديث القائمة</button>
            </div>
            <div className="p-4">
              {loading ? (
                <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
              ) : advices.length === 0 ? (
                <p className="text-center text-gray-500 py-10">لا توجد نصائح حالياً.</p>
              ) : (
                <div className="space-y-4">
                  {advices.map(advice => (
                    <div key={advice.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-md font-bold text-gray-900">{advice.userName}</h4>
                          <span className="text-xs text-gray-400">
                            {advice.timestamp?.toDate ? advice.timestamp.toDate().toLocaleDateString('ar-EG') : ''}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{advice.content}</p>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button 
                          onClick={() => toggleApproval(advice.id, advice.isApproved)} 
                          className={`text-xs font-bold px-3 py-1 rounded transition-colors ${advice.isApproved ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}
                        >
                          {advice.isApproved ? '✅ معروضة' : '⏳ بانتظار الموافقة'}
                        </button>
                        <button onClick={() => handleDelete(advice.id)} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors text-center">
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
