# Восстановление проекта из транскриптов Claude Code

## Что есть
Все исходники (`app/`, `components/`, `lib/`, `middleware.ts`, конфиги Docker/Caddy) восстановлены из логов прошлых сессий — это последние известные версии файлов на момент 27 апреля 2026.

Дополнительно сгенерированы стандартные конфиги, которые я в чате не открывал:
- `package.json`, `tsconfig.json`, `next-env.d.ts`
- `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`
- `components.json` (shadcn)
- `lib/utils.ts` (`cn` helper)
- `components/ui/{button,input,label,tooltip,carousel}.tsx` — стандартные shadcn-компоненты

## Чего нет — нужно положить руками

### 1. Картинки в `public/images/`
Код ссылается на эти файлы (см. `components/hero.tsx`, `gallery.tsx`, `lib/rooms.ts`):
```
public/images/hero.jpg
public/images/exterior.jpg
public/images/lobby.jpg
public/images/lobby-2.jpg
public/images/besedki.jpg
public/images/halal.png
public/images/rooms/standard-1.jpg ... standard-5.jpg
public/images/rooms/family-1.jpg   ... family-5.jpg
public/images/rooms/deluxe-1.jpg   ... deluxe-5.jpg
```
Скачайте их из v0 (исходный проект) или Time Machine. Без них `next/image` будет 404.

### 2. `assets/` (если в коде ещё используется)
Транскрипт упоминал `assets/2kom/1.jpg`, `assets/3kom/1.jpg`, `assets/4kom/1.jpg`,
`assets/terrasa/{беседки и мангальная зона,вид на природу,ресепшн,ресепшн2,сам гостевой дом}.jpg` —
если эти пути всё ещё ссылаются из кода, восстановите ту же структуру. Если нет — просто игнорируйте.

### 3. Файл `.env.local`
Восстановлен в `.env.local`, но проверьте, что значения актуальные (особенно `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`).

## Как запустить
```bash
cd /Users/edem/Downloads/b_0FmqHoAUTBZ_recovered
pnpm install
pnpm dev
```

Если хочется поднять через Docker (как было настроено):
```bash
docker compose up -d --build
```

## Что может сломаться
- **Версии в `package.json`** взяты разумно-актуальные на январь 2026 (Next 15.1, React 19). Если v0 использовал что-то другое — перетяните `package.json` оттуда.
- **`tailwind.config.ts` / `globals.css`** — стандартный shadcn. Если у вас была кастомная палитра/тема (например, акцентный синий бренда) — восстанавливать руками.
- **Контент landing-секций** — если в `components/welcome.tsx`, `about.tsx` правки были после моих последних чтений, они могут быть устаревшими.

## На будущее
Перед любыми экспериментами:
```
cd <project>
git init && git add -A && git commit -m "snapshot"
gh repo create --private --source=. --push
```
Это занимает 30 секунд и спасает от потери всего проекта.
