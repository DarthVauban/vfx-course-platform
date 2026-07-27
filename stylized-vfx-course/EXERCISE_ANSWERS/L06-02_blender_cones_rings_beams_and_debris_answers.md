# Рішення до уроку 06.02

## EX-L06-02-A

### 1. Elemental-бриф

Модельний kit: stylized impact землі/каменю. Це оригінальне сімейство shapes, а не копія game asset.

### 2. Список assets

```text
SM_VFX_Earth_Cone_01
SM_VFX_Earth_Ring_01
SM_VFX_Earth_Beam_01
SM_VFX_Earth_Debris_A
SM_VFX_Earth_Debris_B
SM_VFX_Earth_Debris_C
```

### 3. Cone/frustum

```text
Segments: 10
Base radius: 0.55
Top radius: 0.10
Length: 1.35
Caps: removed
Origin: base center
Style: slightly faceted, directional volume
```

Причина: 10 sides зберігають stylized facets за номінального кута. Тест із 6 sides був надто кутастим поблизу камери; 16 не додали корисного silhouette для цього brief.

### 4. Ring

```text
Segments: 14
Outer radius: 1.0
Inner radius: 0.68
Width: 0.32
Center fill: none
Origin: center
```

Кожен другий зовнішній vertex отримує малу radial variation до 5%, щоб уникнути ідеального машинного кола, зберігаючи порядок UV. Ця variation опційна; вона не має створювати crossed faces.

### 5. Beam

```text
Type: single tapered card
Sections: 5
Widths: .10/.24/.30/.22/.08
Centerline: straight
Origin: source
Cross-card: test object only, not delivery default
```

Застосування: коротке earth energy connection або проєкція crack. Cross-card відхилено для core kit, бо очікуване використання на землі з контрольованою камерою не виправдовує подвійного overlap.

### 6. Debris

| Asset | Dimensions mesh data | Структурна зміна | Origin |
|---|---|---|---|
| A | 1.0×0.32×0.28 | Довгий wedge, один піднятий corner | Приблизно центр |
| B | 0.62×0.58×0.48 | Компактний block, одна похила plane | Приблизно центр |
| C | 0.88×0.50×0.18 | Плоска plate, tapered-кінець | Трохи нижче центра |

Усі meshes закриті, використовують `Shade Flat`, мають узгоджені outward normals і не мають bevel/subdivision.

### 7. Audit

| Asset | Функція | Open/closed | Ризик кута | Навіщо ця topology |
|---|---|---|---|---|
| Cone | Directional volume | Відкритий | Широкий у близькому view | 10 sides зберігають facets |
| Ring | Реакція землі | Відкритий strip | Тонкий за низької камери | 14 sides достатньо за номінального кута |
| Beam | Source-target | Відкритий | Edge-on | 5 секцій створюють taper |
| Debris A/B/C | Обертові chunks | Закриті | Без значних ризиків | Різні silhouettes, flat shading |

### 8. Чому рішення працює

Kit використовує спільну blocky earth-мову, але assets виконують різні функції. Radial density визначено тестами кутів; variation debris змінює структуру mesh, а не transforms.

### 9. Допустимі альтернативи

- Earth ring може використовувати 12 або 16 sides.
- Cone може бути коротшим і ширшим для ground eruption.
- Beam можна прибрати, якщо elemental kit його не потребує, але exercise вимагає його для практики workflow.
- Origins debris можна розмістити в contact corners, якщо заплановано planted motion.

### 10. Поширені хибні рішення

- Apex cone із нульовим radius.
- Заповнений центр ring.
- Три ідентичні cubes із різним object scale.
- Cross-card прийнято без доказів angle/overlap.

### 11. Перевірка

- Face Orientation.
- Solid/wireframe.
- 25% silhouettes.
- 0°/35°/70°.
- Origin rotation.
- Object transforms чисті.
- Немає internal faces.

### 12. Performance

Основні ризики: широка surface ring/cone, overlap cross-card і майбутня кількість mesh-particles. До профілювання в UE жодний budget не заявляється.

---

## EX-L06-02-B

### 1. Original і Reduced

| Asset | Original | Reduced | Приблизне скорочення |
|---|---|---|---:|
| Cone | 16 sides / ~32 side triangles | 10 sides / ~20 | 37.5% |
| Ring | 24 sides / ~48 triangles | 16 sides / ~32 | 33.3% |
| Beam | 5 sections / ~8 triangles | 4 sections / ~6 | 25% |

Counts припускають відкриті surfaces і просту triangulation; фактичну локальну triangulation copy потрібно перевірити.

### 2. Рішення щодо cone

- 10 sides проходять silhouette за nominal/far.
- Поблизу під 35° facets стають видимими, але це підтримує stylized earth-мову.
- **Рішення:** залишити Reduced.

### 3. Рішення щодо ring

- 16 sides проходять nominal-тест.
- У близькому top-down view corners polygons видимі, але прийнятні.
- Width і зовнішні dimensions не змінено.
- **Рішення:** залишити Reduced як кандидат для Medium/Low; зберегти Original для порівняння High.

### 4. Рішення щодо beam

- Видалення середньої секції змінює peak width із плавного на асиметричний.
- View у 25% проходить тест, але подальший план material/WPO потребує control у центрі.
- **Рішення:** відхилити Reduced для core; залишити Original із п’ятьма секціями.

### 5. Чому скорочення контрольоване

Reduction змінює один вимір topology за раз і використовує ті самі:

- зовнішні dimensions;
- origin;
- material test setup;
- camera;
- scale silhouette.

Це не automatic decimation.

### 6. Допустимі альтернативи

- Відхили cone з 10 sides, якщо цільовий стиль вимагає smooth circular volume.
- Залиш ring із 12 sides, якщо far view проходить тест.
- Beam із чотирма секціями валідний, якщо жодні center deformation/gradient не потребують секції.

### 7. Поширені хибні рішення

- Порівнювати різні scales.
- Видаляти випадкові vertices, створюючи twisted faces.
- Стверджувати про виграш performance лише на основі відсотка triangles без вимірювання в UE.
- Залишати явно зламаний Reduced, щоб досягти числової цілі.

### 8. Перевірка

1. Тимчасова triangulation copy.
2. Запис кількості triangles.
3. Solid-white у 25%.
4. Near/nominal/far.
5. 35°.
6. Origin і normals не змінено.
7. Keep/reject із доказом одним реченням.

### 9. Performance

Скорочення triangles — лише один фактор. Translucent screen coverage ring/cone і кількість instances можуть домінувати. Candidates позначено для подальшого профілювання, а не оголошено швидшими.
