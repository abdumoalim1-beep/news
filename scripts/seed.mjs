import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "articles");
fs.mkdirSync(dir, { recursive: true });

const articles = [
  {
    id: "seed-1",
    title: "كيف تحلل نموذج عمل شركة في 20 دقيقة",
    excerpt: "طريقة عملية لفهم أي شركة بسرعة من خلال أربعة أسئلة أساسية.",
    category: "تحليل المنتجات",
    status: "published",
    date: "2026-07-02",
    readTime: "٦ دقائق",
    coverImage: null,
    thumbImage: null,
    ogImage: null,
    blocks: [
      { id: "b1", type: "p", html: 'عندما تُفتح صفحة شركة جديدة لأول مرة، أغلبنا يبدأ بالسؤال الخطأ: "هل هذا المنتج جيد؟". السؤال الأدق، والذي يوفّر عليك وقتًا طويلًا، هو: "كيف تكسب هذه الشركة المال، ومن أين يأتي نموها؟".' },
      { id: "b2", type: "h2", html: "١. من هو العميل الحقيقي؟" },
      { id: "b3", type: "p", html: "كثير من الشركات تخدم مستخدمًا واحدًا وتُموَّل من طرف آخر. تحديد من يدفع فعليًا هو أول خطوة لفهم أولويات الشركة." },
      { id: "b4", type: "h2", html: "٢. من أين يأتي الإيراد؟" },
      { id: "b5", type: "p", html: "اشتراكات، عمولة على المعاملات، إعلانات، أو ترخيص برمجي؛ كل نموذج إيرادات يفرض سلوكًا مختلفًا على الشركة." },
      { id: "b6", type: "quote", html: "فهم نموذج الإيراد يشرح لك تقريبًا كل قرار غريب تتخذه الشركة." },
      { id: "b7", type: "h2", html: "٣. ما الذي يمنع المنافسين من التكرار؟" },
      { id: "b8", type: "p", html: "السؤال الأخير هو عن الخندق الدفاعي: شبكة مستخدمين، بيانات متراكمة، تكلفة تبديل عالية، أو ميزة تقنية صعبة النسخ." },
    ],
  },
  {
    id: "seed-2",
    title: "الفخ الذي يقع فيه أغلب مؤسسي المنتجات الجديدة",
    excerpt: "لماذا يبدأ الكثيرون بالحل قبل أن يفهموا المشكلة فعليًا.",
    category: "المنتجات",
    status: "published",
    date: "2026-06-24",
    readTime: "٥ دقائق",
    coverImage: null,
    thumbImage: null,
    ogImage: null,
    blocks: [
      { id: "b1", type: "p", html: "الحماس تجاه فكرة الحل يجعل كثيرًا من المؤسسين يتجاوزون خطوة فهم المشكلة الحقيقية للعميل." },
      { id: "b2", type: "quote", html: "أفضل الحلول تولد من فهم عميق للمشكلة، لا من حماس تجاه أداة معينة." },
    ],
  },
  {
    id: "seed-3",
    title: "استراتيجية النمو التي اعتمدتها Notion في سنواتها الأولى",
    excerpt: "كيف حوّلت شركة صغيرة قاعدة مستخدمين محدودة إلى نمو عضوي كبير.",
    category: "الاستراتيجية",
    status: "published",
    date: "2026-06-10",
    readTime: "٨ دقائق",
    coverImage: null,
    thumbImage: null,
    ogImage: null,
    blocks: [
      { id: "b1", type: "p", html: "اعتمدت الشركة في بدايتها على بناء قاعدة من المستخدمين المتحمسين قبل التفكير بالتسويق المدفوع." },
    ],
  },
  {
    id: "seed-4",
    title: "لماذا تفشل أغلب الشركات الناشئة في سنتها الثانية",
    excerpt: "الأسباب المتكررة التي تظهر بعد أن يهدأ حماس الانطلاقة الأولى.",
    category: "الشركات الناشئة",
    status: "published",
    date: "2026-05-29",
    readTime: "٧ دقائق",
    coverImage: null,
    thumbImage: null,
    ogImage: null,
    blocks: [
      { id: "b1", type: "p", html: "أغلب حالات الفشل لا تأتي من نقص التمويل، بل من عدم وضوح من هو العميل الذي يستحق كل هذا الجهد." },
    ],
  },
  {
    id: "seed-5",
    title: "قراءة في نموذج الإيرادات لدى Figma",
    excerpt: "كيف بنت الشركة تسعيرًا يوازن بين النمو المجاني والإيرادات.",
    category: "تحليل المنتجات",
    status: "published",
    date: "2026-05-14",
    readTime: "٦ دقائق",
    coverImage: null,
    thumbImage: null,
    ogImage: null,
    blocks: [
      { id: "b1", type: "p", html: "التسعير على أساس التعاون بدلاً من الاستخدام الفردي جعل نمو الشركة يتماشى مع نمو الفرق نفسها." },
    ],
  },
];

for (const a of articles) {
  fs.writeFileSync(
    path.join(dir, `${a.id}.json`),
    JSON.stringify(a, null, 2) + "\n",
    "utf-8"
  );
}

console.log(`Seeded ${articles.length} articles into ${dir}`);
