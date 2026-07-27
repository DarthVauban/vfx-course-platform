# Рішення до уроку 06.03

Деталі UI/importer потрібно перевірити у встановлених версіях. Кроки UE, що залежать від версії, зберігають обов’язкову фразу: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L06-03-A

### 1. Структура delivery

```text
L06_03_geometry_source.blend
L06_03_geometry_delivery.blend
VFX_Geometry_Kit.fbx
VFX_Geometry_Kit_Report.md
```

Objects:

```text
SM_VFX_Card_01
SM_VFX_Slash_01
SM_VFX_Cone_01
SM_VFX_Ring_01
SM_VFX_Beam_01
SM_VFX_Debris_A
SM_VFX_Debris_B
SM_VFX_Debris_C
```

### 2. Контракти UV

| Asset | Метод | Direction/seam | Перевірка |
|---|---|---|---|
| Card | Project from View | U зліва направо | Arrow checker спрямований правильно |
| Slash | Project from View | U від start до end | Arrow слідує за slash |
| Beam | Project from View | U від source до target | Контракт gradient/panner |
| Cone | Unwrap | Один longitudinal seam; довжина вздовж V | Стовпці checker без twist |
| Ring | Follow Active Quads/unwrap | Один radial seam; circumference U | Рівні сегменти checker |
| Debris | Ручні seams + unwrap | Seams на менш видимих edges | Без сильного stretch |

Немає ненавмисних overlaps. Islands debris запаковано; точну texel density задокументовано, а не припущено.

### 3. Normals/shading

| Asset | Рішення щодо normal | Shading |
|---|---|---|
| Card/slash/beam/ring | Один свідомо визначений front | Flat |
| Cone | Side normals назовні | Flat для stylized facets |
| Debris | Закриті outward normals | Flat |

`Two Sided` не використовується для приховування reversed faces.

### 4. VFXMask

Застосовано до slash і beam:

```text
Name: VFXMask
Domain: Point
R by sections: 0.00/0.25/0.50/0.75/1.00
G=0
B=0
A=1
```

Preview Blender показує чорний біля source і червоний біля target.

### 5. Origins

| Asset | Origin |
|---|---|
| Card | Центр |
| Slash | Початковий cross-section |
| Cone | Центр base |
| Ring | Геометричний центр |
| Beam | Cross-section source |
| Debris | Приблизний центр |

Тести Rotation збережено до export.

### 6. Transforms

Delivery:

```text
Rotation 0,0,0
Scale 1,1,1
```

Dimensions перевірено після застосування Rotation & Scale до delivery copies. Source-файл зберігає стан та історію до apply.

### 7. Triangulation

| Asset | Очікувана кількість triangles |
|---|---:|
| Card | 2 |
| Slash 4 quads | 8 |
| Cone 12 side quads | 24 |
| Ring 16 quads | 32 |
| Beam 4 quads | 8 |

Counts debris записано з фактичного mesh. Diagonals на non-planar faces перевірено вручну. Counts потрібно порівняти з UE, а не копіювати наосліп.

### 8. FBX test

Тестовий набір:

- reference cube розміром один метр;
- forward arrow;
- card.

Початкові settings export:

```text
Selected Objects on
Object Types Mesh
Forward -Y
Up Z
Apply Modifiers on only for reviewed delivery copies
```

Фактичні labels Blender залежать від версії.

### 9. UE validation

Screenshot шляху importer додано. Точні path/options:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

Модель validation report:

| Asset | Scale | Axis | Pivot | UV0 | Normal | VFXMask | Tris | Результат |
|---|---|---|---|---|---|---|---:|---|
| Card | Match marker | Correct | Center | Pass | Pass | n/a | 2 | Yes |
| Slash | Match | Correct | Start | Pass | Pass | R 0→1 | 8 | Yes |
| Cone | Match | Correct | Base | Pass | Pass | n/a | 24 | Yes |
| Ring | Match | Correct | Center | Pass | Pass | n/a | 32 | Yes |
| Beam | Match | Correct | Source | Pass | Pass | R 0→1 | 8 | Yes |
| Debris A/B/C | Match | Correct | Center | Pass | Pass | n/a | actual | Yes |

### 10. Debug materials

UV:

```text
TextureCoordinate → Texture Sample UVs
Texture Sample RGB → Emissive Color
Surface / Opaque / Unlit
```

Vertex Color:

```text
Vertex Color RGB → Emissive Color
Surface / Opaque / Unlit
```

Точні labels/nodes UE:  
**Потребує ручної перевірки в Unreal Engine 5.8.**

### 11. Чому рішення працює

Кожен контракт перевірено в цільовому engine. Тест one-meter/arrow/card ізолює variables pipeline до повного kit; debug materials підтверджують round trip UV і Color Attribute.

### 12. Допустимі альтернативи

- Напрямок UV може використовувати V від source до target, якщо всі materials і документація узгоджені.
- Ring може використовувати ручний rectangular unwrap замість Follow Active Quads.
- Окремий FBX для кожного asset валідний, якщо це передбачає pipeline команди.
- Import normals можна обчислювати для конкретних assets, але рішення й докази потрібно задокументувати.

### 13. Поширені хибні рішення

- Повний kit імпортовано до marker.
- Import Scale використано навмання.
- Збереження Vertex Color припущено зі screenshot Blender.
- Неправильні normals приховано через Two Sided.
- Неконтрольована triangulation importer.

### 14. Перевірка

- Повторно відкрий delivery Blender.
- Повтори export вибраних objects.
- Зроби reimport у чисту папку UE.
- Застосуй debug UV і Vertex Color.
- Обертай навколо pivot.
- Порівняй dimensions/triangles.
- Архівуй звіт.

### 15. Performance

Collision не генерується. Додаткові materials автоматично не створюються. Counts geometry і широкі surfaces записано для подальшого профілювання Niagara/material.

---

## EX-L06-03-B

### 1. Таблиця несправностей

| Несправний asset | Внесена несправність | Симптом в UE | Правильна діагностика |
|---|---|---|---|
| Card_FaultUV | UV island повернуто на 90° | Arrow checker рухається поперек запланованого напрямку | Контракт UV |
| Card_FaultNormal | Front normal перевернуто | Відсутня або неправильна side в односторонньому debug | Контракт normal |
| Slash_FaultPivot | Origin у world center | Rotation обертається далеко від slash | Контракт pivot |
| Cone_FaultScale | Object Scale 2,1,.5 не застосовано | Невідповідність dimensions/non-uniform transform | Контракт transform/scale |
| Beam_FaultColor | VFXMask перевернуто або відсутній | Debug UE чорний або перевернутий | Контракт attribute |

### 2. Журнали діагностики

#### Fault UV

```text
Симптом: arrow checker спрямована поперек width.
Гіпотеза: UV island повернуто.
Тест: перевірити UV0 в UE і порівняти із source.
Першопричина: island повернуто на 90°.
Виправлення: повернути island, повторити export/reimport.
Доказ: arrow спрямована від source до target.
```

#### Fault normal

```text
Симптом: card не видно з очікуваного front в односторонньому debug.
Гіпотеза: normal перевернуто.
Тест: Face Orientation у Blender, а не Two Sided.
Першопричина: face перевернуто.
Виправлення: виконати Flip вибраної normal, повторити export.
Доказ: очікуваний front видно; workaround не використано.
```

#### Fault pivot

```text
Симптом: slash рухається по орбіті під час rotation.
Гіпотеза: origin розташований поза mesh.
Тест: повернути instance Static Mesh.
Першопричина: origin у world center.
Виправлення: 3D Cursor на початку, Set Origin, повторити export.
Доказ: slash обертається або росте від start.
```

#### Fault scale

```text
Симптом: size/profile cone неочікуваний.
Гіпотеза: non-uniform Object Scale.
Тест: порівняти reference cube і transform Blender.
Першопричина: Scale 2,1,.5.
Виправлення: backup source/delivery, Apply Rotation & Scale, перевірити dimensions.
Доказ: чистий transform і відповідні dimensions в UE.
```

#### Fault VFXMask

```text
Симптом: beam чорний або gradient іде від target до source.
Гіпотеза: attribute відсутній або перевернуто name/domain/data.
Тест: preview attribute Blender + debug Vertex Color в UE.
Першопричина: values перевернуто, а export copy не мала фінального attribute.
Виправлення: точний VFXMask, R 0→1 за секціями, повторний export.
Доказ: червоний gradient від source до target.
```

### 3. Чому виправлення належать до source

Hacks import/material можуть приховати симптоми, але залишити контракт asset зламаним. Виправлення source і reimport доводять відтворюваність.

### 4. Допустимі альтернативи

- Якщо importer навмисно обчислює normals, тест усе одно потребує задокументованого очікуваного результату.
- Проблему pivot можна виправити wrapper на стороні engine лише тоді, коли production pipeline явно цього вимагає; не в цьому beginner baseline.
- Несправність axis може замінити одну з п’яти несправностей, якщо її повністю задокументовано.

### 5. Поширені хибні рішення

- Увімкнути Two Sided.
- Задати Import Uniform Scale 100 для одного asset.
- Повернути розміщений Actor і назвати axis виправленою.
- Намалювати gradient material замість виправлення Vertex Color.
- Видалити несправний asset без діагностики.

### 6. Перевірка

Кожен виправлений asset:

1. новий export;
2. чистий reimport;
3. той самий debug material;
4. ті самі camera/test transform;
5. screenshot до/після;
6. рядок звіту змінено з Fail на Pass.

### 7. Performance

Внесення несправностей також запобігає прихованим performance-помилкам: duplicated surfaces через workaround normals, невідповідності scale між assets, додаткові textures замість attributes і неконтрольована geometry.
