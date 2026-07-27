# Assessment блока 05 — Photoshop VFX Textures

| Поле | Значення |
|---|---|
| Gate | G05 |
| Час | 3.0 години |
| Де враховано | Практика L05-05; не додається до 28 годин блока |
| Максимум | 100 балів |
| Проходження | ≥80/100 та ≥60% у кожній категорії |
| Дозволено | Власні source-файли L05, Photoshop або Krita, UE 5.8, офіційна документація |
| Заборонено | Покрокові текстові/відеоуроки, файли розв’язків уроків, proprietary/downloaded artwork, готові packs brush/texture, чужі sigils |

## Мета

Довести, що ви з чистих documents створюєте функціональні grayscale/alpha/packed/flipbook VFX textures, експортуєте їх із явним контрактом і перевіряєте в Unreal Engine Material Laboratory.

## Розклад 3.0 години

| Час | Дія |
|---:|---|
| 0:00–0:20 | Теорія, 10 коротких відповідей |
| 0:20–2:20 | Практичний набір textures і export |
| 2:20–2:40 | Перевірка import/material в UE |
| 2:40–2:50 | Troubleshooting/performance |
| 2:50–3:00 | Самоперевірка, manifest, фінальна submission |

Якщо час закінчився, здайте поточний стан і позначте відсутні докази. Не додавайте edits після assessment до timed score.

## Категорія A — Теорія, 20 балів

Дайте короткі точні відповіді, по 2 бали кожна.

1. Чим grayscale value відрізняється від alpha coverage?
2. Що робить half-size Offset і чому потрібен Wrap Around?
3. Чим border seam відрізняється від tile signature?
4. Чому data masks і packed textures зазвичай мають `sRGB=Off`?
5. Назвіть три frequency bands smoke texture та їхню роль.
6. Який neutral value використовує unsigned RG distortion і як його decode-ити?
7. Які шість compatibility питань треба поставити перед channel packing?
8. Для 4×4 row-major atlas де знаходиться frame 11: zero-based row і column?
9. Чим cell bleeding відрізняється від alpha halo?
10. Скільки raw memory має 1024² RGBA8 atlas без mips і приблизно з full mip chain?

## Категорія B — Практика, 60 балів

Починайте з чистих documents. Можна повторно використовувати власні базові geometric layers, але не готові фінальні textures.

### B1 — Організація source і grayscale/alpha, 8 балів

Створіть `T_B05_Slash_512`:

- іменовані groups, masks, редаговані Levels/Curves;
- чиста tapered silhouette;
- RGB soft glow ширший за alpha coverage;
- 8 px padding;
- Source PSD/KRA і exports PNG/TGA.

### B2 — Seamless noise і smoke, 10 балів

Створіть:

- `T_B05_Noise_Seamless_512`;
- `T_B05_Smoke_Seamless_512`.

Вимоги: докази Offset/repair, board 3×3, ієрархія large/medium/small, без очевидного border seam.

### B3 — Оригінальний combat texture sheet, 10 балів

Створіть на clean documents:

- один slash;
- одна spark;
- одне оригінальне magic circle.

Немає fonts/downloaded symbols. Contact sheet показує thumbnails 64/128 px і views лише з alpha.

### B4 — Ramp, distortion, packing, 14 балів

Створіть:

- `T_B05_Ramp_256x16`;
- `T_B05_Distortion_RG_512`;
- `T_B05_UtilityPacked_RGBA_512`.

Packed contract:

| Channel | Обов’язкове значення |
|---|---|
| R | Seamless noise |
| G | Smoke breakup |
| B | Radial timing mask |
| A | Slash coverage |

Distortion має neutral background `128/255`; R/G independent; manifest містить encode/decode.

### B5 — Flipbook, 10 балів

Створіть 16-frame original ring/smear atlas:

- 4×4, cells 256, atlas 1024;
- row-major `F_000`–`F_015`;
- 8 px internal padding;
- стабільний pivot;
- повторно відкриті source frames first/middle/last;
- без неприйнятного bleeding edge/mip на зазначеній цільовій відстані.

### B6 — Перевірка import/material в UE, 8 балів

Надайте:

- таблиця import: asset, dimensions, purpose, sRGB, compression candidate, address, mip policy, фактичний resource size;
- captures `M_PS_ChannelViewer` R/G/B/A для packed texture;
- `M_PS_DistortionViewer` captures Strength `0` і `0.03`;
- captures `M_PS_FlipbookViewer` для Frames `0`, `6`, `15`;
- без непояснених errors/warnings compile.

Потребує ручної перевірки в Unreal Engine 5.8. Точні labels properties, defaults, formats compression, controls mip, pins nodes і reporting resource-size звірте у встановленому build.

## Категорія C — Troubleshooting і performance, 10 балів

### C1 — Випадок виправлення, 5 балів

Отримайте одну з проблем:

- видимий seamless cross;
- alpha halo;
- flipbook neighbor bleed.

Подайте:

1. capture симптому;
2. ізольований diagnostic view;
3. зазначену root cause;
4. виправлення;
5. capture після виправлення за тієї самої умови.

### C2 — Порівняння budget, 5 балів

Порівняйте:

- 512 R8 проти 512 RGBA8;
- atlas 1024 RGBA8 із reference без/з mip;
- окремі channels проти packed sample.

Вкажіть raw estimates, фактичні resource-докази UE й застереження щодо platform compression/streaming. Додайте одне спостереження overdraw/screen-coverage для translucent card.

## Категорія D — Самоперевірка й production handoff, 10 балів

Подайте:

1. аудит naming: names source/export/UE і політика suffix version — 2 бали;
2. contact sheet організації source — 2 бали;
3. manifest export із контрактами R/G/B/A — 3 бали;
4. еквіваленти Krita або нотатка про обмеження Photoshop-only — 1 бал;
5. Ledger M/S на 14 годин і коротка retrospective — 2 бали.

M/S ledger expected:

| Lesson | M/S hours |
|---|---:|
| L05-01 | 2.0 |
| L05-02 | 3.0 |
| L05-03 | 3.0 |
| L05-04 | 4.0 |
| L05-05 | 2.0 |
| **Разом** | **14.0** |

## Структура submission

```text
B05_Submission/
  01_SOURCES/
  02_EXPORTS/
  03_UE_CAPTURES/
  04_TILE_ALPHA_BOARDS/
  05_MANIFEST/
  06_WORKLOG/
```

Обов’язкові documents:

- `B05_Export_Manifest.md` або `.xlsx`;
- `B05_UE_Import_Table.md`;
- `B05_MS_Ledger.md`;
- `B05_Retrospective.md`.

## Автоматичні blockers

Assessment не проходить незалежно від загального бала, якщо:

- є proprietary/downloaded artwork без явної дозволеної ліцензії;
- final exports не відкриваються або не імпортуються;
- відсутня UE material validation;
- flipbook order неможливо перевірити;
- packed channels не мають contract;
- Ledger M/S має менше 14.0 задокументованих годин;
- роботу створено шляхом копіювання файлів solutions.

## Проходження й remediation

- Проходження: ≥80 загалом і щонайменше `12/20`, `36/60`, `6/10`, `6/10`.
- 70–79 або непройдений мінімум category: цільове remediation відповідної category, потім retest із новим variant asset.
- <70: повторити retrieval tasks L05-01–L05-05 і скласти assessment із чистим brief.
- Після проходження переходьте до G06; зберігайте докази source/export/UE як process artifact для portfolio.
