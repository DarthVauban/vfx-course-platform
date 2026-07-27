# Рішення до L01-03 — тестова VFX-сцена та import pipeline

## EX-L01-03-A — Другий import contract

### Source texture

Створи `T_Import_Gradient_512.png` за contract:

```text
Dimensions: 512×512
Color: grayscale, opaque
Interior: horizontal gradient
Left edge: 0.0 black
Right edge: 1.0 white
Border: 16 px solid white on all four sides
```

Border потрібен не для краси: він швидко показує crop, bleed, resize або неправильне framing preview.

### Source mesh

Створи `ImportProbe_Cone100`:

```text
Height: 1 m
Base diameter: 1 m
Origin: center of volume або center of base — обери один contract і запиши
Object Scale before export: (1,1,1)
UV maps: 1
Objects exported: 1 selected object
```

Для VFX attachment практичнішим часто є base-centered pivot, але в цій вправі будь-який із двох contract правильний, якщо він свідомий і rotation test відповідає запису.

### Import і validation

1. Імпортуй PNG у:

```text
/Game/VFXCourse/VFX/Textures/Diagnostics/T_Import_Gradient_512
```

2. Відкрий Texture Asset Editor.
3. Заповни:

| Check | Expected | Pass condition |
|---|---|---|
| Dimensions | 512×512 | Editor показує 512×512 |
| Left/right values | Black → white | Gradient не перевернутий |
| Border | 16 px on all sides | У 1:1 preview border симетричний |
| Alpha | Fully opaque | Немає accidental transparency |
| sRGB/compression/mips | Recorded | Значення не приховані словом `default` |

4. Імпортуй mesh у:

```text
/Game/VFXCourse/VFX/Meshes/Diagnostics/SM_Import_Cone100
```

5. Запиши фактичний importer. FBX або Interchange UI: **Потребує ручної перевірки в Unreal Engine 5.8.**
6. Розмісти actor у asset station з Scale `(1,1,1)`.
7. Порівняй його висоту з `Ref_Cube100`.
8. Обчисли:

```text
height ratio = imported cone height / reference cube height
```

9. Виконай pivot test:
   - якщо contract “base-centered”, rotation/placement має підтвердити точку біля основи;
   - якщо “centered”, object обертається навколо geometric center.
10. Перевір зовнішні faces, UV channel, material slots і geometry stats.

### Завершений validation record

| Asset | Source | Import observation | Verdict |
|---|---|---|---|
| `T_Import_Gradient_512` | 512×512 opaque PNG | Dimensions/pattern/border збігаються | Pass |
| `SM_Import_Cone100` | 1 m cone, documented pivot | Ratio записаний; pivot/UV/faces перевірені | Pass або Pass with observation |

`Pass with observation` є коректним, якщо scale ratio не 1, але mismatch точно виміряний і записаний для подальшого Blender/export lesson. `Pass` не ставлять лише за те, що asset “схожий на cone”.

### Чому це працює

Texture contract має ознаки, які однозначно перевіряються. Mesh contract розділяє geometry size, actor Scale й pivot. Camera station прибирає framing як додаткову змінну.

### Допустимі альтернативи

- Pyramid замість cone, якщо height, base, origin і UV contract так само задокументовані.
- 8- або 16-sided cone; side count записується, але не є mastery threshold.
- Border іншого значення у градаціях сірого, якщо він контрастує з gradient і точне значення відоме.

### Неправильні рішення

- Виправити size actor Scale і не записати source/import ratio.
- Назвати texture `T_Gradient_Final`.
- Експортувати весь Blender scene із camera/light.
- Припустити, що UV є, не відкривши mesh validation view.
- Змінити camera, щоб cone “краще вліз”.

### Performance note

512×512 має 262,144 source pixels, 256×256 — 65,536; pixel count зростає в чотири рази. Runtime resource size усе одно потрібно читати після UE import, бо compression/mips/platform format мають значення.

## EX-L01-03-B — Несправна пара та виправлена пара

Назва “Probe” означає test condition, а не доведену помилку.

### Texture pair

Створи:

```text
T_Import_RGBA_NPOT_Probe.png      300×180
T_Import_RGBA_POT_Corrected.png   512×256
```

Обидві textures мають той самий quadrant/alpha pattern. Не resize Probe in-place: потрібні два незалежні source files.

Імпортуй обидві з однаковим фактичним importer workflow і не змінюй `sRGB`, compression або mip settings до первинного record.

| Check | NPOT Probe | POT Corrected |
|---|---|---|
| Imported dimensions | Записати | Записати |
| Mip chain | Записати фактичний result | Записати фактичний result |
| Resource information | Записати | Записати |
| Alpha/channel pattern | Pass/fail | Pass/fail |
| Visible filtering at camera test | Screenshot | Screenshot |
| Verdict for target use | Аргументований | Аргументований |

Правильний висновок має одну з форм:

- `Probe непридатна для цього use case, тому що фактично відсутній/неприйнятний required mip/streaming result`.
- `Обидві працюють у цьому isolated test; POT Corrected обрана як course baseline для передбачуваного mip/packing workflow`.
- `Результат потребує target-platform test; universal failure не доведено`.

Неправильний висновок: “усі NPOT textures не працюють”.

### Mesh pair

Створи один base mesh і duplicate:

```text
ImportProbe_Unapplied
  Geometry base: cube
  Object Scale: (2.0, 0.5, 1.5)
  Apply Scale: No

ImportProbe_Applied
  Geometry base: duplicate того самого cube
  Visible Dimensions: ті самі
  Apply Scale: Yes
  Object Scale after apply: (1,1,1)
```

Експортуй кожен object окремо з однаковими exporter options. У UE:

```text
SM_Import_Transform_Probe
SM_Import_Transform_Corrected
```

Обидва actors розмісти з UE Scale `(1,1,1)`.

### Mesh comparison table

| Check | Probe | Corrected |
|---|---|---|
| Source Dimensions | Записано | Записано |
| Source Object Scale | `(2,0.5,1.5)` | `(1,1,1)` |
| Imported size | Виміряти | Виміряти |
| Imported ratio vs reference | Обчислити | Обчислити |
| Pivot rotation | Перевірити | Перевірити |
| Normals/faces | Перевірити | Перевірити |
| Import warning | Записати | Записати |

Exact result залежить від exporter/importer combination. Якщо обидва assets виглядають однаково, correct verdict:

```text
NO OBSERVED DIFFERENCE у цьому UE 5.8 build,
з цими exporter/importer options і цим test mesh.
```

Це не доводить, що unapplied transforms безпечні для всіх meshes, animation, pivots або pipelines.

### Чому це працює

У pair змінюється одна source property: dimensions family для texture або applied transform state для mesh. Names, station, UE actor Scale й capture conditions відокремлюють цю variable від решти.

### Неправильні рішення

- Import Probe з FBX, а Corrected з Interchange і приписати різницю transform.
- Змінити actor Scale для одного mesh.
- Порівняти assets у різних maps/cameras.
- Вимкнути mips лише для NPOT Probe.
- Видалити Probe до завершення evidence table.
- Назвати відсутність visible difference доказом повної pipeline equivalence.

### Verification

- чотири UE assets мають semantic `_Probe`/`_Corrected` names;
- source files незалежні;
- кожна pair використовує однаковий importer/options;
- raw observations записані до verdict;
- camera й placement однакові;
- corrected choice пояснюється target use;
- жодного universal claim без target-platform evidence.

### Performance note

Не порівнюй лише PNG/FBX file size. Для texture використовуй imported resource/mip information, для mesh — geometry stats і майбутній renderer context. Foundation exercise не встановлює production budget.
