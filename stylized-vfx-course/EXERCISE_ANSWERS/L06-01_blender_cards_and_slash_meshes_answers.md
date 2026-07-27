# Рішення до уроку 06.01

Відкривай після власної спроби та трьох hints. Значення нижче — еталонне рішення, а не єдина правильна topology.

## EX-L06-01-A

### 1. Список objects

```text
SM_VFX_Card_Quad_01
SM_VFX_Card_Curve_01
SM_VFX_Card_Beam_01
```

Усі objects:

- Location `0,0,0` у delivery collection;
- Rotation `0,0,0`;
- Scale `1,1,1`;
- узгоджені front normals;
- без duplicate back faces;
- збережено в `EX_L06_01_A_card_kit.blend`.

### 2. Card з одним quad

Topology:

```text
4 vertices
4 edges
1 quad
```

Bounds mesh:

```text
X: -0.5 ... 0.5
Y: -0.5 ... 0.5
Z: 0
```

Origin: центр.

Застосування: статична flash/smoke card, керована texture, коли deformation не потрібна.

Чому без subdivision: silhouette front/35° не покращується, а вимога WPO у brief відсутня.

### 3. Вигнута card із трьома секціями

Topology:

```text
6 vertices
7 edges
2 quads
```

Sections:

| Секція | X | Локальний offset depth |
|---|---:|---:|
| 0 | -0.50 | 0.00 |
| 1 | 0.00 | 0.12 |
| 2 | 0.50 | 0.00 |

Висота: `1.0`.

Origin: центр.

Застосування: широка smoke/energy sheet із легкою curvature, що зберігає area під 35° краще за flat card.

Чому одна додаткова секція: middle offset створює помітну curvature. Додаткові sections не дали помітної різниці в тесті кутів.

### 4. Tapered beam card

Topology:

```text
8 vertices
10 edges
3 quads
```

| Секція | X | Ширина |
|---|---:|---:|
| 0 | -1.00 | 0.10 |
| 1 | -0.35 | 0.35 |
| 2 | 0.35 | 0.35 |
| 3 | 1.00 | 0.10 |

Origin: центр першої секції.

Застосування: ріст beam/slash від source.

### 5. Тест кутів

| Mesh | 0° | 35° | 70° | Висновок |
|---|---|---|---|---|
| Quad | Чіткий | Вужчий | Майже edge-on | Задокументувати потребу camera-facing |
| Curve | Чіткий | Зберігає частину area | Вузький | Корисний для косих gameplay-ракурсів |
| Beam | Напрямок чіткий | Напрямок зберігається | Тонкий | За крайнього кута потребує підтримки material/camera |

### 6. Таблиця обґрунтування topology

| Mesh | Що робить кожна додана секція? |
|---|---|
| Quad | Додаткових секцій немає |
| Curve | Середня секція створює curvature/parallax |
| Beam | Внутрішні секції створюють стабільну body й tapered-кінці |

### 7. Чому рішення працює

Kit охоплює три різні surface-контракти без довільної density. Normals/origins налаштовано свідомо, а аркуш кутів фіксує обмеження замість того, щоб їх приховувати.

### 8. Допустимі альтернативи

- Curved card може мати чотири секції, якщо silhouette помітно покращується.
- Origin beam може бути в центрі, якщо use case передбачає radial scale.
- Card може лежати в іншій local plane, якщо convention axis задокументовано й згодом перевірено в UE.

### 9. Поширені хибні рішення

- Grid із десятками faces без deformation.
- Дві coincident planes для імітації `Two Sided`.
- Endpoints beam стягнуто в duplicate vertices.
- Object Scale відрізняється для assets без apply або запису.

### 10. Перевірка

1. Увімкни wireframe.
2. Запускай `Merge by Distance` лише з безпечним threshold і підтвердь, що заплановані vertices не стягуються.
3. Перевір `Face Orientation`.
4. Поверни кожен object навколо origin.
5. Перевір 0°/35°/70°.
6. Поверни transforms у чистий стан.

### 11. Performance

Жодний числовий production budget не заявляється. Kit малої складності мінімізує geometry, зберігаючи задокументовані потреби surface; вартість translucent material буде виміряна пізніше в UE.

---

## EX-L06-01-B

### 1. Спільна topology

Кожен slash:

```text
5 cross-sections
10 vertices
4 quads
non-zero end widths
```

### 2. Fast

```text
Name: SM_VFX_Slash_Fast_01
Origin: start
Widths: .05, .18, .42, .30, .06
Centerline Y: -.18, -.08, .05, .16, .20
Centerline X: -1.0, -.55, 0, .55, 1.0
```

Дизайн:

- mass досягає максимуму трохи після центру;
- вузький передній кінець;
- неглибока forward curve;
- start origin підтримує growth/travel.

### 3. Heavy

```text
Name: SM_VFX_Slash_Heavy_01
Origin: contact/end
Widths: .18, .45, .70, .62, .16
Centerline Y: -.30, -.08, .18, .32, .22
Centerline X: -1.0, -.55, 0, .55, 1.0
```

Дизайн:

- широка center/contact mass;
- сильніша curvature;
- тупі, але не degenerate-кінці;
- contact origin підтримує placement/rotation навколо hit.

### 4. Arcane Precision

```text
Name: SM_VFX_Slash_Precision_01
Origin: center
Widths: .04, .26, .48, .26, .04
Centerline Y: -.25, .02, .24, .02, -.25
Centerline X: -1.0, -.50, 0, .50, 1.0
```

Дизайн:

- двостороння контрольована arch;
- найбільша mass у центрі;
- чисті вузькі кінці;
- center origin підтримує симетричні rotate/scale.

### 5. Порівняння silhouette

| Variant | Перше зчитування | 25% | 35° |
|---|---|---|---|
| Fast | Direction/speed | Проходить | Проходить |
| Heavy | Weight/impact | Проходить | Проходить, є ризик occlusion target |
| Precision | Контрольована arc | Проходить | На межі; за потреби трохи розширити центр |

### 6. Обґрунтування origin

- `Fast/start`: проявляється від weapon/source.
- `Heavy/contact`: позиціонується або обертається навколо impact.
- `Precision/center`: обертається симетрично.

### 7. Чому рішення працює

Усі три використовують однаковий topology budget, тому візуальна різниця походить від структурних proportions і curvature, а не від кількості polygons. Стратегія pivot відповідає запланованому motion.

### 8. Допустимі альтернативи

- Heavy може використовувати start origin для slash, прикріпленого до weapon.
- Precision може мати asymmetrical centerline, якщо design language залишається контрольованою.
- Шосту секцію дозволено лише тоді, коли тест angle/silhouette показує kink.

### 9. Поширені хибні рішення

- Та сама geometry з трьома object scales.
- Точно обведені arcs із game footage.
- Кінці нульової ширини.
- Pivot переміщено візуально, але origin object не змінено.

### 10. Перевірка

1. Наклади wireframes.
2. Підтвердь однакову кількість секцій.
3. Виконай solid-white порівняння у 25%.
4. Поверни на 30° навколо кожного origin.
5. Перевір Face Orientation.
6. Збережи перед будь-якою роботою з export.

### 11. Performance

Heavy має більший очікуване покриття екрана; Precision може потребувати camera-facing support; Fast геометрично найдешевший, але може зникати на відстані. Це дизайнерські ризики, а не виміряна вартість UE.
