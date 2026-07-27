# VFX Course Platform

Навчальна платформа для самостійного проходження курсу зі stylized VFX, Unreal Engine, Materials і Niagara.

Матеріали курсу зберігаються в `stylized-vfx-course/` і автоматично
перетворюються на навігацію, пошуковий індекс та сторінки під час збірки.

## Локальний запуск

Потрібен Node.js 22 або новіший.

```bash
npm ci
npm run dev
```

Production-перевірка:

```bash
npm test
npm run build
```

Генератор `scripts/generate-course-data.mjs` перевіряє структуру курсу,
кількість уроків і всі відносні Markdown-посилання. Зламане посилання зупиняє
збірку до деплою.

Прогрес, закладки, checklist, результати контрольних і нотатки зберігаються у
`localStorage`. На сторінці «Мій прогрес» їх можна експортувати та імпортувати
одним JSON-файлом.

## Deployment

Кожен push у `main` збирає immutable Docker image у GitHub Container Registry і розгортає його на production-сервері через окремого користувача `vfxdeploy`.

- Production: `https://vfx.mt-panel.sbs/`
- Server directory: `/opt/vfx-course-platform`
- Compose project: `vfx-course-platform`
- Shared proxy network: `stream-lab_default`

Deployment перевіряє healthcheck нового контейнера та повертається до попереднього image у разі помилки. Він не виконує глобальне очищення Docker і не керує контейнерами проєкту `stream-lab`.

Після серверного healthcheck workflow додатково перевіряє production endpoint `https://vfx.mt-panel.sbs/health`. Caddy-блок, встановлений у наявний reverse proxy, збережений для відновлення в `deploy/Caddyfile.vfx`.
