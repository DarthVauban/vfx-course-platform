# Рішення вправ L09-08

Gameplay володіє radius, Charge01 і trigger; VFX робить цю обіцянку видимою.

## EX-L09-08-A — Чесний targeting telegraph

### Повна побудова

1. Контракт User: center, normal, `RadiusCm`, `Charge01`, `IsTriggered`.
2. Власний magic circle mesh/card, без скопійованих sigil/font.
3. `NE_Circle`: один persistent particle, scale від radius, rotation 15°/s, DynamicParameter Charge01.
4. `NE_Boundary`: чистий ring на точному зовнішньому радіусі; pulse `.96→1.02`, alpha `.6→1`.
5. `NE_Ticks`: one-shot accents на авторитетних порогах progress, що відповідають вибраній duration.
6. `NE_ChargeMotes`: 12×(1+Charge01)/s, рух усередину 80–240.
7. One-shot guard гарантує один trigger burst на rising edge.
8. Перевірте radii 250/400/650 і durations `.8/1.5/2.5`.
9. Використайте темну/сіру/світлу візерункову поверхню, вимкнений bloom і режим відтінків сірого.
10. H/M/L зберігають boundary і щонайменше три сигнали countdown/urgency.

### Чому це працює

Окрема boundary відповідає на питання «де» незалежно від bloom. Авторитетний Charge01 відповідає на «коли»; one-shot edge запобігає дублюванню burst. Magic circle додає ідентичність, не змінюючи радіус.

### Допустимі альтернативи

- Безперервний radial fill до boundary замість discrete ticks.
- Три arcs, що стискаються, як countdown.
- World-space material parameter collection лише за безпечних і задокументованих scope/lifecycle.

### Типові неправильні рішення

- Вільний clock усередині Niagara.
- Edge, що читається лише завдяки bloom.
- Interior art виходить за boundary.
- Trigger bool виконує spawn у кожному кадрі.
- Low прибирає сигнал таймінгу.

### Перевірка

Подайте похибку радіуса ≤5%, timestamp burst, що збігається з gameplay marker, перевірки one-shot/reuse, три фони з bloom off, provenance оригінальних assets, H/M/L і concurrent telegraphs.

### Performance

Тривалість persistent circle/boundary визначає накопичену вартість. Low зберігає boundary +3 ticks. Перевірте 1/6/16 telegraphs і одночасний burst.

## EX-L09-08-B — Оригінальний призматичний elemental burst

### Повна побудова

#### Етап 1

Концентричне circle, рівномірні ticks, radial rays і pillars.

#### Етап 2

Запишіть лише duration charge, контраст radius, криву tick і співвідношення шарів burst. Відбудуйте власні symbol/material.

#### Етап 3

1. Форма: triangular aperture всередині broken hex; без font/glyph.
2. Таймінг: інтервали `.30/.20/.12/.07`; aperture блокується за Charge01 `.96`.
3. Рух: inner/outer apertures обертаються зустрічно ±28°/s, потім зупиняються; release випускає три пари rays під 0/60/120°, delayed prism arcs у +`.06`.
4. Колір: ivory Core, розділені cyan/rose edges, темні negative gaps.
5. Flash `.08`, 12 rays `.25–.4`, 3–6 pillars `.35`, residue `.8`.
6. Trigger лишається точним за Charge01=1.

### Чому це працює

Геометрія, прискорений ритм, counter-rotation/axial release і призматична ієрархія відрізняються від технічного етапу, зберігаючи чесні радіус і таймінг.

### Допустимі альтернативи

- Square aperture із чотирма діагональними парами rays.
- Оригінальний п’ятикутний polygon з асиметричним delayed echo.
- Без pillars у пласкішому ігровому стилі.

### Типові неправильні рішення

- Обведено наявний proprietary magic symbol.
- Tick intervals візуально прискорюються, але trigger дрейфує.
- Prismatic colors замінюють зміни shape/motion, а не доповнюють їх.
- Negative gaps зникають під bloom.
- Low стає Flash без попередження.

### Перевірка

Подайте дошку білої геометрії, графік timing/trigger, захоплення rotation/pulse, колірну смугу, provenance джерел, матрицю фонів і H/M/L. Самоперевірка має передбачити і радіус, і момент до burst.

### Performance

High використовує 12 rays/6 pillars/prism arcs; Medium — 8/3 без додаткових arcs; Low — Flash+6 rays після boundary/ticks. Ground fill і великий bloom обмежують раніше, ніж основне попередження.
