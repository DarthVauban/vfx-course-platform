# Рішення вправ L05-04

До відкриття розв’язків перевірте export через повторно відкриті channels і Unreal Engine. Composite RGB packed texture не є доказом.

## EX-L05-04-A — Packing чотирьох наявних masks

### Повна побудова

Спершу контракт channels:

| Channel | Source | Значення | Range/neutral | Address | Consumer |
|---|---|---|---|---|---|
| R | `T_Noise_Seamless_512.R` | Дрібний breakup | 0–1, без neutral | Wrap | Dissolve/noise |
| G | `T_Smoke_Seamless_512.R` | Широкий breakup | 0–1 | Wrap | Модуляція Opacity |
| B | Procedural radial | Timing від центра | 0–1, center=1 | Сумісний із Wrap | Reveal |
| A | `T_CometMask_512.A` | Coverage | 0–1 | Wrap прийнятний для цього pack | Opacity |

1. Новий source 512×512 RGB 8-bit з явною alpha.
2. Приведи всі inputs до однакових pixel dimensions; після paste channels не виконуй profile conversion.
3. Photoshop Channels:
   - вибери Red, встав точний grayscale noise;
   - у Green встав smoke;
   - у Blue встав radial;
   - в Alpha 1 встав coverage.
4. Альтернатива Krita: перетвори окремі sources у grayscale, склади RGBA через workflow об’єднання channels; перевір після export.
5. Збережи layered/source-channel master.
6. Експортуй PNG і TGA; повторно відкрий обидва.
7. Точки sample:
   - P0 `(0,0)`;
   - P1 `(256,256)`;
   - P2 brightest noise feature;
   - P3 comet tail.
8. Запиши відносні очікування, наприклад B center > B corner; A tail > A background.
9. Import в UE: `sRGB=Off`, Address Wrap, кандидат compression для data/mask.
10. Captures `M_PS_ChannelViewer` із weights R/G/B/A.
11. У consumer-тесті під’єднай кожен channel окремо до Emissive, а потім до запланованого input mask.

### Чому це працює

Контракт передує packing, тому selection не залежить від composite appearance. Усі channels мають спільні resolution, linear interpretation і прийняту поведінку Wrap/mip; відомі sample points виявляють swap/inversion.

### Допустимі альтернативи

- Coverage в окремій texture, якщо alpha змінює runtime format або потребує Clamp.
- B = gradient ramp coordinate замість radial.
- Source master EXR/TIFF, але фінальний format UE має пройти ту саму перевірку.

### Типові неправильні рішення

- Копіювання composite RGB замість grayscale окремого channel.
- G інвертовано без update manifest.
- A забуто або залишено білим.
- Один channel потребує Clamp, але pack використовує Wrap.
- `sRGB=On` або коригування color після packing.

### Перевірка

1. Повторно відкрий PNG/TGA й перевір R/G/B/A.
2. Порівняй чотири sample points із source.
3. Screenshots channels в UE збігаються.
4. Перемикай кожну consumer branch: без crosstalk.
5. Перевір рівні mip на втрати або bleed.
6. Запиши resource size і фактичний format compression, де доступно.

### Performance

Reference 512 RGBA8 ≈ `1.00 MiB` raw, `1.33 MiB` із mips. Чотири resources R8 сумарно мають ті самі raw pixel bytes, тому цінність packing часто полягає в меншій кількості lookups/assets, а не в гарантованій економії пам’яті. Якщо alpha змінює compression або зазвичай потрібен лише один channel, окремі assets можуть бути кращими.

## EX-L05-04-B — Directional RG distortion pair

### Повна побудова

1. Master 1024 для downsample, background усіх channels `128`.
2. `U_Field`: використовуй seamless wisp/noise; input Levels `32/1.0/224`, output `64/192`; цільове mean близько 128.
3. `V_Field`: незалежний noise, повернутий на 90° і warped; той самий range output.
4. За потреби інвертуй розріджені regions, щоб світлі й темні deviations були збалансовані; не дублюй U без змін.
5. Offset `512/512`, Wrap Around, виконай repair обох fields окремо.
6. Downsample 512.
7. Встав U в R, V у G, заповни B значенням 128, A — 255.
8. Експортуй PNG/TGA, повторно відкрий; mean histogram:
   - R target `0.48–0.52`;
   - G target `0.48–0.52`.
9. UE `sRGB=Off`, Address Wrap.
10. Точні branches validator:

```text
Distortion.RG − (0.5,0.5) → Offset
Offset × Strength → DeltaUV
UV + DeltaUV → PreviewTexture.UVs
```

11. Captures зі Strength `−0.03`, `0`, `+0.03`.
12. Neutral reference: заміни RG texture на Constant2Vector 0.5; результат має дорівнювати Strength 0.

### Чому це працює

Output 64–192 залишає bidirectional headroom навколо neutral і уникає крайніх displacements. Незалежні поля U/V створюють органічний vector motion, а збалансовані means зменшують global drift. Тест знака Strength виявляє помилки axis/inversion.

### Допустимі альтернативи

- Використовуй decode повного signed range `(RG−0.5)×2` і зменшуй Strength удвічі.
- Зберігай B=magnitude `length(decodedRG)` для masking/diagnostics.
- Використовуй 16-bit source під час authoring, а потім перевір фінальну quantization 8-bit.

### Типові неправильні рішення

- Чорний background означає постійний від’ємний offset UV.
- R=G означає діагональний displacement всюди.
- Decode sRGB зсуває 0.5 і distribution.
- Field не seamless, але Address установлено в Wrap.
- Preview checker використовує Clamp і помилково вважається seam distortion.

### Перевірка

1. Strength 0 є pixel-identical до початкового checker.
2. Constant neutral за ненульового Strength візуально стабільний, крім задокументованого нюансу 8-bit neutral.
3. Додатний і від’ємний Strength змінюють напрямок motion.
4. Horizontal stripes виявляють R/U; vertical stripes — G/V.
5. П’ятисекундний тест pan/animated UV не має стрибка border.
6. Means і min/max channels R/G записано.

### Performance

Фінальний validator використовує два samples: distortion і preview. Production material, який уже робить sample base texture, додає lookup/ALU distortion. За високого translucent overdraw ця вартість повторюється для кожного покритого pixel. Нижчий tier може використовувати слабший procedural motion UV або прибрати distortion, зберігаючи silhouette/timing.
