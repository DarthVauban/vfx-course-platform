# Розв’язки L08-05 — Bounds, scalability і optional Fluids

## EX08-05-A — Виправлення bounds/scalability

### Діагностика

```text
Pop at camera edge:
  bounds cover origin/core but not long ribbon/cosmetic particles/WPO

Enormous quick-fix bounds:
  prevents pop but keeps System relevant far outside visible effect

Low tier:
  disabled entire core emitter instead of cosmetic layers

Aura re-entry:
  cull response resets/restarts looping burst

Cost:
  long lifetime × spawn rate × wide translucent coverage
```

### Workflow для envelope

Для кожного emitter:

```text
Initial extent
+ maximum displacement from velocity/forces/target
+ renderer half-size/mesh extent/ribbon width
+ material WPO
+ attached component motion during relevant frame
```

Зафіксуй фактичні крайні значення. Використовуй консервативний padding, виведений із невизначеності, а не довільне множення ×100.

### Щільні bounds

Обирай fixed bounds, якщо motion envelope детермінований і A/B-перевірка підтверджує стабільність. Обирай dynamic/default, якщо поточна simulation сильно змінюється, а profile/correctness на цільовій платформі проходять перевірку. Запиши:

- трактування local/world;
- максимальні user scale/charge;
- найдовший layer у tier High;
- mesh/ribbon/WPO;
- край кадру;
- рух actor.

Точні значення properties залежать від проєкту; не вигадуй координати.

### Політика tiers

```text
Core emitter:
  High/Medium/Low = enabled
  same area, hit timing, color/team cue

Directional support:
  High = full ribbon
  Medium = shorter/fewer segments or mesh accent
  Low = minimal arrow/arc if direction critical

Cosmetic:
  High = 100%
  Medium = 40–60%
  Low = 0–20%

Polish:
  High only; distortion/light/second noise
```

### Повторна поява

Looping-аура не має повторювати одноразовий activation burst після повернення видимості. Розділи:

- one-shot activation emitter;
- looping persistent emitter.

Налаштуй cull/deactivation response так, щоб persistent loop відновлювався або повторно ініціалізувався, не створюючи враження нової gameplay activation. Точне налаштування:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Докази до/після

Зафіксуй:

- camera path;
- конкурентні systems;
- тривалість ефекту;
- quality tier;
- resolution/exposure;
- hardware/build.

Збери:

- візуалізацію bounds;
- Shader Complexity/overdraw;
- CPU/GPU Niagara profile;
- відео або послідовність кадрів re-entry;
- відповіді blind cue.

### Хибні виправлення

- Нескінченні або надмірно великі bounds.
- Скорочення gameplay range.
- Вимкнення core telegraph у tier Low.
- Зміна камери, щоб приховати pop.
- Reset кожного loop після повернення з cull.
- Твердження без capture, що зменшення кількості частинок виправляє material overdraw.

### Рубрика

| Критерій | Бали |
|---|---:|
| Діагностика першопричини | 15 |
| Envelope / щільні bounds | 25 |
| Політика re-entry | 15 |
| Паритет сигналів між tiers | 20 |
| Контрольовані performance-докази | 15 |
| Ownership / обмеження | 10 |

## EX08-05-B — Опційне досьє Fluids-to-flipbook

Це еталонна структура, а не обіцянка, що точні Baker UI/settings існують без змін.

### Обов’язковий заголовок

```text
Engine build: UE 5.8.x
Niagara Fluids status: Beta
Plugin enabled/restart: verified
Template: exact name
Dimension: 2D or 3D
RHI/platform:
Core requirement: No
Fallback: Sprite flipbook
```

### Дослідження live-версії

Почни з найменшого template. Запиши:

- grid resolution/domain size;
- stages і кількість iterations, видимі у stack;
- settings source/injection;
- renderer/material;
- bounds;
- докази memory/profile;
- відомі обмеження camera/platform.

Змінюй одну змінну:

```text
resolution A/B
or iterations A/B
or one solver feature
```

Ніколи не змінюй усе одночасно.

### Checklist для bake

Якщо Niagara Baker доступний:

```text
Frame range/fps
Atlas rows/columns
Frame order
Output resolution
Padding/edge bleeding
Captured attribute/render target
Color/alpha/HDR format
Output assets
```

Точні можливості UI/output:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Якщо він недоступний, зроби скриншот відсутнього UI/template state і зупинись; не вигадуй atlas.

### Відтворення Sprite

```text
Texture atlas
→ SubUV/flipbook UV
→ Sprite material
→ Niagara age-driven frame index
→ black/mid/white background
→ loop/non-loop test
```

Перевір:

- правильний порядок кадрів;
- відсутність bleeding;
- alpha/color space;
- mip/distance;
- memory;
- overdraw;
- orientation.

### Порівняння

| Вимір | Live fluid | Flipbook |
|---|---|---|
| Dynamic interaction | вищий потенціал | фіксовані кадри |
| Вартість simulation | grid/stages під час runtime | відсутня або низька simulation |
| Texture memory | менша залежність від atlas | пам’ять atlas |
| Overdraw | залежить від renderer | покриття sprite |
| Варіативність | runtime controls | playback/tint/UV |
| Платформа | перевірка Beta/support | стандартний texture/render path |

### Рекомендація

Для portfolio R&D: live-дослідження Beta допустиме, якщо має відповідне маркування. Для ключового gameplay cue: використовуй перевірене стандартне представлення Niagara/material; flipbook — лише після перевірки texture memory/overdraw/import. Ніколи не роби Beta Fluids єдиним deliverable.

### Рубрика (опційно)

| Критерій | Бали |
|---|---:|
| Чесне зазначення Beta/build/plugin | 20 |
| Контрольоване live-дослідження | 20 |
| Bake metadata / ручні перевірки | 20 |
| Перевірка playback | 20 |
| Рекомендація / fallback на основі доказів | 20 |

Ця оцінка не замінює й не змінює G08.
