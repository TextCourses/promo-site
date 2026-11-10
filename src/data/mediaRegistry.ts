export interface MediaSlotVariant {
  url: string
  width: number
  height?: number
  format: 'webp' | 'jpg' | string
}

export interface MediaSlotEntry {
  id: string
  kind?: 'image' | 'video' | 'file'
  url?: string | null
  element_label?: string
  slot_index?: number
  alt?: string
  prompt?: string
  aspect_ratio?: string
  mobile_aspect_ratio?: string
  recommended_size?: string
  mobile_recommended_size?: string
  role?: string
  usage?: 'background' | 'inline' | 'cutout'
  composition?: string
  subject_position?: string
  copy_space?: string
  focal_point?: string
  mobile_focal_point?: string
  style?: string
  lighting?: string
  mood?: string
  palette?: string
  negative_constraints?: string[]
  mobile_strategy?: string
  media_family_intent?: {
    version: 1
    slot_id: string
    kind: 'image' | 'video'
    criticality: 'critical' | 'supporting'
    consistency_key: string
    mobile_strategy: 'shared-crop' | 'derived-mobile' | 'dedicated-mobile' | 'poster-only'
    reason_codes?: string[]
  }
  consistency_prompt?: string
  copy_position?: 'left' | 'center' | 'right'
  scrim?: 'dark' | 'light' | 'none'
  overlay_strength?: number
}

export interface MediaRegistry {
  version: number
  slots: MediaSlotEntry[]
}

export const MEDIA_REGISTRY: MediaRegistry = {
  "version": 1,
  "slots": [
    {
      "id": "hero.image_hero.0",
      "kind": "image",
      "usage": "inline",
      "role": "proof",
      "element_label": "Рабочая среда QA TEST MASTER",
      "slot_index": 0,
      "alt": "Практика тестирования на реальном продукте QA TEST MASTER",
      "aspect_ratio": "16:9",
      "mobile_aspect_ratio": "4:3",
      "recommended_size": "1600x900",
      "mobile_recommended_size": "960x720",
      "prompt": "Скриншот интерфейса HR-системы QA TEST MASTER: браузер, панель API-эндпоинтов и терминал с прогоном pytest, чёткий читаемый технический интерфейс, без людей и иллюстраций.",
      "composition": "Широкий инженерный интерфейс с терминалом в нижней части и API-панелью в фокусе.",
      "subject_position": "center",
      "copy_space": "none",
      "focal_point": "50% 50%",
      "mobile_focal_point": "50% 50%",
      "style": "Интерфейсный скриншот в тёмной теме",
      "lighting": "Экранное свечение кода",
      "mood": "Технологичный, рабочий, строгий",
      "palette": "Тёмная IDE, зелёный сигнал и синий статус",
      "negative_constraints": [
        "стоковые фотографии людей",
        "размытый код",
        "рисунки от руки"
      ],
      "mobile_strategy": "Общий кадр с адаптивной обрезкой",
      "consistency_prompt": "Dark mode IDE screenshot, PyCharm editor with Python pytest code, GitHub Actions CI/CD pipeline graph, professional software engineering, high clarity UI",
      "media_family_intent": {
        "version": 1,
        "slot_id": "hero.image_hero.0",
        "kind": "image",
        "criticality": "critical",
        "consistency_key": "textcourses-engineering",
        "mobile_strategy": "shared-crop",
        "reason_codes": [
          "HERO_PROOF"
        ]
      },
      "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a049c0-27dc-732f-9f14-35cd32975b8c/20260828_190216_image_0_633fbda7.jpg",
      "variants": [
        {
          "format": "webp",
          "width": 1376,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a049c0-27dc-732f-9f14-35cd32975b8c/20260828_190216_image_0_633fbda7.w1376.webp"
        },
        {
          "format": "jpg",
          "width": 1376,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a049c0-27dc-732f-9f14-35cd32975b8c/20260828_190216_image_0_633fbda7.w1376.jpg"
        }
      ],
      "width": 1376,
      "height": 768,
      "mobile_url": "https://files.surgaygpt.ru/media/upload/019fffe3-2d60-7743-a3af-e97a674f06bd/303a2ff0-ea8d-4153-8972-204ce94a55ed/20260828_191122_upload_b9fee110.png",
      "mobile_variants": [
        {
          "format": "webp",
          "width": 960,
          "height": 720,
          "url": "https://files.surgaygpt.ru/media/upload/019fffe3-2d60-7743-a3af-e97a674f06bd/303a2ff0-ea8d-4153-8972-204ce94a55ed/20260828_191122_upload_b9fee110.w960.webp"
        },
        {
          "format": "jpg",
          "width": 960,
          "height": 720,
          "url": "https://files.surgaygpt.ru/media/upload/019fffe3-2d60-7743-a3af-e97a674f06bd/303a2ff0-ea8d-4153-8972-204ce94a55ed/20260828_191122_upload_b9fee110.w960.jpg"
        }
      ],
      "mobile_width": 960,
      "mobile_height": 720,
      "source": "generated",
      "mobile_original_media_item_id": "01a049c7-2835-754f-b767-9444f583e20f",
      "mobile_original_url": "https://files.surgaygpt.ru/media/upload/019fffe3-2d60-7743-a3af-e97a674f06bd/7da9dfc6-fe1c-48ae-83d1-b3a930c60297/20260828_190943_upload_fbf2185d.png"
    },
    {
      "id": "quiz.quiz_preview_image.0",
      "kind": "image",
      "usage": "inline",
      "role": "desire",
      "element_label": "Превью персонального чек-листа",
      "slot_index": 0,
      "alt": "Персональный чек-лист развития QA-инженера",
      "aspect_ratio": "4:3",
      "mobile_aspect_ratio": "4:3",
      "recommended_size": "1200x900",
      "mobile_recommended_size": "960x720",
      "prompt": "Обложка инженерного PDF-документа «Персональный план входа и роста в QA-автоматизации»: чек-боксы, карта навыков и технологический стек, тёмная минималистичная подача, без денег и рекламных символов.",
      "composition": "Документ лежит фронтально, схема навыков занимает центральную часть.",
      "subject_position": "center",
      "copy_space": "none",
      "focal_point": "50% 50%",
      "mobile_focal_point": "50% 50%",
      "style": "Инженерный минималистичный документ",
      "lighting": "Мягкий студийный свет",
      "mood": "Профессиональный, полезный, точный",
      "palette": "Тёмный графит, зелёный сигнал и белые строки",
      "negative_constraints": [
        "стоковые яркие обложки",
        "восклицательные знаки",
        "рисунки денег"
      ],
      "mobile_strategy": "Общий кадр с адаптивной обрезкой",
      "consistency_prompt": "Dark mode IDE screenshot, PyCharm editor with Python pytest code, GitHub Actions CI/CD pipeline graph, professional software engineering, high clarity UI",
      "media_family_intent": {
        "version": 1,
        "slot_id": "quiz.quiz_preview_image.0",
        "kind": "image",
        "criticality": "supporting",
        "consistency_key": "textcourses-engineering",
        "mobile_strategy": "shared-crop",
        "reason_codes": [
          "CONVERSION_ARTIFACT"
        ]
      },
      "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.jpg",
      "variants": [
        {
          "format": "webp",
          "width": 1024,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w1024.webp"
        },
        {
          "format": "jpg",
          "width": 1024,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w1024.jpg"
        }
      ],
      "width": 1024,
      "height": 768,
      "mobile_url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.jpg",
      "mobile_source": "generated",
      "mobile_variants": [
        {
          "format": "webp",
          "width": 1024,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w1024.webp"
        },
        {
          "format": "jpg",
          "width": 1024,
          "height": 768,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w1024.jpg"
        },
        {
          "format": "webp",
          "width": 960,
          "height": 720,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w960.webp"
        },
        {
          "format": "jpg",
          "width": 960,
          "height": 720,
          "url": "https://files.surgaygpt.ru/media/image/019fffe3-2d60-7743-a3af-e97a674f06bd/01a04998-c4d5-7724-a9bf-fc225d861979/20260828_182109_image_0_ffdfa0e4.w960.jpg"
        }
      ],
      "mobile_width": 960,
      "mobile_height": 720,
      "source": "generated"
    }
  ]
}
