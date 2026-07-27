# Рішення вправ — 03.01 Shader mental model і value types

Відкривайте цей файл після власної спроби, трьох hints і запису того, де саме виникла невизначеність. Версія: Unreal Engine 5.8; UI labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L03-01-A

### Обґрунтування

Мета — показати component composition без зайвої math. `Constant2Vector` зберігає R/G, `ScalarParameter` — B, а `AppendVector` утворює прогнозований Vector3. Opaque/Unlit із `Emissive Color` ізолює numeric output від lighting і transparency.

### Contract material

- Asset: `M_EX_L03_01_ValueDiagnostic`
- `Material Domain = Surface`
- `Blend Mode = Opaque`
- `Shading Model = Unlit`
- `Two Sided = False`
- `Use Material Attributes = False`

### Повний inventory nodes

| Alias | Exact node | Type / default |
|---|---|---|
| `RG_Base` | `Constant2Vector` | Vector2 `(0.15, 0.55)` |
| `B_Channel` | `ScalarParameter` | Scalar; name `B_Channel`; default `0.9` |
| `RGB_Compose` | `AppendVector` | A accepts Vector2; B accepts Scalar |
| `MaterialOutput` | Main Material Node | root |

### Точний список connections

```text
RG_Base.Output → RGB_Compose.A
B_Channel.Output → RGB_Compose.B
RGB_Compose.Output → MaterialOutput.Emissive Color
```

Orphan nodes відсутні.

### Чому це працює

`AppendVector((0.15,0.55),0.9)` дає `(0.15,0.55,0.9)`. Зміна `B_Channel` не перераховує R/G source. При `B=3`, output стає HDR у blue component, але це не змінює component count.

### Таблиця перевірки

| `B_Channel` | Numeric RGB | Очікування |
|---:|---|---|
| `0` | `(0.15,0.55,0)` | green-dominant |
| `0.5` | `(0.15,0.55,0.5)` | green/cyan |
| `1` | `(0.15,0.55,1)` | blue/cyan |
| `3` | `(0.15,0.55,3)` | HDR blue |

Перевірте:

1. compile без errors;
2. preview змінює лише blue contribution;
3. graph screenshot збігається з чотирма connection lines;
4. parameter name exact `B_Channel`.

### Альтернативний valid approach

Можна використати два послідовні `AppendVector`: три Scalar sources → Vector2 → Vector3. Це краще, коли кожен RGB channel повинен бути parameter. Воно не відповідає constraint цієї вправи про `Constant2Vector` RG, тому є valid general architecture, але не повна здача EX-L03-01-A.

### Типові неправильні рішення

- `B_Channel` під’єднано прямо до `Emissive Color`: RG branch не використовується.
- У `AppendVector.A` подано B, а в B — RG: component order стає B,R,G.
- Використано `VectorParameter`, і exercise більше не демонструє Vector2 + Scalar.
- Додано alpha та очікується transparency в Opaque material.
- Змінено exposure між captures, через що visual comparison ненадійний.

### Performance

Один `AppendVector` є тривіальною composition operation. Головний performance lesson — не робити висновок про майбутній translucent VFX із цього Opaque debug graph.

## EX-L03-01-B

### Обґрунтування

Потрібно розділити:

- numeric input;
- encoded texture color;
- linear shader data;
- display/tone-mapped appearance.

HDR визначається values понад standard `1`, а не bloom. `sRGB` має відповідати semantic content.

### Reference solution для observation

За фіксованого exposure заповніть таблицю власними measured descriptions. Приклад структури:

| Test | Input і settings | Numeric classification | Очікувана interpretation |
|---|---|---|---|
| 1 | RGB `(0.18,0.18,0.18)` | linear values inside `0–1` | dark gray numeric output |
| 2 | RGB `(0.5,0.5,0.5)` | linear values inside `0–1` | mid numeric gray; не обов’язково perceptual midpoint display |
| 3 | RGB `(1,1,1)` | standard white-level vector | white before HDR intensity increase |
| 4 | RGB `(4,1,0.1)` | HDR red component | HDR warm color; bloom depends on post-process |
| 5 | color texture copy A, `sRGB = On` | color-oriented decode | expected choice for display-painted color |
| 6 | same source copy B, `sRGB = Off` | values treated as linear data | different midtone sampling; expected for masks/data only when semantics agree |

Точний preview brightness залежить від viewport, exposure і engine color pipeline. Не підмінюйте observation вигаданим універсальним RGB screenshot.

### Protocol перевірки

1. Запишіть UE 5.8.x build.
2. Зафіксуйте preview scene і exposure.
3. Для material tests змінюйте лише `DebugColor`.
4. Для texture test використайте дві copies одного source.
5. У Texture Asset Editor змінюйте лише `sRGB`; Apply/Save.
6. Зафіксуйте property state й midtone difference.
7. Поясніть semantic decision: color або numeric mask/data.

**Потребує ручної перевірки в Unreal Engine 5.8.** Exact location property `sRGB`, preview controls і Apply behavior звіряються у встановленому build.

### Альтернативні valid approaches

- Замість двох assets можна тимчасово toggle `sRGB` одного asset і робити captures, але дві copies дають надійніше side-by-side comparison.
- Можна використати calibrated grayscale ramp source. Це кращий diagnostic source, якщо ви точно документуєте його encoding.

### Типові неправильні рішення

- «sRGB On завжди краще» — неправильно; semantics вирішують.
- «sRGB Off завжди правильніше для VFX» — неправильно; painted color усе ще color data.
- «Є bloom, отже HDR» — неповний доказ.
- Порівнювати різні source images.
- Змінювати exposure або preview environment між tests.
- Оголошувати visual `50% gray` тотожним linear `0.5` без color-management context.

### Performance

`sRGB` decision передусім correctness/data interpretation concern. Неправильні settings можуть змусити компенсувати error додатковою shader math. HDR bloom і large emissive coverage можуть мати downstream rendering cost, який вимірюється пізніше в representative scene.

### Check приймання

- [ ] Не менше шести observations.
- [ ] Exact build і stable exposure записані.
- [ ] HDR визначено чисельно.
- [ ] Color і mask semantics розділено.
- [ ] Exact `sRGB` UI позначено як manual verification.
- [ ] Висновок не залежить від одного screenshot.
