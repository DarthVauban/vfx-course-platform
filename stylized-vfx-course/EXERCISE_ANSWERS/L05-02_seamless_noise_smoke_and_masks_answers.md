# Рішення вправ L05-02

Відкривайте після власного 3×3 і UE pan test. Повторіть результат із clean source, щоб перевірити retrieval.

## EX-L05-02-A — Seamless energy wisps

### Повна побудова

1. Source `1024×1024`, RGB 8-bit; groups `10_WISP_A`, `20_WISP_B`, `30_BREAKUP`, `40_SEAM_REPAIR`, `90_ADJUST`.
2. `WISP_A`: ellipse `620×92 px`, fill white, Free Transform rotation `−28°`; duplicate twice, scales `72%` і `46%`, offsets irregular.
3. На masks taper both ends soft brush `180 px`, opacity `100%`; body лишіть continuous.
4. `WISP_B`: duplicates rotated `−18°`, thinner `60–74 px`, opacity `45–70%`; не робіть exact parallel spacing.
5. Warp кожного family 3×3: максимальний bend `35–55 px`, протилежні bends для двох families.
6. Levels family A `24/0.85/225`, family B `38/1.05/235`.
7. Offset master `512/512`, Wrap Around. Repair central cross короткими mask strokes/clone segments.
8. 3×3 test на 100%, 25%, 12.5%; зменшіть будь-який repeated bright knot.
9. Downsample copy 512×512. Повторний Offset `256/256` лише як diagnostic.
10. Export `T_EnergyWisps_Seamless_512.png`, `sRGB=Off`, Address Wrap.
11. UE pan: Tiling `1,4,8`, Speed `(0.05,0.02)` і reverse `(-0.03,0.01)`.

### Чому це працює

Ellipses дають clean directional bands, taper створює motion, Warp прибирає mechanical straightness. Half-offset repair закриває boundaries, а unequal families зменшують tile signature.

### Допустимі альтернативи

- Pen strokes зі scalable vector masks.
- Basic hard brush із smoothing, якщо outline лишається clean.
- 512 master із Offset 256/256, якщо final resolution не потребує supersampling.

### Типові неправильні рішення

- Repair outer borders напряму без Offset.
- Довгий Clone stroke по central line створює новий seam.
- Усі wisps parallel/equidistant: wallpaper signature.
- Clamp addressing у UE.
- Aggressive white clipping: motion виглядає binary і flicker-ить у mips.

### Перевірка

- Left/right і top/bottom borders match.
- 3×3 не має cross або dominant 9-fold knot.
- Tiling 1/4/8 не показує jump у 5-second capture.
- Mip/gameplay view зберігає at least one directional family.
- R-channel source/reopen/UE збігається.

### Performance

512 R8 reference ≈ `0.25 MiB` без mips і `0.33 MiB` із mips. Використання одного asset у двох scales економить asset memory, але два Texture Sample nodes лишаються двома lookups.

## EX-L05-02-B — Smoke подвійного масштабу

### Повна побудова

1. 1024 source; large group має 4 lobes sizes `480,390,330,260 px`, opacity `25–45%`.
2. Negative pockets на mask: `170,120,90 px`, opacity `20–35%`; не відділяйте lobes повністю.
3. Medium group: 7–10 lobes `80–190 px`, opacity `20–30%`.
4. Small group: розріджені marks 20–55 px, opacity ≤18%, area ≤15%.
5. Levels large `16/1.12/242`; medium `28/0.95/230`; combined `20/1.05/238`.
6. Offset 512/512 Wrap, repair cross; board 3×3.
7. Зменште hero blob, якщо його center повторюється очевидно.
8. Downsample до 512, export лише R / контракт linear data.
9. Material для перевірки в UE:

```text
UV × 1 → PannerA → SampleA
UV × 5 → PannerB → SampleB
DetailSafe = Lerp(0.65, 1.0, SampleB.R)
SampleA.R × DetailSafe → Emissive
```

10. Speeds: A `(0.018,0.010)`, B `(-0.035,0.022)`.

### Чому це працює

Large sample несе silhouette; remapped high-frequency sample лише модулює його в range 0.65–1.0, тому Multiply не знищує smoke. Різні scale/speed зменшують видиму periodicity.

### Допустимі альтернативи

- `Lerp(SampleA, SampleA×SampleB, DetailAmount)` із `DetailAmount≤0.5`.
- Add/Subtract detail із Saturate, якщо range документовано.
- Один sample для low-quality tier; primary meaning зберігається.

### Типові неправильні рішення

- Raw `A×B`, де обидві masks переважно темні.
- Однаковий tiling/speed для обох branches.
- Small detail займає всю value hierarchy.
- Seam repair зроблено після downsample лише в одному axis.
- Texture використовує sRGB decode.

### Перевірка

1. Preview A, B і final окремо.
2. A при Tiling 1 читається як smoke mass.
3. B при Tiling 5 не shimmer-ить неприйнятно.
4. DetailAmount/branch off повертає exact SampleA.
5. 10-second capture не має border jump або короткого obvious loop.
6. Distant view лишає primary mass.

### Performance

Один 512 asset двічі sample-иться; memory ≈ one asset, shader lookup count = two. Low tier може використовувати SampleA only. Для translucent renderer головний cost часто overdraw великих overlapping cards; detail lookup має виправдовувати видиму різницю.
