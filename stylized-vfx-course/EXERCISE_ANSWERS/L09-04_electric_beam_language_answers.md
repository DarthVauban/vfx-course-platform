# Рішення вправ L09-04

Усі endpoint-и й gameplay timing надходять з authoritative system; reference assets не імпортуються.

## EX-L09-04-A — Бойовий beam із зафіксованими endpoints

### Повна побудова

1. Контракт User: `SourcePosition`, `TargetPosition`, `BeamWidth=9`, `NoiseAmplitude=45`, colors, `IsActive`.
2. Створіть 32 ordered points. Для `i=0..31`: `t=i/31`.
3. `Base=Lerp(Source,Target,t)`.
4. Побудуйте stable perpendicular basis Y/Z навколо axis.
5. `Offset=(Y×Noise1+Z×Noise2)×45×sin(πt)`.
6. `Position=Base+Offset`; для first/last point примусово Source/Target.
7. Core width 9, outer width 28; core emissive 10, outer 4.
8. Update points з current endpoints щокадрово.
9. Target burst 8 sparks на кожному primary pulse.
10. Перевірте target speed 0/300/600 cm/s і lengths 200/900/2200.
11. Виміряйте похибку першої/останньої точки; умова приймання <1 cm.
12. H/M/L: 48/32/16 points, branches 5/2/0; core connection завжди лишається.

### Чому це працює

Envelope зануляє noise на endpoints, тому style не спотворює gameplay relationship. Щокадрове оновлення тримає moving target, а core/outer hierarchy читається на різних backgrounds.

### Допустимі альтернативи

- Confirmed Niagara Beam modules замість власної point interpolation.
- 24 points для коротких beams.
- One ribbon material with core/outer bands, якщо profiling доводить benefit.

### Типові неправильні рішення

- Constant noise offset зсуває endpoints.
- Закешований у world space target спричиняє lag.
- Branches такі ж яскраві й широкі, як основний beam.
- Ribbon order/link не ініціалізовано.
- Low зберігає glow, але втрачає точне core connection.

### Перевірка

Подайте числові/debug markers endpoints, захоплення рухомої цілі, швидкий retarget із reset, кутову мову з білим матеріалом, H/M/L і bounds/performance. Історичного сегмента через увесь світ немає.

### Performance

Cost росте приблизно з active beams × paths × points, плюс pixel coverage. Profile 1/5/12 beams. Low removes branches/outer complexity before core.

## EX-L09-04-B — Оригінальний плетений ribbon discharge

### Повна побудова

#### Етап 1

Збережіть one-core/outer technical beam, continuous pulse і short source trail.

#### Етап 2

Запишіть лише core:outer width, segment density, on/off rhythm, branch count і pulse direction. Provenance points to own noise/ramp.

#### Етап 3

1. Три strands із фазами `0°,120°,240°`.
2. Для strand k: `OffsetK=(Y cos φk + Z sin φk)×Radius×sin(πt)` плюс невеликий angular noise.
3. Radius 18 cm; усі strands примусово сходяться в тих самих endpoints.
4. Charge `.18 s`; pulses `.06 on/.04 off` ×3.
5. Traveling bright band рухається U 0→1 протягом кожної on phase.
6. Сторона Branch чергується +/− для кожного pulse; lifetime `.08–.12`.
7. Trail руху Source має lifetime `.22`; виконуйте reset під час retarget.
8. Colors: тепло-білий/жовтий Core, magenta-violet Outer, повністю читабельні темні gaps.

### Чому це працює

Три фазово зміщені paths змінюють форму, staccato charge — таймінг, traveling band/polarity — рух, а нова ієрархія — колір. Спільні endpoints зберігають функцію.

### Допустимі альтернативи

- Twist із двох strands та роздвоєним кінцем.
- Чотири strands лише в hero tier.
- Одна traveling band, керована material, поверх статичної геометрії.

### Типові неправильні рішення

- Три паралельні дублікати без phase rotation.
- Radius braid не сходиться до нуля в endpoints.
- Безперервна біла emission ховає pulses.
- Історія trail переживає retarget.
- Path beam із референсу обведено.

### Перевірка

Подайте накладення білих paths, timing chart, захоплення U pulse, похибку endpoint, retarget/reset, provenance і H/M/L. Самоперевірка розрізняє beam connection і source trail.

### Performance

High: 3×48 points; Medium: один Core на 32 точки плюс Outer; Low: один Core на 16 точок. Braid є першим кандидатом на зменшення складності, а endpoint/contact cue — ні.
