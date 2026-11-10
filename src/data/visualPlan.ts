import { HERO_VIDEO_POLICY } from './heroVideoPolicy'
import { MOTION_POLICY } from './motionPolicy'
import CREATIVE_PLAN from './creativePlan.json'

export const VISUAL_PLAN = {
  version: 3,
  creativePlan: CREATIVE_PLAN,
  sourceKnobs: { designVariance: 8, motionIntensity: 5, visualDensity: 5 },
  artDirection: 'Тёмный инженерный редактор: терминальные строки, сигнальный зелёный и реальные рабочие артефакты вместо рекламы онлайн-школы.',
  aestheticFamily: 'tech-precise-editorial',
  userDirectionRationale: 'Страница использует запланированные изображения как доказательство практики и держит фокус на персональном плане.',
  designSystemTranslation: 'Контрастные тёмные поверхности, зелёный для действия, синий для технического статуса, Manrope для заголовков и моноширинные строки для артефактов.',
  heroConcept: 'Асимметричная сцена: оффер и путь к чек-листу на широкой текстовой части, интерфейс QA TEST MASTER — как единственное доказательство справа.',
  heroComposition: 'Асимметричная сетка 5/7 на широком экране, стек на телефоне.',
  heroAlternativesRationale: 'Фотофоном не используется: плотная копия и интерфейсный артефакт требуют отдельной безопасной зоны.',
  heroRationale: 'Главный экран сразу показывает результат, опыт автора и материальное доказательство практики.',
  heroMediaRationale: 'Скриншот QA TEST MASTER показывает объект обучения, а не декоративную технологичность.',
  referenceRationale: 'Ориентир — IDE, журнал инженерных решений и CI/CD-пайплайн, без копирования готовых интерфейсов.',
  compositionRules: ['Одна доминанта на сцену: обещание, риск или действие.', 'Карточки кода используют тонкие бордеры и моноширинные строки.', 'Сетки максимум в две колонки внутри узких областей.'],
  referencePack: [
    { label: 'IDE workspace', pattern: 'Плотная рабочая поверхность', borrow: 'Иерархия панели и статусов', avoid: 'Копирование конкретного интерфейса' },
    { label: 'Engineering runbook', pattern: 'Редакционная последовательность', borrow: 'Чёткая структура доказательств', avoid: 'Канцелярская перегрузка' },
    { label: 'CI/CD console', pattern: 'Сигнальные статусы', borrow: 'Зелёный как маркер готовности', avoid: 'Декоративные анимации статусов' }
  ],
  mediaPlan: [
    { slotId: 'hero.image_hero.0', kind: 'image', purpose: 'Доказать работу на реальном продукте', usage: 'proof', aspectRatio: '16:9', promptBrief: 'QA TEST MASTER, API и pytest', fallback: 'Стабильная IDE-заглушка' },
    { slotId: 'quiz.quiz_preview_image.0', kind: 'image', purpose: 'Показать ценность чек-листа', usage: 'inline', aspectRatio: '4:3', promptBrief: 'Инженерный документ навыков', fallback: 'Стабильная документная заглушка' }
  ],
  motionPlan: [
    { id: 'hero-entrance', trigger: 'load', intensity: 'polished', description: 'Короткое последовательное появление предложения и доказательства.', reducedMotion: 'Без смещения, сразу видимое содержимое.', mobile: 'Сдержанное появление.' },
    { id: 'quiz-state', trigger: 'state', intensity: 'polished', description: 'Мгновенная смена карточки вопроса без декоративной задержки.', reducedMotion: 'Мгновенная смена.', mobile: 'Мгновенная смена.' }
  ],
  densityRules: ['Первый экран сочетает оффер и одно доказательство.', 'Факты собраны в короткие инженерные строки.', 'Опрос показывает только один вопрос за раз.'],
  motionPolicy: MOTION_POLICY,
  heroVideoPolicy: HERO_VIDEO_POLICY,
  signatureMotionPattern: 'state-transition',
  signatureMoment: 'Переход от строки терминала с ошибкой к готовому персональному маршруту в опросе.',
  qaChecklist: ['Один H1', 'Доступные варианты ответов', 'Медиа имеют стабильные пропорции', 'Опрос ведёт на контактный шаг']
} as const
