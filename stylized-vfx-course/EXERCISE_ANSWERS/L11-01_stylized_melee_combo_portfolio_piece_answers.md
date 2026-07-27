# Рішення вправ — 11.01 Stylized melee combo portfolio piece

Version-sensitive UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L11-01-A

### Концепція та обґрунтування reference solution

`Crosswind Cadence` — оригінальне комбо `два light + один heavy`, засноване на принципах acceleration, чергуванні diagonals і compressed heavy contact. Воно не відтворює named commercial ability, branded silhouette або extracted asset.

### Creative/ethical contract

- references: одне fencing motion study, одне abstract calligraphy stroke study та одне real-sparks slow-motion study;
- extracted principles: direction `narrow→wide`, decreasing interval і contact `sparse→dense`;
- явно не копіюються exact weapon design, animation frames, palette, logo, texture або effect silhouette;
- усі VFX textures створені з власних brush/noise sources студента; замість `SM_VFX_Slash_01` створено новий asymmetric mesh `SM_EX11_CrosswindArc`.

### Timing and integration

За 30 fps:

```text
Hit1 contact F06: rising left→right
Hit2 contact F13: compact right→left
Hit3 contact F25: horizontal-to-downward heavy
Trail windows: F02–08, F10–15, F19–27
Ground response: F25 only
```

`BP_EX11_CrosswindCombo` відтворює montage, активує attached `NS_EX11_CrosswindTrail` протягом кожного Notify State, отримує `HitResult` у contact і викликає `Spawn System at Location` для slash/impact. Hit3 виконує ground trace й вирівнює local Z ring за `ImpactNormal`.

### Повна архітектура effect

```text
NS_EX11_CrosswindTrail
  Ribbon: CPUSim, Local True, Seed 1121
  Emitter State; Spawn Rate 55
  Initialize Ribbon: Lifetime .16, Width 6
  Scale Ribbon Width; Scale Color
  Ribbon Renderer: tiling 30, Automatic

NS_EX11_CrosswindSlash
  Arc: Burst1; Initialize Particle; Initial Mesh Orientation;
       Scale Mesh Size/Color; Mesh Renderer SM_EX11_CrosswindArc
  Accent: Burst10; Initialize/Shape/Add Velocity;
          State/Drag/Solve/Color/Size; Sprite Renderer

NS_EX11_CrosswindImpact
  Flash: Burst1, lifetime .08–.12
  Sparks: Burst 14/20/30, speed 350/500/650, lifetime .25–.6
  Shards: hit3 only, Burst6, world-space gravity/rotation

NS_EX11_CrosswindGround
  Ring: Burst1, life .5
  Dust: Burst12, life .7, surface-tangent velocity
```

User defaults: primary `(.08,.8,1,1)`, accent `(1,.2,.03,1)`, `Scale=1`, `Intensity=1`, `ComboIndex=0`; `Direction/SurfaceNormal` надходять із gameplay.

### H/M/L and performance

- High: зазначені counts, ribbon `55/s`, два material accents.
- Medium: ribbon `40/s`, sparks 70%, shards 4, один accent.
- Low: збережені ribbon/mesh slash, sparks 40%, shards лише на heavy, ground ring + 6 dust.

Перевірте одне комбо та stress із трьома overlaps на declared PC/console profile. Зафіксуйте Niagara counts, overdraw і profiler before/after; не вигадуйте target values.

### Presentation і verification

Подайте gameplay і neutral views, усі mandatory breakdown items, source/authorship log, три resets, slope ground test, H/M/L cue comparison і rubric. Pass можливий лише за `≥80` та кожного floor.

### Альтернативи й неправильні рішення

Допустимо: дві systems для light/heavy, якщо shared parameter contract лишається reusable. Неприпустимо: без змін повторити guided palette/timing, spawn impacts у weapon socket, використати commercial game textures або змінити Low-tier contact timing.

## EX-L11-01-B

### Набір defects і виправлення root cause

| Weakness | Відтворення | Root cause | Мінімальне виправлення | Regression |
|---|---|---|---|---|
| contact з’являється на 2 frames пізно | fixed playback 30 fps | Notify key після registered hit | перенести Notify на contact frame; VFX curve лишити local | усі три contacts у normal/slow |
| slash приховує enemy | gameplay camera, bright arc | oversized card/opacity hold | зменшити coverage і скоротити hold; зберегти direction | black/mid/white gameplay |
| повторне комбо використовує старий cyan | друга activation pooled component | User color не скинуто | установити всі User values до `Activate` | чергувати orange/cyan 6 разів |
| High overdraw spike | overlap трьох impacts | full-screen flash + wide translucent slash | зменшити flash coverage, вилучити duplicate wide layer, зберегти contact core | identical stress route/profiler |

### Точний remediation workflow

1. Заморозьте submitted baseline і запишіть build/camera/profile.
2. Ізолюйте affected layer.
3. Простежте `animation/data → Blueprint → Niagara → renderer/material`.
4. Змініть лише перший failing stage.
5. Зафіксуйте той самий frame/route before і after.
6. Повторно оцініть relevant rubric category; не підвищуйте unrelated categories.

### Оновлене performance/presentation evidence

Додайте default і stress counts, Shader Complexity/Quad Overdraw, profiler evidence, H/M/L на тому самому contact frame та коротке limitation: швидкий camera yaw усе ще може погіршити trail readability. Claim на кшталт «console optimized» заборонений без названого console/build/hardware test.

### Неприпустимі виправлення

- приховування lateness довшим flash;
- зміна camera, щоб уникнути occlusion;
- вимкнення pooling замість reset values;
- зменшення resolution/quality лише в after capture;
- claim про percentage improvement без comparable measurement.
