# Розв’язки L08-01 — CPU/GPU simulation і collision

## EX08-01-A — Досьє рішень для чотирьох брифів

| Бриф | Початковий вибір | Відхилена альтернатива | Ризик відмови | Fallback / доказ |
|---|---|---|---|---|
| 80 іскор від удару меча | GPU, якщо ефект суто косметичний; CPU лише тоді, коли справді потрібен Event workflow | CPU Events за звичкою | Вартість Events / стрибок CPU або промах SceneDepth | Прибрати secondary event; використати другий emitter з часовим запуском; профілювати бойову конкурентність |
| Тривалий дощ | Кандидат на GPU; SceneDepth поблизу камери або DF залежно від вимог | CPU collision для кожної краплі | Велика кількість на CPU; промахи поза екраном або полем зору | Kill/clip поблизу камери, наближена реакція землі, окрема система splash |
| Самонавідний gameplay projectile | Gameplay Actor/Component керує траєкторією та hit; прикріплена Niagara-візуалізація може бути CPU або GPU | Particle як авторитетне джерело projectile | Десинхронізація, пропущений hit або обмеження даних | Gameplay collision завжди авторитетний; Niagara отримує transform/target |
| Фоновий пил поза екраном | Кандидат на GPU, без обов’язкового SceneDepth collision | Залежність collision від view depth | Частинки поза екраном не потрапляють у поверхні | Без collision / з обмеженнями volume / DF, якщо це обґрунтовано; перевірити bounds |

### Нюанс удару меча

Якщо secondary burst після collision суто декоративний, а його час передбачуваний, burst другого emitter, керований відомим таймінгом ефекту, може бути дешевшим і простішим за events для кожної частинки. Якщо в кожній точці удару іскри має з’явитися дочірній елемент і кількість мала, CPU Event Handler є допустимим рішенням, але його потрібно виміряти; також він потребує Persistent IDs.

### Нюанс дощу

Не обчислюй collision для кожного візуального штриха, щоб створити gameplay-вологість. Окреме представлення бризок на землі або gameplay/weather-логіка може наближено відтворити контакт. SceneDepth можна обмежити видимим дощем поблизу камери; distance fields використовуй лише тоді, коли якість полів і вартість проходять перевірку.

### Нюанс projectile

```text
Gameplay component:
  target/homing
  collision/hit
  lifetime
  damage

Niagara:
  trail/core/sparks
  receives position/direction/charge
  may use cosmetic local collision
```

### План доказів

- цільовий build / hardware / RHI;
- 1× і бойова конкурентність;
- категорії CPU/GPU profiler;
- перевірка поза екраном і обліт камерою;
- товста, тонка та рухома геометрія;
- паритет візуальних сигналів із fallback;
- відомі непідтримувані можливості.

### Оцінювання

| Критерій | Бали |
|---|---:|
| Вимоги сформульовано до вибору target | 20 |
| Чотири обґрунтовані рішення | 25 |
| Відхилені альтернативи | 15 |
| Випадки відмови | 15 |
| Fallback-рішення | 15 |
| План доказів на цільовій платформі | 10 |

## EX08-01-B — Сімейство collision із bounce/slide

### Спільний контракт System

```text
User.CollisionMode or separate emitter/instance configuration
User.Restitution01
User.Friction01
User.Drag
User.CollisionRadiusCm
User.Tint
```

Уникай однієї dynamic branch, якщо режими є фіксованими instances і статична конфігурація або конфігурація emitter буде чистішою.

### Металеві іскри

```text
Lifetime = 1.0–1.8
Initial speed = 700–1200 cm/s
Gravity Z = -980
Restitution = .45
Friction = .12
Drag = .05
Collision radius = 1–2 cm
```

Візуальний намір: один або два виразні відскоки, швидке згасання, невелика площа покриття.

### Пилинки

```text
Lifetime = 2–4
Initial speed = 80–250
Gravity Z = -100 to -400
Restitution = .05
Friction = .8
Drag = 1–3
Collision response = settle/kill if verified
```

Візуальний намір: без пружного відскоку; drift/settle.

### Магічні уламки

```text
Lifetime = 1.5–3
Initial speed = 300–700
Restitution = .25
Friction = .35
Drag = .2
After collision: cyan → violet, alpha fade
```

Альтернатива без Events: вихідні дані collision module або таймінг на основі age, якщо це перевірено. Якщо точний атрибут валідності collision недоступний, не вигадуй його:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### High/Low

```text
High:
  cosmetic collision active
  secondary color/contact response
  representative count

Low:
  reduced count
  no per-particle collision or simpler source
  timed short lifetime/kill below floor proxy
  primary impact flash and gameplay hit unchanged
```

### CPU/GPU parity

Паритет означає однаковий художній намір, а не ідентичні траєкторії. Зафіксуй:

- приблизний spread;
- область контакту;
- час згасання;
- ієрархію кольору та value;
- відомі промахи.

### Неприпустимі рішення

- Змінювати material/size/count між CPU- та GPU-baseline без явного зазначення.
- Використовувати Restitution >1, щоб без дизайнерської причини компенсувати втрачену енергію.
- Використовувати particle collision для damage.
- Приховувати проникнення геометрії за допомогою bloom.
- Робити так, щоб tier Low прибирав сигнал impact.

### Звіт про performance

Запиши:

```text
Build/platform/hardware:
Sim Target/source:
Count/lifetime:
Collision enabled:
Screen coverage/material:
CPU/GPU observations:
Visual misses:
Chosen tier:
```

Не вигадуй значення в мілісекундах. Числовий результат потребує capture на цільовій платформі.

### Оцінювання

| Критерій | Бали |
|---|---:|
| Три відмінні фізичні / художні реакції | 25 |
| Відкриті нормалізовані controls | 15 |
| Зафіксовані обмеження CPU/GPU | 15 |
| Паритет сигналів High/Low | 20 |
| Зафіксовані performance-докази | 15 |
| Твердження про gameplay authority | 10 |

Поріг опанування: ≥80; gameplay authority і паритет сигналів між tiers є обов’язковими.
