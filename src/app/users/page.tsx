"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  uid: string;
  name: string;
  phoneNumber: string;
  email: string;
  isChatEnabled: boolean;
  isAdviceEnabled: boolean;
  isDeleted: boolean;
  registrationDate: any;
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "Users"), where("isDeleted", "==", false));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: any[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedUsers.push({ uid: docSnap.id, ...docSnap.data() });
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleFeature = async (uid: string, feature: string, currentValue: boolean) => {
    try {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, {
        [feature]: !currentValue,
      });
      setUsers(users.map(u => u.uid === uid ? { ...u, [feature]: !currentValue } : u));
    } catch (error) {
      console.error(`Error toggling ${feature}`, error);
      alert("حدث خطأ أثناء تحديث الصلاحية");
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟ سيتم طرده من التطبيق فوراً.")) return;
    try {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, {
        isDeleted: true,
      });
      setUsers(users.filter(u => u.uid !== uid));
    } catch (error) {
      console.error("Error deleting user", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  // Get dynamic feature columns (any key starting with 'is' except 'isDeleted')
  const getFeatureColumns = () => {
    if (users.length === 0) return ["isChatEnabled", "isAdviceEnabled"]; // defaults
    const firstUser = users[0];
    return Object.keys(firstUser).filter(key => key.startsWith('is') && key !== 'isDeleted' && typeof firstUser[key] === 'boolean');
  };

  const featureColumns = getFeatureColumns();

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">إدارة المستخدمين</h2>
          {!loading && (
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
              الإجمالي: {users.length} مستخدم
            </span>
          )}
        </div>
        <button onClick={fetchUsers} className="bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold px-4 py-2 rounded shadow-sm hover:bg-green-100 transition-colors">
          تحديث البيانات
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-secondary)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold">الاسم</th>
                <th className="px-6 py-4 font-bold">رقم الهاتف</th>
                {featureColumns.map(feature => (
                  <th key={feature} className="px-6 py-4 font-bold">حالة {feature.replace('is', '').replace('Enabled', '')}</th>
                ))}
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3 + featureColumns.length} className="px-6 py-8 text-center text-gray-500">جاري تحميل المستخدمين...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3 + featureColumns.length} className="px-6 py-8 text-center text-gray-500">لا يوجد مستخدمين مسجلين بعد.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {user.name || "بدون اسم"}
                      {user.email && <div className="text-xs text-gray-500">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4" dir="ltr">{user.phoneNumber || "-"}</td>
                    {featureColumns.map(feature => (
                      <td key={feature} className="px-6 py-4">
                        <button 
                          onClick={() => toggleFeature(user.uid, feature, user[feature])}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${user[feature] ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                        >
                          {user[feature] ? 'مفعل' : 'معطل'}
                        </button>
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => deleteUser(user.uid)}
                        className="text-red-600 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
