"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Disease {
  id: string;
  name: string;
  type: string;
  symptoms: string;
  treatment: string;
  pesticideName: string;
  pesticideIngredients: string;
  imageUrl: string;
  createdAt?: any;
}

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("فطري");
  const [symptoms, setSymptoms] = useState("");
  const [treatment, setTreatment] = useState("");
  const [pesticideName, setPesticideName] = useState("");
  const [pesticideIngredients, setPesticideIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Diseases"));
      const fetched: Disease[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Disease);
      });
      setDiseases(fetched);
    } catch (error) {
      console.error("Error fetching diseases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleAddDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symptoms || !treatment) return alert("يرجى تعبئة الحقول الأساسية");
    
    setIsSubmitting(true);
    try {
      const newDisease = {
        name,
        type,
        symptoms,
        treatment,
        pesticideName,
        pesticideIngredients,
        imageUrl,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, "Diseases"), newDisease);
      setDiseases([{ id: docRef.id, ...newDisease }, ...diseases]);
      
      // Reset form
      setName("");
      setSymptoms("");
      setTreatment("");
      setPesticideName("");
      setPesticideIngredients("");
      setImageUrl("");
      alert("تمت إضافة المرض بنجاح!");
    } catch (error) {
      console.error("Error adding disease", error);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المرض؟")) return;
    try {
      await deleteDoc(doc(db, "Diseases", id));
      setDiseases(diseases.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting disease", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">إدارة الأمراض والآفات (CMS)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-secondary)]">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">إضافة مرض / آفة جديدة</h3>
            <form onSubmit={handleAddDisease} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2 focus:ring-[var(--color-primary)]" placeholder="مثال: البياض الدقيقي" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع الإصابة</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded p-2 focus:ring-[var(--color-primary)]">
                  <option value="فطري">فطري</option>
                  <option value="حشري">حشري</option>
                  <option value="آفة">آفة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأعراض</label>
                <textarea required value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full border rounded p-2 h-20 focus:ring-[var(--color-primary)]" placeholder="وصف مفصل للأعراض..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">طرق المعالجة</label>
                <textarea required value={treatment} onChange={e => setTreatment(e.target.value)} className="w-full border rounded p-2 h-20 focus:ring-[var(--color-primary)]" placeholder="خطوات المعالجة المقترحة..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم المبيد المقترح</label>
                <input value={pesticideName} onChange={e => setPesticideName(e.target.value)} className="w-full border rounded p-2 focus:ring-[var(--color-primary)]" placeholder="اسم المبيد..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المكونات الفعالة للمبيد</label>
                <input value={pesticideIngredients} onChange={e => setPesticideIngredients(e.target.value)} className="w-full border rounded p-2 focus:ring-[var(--color-primary)]" placeholder="المكونات الكيميائية..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة (URL)</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded p-2 focus:ring-[var(--color-primary)]" placeholder="https://..." dir="ltr" />
                <p className="text-xs text-gray-500 mt-1">يتم حفظ الرابط فقط، وسيقوم التطبيق بتنزيلها وعرضها للمزارع.</p>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold py-2 rounded hover:bg-green-800 transition-colors">
                {isSubmitting ? "جاري الإضافة..." : "إضافة المرض"}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-secondary)] overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold">قائمة الأمراض المسجلة</h3>
              <button onClick={fetchDiseases} className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-100">تحديث القائمة</button>
            </div>
            <div className="p-4">
              {loading ? (
                <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
              ) : diseases.length === 0 ? (
                <p className="text-center text-gray-500 py-10">لا توجد أمراض مضافة حالياً.</p>
              ) : (
                <div className="space-y-4">
                  {diseases.map(disease => (
                    <div key={disease.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-[var(--color-primary)]">{disease.name}</h4>
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{disease.type}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1"><strong>الأعراض:</strong> {disease.symptoms.substring(0, 80)}...</p>
                        <p className="text-sm text-gray-700 mb-2"><strong>العلاج:</strong> {disease.treatment.substring(0, 80)}...</p>
                        {(disease.pesticideName || disease.imageUrl) && (
                          <div className="flex gap-2 mt-2">
                            {disease.pesticideName && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded">مبيد: {disease.pesticideName}</span>}
                            {disease.imageUrl && <a href={disease.imageUrl} target="_blank" className="text-xs bg-gray-100 text-gray-700 border px-2 py-1 rounded hover:bg-gray-200">عرض الصورة</a>}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 min-w-[100px]">
                        <button onClick={() => handleDelete(disease.id)} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors">
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
