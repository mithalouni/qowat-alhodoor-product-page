import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const story = [
  {
    img: '/story/inside.jpg',
    tag: '01',
    title: 'ابدأ من الداخل',
    text: 'قبل الكاريزما والثقة، تحتاج بناء داخلي يثبتك وقت الضغط.',
  },
  {
    img: '/story/confidence.jpg',
    tag: '02',
    title: 'ثقة هادئة',
    text: 'ثقة لا تحتاج صوت عالي، ولا تنهار من رأي أو رفض أو مقارنة.',
  },
  {
    img: '/story/influence.jpg',
    tag: '03',
    title: 'افهم النفوذ',
    text: 'تعرف كيف تتحرك الإطارات، التكرار، والندرة داخل عقل الناس.',
  },
  {
    img: '/story/protection.jpg',
    tag: '04',
    title: 'احمِ نفسك',
    text: 'تتعلم تلاحظ الضغط والتلاعب والذنب قبل أن يقودك أحد.',
  },
];

const bullets = [
  'كتاب PDF كامل بتصميم بصري عربي',
  '280 صفحة و17 فصل عملي',
  'رسوم وخرائط ذهنية بأسلوب القناة',
  'مناسب للجوال والقراءة السريعة',
];

function App() {
  return (
    <main className="productPage">
      <section className="productHero">
        <div className="badge">كتاب رقمي PDF</div>
        <div className="coverWrap">
          <img src="/story/cover.jpg" alt="غلاف كتاب قوة الحضور" />
        </div>
        <h1>قوة الحضور</h1>
        <p className="lead">دليل عملي لبناء الكاريزما والثقة والقيادة والتواصل وفهم النفوذ الخفي دون أن تفقد أخلاقك.</p>
        <div className="priceCard">
          <span>السعر</span>
          <strong>55 ريال</strong>
        </div>
      </section>

      <section className="quickInfo" aria-label="مميزات الكتاب">
        {bullets.map((item) => (
          <div key={item} className="infoItem">
            <span>✓</span>
            <p>{item}</p>
          </div>
        ))}
      </section>

      <section className="storyFlow" aria-label="ماذا داخل الكتاب">
        <div className="sectionHeader">
          <span>ماذا ستأخذ؟</span>
          <h2>رحلة واضحة من الداخل إلى التأثير</h2>
        </div>

        {story.map((card, index) => (
          <article className="storyCard" key={card.title}>
            <img src={card.img} alt="" />
            <div className="storyOverlay">
              <span className="number">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
            {index < story.length - 1 && <div className="connector" aria-hidden="true" />}
          </article>
        ))}
      </section>

      <section className="systemCard">
        <img src="/story/system.jpg" alt="دوائر الحضور السبع" />
        <div>
          <span>الإطار الكامل</span>
          <h2>دوائر الحضور السبع</h2>
          <p>الوعي، القوة، الثقة، الكاريزما، التواصل، القيادة، والحماية. كل فصل يخدم دائرة من هذه الدوائر.</p>
        </div>
      </section>

      <section id="buy" className="buyBox">
        <h2>احصل على الكتاب الآن</h2>
        <p>نسخة PDF كاملة — قراءة فورية بعد الشراء.</p>
        <div className="buyPrice">55 ريال</div>
        <a className="buyButton big" href="/qowat-alhodoor.pdf" target="_blank" rel="noreferrer">شراء الكتاب</a>
        <small>ملاحظة: زر الشراء حاليًا يفتح ملف PDF. أرسل لي رابط الدفع لأربطه مباشرة.</small>
      </section>

      <div className="fixedBuy" role="region" aria-label="شراء الكتاب">
        <div>
          <span>قوة الحضور</span>
          <strong>55 ريال</strong>
        </div>
        <a className="buyButton" href="#buy">اشتر الآن</a>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
