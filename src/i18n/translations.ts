export type Lang = 'en' | 'ar';

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
      tag: '// Creative Technologist · 2026',
      pitch: 'I deploy AI workflows that protect enterprise assets and recapture thousands of engineering hours — turning "magic" tech into predictable ROI.',
      cta: "Let's Talk",
      linkedin: 'LinkedIn',
      location: 'Ajman, UAE · Open across GCC',
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
      tag: '// مبتكر تقني · 2026',
      pitch: 'أطرح سير عمل الذكاء الاصطناعي التي تحمي أصول المؤسسات وتستعيد آلاف ساعات الهندسة — محوّلاً التقنية السحرية إلى عائد استثمار متوقع.',
      cta: 'لنتحدث',
      linkedin: 'لينكد إن',
      location: 'عجمان، الإمارات · متاح في دول الخليج',
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
  },
} as const;
