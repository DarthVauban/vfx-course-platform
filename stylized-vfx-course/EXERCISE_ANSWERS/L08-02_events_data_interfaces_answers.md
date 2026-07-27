# Розв’язки L08-02 — Events, Data Interfaces і skeletal sampling

## EX08-02-A — Іскри hit: Event проти детермінованої альтернативи

### Варіант A — CPU Collision/Death Event

```text
Source:
  Sim Target = CPU
  Persistent IDs = true
  Burst = 40–80
  CPU Collision
  Generate Collision Event або Death Event
  Generation bounded: first relevant event / probability / count policy

Receiver Event Handler:
  Exact Source Emitter
  Matching event type/name
  Spawn Number = 1
  Lifetime = .08–.18
  Size = 24–48
  White-yellow core, fast alpha fade
```

Точний спосіб обмежити перший collision event і вихідний payload:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Використовуй лише підтверджені атрибути; не вигадуй `Particles.HasCollided`, якщо module його не відкриває.

### Варіант B — Відомі gameplay-системі transform/timing

```text
Blueprint/gameplay already knows HitTransform
→ Spawn/activate Niagara System at HitTransform
→ Source sparks burst at t=0
→ Secondary flash burst at t=0–.03
→ No per-particle event communication
```

Якщо ефект міститься в одному System, обидва emitters використовують детермінований gate за emitter/system age або burst timing.

### Рішення

Обирай **варіант B** для стандартного melee hit, де gameplay уже надає точний hit transform. Він:

- зберігає авторитетну позицію;
- підтримує source sparks на GPU, якщо це корисно;
- уникає Persistent IDs/Event DataSet;
- має детермінований таймінг;
- його простіше використовувати з pooling і повторно.

Обирай A лише тоді, коли secondary має виникати в непередбачуваних точках контакту окремих CPU particles і візуальна користь виправдовує вартість.

### Контрольоване порівняння

Зафіксуй:

- materials джерела й receiver;
- заплановану загальну кількість secondary flashes;
- camera/exposure;
- репрезентативну конкурентність hit;
- тривалість.

Запиши:

```text
CPU Niagara time/categories
GPU renderer cost
Event count/receiver count
Visual position fidelity
Failure under collision misses
Authoring/debug complexity
```

### Хибні рішення

- GPU-джерело з Event Handler.
- Відсутні Persistent IDs.
- Location Event щокадру для 80 іскор.
- Трактувати collision event як damage.
- Порівнювати 80 event-flashes з одним timed flash і називати лише таймінг виграшем performance, не зазначивши візуальну різницю.

### Рубрика

| Критерій | Бали |
|---|---:|
| Валідний setup CPU Event | 25 |
| Валідна детермінована альтернатива | 20 |
| Контрольоване візуальне порівняння | 15 |
| Production-вибір та обґрунтування | 20 |
| Відмова / fallback | 10 |
| Performance-докази | 10 |

## EX08-02-B — Аура на поверхні анімованого персонажа

### Контракт даних

```text
User.SourceSkeletalMesh
  Type: supported Skeletal Mesh Component DI/object parameter
  Owner: BP_CharacterVFXController
  Space: world output into world-space Niagara, or explicit local contract
  Validity: component valid and mesh assigned
  Fallback: emitter disabled/no spawn
```

### Sampling

Бажаний варіант:

- іменована область sampling для тулуба/рук;
- triangle/surface sampling зі зважуванням за площею;
- sampling стабільної точки під час spawn;
- зберігання normal/index/barycentric data, якщо поведінка follow цього потребує і module їх відкриває.

Fallback:

- sampling поверхні всього тіла;
- задокументована щільність;
- mask/filter для частинок поза бажаною висотою або областю лише тоді, коли це достатньо дешево й надійно.

### Аура зі sampling лише під час Spawn

```text
Particle Spawn:
  Skeletal Mesh Location
  Store Position
  Store SurfaceNormal
  Velocity = SurfaceNormal × 20–50

Particle Update:
  Particle State
  Drag
  Scale Color by NormalizedAge
```

Частинки від’єднуються й дрейфують; це навмисно.

### Аура, що слідує за поверхнею

Потребує стабільних sample coordinate/index і повторного sampling поточної skinned-поверхні. Не обирай новий випадковий triangle щокадру. Точні вихідні дані module/data:

`Потребує ручної перевірки в Unreal Engine 5.8.`

Якщо стабільний follow не вдається підтвердити, випускай ауру зі sampling лише під час spawn або прикріпи простіше mesh/sprite-представлення.

### Тести

| Тест | Умова проходження |
|---|---|
| Idle | Розподіл відповідає області |
| Швидка атака | Немає burst у world origin або space-offset |
| Root translation | Поведінка attach/detach відповідає наміру |
| Обертання / scale Actor | Normals/positions узгоджені |
| Невалідне джерело | Немає неконтрольованого spawn в origin |
| Знищення джерела | Emitter безпечно зупиняється / деактивується |
| Повернення з-за меж екрана | Bounds/culling не псує стан |

### Рішення CPU/GPU

Починай діагностику на CPU, адже видимість даних і debug там зрозуміліші. Переходь на GPU лише після підтвердження, що Skeletal Mesh DI/module підтримує потрібну operation/target в UE 5.8, а профіль на цільовій платформі показує виграш. Ніколи не обіцяй GPU-підтримку за аналогією.

### High/Low

```text
High:
  40/s
  torso+arms region
  optional stable follow for short lifetime
  normal-driven motion

Low:
  12/s
  spawn-only sample
  shorter lifetime/smaller coverage
  same aura hue and character-state cue
```

### Performance

- виконуй sampling під час Spawn, коли follow не потрібен;
- уникай full-body sampling для малого локального сигналу;
- зменшуй spawn/lifetime до додавання складних filters;
- вимірюй кілька анімованих персонажів;
- документуй overhead для DI instance/object;
- перевіряй підтримку цільової платформи.

### Рубрика

| Критерій | Бали |
|---|---:|
| Валідний контракт source/DI | 20 |
| Sampling/region з урахуванням площі | 15 |
| Коректні space і рух уздовж normal | 20 |
| Стабільний update без випадкової телепортації | 15 |
| Fallback для невалідного / знищеного джерела | 10 |
| Паритет сигналів High/Low | 10 |
| Докази на цільовій платформі / performance | 10 |

Поріг опанування: ≥80; валідність source, коректність space і відсутність випадкового повторного sampling є обов’язковими.
