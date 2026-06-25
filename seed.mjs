import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQA29A1v-_1JSih1Sw-Lyr6kV67dbbQZc",
  authDomain: "doctor-ae322.firebaseapp.com",
  databaseURL: "https://doctor-ae322-default-rtdb.firebaseio.com",
  projectId: "doctor-ae322",
  storageBucket: "doctor-ae322.firebasestorage.app",
  messagingSenderId: "75344651679",
  appId: "1:75344651679:web:65d27013f5e5d011e209aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const diseases = [
  {
    name: "البياض الدقيقي (Powdery Mildew)",
    type: "فطري",
    symptoms: "ظهور بقع بيضاء تشبه المسحوق الدقيقي على الأوراق الفتية والساق، مما يؤدي إلى تجعد الأوراق وتوقف نمو الشجرة وانخفاض جودة المحصول.",
    treatment: "تقليم الأجزاء المصابة فوراً وحرقها لتقليل العدوى، تحسين التهوية بين الأشجار، وتجنب الري الزائد. رش مبيدات فطرية متخصصة.",
    pesticideName: "توباس (Topas) أو كبريت ميكروني",
    pesticideIngredients: "Penconazole أو Sulfur",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Powdery_mildew_on_leaf.jpg/800px-Powdery_mildew_on_leaf.jpg",
    createdAt: Timestamp.now()
  },
  {
    name: "العناكب الحمراء (Red Spider Mites)",
    type: "آفة",
    symptoms: "اصفرار الأوراق وظهور بقع باهتة صغيرة جداً، وجود خيوط عنكبوتية دقيقة على السطح السفلي للورقة، جفاف الأوراق وتساقطها في حالات الإصابة الشديدة.",
    treatment: "رش الشجرة بالماء بضغط عالٍ لغسل العناكب كإجراء وقائي، التخلص من الأعشاب الضارة حول الشجرة، واستخدام مبيدات عناكب متخصصة (Acaricides).",
    pesticideName: "فيرتيميك (Vertimec)",
    pesticideIngredients: "أبامكتين (Abamectin)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tetranychus_urticae_on_leaf.jpg/800px-Tetranychus_urticae_on_leaf.jpg",
    createdAt: Timestamp.now()
  },
  {
    name: "نطاطات الأوراق (Leafhoppers)",
    type: "حشري",
    symptoms: "تجعد الأوراق واصفرار الحواف (التبقع الجانبي)، ضعف عام في نمو الأغصان الجديدة الغضة التي تُحصد (القات)، وتقزم الأوراق.",
    treatment: "استخدام مصائد لاصقة صفراء لتقليل الأعداد، تقليم الأغصان المصابة بشدة، الرش بمبيد حشري جهازي لضمان القضاء على الحشرة.",
    pesticideName: "كونفيدور (Confidor)",
    pesticideIngredients: "إيميداكلوبريد (Imidacloprid)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Empoasca_decipiens_01.jpg/800px-Empoasca_decipiens_01.jpg",
    createdAt: Timestamp.now()
  }
];

async function seed() {
  console.log("Starting to seed diseases...");
  for (const disease of diseases) {
    try {
      const docRef = await addDoc(collection(db, "Diseases"), disease);
      console.log(`Successfully added: ${disease.name} with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
