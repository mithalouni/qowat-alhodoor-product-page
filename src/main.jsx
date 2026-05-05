import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const desires = [
  ['تريد أن تُسمع', 'عندك أفكار، لكنك تريد طريقة تجعل كلامك يصل بوضوح ووزن.'],
  ['تريد أن تُحترم', 'لا تريد أن تكون الشخص السهل الذي تُؤخذ طيبته كأمر مضمون.'],
  ['تريد أن تؤثر', 'تريد فهم النفوذ، الإقناع، وقراءة الناس من غير تلاعب رخيص.'],
  ['تريد علاقات أنجح', 'تريد جاذبية طبيعية، قربًا مريحًا، واحترامًا لا يكسرك ولا يبعد الناس عنك.'],
];

const path = [
  ['01', 'ثقة لا تهتز', 'القوة الداخلية، الذكاء العاطفي، الثقة الثابتة، والتخلص من تأجيل حياتك.', '/charisma-web-images/confidence-godlike-no-eyes.png'],
  ['02', 'هيبة وكلام يُسمع', 'الكاريزما، الكلام المؤثر، قراءة الناس، والحدود التي تصنع الاحترام.', '/charisma-web-images/enter-room-power.png'],
  ['03', 'قوة التأثير وكشف التلاعب', 'القيادة، النفوذ الخفي، كشف التلاعب، وحماية نفسك من الاستغلال.', '/charisma-web-images/leadership-power.png'],
  ['04', 'جاذبية وعلاقات ناجحة', 'تغيير صورتك أمام الناس، الصداقة، الجاذبية، وتثبيت نسختك الجديدة.', '/charisma-web-images/relationships-power.png'],
];

const toc = [
  'كيف تبني قوتك من الداخل',
  'كيف تفهم مشاعرك وتضبطها',
  'كيف تقوّي ثقتك بنفسك',
  'كيف تتوقف عن تأجيل حياتك',
  'كيف تصنع كاريزما حقيقية',
  'كيف تتكلم بطريقة تؤثر',
  'كيف تقرأ الناس بذكاء',
  'كيف تجعل الناس يحترمونك',
  'كيف تقود قبل أن تملك منصبًا',
  'كيف تفهم النفوذ الخفي',
  'كيف تكتشف التلاعب النفسي',
  'كيف تحمي نفسك من الاستغلال',
  'كيف تغيّر صورتك أمام الناس',
  'كيف تصنع أصدقاء بسهولة',
  'كيف تكون أكثر جاذبية في العلاقات',
  'كيف تثبّت التغيير ولا تعود للقديم',
];

const outcomes = [
  'ثقة أهدأ أمام الناس.',
  'كلام أوضح وأكثر تأثيرًا.',
  'احترام أكبر من غير قسوة.',
  'فهم أعمق للنفس والآخرين.',
  'جاذبية اجتماعية من غير تصنّع.',
];

function App() {
  return (
    <main>
      <section className="hero">
        <div className="copy">
          <h1>كاريزما جذابة</h1>
          <p className="subtitle">أسرار علم النفس للجاذبية والاحترام والقوة الاجتماعية</p>
          <p className="lead">
            كتاب عملي يعلمك كيف ترفع قيمتك أمام الناس: تثق بنفسك، تتكلم بطريقة مؤثرة، تضع حدودًا تجعلهم يحترمونك، تفهم أسرار النفس، وتبني جاذبية اجتماعية من غير تصنّع.
          </p>
          <div className="actions">
            <a className="primary" href="#buy">شراء الكتاب — 55 ريال</a>
            <a className="ghost" href="#path">شاهد محتوى الكتاب</a>
          </div>
        </div>
        <div className="coverWrap heroArt">
          <img src="/charisma-web-images/book-options-channel-style/book-channel-option-04-light-bg.png" alt="صورة منتج كتاب كاريزما جذابة" />
        </div>
      </section>

      <section className="pain imageSection">
        <div>
          <h2>الكاريزما تغيّر حياتك</h2>
          <div className="problemGrid">
            {desires.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
        <img className="sideImage" src="/charisma-web-images/charisma-force-godlike.png" alt="قوة الكاريزما" />
      </section>

      <section className="truth">
        <p>
          أكيد تعرف شخصًا عندما يدخل المكان ينتبه له الناس، وعندما يتكلم يصمتون ليسمعوه. ليس لأنه الأعلى صوتًا أو الأجمل شكلًا، بل لأن طريقته تقول: أنا واثق، واضح، وأعرف قيمتي.
        </p>
        <h2>هذه هي الكاريزما: أن تُشعر الناس بقيمتك قبل أن تشرحها لهم.</h2>
        <p>
          ستفهم لماذا تهتز ثقتك، لماذا تشعر بالوحدة رغم وعيك، لماذا يستسهل البعض التعامل معك، وكيف تصبح أكثر تأثيرًا وجاذبية ونجاحًا في علاقاتك وقراراتك.
        </p>
      </section>

      <section id="path" className="inside">
        <h2>الطريق داخل الكتاب</h2>
        <div className="insideGrid">
          {path.map(([num, title, text, img]) => (
            <article key={title}>
              <img src={img} alt="" />
              <div>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tocSection">
        <h2>فهرس الكتاب</h2>
        <div className="tocGrid">
          {toc.map((item, index) => (
            <div className="tocItem" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="outcomes">
        <h2>ماذا ستأخذ منه؟</h2>
        <ul>
          {outcomes.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="buy" className="buy">
        <img className="buyImage" src="/charisma-web-images/cta-godlike-no-book.png" alt="بناء الكاريزما" />
        <div>
          <h2>جاهز تبني كاريزمتك؟</h2>
          <p>نسخة PDF فورية من كتاب <strong>كاريزما جذابة</strong>.</p>
        </div>
        <div className="buyCard">
          <strong>55 ريال</strong>
          <a className="primary" href="/karezma-jathaba-final.pdf" target="_blank" rel="noreferrer">شراء الكتاب</a>
          <small>للمعاينة محليًا الآن — يمكن ربطه برابط الدفع لاحقًا.</small>
        </div>
      </section>

      <div className="fixedBuy">
        <div><span>كاريزما جذابة</span><strong>55 ريال</strong></div>
        <a href="#buy">اشتر الآن</a>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
