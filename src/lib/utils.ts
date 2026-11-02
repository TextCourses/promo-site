/*
 * Утилита `cn` — стандартный shadcn-хелпер для классов.
 *
 * Соединяет classnames через clsx и резолвит конфликты Tailwind-классов
 * через tailwind-merge. Нужен shadcn-атомам в `components/ui/*`.
 *
 * Пример:
 *   <button className={cn('px-4 py-2', isPrimary && 'bg-accent text-accent-on', className)} />
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
