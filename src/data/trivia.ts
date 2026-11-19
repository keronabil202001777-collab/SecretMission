export interface QuestionItem {
  id: string;
  category: 'football' | 'media' | 'general' | 'true-false' | 'math' | 'emoji';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export const QUESTION_BANK: Record<string, QuestionItem[]> = {
  // 1. كورة عالمية ودوري أبطال
  football: [
    {
      id: 'f-1',
      category: 'football',
      question: 'مين أكتر نادي حقق لقب دوري أبطال أوروبا في التاريخ؟',
      options: ['ريال مدريد', 'ميلان', 'بايرن ميونخ', 'ليفربول'],
      correctAnswer: 'ريال مدريد',
    },
    {
      id: 'f-2',
      category: 'football',
      question: 'مين الهداف التاريخي لبطولات كأس العالم عبر التاريخ؟',
      options: ['ميروسلاف كلوزه', 'رونالدو الظاهرة', 'ميسي', 'بيليه'],
      correctAnswer: 'ميروسلاف كلوزه',
    },
    {
      id: 'f-3',
      category: 'football',
      question: 'مين النادي الإنجليزي الوحيد اللي فاز بالدوري الذهبي بدون أي هزيمة؟',
      options: ['أرسنال', 'مانشستر يونايتد', 'مانشستر سيتي', 'تشيلسي'],
      correctAnswer: 'أرسنال',
    },
    {
      id: 'f-4',
      category: 'football',
      question: 'في أي نادي يلعب كيليان مبابي حالياً؟',
      options: ['ريال مدريد', 'باريس سان جيرمان', 'مانشستر سيتي', 'بايرن ميونخ'],
      correctAnswer: 'ريال مدريد',
    },
    {
      id: 'f-5',
      category: 'football',
      question: 'مين سجل مقصية نهائي دوري أبطال أوروبا الشهيرة عام 2018 ضد ليفربول؟',
      options: ['جاريث بيل', 'كريستيانو رونالدو', 'كريم بنزيما', 'سيرجيو راموس'],
      correctAnswer: 'جاريث بيل',
    },
    {
      id: 'f-6',
      category: 'football',
      question: 'كام مرة فازت البرازيل ببطولة كأس العالم؟',
      options: ['٥ مرات', '٤ مرات', '٦ مرات', '٣ مرات'],
      correctAnswer: '٥ مرات',
    },
    {
      id: 'f-7',
      category: 'football',
      question: 'مين مدرب مانشستر سيتي الحالي؟',
      options: ['بيب جوارديولا', 'يورجن كلوب', 'أنشيلوتي', 'مورينيو'],
      correctAnswer: 'بيب جوارديولا',
    },
  ],

  // 2. مسلسلات وأفلام وأغاني مصرية
  media: [
    {
      id: 'm-1',
      category: 'media',
      question: 'كمل إفيه عادل إمام الشهير في شاهد ما شفش حاجة: "متعودة...."',
      options: ['دايماً', 'سهرانة', 'تنام بدري', 'تضحك'],
      correctAnswer: 'دايماً',
    },
    {
      id: 'm-2',
      category: 'media',
      question: 'مين بطل فيلم "صعيدي في الجامعة الأمريكية"؟',
      options: ['محمد هنيدي', 'أحمد حلمي', 'أحمد السقا', 'كريم عبد العزيز'],
      correctAnswer: 'محمد هنيدي',
    },
    {
      id: 'm-3',
      category: 'media',
      question: 'كمل مطلع أغنية ويجز الشهيرة "البخت": "عيني منها بشكل...."',
      options: ['جدي', 'رسمي', 'يومي', 'عادي'],
      correctAnswer: 'جدي',
    },
    {
      id: 'm-4',
      category: 'media',
      question: 'أحمد حلمي في فيلم "كده رضا" كان عنده كام شخصية توأم؟',
      options: ['٣ شخصيات', 'شخصيتين', '٤ شخصيات', 'شخصية واحدة'],
      correctAnswer: '٣ شخصيات',
    },
    {
      id: 'm-5',
      category: 'media',
      question: 'مين قال الجملة الأيقونية: "أنا لا أكذب ولكني أتجمل"؟',
      options: ['أحمد زكي', 'عادل إمام', 'محمود عبد العزيز', 'نور الشريف'],
      correctAnswer: 'أحمد زكي',
    },
    {
      id: 'm-6',
      category: 'media',
      question: 'اسم شخصية كريم عبد العزيز في فيلم "الفيل الأزرق"؟',
      options: ['د. يحيى راشد', 'شريف', 'رضا', 'سالم'],
      correctAnswer: 'د. يحيى راشد',
    },
    {
      id: 'm-7',
      category: 'media',
      question: 'كمل إفيه محمد سعد الشهير في اللمبي: "يا عم عم...."',
      options: ['الجمال دلال', 'الروقان', 'الحلوين', 'الناس'],
      correctAnswer: 'الجمال دلال',
    },
  ],

  // 3. معلومات عامة وسريعة
  general: [
    {
      id: 'g-1',
      category: 'general',
      question: 'ما هي عاصمة أستراليا الحقيقية؟',
      options: ['كانبرا', 'سيدني', 'ملبورن', 'بيرث'],
      correctAnswer: 'كانبرا',
    },
    {
      id: 'g-2',
      category: 'general',
      question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
      options: ['المشتري', 'زحل', 'الأرض', 'المريخ'],
      correctAnswer: 'المشتري',
    },
    {
      id: 'g-3',
      category: 'general',
      question: 'كم عدد قارات العالم المعترف بها؟',
      options: ['٧', '٦', '٥', '٨'],
      correctAnswer: '٧',
    },
    {
      id: 'g-4',
      category: 'general',
      question: 'ما هو الحيوان الأسرع على اليابسة في العالم؟',
      options: ['الفهد الصياد', 'الأسد', 'الغزال', 'الحصان'],
      correctAnswer: 'الفهد الصياد',
    },
    {
      id: 'g-5',
      category: 'general',
      question: 'كم عدد أضلاع المثلث؟',
      options: ['٣', '٤', '٥', '٦'],
      correctAnswer: '٣',
    },
  ],

  // 4. صح ولا هبد؟ (True or False)
  'true-false': [
    {
      id: 'tf-1',
      category: 'true-false',
      question: 'الفراولة تصنف نباتياً كنوع من أنواع المكسرات مش التوت!',
      options: ['صح', 'هبد'],
      correctAnswer: 'صح',
    },
    {
      id: 'tf-2',
      category: 'true-false',
      question: 'الأخطبوط عنده ٣ قلوب ودمه لونه أزرق!',
      options: ['صح', 'هبد'],
      correctAnswer: 'صح',
    },
    {
      id: 'tf-3',
      category: 'true-false',
      question: 'سور الصين العظيم هو الشيء البشري الوحيد المرئي بالعين المجردة من القمر!',
      options: ['صح', 'هبد'],
      correctAnswer: 'هبد',
    },
    {
      id: 'tf-4',
      category: 'true-false',
      question: 'الفلفل الحار بيحرق لسان الطيور زي البني آدمين بالظبط!',
      options: ['صح', 'هبد'],
      correctAnswer: 'هبد',
    },
    {
      id: 'tf-5',
      category: 'true-false',
      question: 'الزرافة بتنام في المتوسط حوالي ٣٠ دقيقة بس في اليوم كله!',
      options: ['صح', 'هبد'],
      correctAnswer: 'صح',
    },
    {
      id: 'tf-6',
      category: 'true-false',
      question: 'الذهب ممكن يتاكل ومش سام ومفيش منه ضرر على المعدة!',
      options: ['صح', 'هبد'],
      correctAnswer: 'صح',
    },
  ],

  // 5. حساب سريع (Quick Math)
  math: [
    { id: 'qm-1', category: 'math', question: '١٢ × ٤ = كام؟', options: ['٤٨', '٤٤', '٥٢', '٤٦'], correctAnswer: '٤٨' },
    { id: 'qm-2', category: 'math', question: '٩٩ - ٤٥ = كام؟', options: ['٥٤', '٤٤', '٥٥', '٥٦'], correctAnswer: '٥٤' },
    { id: 'qm-3', category: 'math', question: '٧ × ٨ = كام؟', options: ['٥٦', '٥٤', '٥٨', '٦٢'], correctAnswer: '٥٦' },
    { id: 'qm-4', category: 'math', question: '١٥٠ ÷ ٥ = كام؟', options: ['٣٠', '٢٥', '٣٥', '٢٠'], correctAnswer: '٣٠' },
    { id: 'qm-5', category: 'math', question: '٦٥ + ٣٨ = كام؟', options: ['١٠٣', '١٠١', '٩٨', '١٠٥'], correctAnswer: '١٠٣' },
  ],

  // 6. ألغاز الإيموجي (Emoji Riddles)
  emoji: [
    { id: 'er-1', category: 'emoji', question: 'خمن اسم الفيلم: 🦁 👑', options: ['الأسد الملك', 'النمر والأنثى', 'ملك الغابة', 'الفيل الأزرق'], correctAnswer: 'الأسد الملك' },
    { id: 'er-2', category: 'emoji', question: 'خمن اسم الفيلم المصري: 🐘 🔵', options: ['الفيل الأزرق', 'طير إنت', 'صعيدي في الجامعة', 'الجزيرة'], correctAnswer: 'الفيل الأزرق' },
    { id: 'er-3', category: 'emoji', question: 'خمن المثل الشعبي: 🪱 🍎', options: ['دود المش منه فيه', 'تفاحة آدم', 'عصفور في اليد', 'رجعت ريمة'], correctAnswer: 'دود المش منه فيه' },
    { id: 'er-4', category: 'emoji', question: 'خمن الفيلم الشهير: 🚢 💔 ❄️', options: ['تيتانيك', 'المركب', 'القبطان', 'القرش'], correctAnswer: 'تيتانيك' },
    { id: 'er-5', category: 'emoji', question: 'خمن مثل شعبي: 🐒 👀 🦌', options: ['القرد في عين أمه غزال', 'عصفورين بحجر', 'يا واخد القرد', 'القرود التلاتة'], correctAnswer: 'القرد في عين أمه غزال' },
  ],

  // 7. طلع المختلف (Odd One Out)
  'odd-one-out': [
    { id: 'ooo-1', category: 'general', question: 'مين العنصر المختلف في المجموعة؟', options: ['كباب', 'كفتة', 'شاورما', 'شاي بلبن'], correctAnswer: 'شاي بلبن' },
    { id: 'ooo-2', category: 'general', question: 'مين اللاعب اللي مش بيلعب هجوم؟', options: ['محمد صلاح', 'هالاند', 'فيرجيل فان دايك', 'ميسي'], correctAnswer: 'فيرجيل فان دايك' },
    { id: 'ooo-3', category: 'general', question: 'مين المعلم اللي مش موجود في مصر؟', options: ['الأهرامات', 'برج القاهرة', 'تمثال الحرية', 'خان الخليلي'], correctAnswer: 'تمثال الحرية' },
    { id: 'ooo-4', category: 'general', question: 'مين المطرب اللي مش من جيل الراب المعاصر؟', options: ['ويجز', 'مروان بابلو', 'عفروتو', 'عبد الحليم حافظ'], correctAnswer: 'عبد الحليم حافظ' },
    { id: 'ooo-5', category: 'general', question: 'مين الشيء اللي مش سائل في دول؟', options: ['بيبسي', 'قهوة', 'طعمية سخنة', 'عصير قصب'], correctAnswer: 'طعمية سخنة' },
  ],

  // 8. الهبدة الكبيرة (Big Fat Lie - 3 كدبات وحقيقة واحدة غريبة جداً!)
  'big-fat-lie': [
    {
      id: 'bfl-1',
      category: 'general',
      question: 'أي جملة من دول هي الحقيقة الوحيدة وسط ٣ كدبات؟',
      options: [
        'العسل الطبيعي مش بيفسد ولا يعفن أبداً لآلاف السنين!',
        'الجمال بتخزن مياه شرب جوا السنام بتاعها.',
        'الخفافيش عمياء تماماً ومبتشوفش بالعين خالص.',
        'سمك القرش بيموت لو نام أكتر من ٥ دقايق.'
      ],
      correctAnswer: 'العسل الطبيعي مش بيفسد ولا يعفن أبداً لآلاف السنين!'
    },
    {
      id: 'bfl-2',
      category: 'general',
      question: 'أي معلومة من دول هي الحقيقة العلمية المؤكدة؟',
      options: [
        'الموز نباتياً يعتبر نوع من أنواع الأعشاب العملاقة!',
        'الفئران بتعشق الجبنة أكتر من أي أكل تاني.',
        'أينشتاين سقط في امتحان مادة الرياضيات وهو طفل.',
        'البشر بيستخدموا ١٠٪ بس من خلايا مخهم.'
      ],
      correctAnswer: 'الموز نباتياً يعتبر نوع من أنواع الأعشاب العملاقة!'
    },
    {
      id: 'bfl-3',
      category: 'general',
      question: 'أي معلومة كروية هي الحقيقة الوحيدة؟',
      options: [
        'كريستيانو رونالدو سجل في كل دقيقة من الدقيقة ١ لحد ٩٠!',
        'ميسي مخدش ولا كارت أحمر في تاريخه كله.',
        'البرازيل لعبت في كل نهائيات كأس العالم.',
        'الأهلي فاز بالدوري الممتاز بدون أي تعادل في تاريخه.'
      ],
      correctAnswer: 'كريستيانو رونالدو سجل في كل دقيقة من الدقيقة ١ لحد ٩٠!'
    }
  ],

  // 9. أقرب تخمين (Close Call)
  'close-call': [
    { id: 'cc-1', category: 'general', question: 'طول نهر النيل كام كيلومتر تقريباً؟', options: ['٦٦٥٠ كم', '٤٢٠٠ كم', '٨٥٠٠ كم', '٥١٠٠ كم'], correctAnswer: '٦٦٥٠ كم' },
    { id: 'cc-2', category: 'general', question: 'سنة كام افتتحت قناة السويس للملاحة؟', options: ['١٨٦٩', '١٩١٤', '١٨٠٥', '١٩٥٦'], correctAnswer: '١٨٦٩' },
    { id: 'cc-3', category: 'general', question: 'كام دورة بيلفها كوكب الأرض حول الشمس في القرن؟', options: ['١٠٠ دورة', '٥٠ دورة', '٣٦٥ دورة', '١٢ دورة'], correctAnswer: '١٠٠ دورة' },
    { id: 'cc-4', category: 'general', question: 'كم عدد عظام جسم الإنسان البالغ؟', options: ['٢٠٦ عظمة', '١٨٠ عظمة', '٢٥٠ عظمة', '٣٠٠ عظمة'], correctAnswer: '٢٠٦ عظمة' },
  ]
};
