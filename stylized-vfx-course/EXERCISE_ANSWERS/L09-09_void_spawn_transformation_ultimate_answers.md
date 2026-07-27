# Рішення вправ L09-09

Зовнішні phase data керують послідовністю. Assets, похідні від референсу, або покадрові копії заборонені.

## EX-L09-09-A — Прототип переходу spawn-to-transformation

### Повна побудова

1. Контракт User містить Center, OwnerPosition/Up, PhaseIndex, Phase01, colors і seed.
2. Phase0 `.00–.45`: world portal ring/card, scale `.2→1.1→.8`; 24 inward motes.
3. Phase1 `.45–1.25`: attached shell, alpha `0→.55`; 8 власних shard meshes, orbit radius 90–140, angular speed 1.2–2.4.
4. Переходи фаз надходять від авторитетного controller, а не від timers emitter.
5. Покриття Shell лишається нижчим за поріг втрати силуету animation; задокументуйте експеримент 30/60/90%.
6. Під час teleport зупиніть і скиньте attached history до зміни transform.
7. Під час despawn attached shell/shards виконують exit; world portal/residue мають власний обмежений lifetime.
8. H/M/L: 8/4/0 shards; full/limited/outline shell; portal видимий завжди.
9. Перевірте activation, interruption, teleport, повторну pooled activation і знищення owner.

### Чому це працює

World portal позначає місце появи; attached shell передає стан. Зовнішні фази синхронізують їх і дозволяють interruption. Окремий життєвий цикл не дає residue слідувати за персонажем або shell лишатися у світі.

### Допустимі альтернативи

- Attached cage з cards замість shell mesh.
- Чотири orbit shards плюс ribbon arcs.
- Spawn із наземного eclipse або вертикального tear, якщо місце лишається зрозумілим.

### Типові неправильні рішення

- Portal прикріплено до персонажа.
- Shell залишено у world space.
- Незалежні clocks дрейфують після зміни duration.
- Миттєвий kill обрізає transformation.
- Повторне використання pool зберігає застарілий PhaseIndex.

### Перевірка

Подайте журнал фаз, world/attached axes, дошку силуетів, interruption/teleport/pool tests, provenance, H/M/L і bounds. Spawn і transformation мають визначатися у відтінках сірого.

### Performance

Low зберігає portal і контур shell. Orbit shards/distortion зменшуються першими. Профілюйте повний життєвий цикл, а не лише release.

## EX-L09-09-B — Оригінальний eclipse character ultimate

### Повна побудова

#### Етап 1

Побудуйте круглий portal, linear suction, прості release і residue під керуванням зовнішніх фаз.

#### Етап 2

Запишіть лише співвідношення фаз, покриття силуету, suction speed і контраст calm:release. Створіть власні eclipse/petal assets; не копіюйте timing/sigil/audio відомого ultimate.

#### Етап 3

1. Форма: зміщений center eclipse + три fractured petals із нерівномірними rotations `−22°,17°,71°`.
2. Таймінг: reveal `.32`; suction `1.05`; false calm `.18`; release A `.10`; gap `.06`; release B `.24`; residue 1.1.
3. Рух: 24/s motes рухаються inward spiral на 2.5 оберти з radius exponent 1.6; release інвертує спіраль зі швидкістю 450–1000, а petals чергують напрямок.
4. Колір: майже чорний Body, pale mint Core, rose-violet Edge.
5. Radius telegraph лишається видимим під час calm і дорівнює ігровому радіусу.
6. One-shot edge для release; скидайте phase/particles під час reuse.
7. H/M/L відповідають таблиці tier уроку; Low зберігає portal/shell/telegraph/flash+wave/petals.

### Чому це працює

Eclipse/fracture змінює форму, асиметрична структура фаз — таймінг, suction-inversion — рух, а нова ієрархія — колір. False calm посилює контраст, не прибираючи чесності.

### Допустимі альтернативи

- Зміщена прямокутна void gate із двома folding panels.
- Inward ribbon lattice з подальшою spherical inversion.
- Mint можна замінити на pale amber, якщо збережено value hierarchy і різницю за чотирма осями.

### Типові неправильні рішення

- Purple recolor технічної послідовності.
- Calm прибирає boundary.
- Release керується Niagara timer, а не gameplay.
- Відомий ultimate скопійовано beat-for-beat.
- Shell/telegraph перекривають character/area.

### Перевірка

Подайте авторитетні markers phase/release, порівняння білих форм, timing chart, накладення spiral path, колірну смугу, ethics/provenance, interruption/pool reset, H/M/L, повні bounds і concurrency. Coverage ledger стає 19/19.

### Performance

Профілюйте одного hero + чотири одночасні зменшені sequences. Distortion, покриття shell, щільність suction і велика wave — основні кандидати на зменшення. Low зберігає ігрові state/fairness/release.
