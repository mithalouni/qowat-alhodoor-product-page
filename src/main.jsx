import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const chapters = [
  'من الداخل تبدأ القوة',
  'الثقة الهادئة',
  'كاريزما الحضور',
  'لغة التأثير',
  'قراءة الناس قبل أن يتكلموا',
  'الحدود التي تصنع الهيبة',
  'القيادة قبل المنصب',
  'النفوذ الخفي',
  'لا تكن ضحية سهلة',
  'حين تؤجل حياتك',
];

const benefits = [
  ['تبني ثقة لا تعتمد على رأي الناس', 'تتعلّم كيف تقف من الداخل قبل أن تظهر في الخارج.'],
  ['تفهم النفوذ والتأثير بوعي', 'تعرف متى تستخدم التأثير ومتى تحمي نفسك منه.'],
  ['تحسّن حضورك في العلاقات والعمل', 'كلام أوضح، حدود أهدأ، وقيادة بلا استعراض.'],
];

function App() {
  return (
    <main>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">كتاب عملي في بناء الشخصية والتأثير</p>
          <h1>قوة الحضور</h1>
          <p className="subtitle">دليل عملي لبناء الكاريزما والثقة والقيادة والتواصل وفهم النفوذ الخفي دون أن تفقد أخلاقك.</p>
          <div className="actions">
            <a className="primary" href="/qowat-alhodoor.pdf" target="_blank" rel="noreferrer">افتح الكتاب PDF</a>
            <a className="secondary" href="#content">ماذا ستتعلم؟</a>
          </div>
          <div className="stats" aria-label="معلومات الكتاب">
            <span><strong>280</strong> صفحة</span>
            <span><strong>17</strong> فصل</span>
            <span><strong>+100</strong> رسم وشرح بصري</span>
          </div>
        </div>
        <div className="bookCard" aria-label="غلاف كتاب قوة الحضور">
          <img src="/cover.jpg" alt="غلاف كتاب قوة الحضور" />
        </div>
      </section>

      <section id="content" className="section">
        <p className="sectionLabel">لمن هذا الكتاب؟</p>
        <h2>إذا كنت تريد حضورًا أقوى… لكن بدون تصنّع</h2>
        <div className="benefits">
          {benefits.map(([title, desc]) => (
            <article className="benefit" key={title}>
              <div className="icon">✦</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="sectionLabel">الفكرة الأساسية</p>
          <h2>الحضور ليس صوتًا عاليًا، بل بناء داخلي يظهر في الخارج.</h2>
        </div>
        <p className="copy">الكتاب يأخذك من الداخل إلى الخارج: من الثقة والاتزان، إلى اللغة والقيادة، ثم فهم النفوذ الخفي وحماية نفسك من التلاعب. بأسلوب عربي مباشر، وتصميم بصري قريب من هوية فيديوهاتك.</p>
      </section>

      <section className="section">
        <p className="sectionLabel">نظرة على الفصول</p>
        <h2>رحلة كاملة لبناء حضور واضح وهادئ</h2>
        <div className="chapters">
          {chapters.map((chapter, index) => (
            <div className="chapter" key={chapter}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {chapter}
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>ابدأ قراءة الكتاب الآن</h2>
        <p>نسخة PDF كاملة بتصميم عربي، خلفية هادئة، ورسوم توضيحية بأسلوب القناة.</p>
        <a className="primary" href="/qowat-alhodoor.pdf" target="_blank" rel="noreferrer">تحميل / فتح PDF</a>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
