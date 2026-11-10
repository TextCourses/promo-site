import { ArrowLeft, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Privacy(): JSX.Element {
  return (
    <main className="min-h-screen bg-bg font-body text-fg">
      <header className="border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center px-6 md:px-8">
          <Link to="/" className="font-display text-lg font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
            Text<span className="text-accent">Courses</span>
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-24">
        <Link to="/" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-fg-2 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <ArrowLeft className="size-4" /> На главную
        </Link>

        <p className="mt-10 font-mono text-sm text-accent">// PRIVACY_POLICY</p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-fg md:text-5xl">Политика конфиденциальности</h1>
        <p className="mt-5 text-lg text-fg-2">Дата вступления в силу: 30 августа 2026</p>

        <section className="mt-12 border-y border-border py-8" aria-labelledby="operator-details">
          <h2 id="operator-details" className="font-display text-2xl font-bold text-fg">Реквизиты оператора</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div><dt className="font-mono text-xs text-accent">ФИО</dt><dd className="mt-2 leading-relaxed text-fg-2">Самозанятый Орлова Виктория Александровна</dd></div>
            <div><dt className="font-mono text-xs text-accent">ИНН</dt><dd className="mt-2 leading-relaxed text-fg-2">645505490220</dd></div>
            <div><dt className="font-mono text-xs text-accent">Email</dt><dd className="mt-2"><a href="mailto:textcourses@gmail.com" className="inline-flex min-h-[44px] items-center gap-2 text-fg-2 underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"><Mail className="size-4" />textcourses@gmail.com</a></dd></div>
            <div><dt className="font-mono text-xs text-accent">Телефон</dt><dd className="mt-2"><a href="tel:+79001650158" className="inline-flex min-h-[44px] items-center gap-2 text-fg-2 underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"><Phone className="size-4" />+7 (900) 165-01-58</a></dd></div>
            <div className="sm:col-span-2"><dt className="font-mono text-xs text-accent">Сайт</dt><dd className="mt-2 break-all leading-relaxed text-fg-2">https://text-courses.ru</dd></div>
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="data-scope">
          <h2 id="data-scope" className="font-display text-2xl font-bold text-fg">Объём и цели обработки</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div><h3 className="font-display text-lg font-bold text-fg">Собираемые данные:</h3><ul className="mt-4 space-y-3 leading-relaxed text-fg-2"><li>Номер телефона</li><li>Логин или ссылка выбранного канала связи</li><li>Ответы на вопросы квиза</li><li>IP-адрес</li><li>Cookies</li></ul></div>
            <div><h3 className="font-display text-lg font-bold text-fg">Цели обработки:</h3><ul className="mt-4 space-y-3 leading-relaxed text-fg-2"><li>Квалификация заявки и подготовка предложения</li><li>Связь с пользователем в выбранном канале</li><li>Улучшение качества сервиса</li></ul></div>
          </div>
        </section>

        <div className="mt-14 space-y-10">
          <section><h2 className="font-display text-2xl font-bold text-fg">1. Общие положения</h2><p className="mt-4 leading-relaxed text-fg-2">Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности, принимаемые оператором — Самозанятый Орлова Виктория Александровна, ИНН 645505490220 (далее — Оператор). Политика применяется ко всей информации, которую Оператор может получить о посетителях сайта https://text-courses.ru.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">2. Основные понятия</h2><p className="mt-4 leading-relaxed text-fg-2">Персональные данные — любая информация, относящаяся к прямо или косвенно определённому физическому лицу (субъекту персональных данных). Обработка персональных данных — любое действие с персональными данными, совершаемое с использованием средств автоматизации или без них: сбор, запись, систематизация, накопление, хранение, уточнение, использование, передача, блокирование, удаление, уничтожение. Оператор — лицо, организующее и осуществляющее обработку персональных данных и определяющее её цели и состав. Согласие — добровольное, конкретное, информированное и сознательное волеизъявление субъекта персональных данных.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">3. Права и обязанности Оператора</h2><p className="mt-4 leading-relaxed text-fg-2">Оператор вправе получать от субъекта персональных данных достоверные сведения, необходимые для связи и подготовки предложения, и обязан обрабатывать их исключительно в заявленных целях, обеспечивать их конфиденциальность, принимать правовые, организационные и технические меры защиты, а также прекращать обработку и удалять данные в случаях, предусмотренных законом.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">4. Права и обязанности субъекта персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Субъект персональных данных вправе получать информацию об обработке своих персональных данных, требовать их уточнения, блокирования или уничтожения, если данные являются неполными, устаревшими, неточными или незаконно полученными, а также в любой момент отозвать согласие на обработку, направив запрос на адрес электронной почты Оператора textcourses@gmail.com.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">5. Принципы обработки персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Обработка осуществляется на законной и справедливой основе; ограничивается достижением конкретных, заранее определённых и законных целей; не допускается обработка, несовместимая с целями сбора; содержание и объём обрабатываемых данных соответствуют заявленным целям; обеспечиваются точность и достаточность данных, а также их конфиденциальность и целостность.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">6. Цели обработки персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Персональные данные обрабатываются в целях квалификации заявки и подготовки персонального предложения, связи с пользователем по предоставленному номеру телефона и улучшения качества сервиса на основе агрегированной статистики посещений.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">7. Условия обработки персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Обработка осуществляется с согласия субъекта персональных данных, которое выражается отметкой в форме на сайте перед отправкой заявки, а также в иных случаях, предусмотренных статьёй 6 Федерального закона № 152-ФЗ.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">8. Порядок сбора, хранения и передачи персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Персональные данные собираются через формы сайта https://text-courses.ru и хранятся на защищённых серверах, расположенных на территории Российской Федерации. Доступ к данным ограничен и предоставляется только Оператору и лицам, обеспечивающим работу сайта, в объёме, необходимом для обработки заявки. Срок хранения не превышает трёх лет с момента последнего контакта с субъектом персональных данных, после чего данные уничтожаются.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">9. Перечень действий с персональными данными</h2><p className="mt-4 leading-relaxed text-fg-2">Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу в объёме, необходимом для обработки заявки, блокирование, удаление и уничтожение персональных данных.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">10. Трансграничная передача персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Трансграничная передача персональных данных Оператором не осуществляется: данные обрабатываются и хранятся на серверах, расположенных на территории Российской Федерации.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">11. Конфиденциальность персональных данных</h2><p className="mt-4 leading-relaxed text-fg-2">Оператор и иные лица, получившие доступ к персональным данным, обязаны не раскрывать третьим лицам и не распространять персональные данные без согласия субъекта персональных данных, если иное не предусмотрено федеральным законом.</p></section>
          <section><h2 className="font-display text-2xl font-bold text-fg">12. Заключительные положения</h2><p className="mt-4 leading-relaxed text-fg-2">Оператор вправе вносить изменения в настоящую политику. Новая редакция вступает в силу с момента её размещения на сайте https://text-courses.ru. Актуальная редакция всегда доступна на этой странице. Вопросы по обработке персональных данных направляйте на адрес электронной почты textcourses@gmail.com.</p></section>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Button asChild className="min-h-[48px] w-full sm:w-auto"><Link to="/">На главную <ArrowLeft className="size-4" /></Link></Button>
        </div>
      </article>
    </main>
  )
}
