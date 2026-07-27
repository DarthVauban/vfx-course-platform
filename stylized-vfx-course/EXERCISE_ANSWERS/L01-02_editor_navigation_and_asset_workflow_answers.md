# Рішення до L01-02 — Editor та дисципліна VFX-асетів

## EX-L01-02-A — Розбір “хаотичного” набору

### Повне рішення

Спочатку визначаємо type і purpose, не намагаючись “прикрасити” стару назву.

| Old name | Фактичний type | Визначений purpose | New name | Canonical path |
|---|---|---|---|---|
| `NewMaterial` | Material | Neutral diagnostic surface | `M_Diagnostic_Surface` | `/Game/VFXCourse/VFX/Materials/Master` |
| `NewMaterial_2` | Material | Alternate diagnostic surface | `M_Diagnostic_Surface_Alt` | `/Game/VFXCourse/TestAssets` |
| `Test` | Level | Asset retrieval test | `L_Asset_Retrieval_Test` | `/Game/VFXCourse/Maps` |
| `Final` | Blueprint Class, Actor | Alternate test rig | `BP_VFX_TestRig_Alt` | `/Game/VFXCourse/VFX/Blueprints` |
| `Thing` | Material | Neutral background/backplate | `M_Diagnostic_Backplate` | `/Game/VFXCourse/TestAssets` |

Послідовність:

1. У Content Browser увімкни type column або відкрий asset details, щоб не вгадувати type за thumbnail.
2. Запиши purpose кожного asset одним реченням.
3. Якщо purpose невідомий, не видавай asset за production-ready: лиши його в `TestAssets` і дай diagnostic name.
4. Перейменуй assets усередині Editor.
5. Перемісти assets у canonical folders усередині Editor.
6. Знайди кожен за new name й запиши package path.
7. Відкрий `L_Asset_Retrieval_Test`; перевір Blueprint/Material references, якщо вони були додані.
8. Закрий та знову відкрий Editor.
9. Повтори пошук за prefix і type.
10. Лише після reopen test перевір redirectors у small scope. Exact UE 5.8 context action: **Потребує ручної перевірки в Unreal Engine 5.8.**

### Completed audit

| Asset | Prefix | Purpose | Path | Random suffix | Reopen | Verdict |
|---|---|---|---|---|---|---|
| `M_Diagnostic_Surface` | Pass | Pass | Pass | Ні | Pass | Keep |
| `M_Diagnostic_Surface_Alt` | Pass | Pass | Pass | Ні | Pass | Keep as probe |
| `L_Asset_Retrieval_Test` | Pass | Pass | Pass | Ні | Pass | Keep |
| `BP_VFX_TestRig_Alt` | Pass | Pass | Pass | Ні | Pass | Keep |
| `M_Diagnostic_Backplate` | Pass | Pass | Pass | Ні | Pass | Keep as probe |

### Чому це працює

Type prefix звужує search, semantic role пояснює призначення, canonical path відокремлює reusable assets від probes. `Alt` є змістовним лише тому, що main і alternate variants реально існують. У назві немає удаваного version number.

### Альтернативні правильні рішення

- `M_Diagnostic_Backplate` можна перенести в `VFX/Materials/Master`, якщо він став reusable course asset.
- `BP_VFX_TestRig_Alt` можна назвати за конкретною функцією, наприклад `BP_VFX_CameraMarker`; це навіть краще, якщо функція відома.
- Assets без жодного use можна видалити після reference check, але видалення не є вимогою вправи.

### Неправильні рішення

- `M_NewMaterial`, бо prefix виправлено, а purpose ні.
- `M_Diagnostic_Surface_Final`, бо `Final` не описує variant.
- Винести всі assets у `/Game/Materials`, `/Game/Maps`, `/Game/Blueprints` без project namespace.
- Перемістити `.uasset` через File Explorer.
- Автоматично видалити redirectors у всьому проєкті без backup/reopen test.

### Verification

- пошук `M_Diagnostic` повертає лише diagnostic Materials;
- type filter `Level` знаходить `L_Asset_Retrieval_Test`;
- `BP_VFX_TestRig_Alt` лежить у Blueprints, не в Maps;
- reopen test успішний;
- audit table не містить `Unknown`, `Final` або випадкового `_2`.

### Performance note

Organization не змінює GPU cost. Дублювання Materials може збільшити package count і maintenance cost; тому `Alt` лишається тільки якщо служить конкретному test.

## EX-L01-02-B — Blind asset retrieval

### Повний набір requests

| # | Request | Оптимальний query/filter | Expected result |
|---:|---|---|---|
| 1 | Стартова карта курса | `L_Startup_Check`, type Level | `/Game/VFXCourse/Maps/L_Startup_Check` |
| 2 | Карта asset audit | `L_Asset_Workflow_Audit` | `/Game/VFXCourse/Maps/L_Asset_Workflow_Audit` |
| 3 | Карта retrieval test | `L_Asset_Retrieval_Test` | `/Game/VFXCourse/Maps/L_Asset_Retrieval_Test` |
| 4 | Master diagnostic Material | `M_Diagnostic_Surface` | `VFX/Materials/Master` |
| 5 | Alternate diagnostic Material | `M_Diagnostic_Surface_Alt` | `TestAssets` |
| 6 | Backplate probe | `Backplate`, type Material | `TestAssets/M_Diagnostic_Backplate` |
| 7 | Main Blueprint test rig | `BP_VFX_TestRig` | `VFX/Blueprints` |
| 8 | Alternate Blueprint test rig | `BP_VFX_TestRig_Alt` | `VFX/Blueprints` |
| 9 | Усі Levels | Type filter `Level` + root `/Game/VFXCourse` | Три expected maps |
| 10 | Усі Materials | Type filter `Material` | Три diagnostic materials |
| 11 | Усі test-only assets | Folder scope `TestAssets` | Alt/backplate probes |
| 12 | Усі reusable master materials | Folder `Materials/Master`, type Material | Main diagnostic surface |

### Example result log

| # | Method | Time | Correct | Naming/path issue |
|---:|---|---:|---|---|
| 1 | Exact name | 8 s | Так | Ні |
| 2 | Prefix + Maps | 15 s | Так | Ні |
| 3 | Type Level | 22 s | Так | Ні |
| 4 | Exact name | 7 s | Так | Ні |
| 5 | Search `Alt` | 19 s | Так | Ні |
| 6 | Purpose word | 31 s | Так | Ні |
| 7 | Prefix `BP_` | 18 s | Так | Ні |
| 8 | Exact name | 9 s | Так | Ні |
| 9 | Type filter | 14 s | Так | Ні |
| 10 | Type filter | 17 s | Так | Ні |
| 11 | Folder scope | 11 s | Так | Ні |
| 12 | Folder + type | 10 s | Так | Ні |

Ці times є прикладом формату, а не нормативом швидкості. У власному result log використовуй фактичні measurements.

### Якщо target шукався понад 90 секунд

1. Не повторюй query відразу з пам’яті.
2. Класифікуй failure:
   - type prefix відсутній;
   - semantic word нечіткий;
   - path неочікуваний;
   - active filter приховував result;
   - існує кілька однакових candidates.
3. Зміни лише одну частину convention.
4. Закрий search і повтори blind retrieval через 20 хвилин.

### Чому це працює

Request формулюється через production role, а не через візуальну пам’ять thumbnail. Різні methods перевіряють три незалежні сигнали: name, type і path.

### Неправильні рішення

- Заздалегідь відкрити всі потрібні folders і назвати це blind retrieval.
- Переглядати кожен asset вручну без query.
- Записати лише успіхи, приховавши slow/mistaken targets.
- Перейменувати asset після кожної дрібної затримки без класифікації failure.

### Verification

- щонайменше 10 із 12 requests correct;
- усі slow targets мають cause і correction;
- однаковий query наступного разу веде до одного expected result;
- жоден `Dev` asset не використаний як reusable target.

### Performance note

Search time є workflow metric, не runtime metric. Перший Content Browser search після запуску може відрізнятися через asset discovery/cache, тому exact seconds не порівнюють між hardware.
