# Рішення вправ L05-01

Відкривайте після власної спроби та трьох hints. Відтворіть solution із пам’яті в новому document, а не копіюйте source layers.

## EX-L05-01-A — Orb mask із трьома values

### Повна побудова

1. Створіть `512×512`, RGB 8-bit, sRGB source `T_OrbMask_512_v001.psd`/`.kra`.
2. Groups: `00_CHECK`, `10_SHOULDER`, `20_CORE`, `30_BREAKUP`, `40_ALPHA`, `90_ADJUST`.
3. `10_SHOULDER`: soft white circle, brush `360 px`, hardness `0%`, opacity `45%`, flow `20%`, два center dabs.
4. `20_CORE`: hard white circle `190 px`, hardness `100%`; Gaussian-looking edge створіть layer mask feather `3 px`, не destructive blur.
5. `30_BREAKUP`: default chalk/basic spatter на transparency mask, brush `36–72 px`, opacity `20%`, flow `12%`; торкніться лише outer 30% radius.
6. Clipped Levels над shoulder: `18 / 1.10 / 238`. Над combined group: `20 / 1.00 / 235`.
7. Curves над combined: `0→0`, `64→48`, `128→145`, `220→244`, `255→255`.
8. Alpha contract: coverage = silhouette of shoulder після threshold `32`; RGB = full three-zone gradient. Збережіть Alpha 1/transparent layer відповідно до editor.
9. Export PNG-24 і TGA 32-bit, reopen, inspect R та A.
10. UE: `sRGB=Off`, mask compression candidate, R/A captures у `MI_PS_ChannelViewer`.

### Чому це працює

Core, shoulder і exterior мають окремі value ranges та лишаються independently adjustable. Alpha threshold не копіює luminance один-в-один: coverage відсікає майже нульовий fog, а RGB зберігає soft energy.

### Допустимі альтернативи

- Shape Layer ellipses замість Brush dabs.
- Gradient Fill radial замість soft brush.
- Krita Filter Masks замість Photoshop Adjustment Layers.
- Alpha = RGB, якщо texture contract прямо говорить «R та A дублюються» і memory/purpose це виправдовують.

### Типові неправильні рішення

- Три zones flattened на одному layer: неможливо переналаштувати hierarchy.
- Core займає понад половину orb: mid zone зникає.
- Breakup вирізає center: focal point розпадається.
- `sRGB=On`: UE mid-value не відповідає data intent.
- Check background потрапляє в export: transparency втрачено.

### Перевірка

1. Thumbnail 64 px: видно core, shoulder, exterior.
2. Histogram: є black, mid-values і white без dominant clipping.
3. Лише A: чистий coverage без випадкових holes.
4. Halo board: black/white/gray/magenta.
5. UE R/A capture збігається з reopened export.
6. Manifest: призначення, size, значення R, значення A, sRGB Off, format, destination.

### Performance

512 RGBA8 raw ≈ `1.00 MiB` без mips і `1.33 MiB` із full mip chain до platform compression. Якщо A дублює R, one-channel або later packing може бути кращим. Фінальний verdict визначають cooked resource size і material sample use.

## EX-L05-01-B — Вигнута mask comet

### Повна побудова

1. Document `512×512`, guides 8/504 px, центральний guide у `(176,256)`.
2. `Head_RGB`: м’яке circle `180 px`, opacity `55%`; `Head_Core`: жорстке circle `82 px`.
3. `Tail_Base`: rounded rectangle `300×84 px`, left edge під head; convert to Smart Object/Transform Mask.
4. Free Transform: scale X `112%`, Y `70%`, rotation `−14°`.
5. Warp 3×3: far-right center point `−72 px Y`, upper-right `−44 px Y`, lower-right `−58 px Y`.
6. Add tail mask; black linear gradient removes final 70%→100%; hard-to-soft brush narrows final tip до 8–12 px.
7. Дублюй tail як `Tail_Glow`, розтягни Y до `145%`, Gaussian/soft mask, opacity `30%`; RGB використовує обидва.
8. Alpha: hard head + narrower `Tail_Base`, feather `2–3 px`; не включайте full `Tail_Glow`.
9. Breakup: базовий noise за принципом L05-02, clipped до tail на `18%`; збережи безперервний directional spine.
10. Levels для combined RGB `16 / 0.95 / 235`; threshold alpha перевіряється візуально, без clipped jagged edge.
11. Export і повторне відкриття PNG/TGA; board із 4 backgrounds; viewer R/A в UE.

### Чому це працює

Straight capsule гарантує clean taper, Warp додає curvature, а separate glow/coverage contracts дають wide energy без надмірного translucent silhouette. 8 px border захищає filtering і later atlas placement.

### Допустимі альтернативи

- Pen/Bezier Shape Layer із variable-width stroke.
- Liquify-like warp лише на duplicate Smart Object, якщо source лишається recoverable.
- RGB soft tail із alpha=R для additive-only purpose, якщо contract і UE material це підтверджують.

### Типові неправильні рішення

- Почати freehand stroke з downloaded brush.
- Warp без safe padding: tip торкається border.
- Однаково wide alpha і glow: великий soft coverage/overdraw.
- Noise перерізає directional spine.
- Export лише composite screenshot без reopened alpha.

### Перевірка

- 64 px thumbnail: head і direction однозначні.
- Toggle Warp: curvature intentional, не випадковий kink.
- A-only: tail звужується монотонно.
- Magenta board: без dark fringe.
- Emissive в UE використовує R, Opacity — A; зроби capture на трьох backgrounds scene.
- Manifest пояснює wider RGB і tighter A.

### Performance

Обріжте useful bounds без порушення 8 px padding: зайва transparent area підвищує wasted texels і може збільшити covered translucent quad. One 512 RGBA asset має той самий reference size, що у вправі A; реальна compression залежить від alpha й platform.
