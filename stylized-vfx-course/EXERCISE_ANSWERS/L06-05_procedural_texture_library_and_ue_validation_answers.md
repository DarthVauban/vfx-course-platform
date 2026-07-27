# Рішення до уроку 06.05

## EX-L06-05-A

### 1. Структура package та graph

```text
Package: P_VFX_TextureLab.sbs
Graph: G_VFX_UtilityLibrary
Parent size: 1024×1024
Working model: grayscale branches → RGBA Merge → color Output

Frames:
01_BREAKUP_R
02_SPARK_G
03_STREAK_B
04_FADE_A
05_PACK_AND_OUTPUT
```

Graph comment:

```text
Linear data masks. 0=вимкнено/прибрано, 1=увімкнено/збережено.
R=breakup, G=sparks, B=streak, A=soft fade.
```

### 2. Повний node list

```text
BREAKUP_R
Perlin Noise             N_BreakupLarge
Perlin Noise             N_BreakupSmall
Levels                   L_BreakupSmall
Blend                    B_BreakupMultiply
Levels                   L_BreakupFinal
Output                   O_breakup_mask

SPARK_G
Shape                    S_SparkDisc
Tile Generator           TG_Sparks
Distance                 D_SparkFalloff
Levels                   L_SparkFinal
Output                   O_spark_mask

STREAK_B
Gradient Linear 1        G_StreakFade
Perlin Noise             N_StreakBreakup
Levels                   L_StreakBreakup
Blend                    B_StreakMultiply
Perlin Noise             N_WarpSmooth
Directional Warp         DW_Streak
Levels                   L_StreakFinal
Output                   O_streak_mask

FADE_A
Gradient Linear 1        G_SoftFade
Levels                   L_SoftFade
Output                   O_soft_fade

PACK
RGBA Merge               M_UtilityRGBA
Output                   O_utility_rgba
```

### 3. Connections

```text
N_BreakupSmall.Output → L_BreakupSmall.Input
N_BreakupLarge.Output → B_BreakupMultiply.Background
L_BreakupSmall.Output → B_BreakupMultiply.Foreground
B_BreakupMultiply.Output → L_BreakupFinal.Input
L_BreakupFinal.Output → O_breakup_mask.Input

S_SparkDisc.Output → TG_Sparks.Pattern Input
TG_Sparks.Output → D_SparkFalloff.Source
D_SparkFalloff.Output → L_SparkFinal.Input
L_SparkFinal.Output → O_spark_mask.Input

N_StreakBreakup.Output → L_StreakBreakup.Input
G_StreakFade.Output → B_StreakMultiply.Background
L_StreakBreakup.Output → B_StreakMultiply.Foreground
B_StreakMultiply.Output → DW_Streak.Input
N_WarpSmooth.Output → DW_Streak.Intensity Input
DW_Streak.Output → L_StreakFinal.Input
L_StreakFinal.Output → O_streak_mask.Input

G_SoftFade.Output → L_SoftFade.Input
L_SoftFade.Output → O_soft_fade.Input

L_BreakupFinal.Output → M_UtilityRGBA.R
L_SparkFinal.Output → M_UtilityRGBA.G
L_StreakFinal.Output → M_UtilityRGBA.B
L_SoftFade.Output → M_UtilityRGBA.A
M_UtilityRGBA.Output → O_utility_rgba.Input
```

Назви socket/property можуть трохи відрізнятися в installed Designer version. Connection semantics та output contract мають лишитися саме такими.

### 4. Стартові параметри та обґрунтовані коригування

| Branch | Node | Parameter | Значення |
|---|---|---|---:|
| Breakup | N_BreakupLarge | Scale | 5 |
| Breakup | N_BreakupSmall | Scale | 18 |
| Breakup | B_BreakupMultiply | Mode/Opacity | Multiply / 1 |
| Breakup | L_BreakupFinal | Input range | .10 / .50 / .92 |
| Sparks | TG_Sparks | X/Y Amount | 8 / 8 |
| Sparks | TG_Sparks | Scale | .12 |
| Sparks | TG_Sparks | Position Random | .45 |
| Sparks | TG_Sparks | Scale Random | .55 |
| Sparks | D_SparkFalloff | Maximum Distance | 16 |
| Streak | N_StreakBreakup | Scale | 10 |
| Streak | N_WarpSmooth | Scale | 3 |
| Streak | DW_Streak | Strength | 8 |
| Streak | DW_Streak | Angle | вирівняно за UV slash |
| Fade | L_SoftFade | Input low/high | .05 / .95 |

Після 25% zoom перевірки spark scale збільшено з .12 до .14, бо найменші точки зникали ще до UE mip test. Warp strength залишено 8: при 24 contour почав fold.

### 5. Output contract та export

| Identifier | Запакований канал | Файл export | Призначення |
|---|---|---|---|
| `breakup_mask` | R | `T_VFX_Breakup_R_1024.png` | breakup opacity/erosion |
| `spark_mask` | G | `T_VFX_Sparks_G_1024.png` | розріджені shapes іскор |
| `streak_mask` | B | `T_VFX_Streak_B_1024.png` | silhouette slash/beam |
| `soft_fade` | A | `T_VFX_SoftFade_A_1024.png` | fade root/tip/lifetime |
| `utility_rgba` | RGBA | `T_VFX_Utility_RGBA_1024.tga` | запакований runtime-кандидат |

Export:

1. `Export Outputs as Bitmaps`.
2. Окремі grayscale outputs → PNG.
3. Запакований color output → TGA з alpha.
4. Dimensions перевірено як 1024×1024.
5. Alpha перевірено в зовнішньому viewer.
6. Delivery містить стандартні bitmap-файли, а не `.sbsar`.

Точне розташування command залежить від установленої версії Designer.

### 6. UE import та material validation

Asset folder:

```text
/Game/VFX/Textures/Utility/T_VFX_Utility_RGBA_1024
/Game/VFX/Materials/Debug/M_VFX_TextureChannelCheck
```

Texture intent:

```text
sRGB: Off
Compression: mask/data-compatible candidate
Mip policy: project default for first test
Texture Group: VFX/effects candidate
```

Точні доступні labels/options: **Потребує ручної перевірки в Unreal Engine 5.8.**

Material check:

```text
TextureSampleParameter2D UtilityTexture
  ├─ ComponentMask R → preview = breakup
  ├─ ComponentMask G → preview = sparks
  ├─ ComponentMask B → preview = streak
  └─ ComponentMask A → preview = soft fade

Selected mask × VectorParameter Tint → Emissive Color
Selected mask → Opacity
```

Evidence:

- R збігся з `T_VFX_Breakup_R_1024.png`;
- G збігся з `T_VFX_Sparks_G_1024.png`;
- B збігся з `T_VFX_Streak_B_1024.png`;
- A збігся з `T_VFX_SoftFade_A_1024.png`;
- на відстані sparks стали слабшими, але основний cluster лишився;
- streak direction відповідав UV slash mesh.

### 7. Чому рішення працює

- Кожний branch має одну semantic responsibility.
- Individual Outputs створюють діагностичний baseline до packing.
- `RGBA Merge` виконує лише packing, тому graph легко перевіряти.
- Smooth warp input деформує macro silhouette без high-frequency tearing.
- `Distance` створює керовану falloff, а `Levels` відділяє core від halo.
- Stable identifiers і channel table не дозволяють artist/material contracts розійтися.
- External alpha check відділяє export problem від UE import problem.
- UE inspection доводить numerical interpretation у runtime context.

### 8. Допустимі альтернативи

- Packed output може бути RGBA PNG, якщо pipeline надійно зберігає alpha і це підтверджено.
- `Clouds 2` або інший seamless grayscale noise може замінити Perlin із записаною причиною.
- Disc можна замінити маленьким shard shape, якщо `Tile Generator` branch лишається sparse.
- Streak direction можна розвернути, якщо UV contract задокументовано.
- Якщо alpha compression псує fade, acceptable redesign — RGB pack плюс окремий soft fade.
- 512² acceptable для малих screen-space effects після UE evidence; 2048² — лише після доведеної потреби.

### 9. Поширені неправильні рішення

- Вставити чотири masks у color channels вручну й не зберегти graph contract.
- Вивести `utility_rgba` як grayscale.
- Зробити sparks dense, потім crush Levels до випадкових pixels.
- Використати high-frequency noise для Warp Intensity.
- Компенсувати sRGB problem через `Power` у material.
- Переставити R/G у UE, не виправивши неправильний source contract.
- Вважати Designer graph runtime cost у UE.
- Deliver лише `.sbsar` або вимагати Substance plugin.
- Експортувати JPEG.

### 10. Прохід перевірки

1. Повторно відкрий `.sbs`.
2. Підтвердь розмір graph 1024².
3. Переглянь усі endpoints branches.
4. Запусти preview breakup 2×2.
5. Перевір negative space іскор.
6. Порівняй Warp 0/8/24.
7. Перевір монотонність fade.
8. Підтвердь точні п’ять identifiers.
9. Простеж wires R/G/B/A.
10. Відкрий експортовані файли поза Designer.
11. Перевір alpha TGA.
12. Зроби reimport в UE.
13. Перевір data intent.
14. Переглянь чотири ComponentMasks.
15. Порівняй mips near/far.
16. Збережи докази.

### 11. Результат приймання

| Критерій | Результат |
|---|---|
| Стабільні outputs | Пройдено |
| Seamless breakup | Пройдено |
| Розріджені sparks | Пройдено |
| Контрольований streak | Пройдено |
| Монотонний fade | Пройдено |
| Коректний RGBA | Пройдено |
| Стандартні файли | Пройдено |
| Повторний reopen/channel inspection alpha | Пройдено |
| Відповідність channels в UE | Пройдено |
| Data intent | Пройдено |
| Докази mip | Пройдено |
| Немає залежності від plugin | Пройдено |

Результат: **12/12**.

### 12. Performance

Designer preview знижено до 512 during iteration; final outputs rendered at 1024. Graph node count не переноситься в runtime. В UE один packed sample корисний у material, який читає кілька masks разом. Якщо effect читає лише sparks, memory residency packed texture може бути гіршою за окрему smaller texture, тому packing залишається measured decision.

---

## EX-L06-05-B

### 1. Контрольований setup несправностей

Створено duplicate:

```text
T_VFX_Utility_RGBA_1024_BAD.tga
M_VFX_TextureChannelCheck_BAD
```

Внесені несправності:

1. R/G inputs swapped у duplicate `RGBA Merge`.
2. Data texture імпортовано або інтерпретовано з увімкненим setting color-space.
3. Spark source reduced до 1–2 px core in relevant lower mips.

Original good asset збережено як control.

### 2. Несправність 1 — Переставлені R/G

**Symptom:** `ComponentMask R` показує dots, а G — cloud breakup.

**Hypothesis:** pack wiring або UE ComponentMask contract swapped.

**Single-variable test:** individual exported R/G PNGs порівняно з packed R/G preview; material wiring не змінено.

**Finding:** swap існував у `RGBA Merge`, бо packed channels були неправильні вже у external viewer.

**Fix:**

```text
L_BreakupFinal → RGBA Merge.R
L_SparkFinal   → RGBA Merge.G
```

Re-export та reimport. Не зроблено compensating swap у UE.

### 3. Несправність 2 — Неправильний намір color-space

**Symptom:** breakup mid-gray став яскравішим, silhouette erosion змінив threshold.

**Hypothesis:** color decode змінює numerical mask.

**Single-variable test:** той самий texture/material, змінено лише `sRGB` interpretation, а screenshot зроблено на fixed exposure/debug view.

**Finding:** channel layout не змінювався; найбільша різниця була в mid-gray, що відповідає color-space problem.

**Fix:** відновлено linear data intent.

Точний setting path/label: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 4. Несправність 3 — Втрата spark у mip

**Symptom:** G правильний зблизька, але майже чорний у far view.

**Hypotheses:**

- feature надто малий у source;
- resolution/mip policy не відповідає target size;
- compression знижує small peak.

**Tests:**

1. Texture Editor mip preview: spark core зникає на lower mip.
2. За тих самих settings UE core spark збільшено з 2 px до 6 px у 1024.
3. Той самий source, окремий кандидат spark texture 512.
4. Кандидат compression/mip порівняно лише після тесту content.

**Finding:** primary root cause — sub-mip feature size, не swapped channel і не gamma.

**Виправлення:** core spark розширено, count трохи зменшено, а Distance/Levels зберегли м’який rim 1–2 px. Фінальний view near/far залишився розрідженим, але видимим.

### 5. Матриця рішення щодо packing

| Питання | Спостереження | Наслідок |
|---|---|---|
| Channels використовуються разом? | Breakup/streak/fade часто разом; sparks іноді окремо | Кандидат на частковий packing |
| Та сама resolution? | Breakup/streak/fade потребують 1024; sparks прийнятні в 512 після redesign | Розділення може заощадити пам’ять |
| Та сама compression? | Широкий fade потребує плавної precision; sparks витримують жорсткішу mask | Розділення покращує контроль |
| Та сама поведінка mip? | Sparks потребують content зі збереженням features; широкі masks стабільні | Окрема spark texture обґрунтована |
| Вартість sample? | Основний slash читає R/B/A разом | Зберегти їх разом |

### 6. Фінальний redesign

Обраний production-контракт:

```text
T_VFX_MainUtility_RGB_1024.tga
R = breakup
G = streak
B = soft fade

T_VFX_Sparks_R_512.png
R = sparks
```

Причина: main slash material використовує three channels разом; sparks використовуються окремим emitter і не потребують 1024. Це зменшує wasted spark resolution та дозволяє independent mip/compression tuning.

Якщо project compression strategy робить RGBA pack дешевшим і всі effects використовують channels разом, original RGBA contract теж acceptable за наявності measurements.

### 7. Оновлене рішення graph/output

Source branch logic не дублюється. Додано:

```text
RGB Merge/Main pack equivalent → Output main_utility_rgb
Spark branch → Output spark_mask
```

Identifiers delivery:

| Output | Файл | Контракт |
|---|---|---|
| `main_utility_rgb` | `T_VFX_MainUtility_RGB_1024.tga` | R breakup / G streak / B fade |
| `spark_mask` | `T_VFX_Sparks_R_512.png` | R sparks |

RGBA original зберігається лише як exercise evidence, не як active production asset.

### 8. Чому рішення працює

- Failures відтворено на duplicate assets, тому control лишився надійним.
- Кожний test змінював одну variable.
- Source contract виправлено біля root cause, а не compensated downstream.
- Color-space test використовував mid-gray, де gamma difference видно найкраще.
- Spark redesign врахував actual mip footprint.
- Packing decision прив’язаний до use together/resolution/compression/mips, а не до правила «packing завжди краще».

### 9. Допустимі альтернативи

- Лишити RGBA 1024, якщо profiler і target memory підтверджують користь.
- Pack sparks із двома іншими small high-frequency masks у окремий RGB 512.
- Зменшити main utility до 512, якщо screen-size test проходить.
- Використати alpha для smooth fade лише після compression precision comparison.

### 10. Поширені неправильні рішення

- Перемкнути R/G у material і лишити source documentation неправильною.
- Одночасно змінити sRGB, compression, mips і Levels.
- Вимкнути всі mips як універсальне виправлення small sparks.
- Підняти texture до 2048 без screen-space proof.
- Вважати external viewer color preview достатнім без channel inspection.
- Додати plugin, хоча проблема у standard texture contract.

### 11. Перевірка

1. Bad assets відтворюють три symptoms.
2. Good control не змінений.
3. Individual masks відповідають graph.
4. Packed external channels відповідають new table.
5. Data intent UE задокументовано.
6. Near/far screenshots зроблено з однакової camera.
7. Доречні рівні mip зафіксовано.
8. R/G/B основного pack перевірено.
9. R окремої spark texture перевірено.
10. Material samples відповідають final usage.

### 12. Performance

Redesign додає окремий spark texture sample лише там, де потрібні sparks; main slash material не читає його. Main pack зберігає shared sample для breakup/streak/fade. Реальний memory format, streaming та sampler impact: **Потребує ручної перевірки в Unreal Engine 5.8.** Рішення приймається після target-platform stats, але exercise правильно формує hypothesis та validation plan.
