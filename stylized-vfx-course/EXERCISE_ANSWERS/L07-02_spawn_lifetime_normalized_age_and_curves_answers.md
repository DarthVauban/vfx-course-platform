# Рішення вправ — 07.02 Spawn, lifetime, normalized age і curves

Version-sensitive labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L07-02-A

### Обґрунтування

Три emitters — foundation-safe спосіб дати phases різний color без events, custom modules або spawn-group branching. Вони мають однакову simulation architecture; змінюються тільки time, count, color і seed.

### Повний stack System

Для `Phase_A`, `Phase_B`, `Phase_C`:

```text
Emitter Properties: CPUSim; Local Space False; Determinism True
Emitter Spawn: no added modules
Emitter Update
  Emitter State
  Spawn Burst Instantaneous
Particle Spawn
  Initialize Particle
Particle Update
  Particle State
  Scale Color
  Scale Sprite Size
Render
  Sprite Renderer
```

Групи System: `System Properties`; порожній `System Spawn`; `System Update > System State`.

### Точні значення

| Emitter | Seed | Count | Spawn Time | Color | Position |
|---|---:|---:|---:|---|---|
| `Phase_A` | `1202` | `4` | `0.00` | `(1,.1,.02,1)` | `(-40,0,0)` |
| `Phase_B` | `1203` | `6` | `.25` | `(1,.8,.02,1)` | `(0,0,0)` |
| `Phase_C` | `1204` | `2` | `.50` | `(.1,.6,1,1)` | `(40,0,0)` |

Для всіх: `Emitter State = Self/Complete/Once/Fixed 1.0 s`; `Lifetime=1.0 s`; velocity дорівнює нулю; size `(24,24)`. Крива Alpha `(0,0),(.1,1),(.8,1),(1,0)`. Крива Size `(0,.5),(.1,1),(1,0)`.

Bindings Sprite Renderer: Position/Color/Velocity/Rotation/Size/NormalizedAge до відповідних `Particles.*`; material `MI_VFX_FoundationSprite`; Face Camera; Unaligned.

### Timeline і перевірка

| Межа | Очікувана подія |
|---:|---|
| `0.00` | народжується 4 A |
| `.25` | народжується 6 B; normalized age A дорівнює `.25` |
| `.50` | народжується 2 C; A `.5`, B `.25` |
| `1.00` | A досягає death |
| `1.25` | B досягає death |
| `1.50` | C досягає death |

Emitter loop may become inactive at `1.0`, but `Inactive Response=Complete` lets existing particles finish. If the installed build kills late phases at emitter completion, extend loop to `1.6 s`; record deviation. **Потребує ручної перевірки в Unreal Engine 5.8.**

### Альтернативи, неправильні рішення й performance

Кілька burst modules в одному emitter допустимі, коли всі фази мають спільні attributes. Без додаткової логіки вони не задають незалежно три кольори. Неправильно: три нескінченні loops; lifetime, відрахований від нуля emitter; random lifetime; event handlers. Три emitters додають overhead, прийнятний заради ясності; об’єднуйте їх пізніше лише після досягнення потрібної поведінки й профілювання.

## EX-L07-02-B

### Обґрунтування

Однаковий total spawn не означає однакового розподілу в часі. Burst одразу створює всі 20; Rate розподіляє їх упродовж секунди. Lifetime `.5` обмежує живу популяцію Rate приблизно до 10.

### Повні stacks

Обидва emitters використовують:

```text
Emitter Properties: CPUSim, Local Space False, Determinism True
Emitter Spawn: empty
Emitter Update: Emitter State; [Burst or Rate]
Particle Spawn: Initialize Particle
Particle Update: Particle State; Scale Color; Scale Sprite Size
Render: Sprite Renderer
```

`Burst_20`: seed `1210`, loop `1 s`, `Spawn Burst Instantaneous Count=20 Time=0`, lifetime `.5`, position `(-75,0,0)`.

`Rate_20`: seed `1211`, loop `1 s`, `Spawn Rate=20/s`, lifetime `.5`, position `(75,0,0)`.

Для обох: size `(20,20)`; velocity дорівнює нулю; alpha `(0,1),(.8,1),(1,0)`; default renderer bindings `Particles.*`.

### Довідкова таблиця

| Час | Burst: накопичено / живі | Rate: накопичено / живі, приблизно |
|---:|---:|---:|
| `.25` | `20 / 20` | `5 / 5` |
| `.50` | `20 / межа death` | `10 / ~10` |
| `.75` | `20 / 0` | `15 / ~10` |
| `1.00` | `20 / 0` | `20 / ~10`, потім decay |
| `1.50` | `20 / 0` | `20 / 0` |

Спостережувані значення на межах кадрів можуть відрізнятися на одну або кілька частинок через sampling; умовами приймання є trend та інтегрований total.

### Чому це працює, альтернативи й неправильні рішення

Кожна частинка Rate починається в інший момент, тому її normalized curve зміщена за фазою. Один burst має синхронізовані фази. Допустима альтернатива — Spawn Per Frame лише тоді, коли ви вивели й задокументували залежність від frame; це не рівнозначно rate за секунду. Неправильно: задати lifetime `1` лише одному emitter, порівнювати auto-play із різними моментами старту або виводити total з одного alive counter.

### Перевірка й performance

Подайте повні stacks, протокол reset, п’ять захоплень, theoretical/observed columns і речення: «однаковий total, різні concurrency та overdraw». Peak Burst дорівнює 20; peak Rate — приблизно 10, тому пікове навантаження render/simulation різне, навіть коли загальна робота ефекту наближається до 20.
