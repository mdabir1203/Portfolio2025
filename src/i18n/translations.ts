export type Lang = 'en' | 'ar' | 'bn' | 'de';

export const SUPPORTED_LANGS: ReadonlyArray<Lang> = ['en', 'ar', 'bn', 'de'];

/**
 * Get the translation dictionary for `lang`, with English as a transparent
 * fallback. Any leaf missing in `lang` (or any partial sub-tree) reads through
 * to the English value, so components can access `tx.building.tags` etc.
 * without having to ship identical keys in every locale.
 */
function makeFallback(lang: Lang): unknown {
  const base = (translations as unknown as Record<Lang, unknown>).en;
  const over = (translations as unknown as Record<Lang, unknown>)[lang] || {};
  return mergeDeep(base, over);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeDeep(base: unknown, over: unknown): unknown {
  if (!isPlainObject(base)) return over ?? base;
  if (!isPlainObject(over)) return base;
  const out: Record<string, unknown> = { ...base };
  for (const k of Object.keys(over)) {
    const b = base[k];
    const o = over[k];
    out[k] = isPlainObject(b) && isPlainObject(o) ? mergeDeep(b, o) : o ?? b;
  }
  return out;
}

export function getTranslations(lang: Lang) {
  return makeFallback(lang) as typeof translations.en;
}

export const translations = {
  en: {
    nav: {
      available: 'AVAILABLE — Q3 2026',
      work: 'Work',
      stack: 'Stack',
      contact: 'Contact',
      resume: 'Resume',
      ats: 'ATS CV',
      langSwitch: 'عر',
    },
    hero: {
      tag: '// Creative Technologist · Dubai · 2026',
      pitch: 'Technology is valuable when it creates leverage — I help GCC founders, SMEs and enterprises turn emerging technologies into business advantage. Sense → Understand → Predict → Decide → Act → Measure → Learn.',
      emphasisWords: ['AI', 'workflows', 'predictable', 'ROI.'] as readonly string[],
      cta: "Let's Talk",
      linkedin: 'LinkedIn',
      location: 'Dubai, UAE · Open to KSA & remote',
      countries: '13 Countries',
      readers: '325K+ Global Readers',
    },
    portrait: {
      now: 'Now',
      role: 'CTA · Wavelink',
    },
    metrics: {
      m1tag: '// Engaze.ai integration',
      m1label: 'Faster payment processing for 50+ sellers at Deep Blue Digital.',
      m2tag: '// Midjourney × Zapier',
      m2label: 'Customer Acquisition Cost cut via AI-driven marketing automation.',
      m3tag: '// MTTR',
      m3label: 'Mean-time-to-resolution at HNM IT, Frankfurt — 99.9% uptime.',
    },
    building: {
      tag: '// Currently Building',
      period: '2025 — Present',
      title1: 'Wavelink — smart NFC networking.',
      title2: 'One tap. Zero paper. GDPR-compliant.',
      tags: ['GTM Strategy', 'Pipeline Design', 'Process Optimization', '100% Compliance'],
      cta: 'See case studies',
      explore: 'Explore Wavelink',
    },
    contact: {
      tag: "// Let's talk",
      brief: 'Send a brief',
    },
    capabilities: {
      tag: '// Capabilities',
      items: ['AI Agent Workflows', 'Process Automation', 'React / React Native', 'Rust / C / C++', 'Cross-cultural GTM'],
    },
    path: {
      tag: '// Path',
      items: [
        ['25→', 'Wavelink · CTA'],
        ['24→', 'Deep Blue Digital · Co-Founder'],
        ['23→', 'HNM IT · Frankfurt'],
        ['22→', '42 Wolfsburg · C/C++'],
        ['22→', 'phaeno gGmbH · Robotics Mentor'],
      ] as [string, string][],
    },
    spoken: {
      tag: '// Spoken',
      langs: [
        { l: 'EN', s: 'IELTS 7.5' },
        { l: 'BN', s: 'Native' },
        { l: 'DE', s: 'Goethe A2' },
      ],
    },
    recognition: {
      tag: '// Recognition',
      items: [
        { name: 'RedAGPT', sub: 'Redis Side Quest Winner' },
        { name: 'SmartSwap', sub: 'MIT Hacknation 2026 — Next Best' },
      ],
    },
    abayatrack: {
      tag: '// GCC Manufacturing · AbayaTrack',
      title1: 'Famous Ladies Gowns',
      title2: 'Tailoring LLC',
      desc: 'Deployed end-to-end production visibility (AbayaTrack) across a GCC abaya factory — mobile time-tracking per unit, real-time bottleneck detection, zero additional headcount.',
      cta: 'Full case study',
      metrics: [
        { v: '+38%', l: 'Production output', tone: 'amber' },
        { v: '−30%', l: 'Cycle time', tone: 'lime' },
        { v: '92%', l: 'On-time delivery', tone: 'teal' },
        { v: '0', l: 'Extra hires needed', tone: 'amber' },
      ] as { v: string; l: string; tone: 'amber' | 'lime' | 'teal' }[],
    },
    gcc: {
      tag: '// Executive · Based in GCC',
      items: [
        'Cross-cultural GTM — 13 countries',
        'Arabic market · GCC operations',
        'GDPR + compliance-first leadership',
        'Co-founder P&L ownership',
        'EN / BN / DE · UAE · KSA · Qatar',
      ],
      cta: 'Reach Out — GCC Roles',
    },
    recruiter: {
      tag: '// For Recruiters',
      title1: 'Looking for',
      title2: 'a clean CV?',
      desc: 'Download a simple, ATS-optimized version of my professional experience.',
      cta: 'Download DOC CV',
    },
    footer: {
      rights: '© 2026 — Abir Abbas',
      tagline: 'Everlasting growth and adaptibility.',
    },
    mobileCta: "Let's Talk",
    chat: {
      tag: '// Ask Abir',
      placeholder: 'Ask about my work, skills, or projects…',
      send: 'Send',
      typing: 'Thinking…',
      loading: '~300 MB · cached after first load',
      error: 'WebGPU not supported. Try Chrome 121+ or Edge.',
      greeting: "Hey 👋 I'm Abir's AI — running fully in your browser (yes, really). Ask me about his work, the numbers behind it, or just what makes him different. I'll be straight with you.",
    },
    personality: {
      navLabel: 'Personality',
      eyebrow: '// 06 — the personality',
      mbti: 'Myers–Briggs Type Indicator',
      headlineLead: 'Four letters I have answered to on every',
      headlineAccent: 'Myers–Briggs',
      headlineTail: 'test since 2017.',
      headlineDayOne: 'Sixteen photos that show up on day one.',
      subhead:
        "The letters aren't a label. They're a working pattern — how I run a room, why I write the README first, who I sit next to at dinner, and which decisions I ship without a meeting. Scroll on. The sixteen frames below speak for themselves.",
      dialEyebrow: '// Pick a letter — the strip changes with you',
      dialLegend: 'ENFP · 4 of 4',
      dialHint: 'to switch letters · the strip below updates with the active one',
      strip: {
        eyebrow: '// 06 — the recruiter’s answer',
        headlineLead: 'Who shows up on',
        headlineAccent: 'day one',
        headlineTail: '.',
        valueProp: 'ENFP on every test. 16 photos. 4 letters. The full picture.',
        closing:
          "The 16 photos that show up on day one — not the persona, the person.",
        roles: '— open to roles in Dubai · Abu Dhabi · Riyadh · NEOM · remote',
        polaroids: '16 polaroids',
        scroll: 'scroll →',
      },
      footer: '— 16 photos · 4 dimensions · 0 personas',
    },
    splash: {
      eyebrow: '// 00 — the opener',
      attribution: '— the page you’ve just opened',
      skipCta: 'Enter the site →',
      ariaSkip: 'Skip opener — dismiss splash',
    },
    manifesto: {
      eyebrow: '// the story',
      chapters: {
        who: { roman: 'I',   title: 'Who',  blurb: 'the work' },
        how: { roman: 'II',  title: 'How',  blurb: 'the mind' },
        why: { roman: 'III', title: 'Why',  blurb: 'the proof' },
        now: { roman: 'IV',  title: 'Now',  blurb: 'the next step' },
      },
      scrollHint: 'scroll ↓',
      ariaLabel: 'Story chapters',
    },
  },
  ar: {
    nav: {
      available: 'متاح — الربع الثالث 2026',
      work: 'الأعمال',
      stack: 'التقنيات',
      contact: 'تواصل',
      resume: 'السيرة الذاتية',
      ats: 'سيرة ATS',
      langSwitch: 'EN',
    },
    hero: {
      tag: '// تقني مبدع · دبي · 2026',
      pitch: 'التقنية قيّمة عندما تصنع رافعة — أساعد المؤسسين والشركات الصغيرة والمتوسطة والمؤسسات في الخليج على تحويل التقنيات الناشئة إلى ميزة تجارية. استشعر → افهم → توقّع → قرّر → تصرّف → قِس → تعلّم.',
      emphasisWords: ['التقنية', 'رافعة', 'ميزة', 'تعلّم.'] as readonly string[],
      cta: 'لنتحدث',
      linkedin: 'لينكد إن',
      location: 'دبي، الإمارات · متاح في السعودية وعبر العمل عن بُعد',
      countries: '13 دولة',
      readers: '+325 ألف قارئ عالمي',
    },
    portrait: {
      now: 'الآن',
      role: 'مستشار تقني · Wavelink',
    },
    metrics: {
      m1tag: '// تكامل Engaze.ai',
      m1label: 'أسرع في معالجة المدفوعات لـ 50+ بائعاً في Deep Blue Digital.',
      m2tag: '// Midjourney × Zapier',
      m2label: 'انخفاض تكلفة اكتساب العملاء عبر أتمتة التسويق بالذكاء الاصطناعي.',
      m3tag: '// متوسط وقت الاستجابة',
      m3label: 'انخفاض وقت الحل في HNM IT، فرانكفورت — وقت تشغيل 99.9%.',
    },
    building: {
      tag: '// أبني الآن',
      period: '2025 — الحاضر',
      title1: 'Wavelink — شبكات NFC الذكية.',
      title2: 'لمسة واحدة. بلا ورق. متوافق مع GDPR.',
      tags: ['استراتيجية GTM', 'تصميم خطوط الأعمال', 'تحسين العمليات', 'امتثال 100%'],
      cta: 'اطلع على دراسات الحالة',
      explore: 'استكشف Wavelink',
    },
    contact: {
      tag: '// لنتحدث',
      brief: 'أرسل ملخصاً',
    },
    capabilities: {
      tag: '// الكفاءات',
      items: ['سير عمل وكلاء الذكاء الاصطناعي', 'أتمتة العمليات', 'React / React Native', 'Rust / C / C++', 'الذهاب للسوق عبر الثقافات'],
    },
    path: {
      tag: '// المسيرة',
      items: [
        ['25→', 'Wavelink · مستشار تقني'],
        ['24→', 'Deep Blue Digital · شريك مؤسس'],
        ['23→', 'HNM IT · فرانكفورت'],
        ['22→', '42 Wolfsburg · C/C++'],
        ['22→', 'phaeno gGmbH · مرشد روبوتيات'],
      ] as [string, string][],
    },
    spoken: {
      tag: '// اللغات',
      langs: [
        { l: 'EN', s: 'IELTS 7.5' },
        { l: 'BN', s: 'لغة أم' },
        { l: 'DE', s: 'Goethe A2' },
      ],
    },
    recognition: {
      tag: '// الجوائز',
      items: [
        { name: 'RedAGPT', sub: 'فائز بـ Redis Side Quest' },
        { name: 'SmartSwap', sub: 'MIT Hacknation 2026 — الأفضل التالي' },
      ],
    },
    abayatrack: {
      tag: '// تصنيع الخليج · AbayaTrack',
      title1: 'Famous Ladies Gowns',
      title2: 'Tailoring LLC',
      desc: 'طرحنا رؤية شاملة للإنتاج (AbayaTrack) في مصنع عباءات بالخليج — تتبع وقت التصنيع لكل وحدة على الهاتف، وكشف الاختناقات فورياً، بدون موظفين إضافيين.',
      cta: 'دراسة الحالة الكاملة',
      metrics: [
        { v: '+38%', l: 'إنتاجية المصنع', tone: 'amber' },
        { v: '−30%', l: 'وقت الدورة', tone: 'lime' },
        { v: '92%', l: 'التسليم في الوقت', tone: 'teal' },
        { v: '0', l: 'توظيف إضافي', tone: 'amber' },
      ] as { v: string; l: string; tone: 'amber' | 'lime' | 'teal' }[],
    },
    gcc: {
      tag: '// تنفيذي · مقيم في الخليج',
      items: [
        'الذهاب للسوق عبر الثقافات — 13 دولة',
        'السوق العربي · عمليات الخليج',
        'قيادة تمتثل لـ GDPR أولاً',
        'ملكية الأرباح والخسائر كمؤسس مشارك',
        'EN / BN / DE · الإمارات · السعودية · قطر',
      ],
      cta: 'تواصل — وظائف الخليج',
    },
    recruiter: {
      tag: '// للمجندين',
      title1: 'تبحث عن',
      title2: 'سيرة ذاتية؟',
      desc: 'نسخة مبسطة ومحسّنة لأنظمة الاختيار الآلي من تجربتي المهنية.',
      cta: 'تحميل السيرة الذاتية',
    },
    footer: {
      rights: '© 2026 — أبير عباس',
      tagline: 'نمو دائم وقدرة على التكيف.',
    },
    mobileCta: 'لنتحدث',
    chat: {
      tag: '// اسأل أبير',
      placeholder: 'اسأل عن مشاريعي أو مهاراتي…',
      send: 'إرسال',
      typing: 'أفكر…',
      loading: '~300 ميجابايت · يُخزَّن بعد أول تحميل',
      error: 'المتصفح لا يدعم WebGPU. جرّب Chrome 121+ أو Edge.',
      greeting: 'أهلاً 👋 أنا ذكاء أبير الاصطناعي — شغّال في متصفحك مباشرة (أيوه، بجد). اسألني عن شغله أو الأرقام اللي وراه أو وش يميّزه. بكون صريح معك.',
    },
  },
  // ───────────────────────────────────────────────────────────────────────
  // Bengali (bn) — native for the founder. Light, conversational.
  // ───────────────────────────────────────────────────────────────────────
  bn: {
    nav: {
      available: 'পাওয়া যাচ্ছে — Q3 2026',
      work: 'কাজ',
      stack: 'স্ট্যাক',
      contact: 'যোগাযোগ',
      resume: 'রিজিউমে',
      ats: 'ATS সিভি',
      langSwitch: 'EN',
    },
    hero: {
      tag: '// AI আর্কিটেক্ট · দুবাই · 2026',
      pitch: 'আমি এমন AI ওয়ার্কফ্লো স্থাপন করি যা এন্টারপ্রাইজ সম্পদ রক্ষা করে এবং হাজার হাজার ইঞ্জিনিয়ারিং ঘণ্টা ফিরিয়ে আনে — "জাদু" প্রযুক্তিকে পূর্বানুমানযোগ্য ROI-তে রূপান্তর করি।',
      emphasisWords: ['AI', 'ওয়ার্কফ্লো', 'পূর্বানুমানযোগ্য', 'ROI'] as readonly string[],
      cta: 'যোগাযোগ করুন',
      linkedin: 'লিঙ্কডইন',
      location: 'দুবাই, UAE · KSA ও রিমোটে উন্মুক্ত',
      countries: '১৩টি দেশ',
      readers: '৩২৫K+ বিশ্বব্যাপী পাঠক',
    },
    portrait: {
      now: 'এখন',
      role: 'CTA · ওয়েভলিংক',
    },
    metrics: {
      m1tag: '// Engaze.ai ইন্টিগ্রেশন',
      m1label: 'ডিপ ব্লু ডিজিটালে ৫০+ বিক্রেতার জন্য দ্রুত পেমেন্ট প্রসেসিং।',
      m2tag: '// Midjourney × Zapier',
      m2label: 'AI-চালিত মার্কেটিং অটোমেশনের মাধ্যমে গ্রাহক অর্জন খরচ কমানো।',
      m3tag: '// MTTR',
      m3label: 'HNM IT, ফ্রাঙ্কফুর্ট — ৯৯.৯% আপটাইম।',
    },
    building: {
      tag: '// বর্তমানে নির্মাণাধীন',
      period: '২০২৫ — বর্তমান',
      title1: 'ওয়েভলিংক — স্মার্ট NFC নেটওয়ার্কিং।',
      title2: 'আবায়া ট্র্যাক — প্রোডাকশন ভিজিবিলিটি।',
    },
    story: {
      tag: '// গল্প',
      h: 'AED ১১১K পুনরুদ্ধার, ১১.১:১ V:C।',
      p1: 'দুবাইয়ের একটি আবায়া কারখানায় আমি একটি ভ্যালু-ওয়েটেড ডেলিভারি ড্যাশবোর্ড তৈরি করেছি যা ৩০ দিনে AED ১১১,২৪৬ আটকে থাকা ব্যাকলগ বের করেছে।',
      p2: 'উৎপাদন +৩৮%, সাইকেল টাইম −৩০%, সময়মতো ডেলিভারি ৬৫% → ৯২% — অতিরিক্ত কর্মী ছাড়াই।',
    },
    capabilities: {
      tag: '// সক্ষমতা',
      h: 'AI আর্কিটেকচার থেকে ডেলিভারি পর্যন্ত।',
      items: [
        'AI এজেন্ট ওয়ার্কফ্লো · Langchain · AutoGPT',
        'React, React Native, TypeScript',
        'Cloudflare Workers · Edge AI',
        'Rust, C, C++',
        'প্রসেস অটোমেশন · ROI মডেলিং',
      ],
    },
    path: {
      tag: '// পথ',
      h: 'হানোভার থেকে উপসাগর পর্যন্ত।',
    },
    press: {
      tag: '// প্রেস',
      h: 'যা বলা হচ্ছে।',
    },
    contact: {
      tag: '// যোগাযোগ',
      h: 'চলুন কথা বলি।',
      lead: 'আমি সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই।',
      name: 'আপনার নাম',
      email: 'ইমেইল',
      msg: 'আপনার বার্তা',
      send: 'পাঠান',
      cta: 'এখনই বুক করুন — GCC রোল',
    },
    footer: {
      copyright: '© ২০২৬ মোহাম্মদ আবির আব্বাস · দুবাই, UAE',
    },
    chat: {
      placeholder: 'AI ডেমো লোড হচ্ছে…',
      typing: 'ভাবছি…',
      loading: '~৩০০ MB · প্রথম লোডের পর ক্যাশ হবে',
      error: 'আপনার ব্রাউজার WebGPU সমর্থন করে না। Chrome 121+ বা Edge ব্যবহার করুন।',
      greeting: 'আসসালামু আলাইকুম 👋 আমি আবিরের AI — আপনার ব্রাউজারে সরাসরি চলছে (হ্যাঁ, সত্যিই)। তাঁর কাজ, পেছনের সংখ্যা, বা কীভাবে তিনি ভিন্ন — যেকোনো কিছু জিজ্ঞাসা করুন। আমি সৎ থাকব।',
    },
  },
  // ───────────────────────────────────────────────────────────────────────
  // German (de) — formal "Sie" for German, the founder lived in Wolfsburg/Frankfurt.
  // ───────────────────────────────────────────────────────────────────────
  de: {
    nav: {
      available: 'VERFÜGBAR — Q3 2026',
      work: 'Arbeit',
      stack: 'Stack',
      contact: 'Kontakt',
      resume: 'Lebenslauf',
      ats: 'ATS-Lebenslauf',
      langSwitch: 'EN',
    },
    hero: {
      tag: '// KI-ARCHITEKT · DUBAI · 2026',
      pitch: 'Ich implementiere KI-Workflows, die Unternehmenswerte schützen und tausende Engineering-Stunden zurückgewinnen — aus „Magie" wird vorhersagbarer ROI.',
      emphasisWords: ['KI', 'Workflows', 'vorhersagbarer', 'ROI'] as readonly string[],
      cta: 'Kontakt',
      linkedin: 'LinkedIn',
      location: 'Dubai, VAE · Offen für KSA & Remote',
      countries: '13 Länder',
      readers: '325K+ Leser weltweit',
    },
    portrait: {
      now: 'Jetzt',
      role: 'CTA · Wavelink',
    },
    metrics: {
      m1tag: '// Engaze.ai-Integration',
      m1label: 'Schnellere Zahlungsabwicklung für 50+ Verkäufer bei Deep Blue Digital.',
      m2tag: '// Midjourney × Zapier',
      m2label: 'Customer Acquisition Cost durch KI-gesteuerte Marketing-Automatisierung gesenkt.',
      m3tag: '// MTTR',
      m3label: 'HNM IT, Frankfurt — 99,9 % Uptime.',
    },
    building: {
      tag: '// IN ARBEIT',
      period: '2025 — heute',
      title1: 'Wavelink — Smart-NFC-Netzwerk.',
      title2: 'AbaYa-Track — Produktions-Transparenz.',
    },
    story: {
      tag: '// STORY',
      h: 'AED 111K zurückgewonnen, 11,1:1 V:C.',
      p1: 'In einer Abaya-Fabrik in Dubai habe ich ein wertgewichtetes Liefer-Dashboard gebaut, das in 30 Tagen AED 111.246 verstauten Backlog freilegte.',
      p2: 'Produktion +38 %, Durchlaufzeit −30 %, pünktliche Lieferung 65 % → 92 % — ohne zusätzliche Mitarbeiter.',
    },
    capabilities: {
      tag: '// KOMPETENZEN',
      h: 'Vom KI-Architekturentwurf bis zur Auslieferung.',
      items: [
        'KI-Agent-Workflows · Langchain · AutoGPT',
        'React, React Native, TypeScript',
        'Cloudflare Workers · Edge-KI',
        'Rust, C, C++',
        'Prozessautomatisierung · ROI-Modellierung',
      ],
    },
    path: {
      tag: '// WEG',
      h: 'Von Wolfsburg in den Golf.',
    },
    press: {
      tag: '// PRESSE',
      h: 'Was andere sagen.',
    },
    contact: {
      tag: '// KONTAKT',
      h: 'Lassen Sie uns sprechen.',
      lead: 'Ich antworte in der Regel innerhalb von 24 Stunden.',
      name: 'Ihr Name',
      email: 'E-Mail',
      msg: 'Ihre Nachricht',
      send: 'Senden',
      cta: 'Jetzt buchen — GCC-Rollen',
    },
    footer: {
      copyright: '© 2026 Mohammad Abir Abbas · Dubai, VAE',
    },
    chat: {
      placeholder: 'KI-Demo wird geladen…',
      typing: 'Ich denke…',
      loading: '~300 MB · wird nach dem ersten Laden zwischengespeichert',
      error: 'Ihr Browser unterstützt kein WebGPU. Versuchen Sie Chrome 121+ oder Edge.',
      greeting: 'Hallo 👋 ich bin Abirs KI — sie läuft direkt in Ihrem Browser (ja, wirklich). Fragen Sie mich nach seiner Arbeit, den Zahlen dahinter oder was ihn ausmacht. Ich bleibe ehrlich.',
    },
  },
} as const;
