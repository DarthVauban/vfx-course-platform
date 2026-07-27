# VFX Course Platform

Навчальна платформа для самостійного проходження курсу зі stylized VFX, Unreal Engine, Materials і Niagara.

Матеріали курсу зберігаються в `stylized-vfx-course/`. Вебзастосунок і Docker-конфігурація будуть додані окремим етапом.

## Deployment

Кожен push у `main` збирає immutable Docker image у GitHub Container Registry і розгортає його на production-сервері через окремого користувача `vfxdeploy`.

- Production: `https://vfx.mt-panel.sbs/`
- Server directory: `/opt/vfx-course-platform`
- Compose project: `vfx-course-platform`
- Shared proxy network: `stream-lab_default`

Deployment перевіряє healthcheck нового контейнера та повертається до попереднього image у разі помилки. Він не виконує глобальне очищення Docker і не керує контейнерами проєкту `stream-lab`.

Після серверного healthcheck workflow додатково перевіряє production endpoint `https://vfx.mt-panel.sbs/health`. Caddy-блок, встановлений у наявний reverse proxy, збережений для відновлення в `deploy/Caddyfile.vfx`.
