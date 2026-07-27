# Карта курсу Stylized Anime Real-Time VFX

## Призначення карти

Цей файл визначає обов’язковий порядок проходження 66 повних уроків, часовий бюджет, прямі prerequisites, практичні результати, блокові контрольні роботи та умови завершення курсу. Курс розрахований на самостійне компетентнісне навчання: наступний блок відкривається лише після проходження критерію переходу попереднього блока.

Назви Unreal Engine UI, Material nodes, Niagara modules, параметрів і технічних елементів у матеріалах курсу залишаються англійською. Основна мова пояснень — українська.

## Ключові позначення

- `T/P` — години теорії / години практики.
- `01.01` — блок 01, урок 01.
- `G01` — mastery gate блока 01 пройдено.
- У prerequisites наведено прямі залежності; усі транзитивні залежності успадковуються.
- `M/S practice` — зарезервована частина практики, яка безпосередньо розвиває навички роботи з матеріалами й шейдерами.
- `BLOCK_ASSESSMENT.md` у кожній тематичній папці є окремим контрольним файлом, але не рахується як урок. Час на нього вже включено в практичний час останнього уроку відповідного блока.

## Загальний обсяг і баланс

| Блок | Уроків | Теорія, год | Практика, год | Разом, год | M/S practice, год |
|---|---:|---:|---:|---:|---:|
| `01_UE_FOUNDATIONS/` | 4 | 6.5 | 15.5 | 22 | 0 |
| `02_VFX_DESIGN/` | 4 | 6.5 | 17.5 | 24 | 0 |
| `03_MATERIAL_FOUNDATIONS/` | 9 | 18.5 | 51.5 | 70 | 51.5 |
| `04_STYLIZED_VFX_MATERIALS/` | 7 | 11.5 | 44.5 | 56 | 44.5 |
| `05_PHOTOSHOP_VFX_TEXTURES/` | 5 | 5 | 23 | 28 | 14 |
| `06_BLENDER_AND_SUBSTANCE/` | 5 | 5 | 19 | 24 | 5 |
| `07_NIAGARA_FOUNDATIONS/` | 8 | 14 | 46 | 60 | 4 |
| `08_NIAGARA_ADVANCED/` | 5 | 7.5 | 20.5 | 28 | 2 |
| `09_EFFECT_ARCHETYPES/` | 9 | 11 | 47 | 58 | 9 |
| `10_GAMEPLAY_AND_OPTIMIZATION/` | 5 | 9 | 31 | 40 | 4 |
| `11_PORTFOLIO_PROJECTS/` | 5 | 6 | 40 | 46 | 6 |
| **Усього** | **66** | **100.5** | **355.5** | **456** | **140** |

Перевірка обмежень:

- практика: `355.5 / 456 = 77.96%`;
- material/shader practice: `140 / 355.5 = 39.38%` усієї практики;
- загальний обсяг: 456 годин, у межах цільових 420–480 годин;
- кількість уроків: 66, у межах цільових 50–75 уроків.

### Що входить до 140 годин M/S practice

| Джерело | Години | Що рахується |
|---|---:|---|
| Блок 03 | 51.5 | Material Graph, shader math, UV, procedural masks, вибірка текстури, material properties, debugging |
| Блок 04 | 44.5 | Dissolve, distortion, flow, gradient mapping, Fresnel, WPO, renderer materials, runtime parameters |
| Блок 05 | 14 | Створення texture inputs із обов’язковою перевіркою через UE materials |
| Блок 06 | 5 | UV, normals, vertex colors і procedural textures, перевірені в material pipeline |
| Блок 07 | 4 | Material assignment, Particle Color та renderer bindings |
| Блок 08 | 2 | User Parameters і Niagara-to-Material data flow |
| Блок 09 | 9 | Оригінальні material variants для elemental effects |
| Блок 10 | 4 | Shader Complexity, translucency, overdraw і material optimization |
| Блок 11 | 6 | Material polish, optimization evidence і shader breakdowns |
| **Усього** | **140** | **39.38% усієї практики** |

## Темп навчання

| Режим | Навантаження | Орієнтовна тривалість |
|---|---:|---:|
| Інтенсивний | 12 год/тиждень | 38 тижнів |
| Рекомендований | 9 год/тиждень | приблизно 51 тиждень |
| Обережний | 7 год/тиждень | 66 тижнів |

Повторне проходження слабких тем може збільшити тривалість. Це нормальна частина competency-based підходу й не є причиною пропускати критерії засвоєння.

Рекомендований тижневий цикл:

1. 1–2 години — читання, формування ментальної моделі і контрольовані експерименти.
2. 5–8 годин — керована практика та самостійна варіація.
3. 1 година — перевірка продуктивності, самооцінювання і навчальний журнал.
4. Після перерви понад два тижні — виконайте повторну самоперевірку останнього завершеного уроку до продовження.

## Загальна політика критеріїв переходу

Кожний `BLOCK_ASSESSMENT.md` містить завершений теоретичний тест, практичну контрольну роботу, умови виконання, 100-бальну rubric і remediation path.

Стандартна структура оцінювання:

| Категорія | Бали |
|---|---:|
| Теоретичний тест | 20 |
| Практична контрольна робота | 60 |
| Усунення проблем і докази продуктивності | 10 |
| Self-review, naming і документація | 10 |
| **Разом** | **100** |

Умови проходження:

- загальний результат не нижче 80/100;
- не нижче 60% балів у кожній категорії;
- під час практичної контрольної заборонені покрокові туторіали й готові solution-файли;
- дозволені офіційна документація, glossary, власні короткі нотатки та самостійно створені assets;
- категорію нижче 60% потрібно повторити через окрему transfer-вправу;
- повторна спроба використовує інші стартові дані або інший brief;
- блок вважається завершеним лише після збереження результату, самооцінювання й підготовки доказів продуктивності.

---

# 01. Unreal Engine Foundations

**Папка:** `01_UE_FOUNDATIONS/`  
**Обсяг:** 4 уроки, 22 години — 6.5 T / 15.5 P.  
**Результат блока:** студент має відтворюваний UE 5.8 VFX sandbox, базовий asset workflow, test level і звичку документувати помилки та performance baseline.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 01.01 | `01_course_setup_and_ue58_workflow.md` | Старт у UE 5.8: проєкт і безпечний перехід з UE 5.5 | 2/3 | Немає | Чистий UE 5.8 VFX sandbox, backup і журнал перевірки міграції |
| 01.02 | `02_editor_navigation_and_asset_workflow.md` | Editor та дисципліна VFX-асетів | 1.5/3.5 | 01.01 | Узгоджена Content-структура, naming convention і audit тестових assets |
| 01.03 | `03_vfx_test_level_and_import_pipeline.md` | тестова VFX-сцена, камера та pipeline імпорту | 2/4 | 01.02 | Стандартизований test level та перевірені імпорти texture/mesh |
| 01.04 | `04_debugging_iteration_and_performance_baseline.md` | Цикл ітерації, діагностика й baseline продуктивності | 1/5 | 01.03 | Відтворюваний iteration loop, troubleshooting log і baseline capture |

### `01_UE_FOUNDATIONS/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** версії проєкту, Editor navigation, asset naming, import pipeline, test-level discipline і базова performance термінологія.
- **Практична робота, 60 балів:** з порожнього проєкту створити задану Content-структуру й тестову сцену і camera setup; імпортувати texture та mesh; підготувати scene preset для порівняння ефектів.
- **Troubleshooting/performance, 10 балів:** знайти й виправити три навмисні помилки імпорту або організації; записати початковий baseline.
- **Self-review, 10 балів:** додати журнал рішень, naming audit і короткий migration note.

**Mastery gate G01:** тестова сцена відкривається без помилок, assets мають передбачувані назви й розташування, імпорт перевірено в сцені, а baseline можна повторити за власними нотатками.

**Критерії завершення блока:**

- завершені 4 lesson deliverables;
- assessment ≥80/100 без слабкої категорії;
- студент може без туторіалу відкрити потрібні Editor panels, знайти asset, повторити імпорт і локалізувати базову технічну проблему.

---

# 02. VFX Design

**Папка:** `02_VFX_DESIGN/`  
**Обсяг:** 4 уроки, 24 години — 6.5 T / 17.5 P.  
**Результат блока:** студент уміє розкласти ефект на шари, спроєктувати ієрархію форми, світлоти й кольору, описати timing і сформувати різні мови руху для стихій.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 02.01 | `01_reference_analysis_and_layer_breakdown.md` | Етичний аналіз референсів і декомпозиція ефекту | 2/4 | G01 | Layer breakdown професійного референсу без копіювання пропрієтарних ресурсів |
| 02.02 | `02_shape_value_color_and_readability.md` | Shape, value, color, negative space і читабельність під час гри | 2/4 | 02.01 | Три композиційні boards із різною ієрархією форм |
| 02.03 | `03_timing_motion_and_animation_phases.md` | Timing, motion і фази anime-ефекту | 1.5/4.5 | 02.02 | Timing sheet та animatic від anticipation до residue |
| 02.04 | `04_elemental_style_language_workbook.md` | Система проєктування стихійної shape і motion language | 1/5 | 02.03 | Оригінальна style bible для дев’яти стихій, а не recolor-матриця |

### `02_VFX_DESIGN/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** основні й другорядні форми, accents, supporting particles, residue, negative space, value hierarchy, color hierarchy, покриття екрана і timing phases.
- **Практична робота, 60 балів:** за незнайомим відеореференсом створити layer decomposition, silhouette/value plan, color plan, timing chart і оригінальну варіацію.
- **Troubleshooting/performance, 10 балів:** знайти проблеми читабельності на ігровій камері, зменшити зайве покриття екрана і повторно перевірити silhouette.
- **Self-review, 10 балів:** аргументувати, що взято як design principle, а що свідомо змінено для уникнення копіювання.

**Mastery gate G02:** ефект читається у grayscale і silhouette, має зрозумілу ієрархію, завершений timing arc та самостійну художню інтерпретацію.

**Критерії завершення блока:**

- завершені 4 design deliverables;
- assessment ≥80/100;
- студент може без готового breakdown назвати всі функціональні шари й пояснити, як форма, колір і timing підтримують читабельність під час гри.

---

# 03. Material Foundations

**Папка:** `03_MATERIAL_FOUNDATIONS/`  
**Обсяг:** 9 уроків, 70 годин — 18.5 T / 51.5 P.  
**M/S practice:** 51.5 години.  
**Результат блока:** студент починає з абсолютного нуля й уміє будувати, читати, перевіряти та оптимізувати базові VFX Material Graphs.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 03.01 | `01_shader_mental_model_and_value_types.md` | Shader з абсолютного нуля: calculations, values і дані кольору | 3/5 | G02 | Debug material для Scalar, Vector2/3/4, RGB, 0–1, values outside 0–1, linear/sRGB і HDR |
| 03.02 | `02_material_math_and_remapping.md` | Material math і remapping | 2.5/5.5 | 03.01 | Візуальна бібліотека Add, Subtract, Multiply, Divide, Lerp, Clamp, Saturate, OneMinus, Power, Abs, Sign, Min і Max |
| 03.03 | `03_procedural_math_and_threshold_masks.md` | Thresholds і процедурна математика масок | 2.5/5.5 | 03.02 | Mask laboratory для Floor, Ceil, Frac, Step, SmoothStep, Distance, Length, Dot Product і Normalize |
| 03.04 | `04_uv_coordinates_and_coordinate_spaces.md` | UV, pivot, рух і системи координат | 2/6 | 03.03 | UV diagnostic material із tiling, offset, pivot, Panner, Rotator та local/world/object/camera/screen comparisons |
| 03.05 | `05_procedural_shapes_polar_and_sdf_masks.md` | Gradients, polar coordinates і SDF-подібні форми | 2/6 | 03.04 | Параметрична бібліотека circle, ring, line, arc, sector, polar і repeating masks |
| 03.06 | `06_texture_sampling_channels_and_flipbooks.md` | Texture sampling, channels, compression і flipbooks | 2/6 | 03.05 | Texture set із alpha/grayscale masks, пакування каналів, compression, mip/bleed tests, noise, directional noise і SubUV |
| 03.07 | `07_material_domains_blending_depth_and_overdraw.md` | Material properties, depth і translucency | 2/6 | 03.06 | Порівняльна сцена Material Domain, Blend Modes, Shading Models, Unlit, Emissive, Opacity/Opacity Mask, Two Sided, Depth Fade, Scene Depth і Pixel Depth |
| 03.08 | `08_instances_functions_switches_and_debugging.md` | Reusable material architecture і shader debugging | 1.5/5.5 | 03.07 | Material Functions, Instances, Static Switches, permutation audit і reusable architecture |
| 03.09 | `09_material_foundations_control_project.md` | Контрольний проєкт фундаменту Material Editor | 1/6 | 03.08 | Три матеріали, відтворені з письмових specifications без готового graph |

### `03_MATERIAL_FOUNDATIONS/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** shader mental model, value types, 0–1, linear/sRGB/HDR, arithmetic, thresholds, vector operations, UV, системи координат, texture sampling і material properties.
- **Практична робота, 60 балів:** створити з чистого graph procedural mask material, texture-driven animated material і depth-aware translucent або masked VFX material.
- **Troubleshooting/performance, 10 балів:** показати intermediate debug outputs, виправити UV/alpha/depth issue і порівняти Shader Complexity.
- **Self-review, 10 балів:** надати однозначний connection list і пояснити кожну математичну гілку.

**Mastery gate G03:** усі три graphs працюють, кожна операція пояснена, проміжні outputs перевіряються окремо, а матеріали не залежать від непрозорого готового function.

**Критерії завершення блока:**

- завершені 9 lesson deliverables;
- assessment ≥80/100;
- студент із чистого Material Graph відтворює задану маску, UV transform і конвеєр вибірки текстури;
- усі 51.5 години практики блока зараховані до M/S ledger.

---

# 04. Stylized VFX Materials

**Папка:** `04_STYLIZED_VFX_MATERIALS/`  
**Обсяг:** 7 уроків, 56 годин — 11.5 T / 44.5 P.  
**M/S practice:** 44.5 години.  
**Результат блока:** студент будує reusable stylized VFX material family для Sprite, Mesh, Ribbon і Decal Renderers та керує нею з Niagara/Blueprint.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 04.01 | `01_dissolve_erosion_and_edge_control.md` | Dissolve, erosion і керований edge mask | 2/6 | G03 | Reusable dissolve function із контрольованим edge і temporal tests |
| 04.02 | `02_distortion_flow_and_fake_refraction.md` | Distortion, flow maps і fake refraction | 2/6 | 04.01 | Читабельні heat/water distortion variants із flow control |
| 04.03 | `03_gradient_mapping_hdr_and_stylized_color.md` | Gradient mapping, HDR і stylized color control | 2/6 | 04.02 | Редагована через gradient ramp система dominant/accent color |
| 04.04 | `04_fresnel_wpo_and_vertex_animation.md` | Fresnel, WPO і Vertex Color | 1.5/6.5 | 04.03 | Animated mesh material із vertex-driven mask і deformation |
| 04.05 | `05_sprite_mesh_ribbon_and_decal_materials.md` | Матеріали для Sprite, Mesh, Ribbon і Decal | 1.5/6.5 | 04.04 | Чотири renderer-ready material templates із sorting/depth tests |
| 04.06 | `06_niagara_material_data_and_runtime_parameters.md` | Дані між Niagara, Material і Blueprint | 1.5/6.5 | 04.05 | Particle Color, Dynamic Parameters, User Parameters, renderer bindings, DMI та MPC demo |
| 04.07 | `07_material_laboratory_capstone.md` | Material Laboratory | 1/7 | 04.06 | Production-ready VFX material family, functions, instances і shader-cost report |

### `04_STYLIZED_VFX_MATERIALS/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** dissolve/erosion, flow, distortion, gradient mapping, Fresnel, WPO, Vertex Color, renderer-specific needs і runtime parameter paths.
- **Практична робота, 60 балів:** розширити Material Laboratory до sprite, mesh, ribbon і decal variants із двома shared Material Functions та Material Instances.
- **Troubleshooting/performance, 10 балів:** виправити sorting/depth/binding issue; надати Shader Complexity і overdraw comparison до/після оптимізації.
- **Self-review, 10 балів:** parameter naming, architecture diagram, connection lists і documented limitations.

**Mastery gate G04:** Material Laboratory дозволяє створити щонайменше три візуально різні effects без дублювання core graph, приймає runtime data й має задокументовану перевірку продуктивності.

**Критерії завершення блока:**

- завершені 7 lesson deliverables;
- assessment ≥80/100;
- Material Laboratory збережено як основний reusable toolkit курсу;
- усі 44.5 години практики блока зараховані до M/S ledger.

---

# 05. Photoshop VFX Textures

**Папка:** `05_PHOTOSHOP_VFX_TEXTURES/`  
**Обсяг:** 5 уроків, 28 годин — 5 T / 23 P.  
**M/S practice:** 14 годин через обов’язкову перевірку вхідних текстур у UE materials.  
**Результат блока:** студент без розвинених painting skills створює функціональні grayscale, alpha, packed і flipbook textures для VFX.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 05.01 | `01_photoshop_vfx_texture_workflow.md` | Photoshop/Krita workflow для VFX-текстур з нуля | 1.5/4.5 | G04 | Grayscale/alpha exercise із document setup, layers, masks, Levels, Curves, brushes, transform і warp |
| 05.02 | `02_seamless_noise_smoke_and_masks.md` | Seamless noise, smoke і utility masks | 1/5 | 05.01 | Seamless noise/smoke texture set |
| 05.03 | `03_slash_spark_and_magic_circle_textures.md` | Slash, spark і magic circle textures | 1/5 | 05.02 | Оригінальний combat texture sheet |
| 05.04 | `04_ramps_distortion_and_channel_packing.md` | Gradient ramps, distortion і пакування каналів | 1/4 | 05.03 | Packed utility texture та UE material validation |
| 05.05 | `05_flipbook_export_and_ue_texture_validation.md` | Flipbook preparation, export і UE texture settings | 0.5/4.5 | 05.04 | Готовий VFX texture atlas/flipbook pack без edge bleeding |

### `05_PHOTOSHOP_VFX_TEXTURES/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** grayscale/alpha logic, Levels/Curves, masks, seamless construction, пакування каналів, export, UE texture settings і flipbook preparation.
- **Практична робота, 60 балів:** з чистих документів створити slash, spark, smoke/noise, magic-circle, gradient-ramp і distortion assets та упаковану текстуру.
- **Troubleshooting/performance, 10 балів:** виправити seam, halo або mip bleeding; перевірити памʼять текстур і sampling у UE.
- **Self-review, 10 балів:** naming, source-file organization, export table і Krita equivalents для використаних Photoshop tools.

**Mastery gate G05:** усі textures читаються в grayscale, мають чисті alpha edges, правильно імпортуються й працюють у Material Laboratory.

**Критерії завершення блока:**

- завершені 5 lesson deliverables;
- assessment ≥80/100;
- texture pack не використовує proprietary assets;
- щонайменше 14 практичних годин задокументовано як texture-to-material M/S practice.

---

# 06. Blender and Substance

**Папка:** `06_BLENDER_AND_SUBSTANCE/`  
**Обсяг:** 5 уроків, 24 години — 5 T / 19 P.  
**M/S practice:** 5 годин.  
**Результат блока:** студент створює тільки потрібну VFX artist геометрію та процедурні textures, коректно переносить їх до UE.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 06.01 | `01_blender_cards_and_slash_meshes.md` | VFX cards, planes і slash meshes у Blender | 1.5/3.5 | G05 | Camera-readable slash/card mesh kit |
| 06.02 | `02_blender_cones_rings_beams_and_debris.md` | Cones, rings, beams і simple debris | 1/4 | 06.01 | Модульний VFX geometry kit |
| 06.03 | `03_uv_normals_vertex_color_and_fbx_export.md` | UV, normals, vertex colors, pivots і FBX pipeline | 1/4 | 06.02 | UE-validated meshes із коректними scale, transforms і triangulation |
| 06.04 | `04_substance_graphs_noise_gradients_and_masks.md` | Substance graph basics для VFX | 1/4 | 06.03 | Процедурний noise/gradient/mask graph |
| 06.05 | `05_procedural_texture_library_and_ue_validation.md` | Warp, distance, tile generation і reusable texture library | 0.5/3.5 | 06.04 | Packed procedural texture family, перевірена в UE |

### `06_BLENDER_AND_SUBSTANCE/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** VFX topology needs, UV, normals, vertex colors, pivots, transforms, scale, triangulation, FBX та Substance graph operations.
- **Практична робота, 60 балів:** створити slash mesh, ring або beam, simple debris і reusable procedural texture без готових вихідних ресурсів.
- **Troubleshooting/performance, 10 балів:** виправити неправильний pivot/scale/normals/UV та перевірити mesh/texture у UE material.
- **Self-review, 10 балів:** export checklist, source organization і коротке пояснення, чому кожний asset потрібен ефекту.

**Mastery gate G06:** geometry і textures коректно імпортуються, реагують на UV/Vertex Color material controls і не мають зайвої для VFX задачі складності.

**Критерії завершення блока:**

- завершені 5 lesson deliverables;
- assessment ≥80/100;
- готові geometry kit і procedural texture kit;
- 5 практичних годин зафіксовано як M/S-compatible asset practice.

---

# 07. Niagara Foundations

**Папка:** `07_NIAGARA_FOUNDATIONS/`  
**Обсяг:** 8 уроків, 60 годин — 14 T / 46 P.  
**M/S practice:** 4 години на renderer materials і bindings.  
**Результат блока:** студент із чистої системи створює керовані Sprite, Mesh і Ribbon Emitters та розуміє execution stack і data flow.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 07.01 | `01_niagara_system_emitter_module_and_stack.md` | System, Emitter, Module, Parameter і execution stack | 2.5/4.5 | G06 | Annotated Niagara System із Spawn/Update stages, namespaces та Parameter Map trace |
| 07.02 | `02_spawn_lifetime_normalized_age_and_curves.md` | Spawn, lifetime, normalized age і curves | 2/5 | 07.01 | Deterministic Burst/Rate timing study |
| 07.03 | `03_shape_location_velocity_and_forces.md` | Shape locations, velocity, acceleration, drag і gravity | 2/6 | 07.02 | Local/world-space motion laboratory |
| 07.04 | `04_curl_noise_attraction_vortex_and_orientation.md` | Curl noise, attraction, vortex, facing і alignment | 2/6 | 07.03 | Три керовані motion-field studies |
| 07.05 | `05_sprite_renderer_and_material_bindings.md` | Sprite Renderer і material bindings | 1.5/6.5 | 07.04; 04.06 | Production-ready sprite emitter |
| 07.06 | `06_mesh_renderer_and_space_control.md` | Mesh Renderer, orientation і space control | 1.5/6.5 | 07.05; 06.03 | Mesh-particle burst із керованою орієнтацією |
| 07.07 | `07_ribbon_renderer_and_trail_construction.md` | Ribbon Renderer і побудова trail | 1.5/5.5 | 07.06 | Stable ribbon trail із material bindings |
| 07.08 | `08_niagara_foundations_control_project.md` | Контрольний multi-renderer Niagara System | 1/6 | 07.07 | Оригінальна система Sprite + Mesh + Ribbon із User controls |

### `07_NIAGARA_FOUNDATIONS/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** System/Emitter/Module/Parameter, stack order, namespaces, Parameter Map, lifetime, normalized age, spawn methods, curves, attributes, forces, spaces і renderers.
- **Практична робота, 60 балів:** за письмовим brief побудувати один System із Sprite, Mesh і Ribbon Emitters, deterministic seed і exposed User controls.
- **Troubleshooting/performance, 10 балів:** виправити stack-order, space, facing або binding issue; встановити bounds і перевірити кількість частинок.
- **Self-review, 10 балів:** надати stack map, parameter table і пояснення CPU/GPU choice.

**Mastery gate G07:** multi-renderer System відтворює brief, усі modules стоять у логічних stages, bindings працюють, а student може пояснити рух одного particle від spawn до death.

**Критерії завершення блока:**

- завершені 8 lesson deliverables;
- assessment ≥80/100;
- Sprite, Mesh і Ribbon Renderers побудовані з чистих Emitters;
- 4 години renderer-material work зафіксовано в M/S ledger.

---

# 08. Niagara Advanced

**Папка:** `08_NIAGARA_ADVANCED/`  
**Обсяг:** 5 уроків, 28 годин — 7.5 T / 20.5 P.  
**M/S practice:** 2 години.  
**Результат блока:** студент обґрунтовано вибирає simulation type, працює з collision/data inputs, створює reusable Niagara logic і налаштовує bounds/scalability.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 08.01 | `01_cpu_gpu_simulation_and_collision_choices.md` | CPU/GPU simulation, collisions і distance fields | 2/4 | G07 | Порівняльний CPU/GPU collision prototype і журнал рішень |
| 08.02 | `02_events_data_interfaces_and_skeletal_sampling.md` | Events, Data Interfaces і skeletal mesh sampling | 1.5/4.5 | 08.01 | Skeletal/data-driven emitter та документовані Events limitations |
| 08.03 | `03_user_parameters_renderer_bindings_and_blueprint_data.md` | User Parameters, renderer bindings і Blueprint data | 1.5/4.5 | 08.02 | Один System, керований direction/color/scale/target inputs |
| 08.04 | `04_scratch_pad_reusable_modules_and_simulation_stages.md` | Scratch Pad, reusable Modules і Simulation Stages | 1.5/3.5 | 08.03 | Reusable custom module з validation cases |
| 08.05 | `05_bounds_culling_scalability_and_optional_fluids.md` | Bounds, culling, scalability та optional Niagara Fluids | 1/4 | 08.04 | Advanced control effect; optional fluids-to-flipbook study поза core gate |

### `08_NIAGARA_ADVANCED/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** CPU/GPU tradeoffs, collision types, distance fields, Events limitations, Data Interfaces, skeletal sampling, User Parameters, Scratch Pad, Simulation Stages, bounds і culling.
- **Практична робота, 60 балів:** створити data-driven System з обґрунтованим simulation type, одним Data Interface, reusable module та елементами керування під час виконання.
- **Troubleshooting/performance, 10 балів:** виправити collision/data/bounds issue та продемонструвати culling/scalability behavior.
- **Self-review, 10 балів:** журнал рішень, limitations і reusable-module documentation.

**Mastery gate G08:** система отримує зовнішні дані, коректно реагує на них, має reusable logic, стабільні bounds і зафіксовані performance assumptions. Optional Niagara Fluids не впливає на проходження.

**Критерії завершення блока:**

- завершені 5 core lesson deliverables;
- assessment ≥80/100;
- advanced feature не використовується без пояснення production risk;
- 2 години Niagara-to-Material practice зафіксовано в M/S ledger.

---

# 09. Effect Archetypes

**Папка:** `09_EFFECT_ARCHETYPES/`  
**Обсяг:** 9 уроків, 58 годин — 11 T / 47 P.  
**M/S practice:** 9 годин.  
**Результат блока:** студент створює всі 19 обов’язкових archetypes і дев’ять окремих elemental shape/motion languages.

Кожний урок цього блока проходить три етапи:

1. Простий технічний варіант.
2. Reference study тільки з власними assets.
3. Оригінальна самостійна варіація.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 09.01 | `01_fire_impact_language.md` | Fire language: hit spark і melee impact | 1.5/5.5 | G08; 02.04 | Триетапний проєкт **Stylized Impact** |
| 09.02 | `02_water_projectile_language.md` | Water language: projectile і projectile trail | 1.5/5.5 | 09.01 | Триетапний **Elemental Projectile Kit** prototype |
| 09.03 | `03_ice_shockwave_language.md` | Ice language: shockwave і shatter response | 1.5/5.5 | 09.02 | Radial ice shockwave із secondary shards |
| 09.04 | `04_electric_beam_language.md` | Electricity language: beam і ribbon trail | 1.5/5.5 | 09.03 | Directed electric beam/trail ability |
| 09.05 | `05_wind_slash_language.md` | Wind language: sword slash і slash arc | 1/5 | 09.04 | Триетапний проєкт **Slash Combo** |
| 09.06 | `06_earth_ground_response.md` | Earth language: ground crack і secondary shockwave | 1/5 | 09.05 | Ground-impact response із crack, debris і wave |
| 09.07 | `07_nature_aura_and_area.md` | Nature language: aura, buff/debuff і lingering area effect | 1/5 | 09.06 | Aura/buff plus readable lingering gameplay area |
| 09.08 | `08_light_telegraph_and_burst.md` | Light language: magic circle, targeting telegraph і elemental burst | 1/5 | 09.07 | Readable telegraphed light burst |
| 09.09 | `09_void_spawn_transformation_ultimate.md` | Darkness/void language: spawn, transformation і character ultimate | 1/5 | 09.08 | Transformation sequence й ultimate prototype |

### `09_EFFECT_ARCHETYPES/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** layer functions, timing phases, читабельність під час гри, elemental shape/motion distinctions і archetype-specific requirements.
- **Практична робота, 60 балів:** за випадковою комбінацією `стихія + два archetypes` пройти три етапи й створити оригінальний effect без покрокового туторіалу.
- **Troubleshooting/performance, 10 балів:** перевірка з ігрової камери, particle/system count, overdraw/material check, bounds і performance correction.
- **Self-review, 10 балів:** coverage ledger 19/19, reference ethics statement і порівняння технічної та оригінальної версій.

**Mastery gate G09:** усі 19 archetypes позначено завершеними, дев’ять elemental languages відрізняються не лише кольором, а контрольний effect читається в реальній ігровій камері.

**Критерії завершення блока:**

- завершені 9 lesson deliverables;
- assessment ≥80/100;
- виконані Stylized Impact, Slash Combo, Elemental Projectile Kit prototype і Aura/Transformation study;
- кожний великий effect пройшов перевірку продуктивності;
- 9 годин effect-material iteration зафіксовано в M/S ledger.

---

# 10. Gameplay and Optimization

**Папка:** `10_GAMEPLAY_AND_OPTIMIZATION/`  
**Обсяг:** 5 уроків, 40 годин — 9 T / 31 P.  
**M/S practice:** 4 години.  
**Результат блока:** студент інтегрує effects у gameplay, передає параметри, синхронізує їх з animation і створює production-friendly High/Medium/Low variants.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 10.01 | `01_niagara_components_spawning_and_lifecycle.md` | Niagara Component, spawning і lifecycle | 2/6 | G09 | Spawn System at Location/Attached demo з activation, deactivation і looping |
| 10.02 | `02_sockets_animation_notifies_and_attachment.md` | Sockets, Animation Notifies і attachment | 1.5/6.5 | 10.01 | Weapon/character effect, синхронізований з animation |
| 10.03 | `03_blueprint_parameters_targets_and_reuse.md` | Blueprint parameters, target data, reuse і pooling concepts | 2/6 | 10.02 | Reusable gameplay setup із position/direction/color/scale/target inputs |
| 10.04 | `04_cpu_gpu_profiling_and_cost_budgets.md` | CPU/GPU profiling і production cost budgets | 2/6 | 10.03 | Niagara Debugger, Unreal Insights/GPU evidence та cost ledger |
| 10.05 | `05_scalability_platform_profiles_and_presentation.md` | Overdraw, culling, H/M/L profiles і PC/console delivery | 1.5/6.5 | 10.04 | Gameplay-tested effect із Effect Type, H/M/L, camera tests; Sequencer лише для presentation |

### `10_GAMEPLAY_AND_OPTIMIZATION/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** Niagara Component, spawn/attach methods, lifecycle, sockets, Animation Notifies, parameter passing, pooling concepts, profiling, Effect Types і scalability.
- **Практична робота, 60 балів:** інтегрувати великий effect у character action, передати target/direction/color/scale data та створити High/Medium/Low profiles.
- **Troubleshooting/performance, 10 балів:** надати captures particle count, active System count, CPU/GPU cost, translucency, overdraw, Shader Complexity, памʼять текстур, mesh/ribbon/collision/light cost, sorting, bounds і culling.
- **Self-review, 10 балів:** platform budget table, нотатки про перевірку з ігрової камери і список компромісів між High/Medium/Low.

**Mastery gate G10:** effect запускається в ігровому контексті, прив’язаний до правильних sockets/notifies, отримує параметри під час виконання, не ламається в ігровій камері й має перевірені H/M/L profiles.

**Критерії завершення блока:**

- завершені 5 lesson deliverables;
- assessment ≥80/100;
- performance перевірено в реальній сцені, а не лише в Niagara preview;
- Sequencer використано лише для презентації;
- 4 години shader/overdraw optimization зафіксовано в M/S ledger.

---

# 11. Portfolio Projects

**Папка:** `11_PORTFOLIO_PROJECTS/`  
**Обсяг:** 5 уроків, 46 годин — 6 T / 40 P.  
**M/S practice:** 6 годин.  
**Результат блока:** чотири завершені, оригінальні, gameplay-tested portfolio pieces із розбором і доказами продуктивності і presentation package.

Кожний portfolio project 11.01–11.04 обов’язково містить:

- creative brief;
- technical requirements;
- constraints;
- reference analysis;
- production milestones;
- checklist;
- self-review rubric;
- performance requirements;
- presentation requirements;
- список обов’язкових breakdown materials;
- Definition of Done.

| ID | Файл | Назва уроку | T/P | Prerequisites | Ключовий результат |
|---|---|---|---:|---|---|
| 11.01 | `01_stylized_melee_combo_portfolio_piece.md` | Portfolio Piece 1: Stylized melee combo | 1/9 | G10; 09.01; 09.05; 09.06 | Impact + slashes + trail + ground response, інтегровані в gameplay |
| 11.02 | `02_elemental_projectile_kit_portfolio_piece.md` | Portfolio Piece 2: Elemental projectile kit | 1/9 | G10; 09.02–09.04 | Cohesive kit із launch, projectile, trail, impact і трьома відмінними element variants |
| 11.03 | `03_character_aura_transformation_portfolio_piece.md` | Portfolio Piece 3: Aura, transformation або buff | 1/9 | G10; 09.07; 09.09 | Character-bound looping/transition piece із читабельністю під час гри |
| 11.04 | `04_character_ultimate_boss_ability_portfolio_piece.md` | Portfolio Piece 4: Character ultimate або boss ability | 1/9 | G10; 09.08; 09.09 | Оригінальна багатофазна ability і фінальна перевірка продуктивності |
| 11.05 | `05_portfolio_breakdowns_reel_and_case_studies.md` | Breakdown, reel і описи проєктів | 2/4 | 11.01–11.04 | Чотири breakdown packages, captures, reel edit і текстові описи проєктів |

### `11_PORTFOLIO_PROJECTS/BLOCK_ASSESSMENT.md`

- **Тест, 20 балів:** production planning, reference ethics, readability, integration, optimization, breakdown і presentation decisions.
- **Практична робота, 60 балів:** фінальний cross-project polish pass і презентація всіх чотирьох pieces у gameplay та нейтральній тестовій сцені.
- **Troubleshooting/performance, 10 балів:** усунути щонайменше одну documented weakness кожної роботи й надати фінальні H/M/L та profiling captures.
- **Self-review, 10 балів:** чотири описи проєктів з design intent, layer breakdown, material/Niagara architecture, iteration history і чесними limitations.

**Mastery gate G11:** кожна робота окремо набрала не менше 80/100, не має критичної gameplay або performance помилки, використовує власні assets і містить повний breakdown.

**Критерії завершення блока:**

- завершені 4 portfolio pieces і 4 описи проєктів;
- assessment ≥80/100;
- кожний piece має gameplay capture, neutral-view capture, layer breakdown, material graph breakdown, Niagara stack breakdown і докази продуктивності;
- 6 годин фінального material/shader polish зафіксовано в M/S ledger.

---

# Coverage ledger

## Матеріали та шейдери

| Обов’язкова тема | Перше системне покриття | Повторне застосування |
|---|---|---|
| Shader, vertex/pixel calculations, Scalar/Vector, RGB, 0–1, linear/sRGB/HDR, Emissive | 03.01 | 03.07, 04.03, 09, 11 |
| Add, Subtract, Multiply, Divide, Lerp, Clamp, Saturate, OneMinus, Power, Abs, Sign, Min, Max, remapping | 03.02 | 03.03–04.07 |
| Floor, Ceil, Frac, Step, SmoothStep, Distance, Length, Dot Product, Normalize | 03.03 | 03.05, 04.01–04.04 |
| UV, tiling, offset, pivot, Panner, Rotator, coordinate spaces | 03.04 | 04.02, 04.04–04.05, 07 |
| Gradients, circles, rings, lines, arcs, sectors, polar, repeating patterns, SDF-like masks | 03.05 | 04.01, 04.03, 05.03, 09 |
| Texture sampling, alpha, grayscale, packing, compression, mipmaps, bleeding, flipbooks, SubUV, noise | 03.06 | 05, 06.04–06.05, 09 |
| Material Domain, Blend Modes, Shading Models, Unlit, Opacity, Opacity Mask, Two Sided, depth, translucency, sorting, overdraw | 03.07 | 04.05, 10.04–10.05 |
| Material Instances, Functions, Static Switches, permutations, debugging, reusable architecture | 03.08 | 04.07, 09, 11 |
| Dissolve, erosion, edge masks | 04.01 | 09.07–09.09, 11.03–11.04 |
| Distortion, fake refraction, flow maps | 04.02 | 05.04, 09.02, 09.04 |
| Gradient ramps і stylized HDR color | 04.03 | 05.04, 09, 11 |
| Fresnel, WPO, Vertex Color | 04.04 | 06.03, 09.07, 09.09 |
| Sprite, Mesh, Ribbon, Decal materials | 04.05 | 07.05–07.08, 09, 11 |
| Particle Color, Dynamic Parameters, renderer bindings, User Parameters, DMI, MPC | 04.06 | 07.05–08.03, 10, 11 |
| Shader Complexity і material performance | 03.08, 04.07 | 10.04–10.05, 11 |

## Photoshop, Krita, Blender і Substance

| Обов’язкова тема | Покриття |
|---|---|
| Photoshop document setup, layers, masks, grayscale, alpha, Levels, Curves, brushes, transform, warp; Krita equivalents | 05.01 |
| Seamless textures, smoke і noise | 05.02 |
| Slash, spark і magic circle elements | 05.03 |
| Gradient ramp, distortion texture, channel packing | 05.04 |
| Export, UE texture settings і flipbook preparation | 05.05 |
| VFX planes/cards і slash meshes | 06.01 |
| Cones, rings, beams і debris | 06.02 |
| UV, normals, vertex colors, pivots, transforms, scale, triangulation, FBX | 06.03 |
| Substance graph, noises, gradients, blend, levels і masks | 06.04 |
| Directional warp, distance, tile generation, packing, reusable export | 06.05 |

## Niagara

| Обов’язкова тема | Покриття |
|---|---|
| System, Emitter, Module, Parameter, stack, stages, namespaces, Parameter Map | 07.01 |
| Lifetime, normalized age, Burst, Rate, curves, attributes, deterministic randomness | 07.02 |
| Shape locations, velocity, acceleration, drag, gravity, local/world space | 07.03 |
| Curl noise, attraction, vortex, orientation, facing, alignment | 07.04 |
| Sprite Renderer | 07.05 |
| Mesh Renderer | 07.06 |
| Ribbon Renderer | 07.07 |
| CPU/GPU simulations, collisions, distance fields | 08.01 |
| Events і limitations, Data Interfaces, skeletal mesh sampling | 08.02 |
| User Parameters, renderer bindings, Blueprint communication | 08.03 |
| Scratch Pad, reusable Modules, Simulation Stages | 08.04 |
| Bounds, culling, Effect Types і scalability | 08.05, 10.05 |
| Niagara Fluids і flipbook baking як optional | 08.05 |
| Debugging і profiling | 07.08, 08.05, 10.04 |

## Дев’ять elemental languages і 19 archetypes

| Урок | Element language | Archetypes |
|---|---|---|
| 09.01 | Fire | hit spark; melee impact |
| 09.02 | Water | projectile; projectile trail |
| 09.03 | Ice | shockwave |
| 09.04 | Electricity | beam; ribbon trail |
| 09.05 | Wind | sword slash; slash arc |
| 09.06 | Earth | ground crack |
| 09.07 | Nature | aura; buff/debuff; lingering area effect |
| 09.08 | Light | magic circle; targeting telegraph; elemental burst |
| 09.09 | Darkness/void | spawn; transformation; character ultimate |
| **Разом** | **9/9** | **19/19** |

## Gameplay integration та optimization

| Обов’язкова тема | Покриття |
|---|---|
| Niagara Component, Spawn System at Location, Spawn System Attached, activation/deactivation/looping | 10.01 |
| Sockets, Animation Notifies, character/weapon attachment | 10.02 |
| Blueprint position, direction, color, scale, target data, reuse, pooling concepts | 10.03 |
| Particle count, active System count, CPU/GPU cost, mesh/ribbon/collision/light cost, Niagara Debugger, Unreal Insights, GPU profiling | 10.04 |
| Translucency, overdraw, Shader Complexity, texture memory, sorting, bounds, culling, Effect Types, H/M/L, PC/console, real-scene tests | 10.05 |
| Gameplay camera testing | 02.02, 09, 10.02, 10.05, 11 |
| Sequencer тільки для presentation | 10.05, 11.05 |

## Обов’язкові практичні проєкти

| Проєкт | Основний урок | Фінальне застосування |
|---|---|---|
| Material Laboratory | 04.07 | Усі effects у блоках 09–11 |
| Stylized Impact | 09.01 | 11.01 |
| Slash Combo | 09.05 | 11.01 |
| Elemental Projectile Kit | 09.02 | 11.02 |
| Aura або Transformation | 09.07 і 09.09 | 11.03 |
| Original Character Ultimate або Boss Ability | 09.09 prototype | 11.04 final |

## Чотири portfolio pieces

| Piece | Урок | Обов’язкові складові |
|---|---|---|
| Stylized melee combo | 11.01 | Anticipation, slash arcs, ribbon/weapon trail, impacts, ground response, gameplay synchronization, H/M/L |
| Elemental projectile kit | 11.02 | Launch, projectile body, trail, impact, три distinct elemental variants, runtime direction/target data, H/M/L |
| Character aura/transformation/buff | 11.03 | Character attachment, readable loop, activation/deactivation або transition, material/parameter control, перевірка з ігрової камери |
| Character ultimate/boss ability | 11.04 | Multi-phase timing, telegraph, main action, contact/impact, dissipation/residue, gameplay integration, final profiling |

# Критерії завершення всього курсу

Курс завершено лише тоді, коли одночасно виконані всі умови:

1. Пройдено всі 66 уроків і збережено всі lesson deliverables.
2. Пройдено `G01`–`G11`: кожний assessment має результат не нижче 80/100 і не нижче 60% у кожній категорії.
3. Підтверджено 355.5 години практики з навчального журналу або еквівалентного evidence log.
4. Підтверджено 140 годин M/S practice.
5. Material Laboratory відтворюється й розширюється без готового покрокового graph.
6. Створено власні Photoshop/Krita textures, Blender meshes і Substance procedural textures.
7. Створено Sprite, Mesh і Ribbon Niagara Systems; продемонстровано runtime data flow між Niagara, Materials і Blueprint.
8. Coverage ledger містить 9/9 elemental languages і 19/19 archetypes.
9. Кожний великий effect має перевірку з ігрової камери та перевірку продуктивності.
10. Один effect повністю інтегровано через Niagara Component, sockets/Animation Notifies і runtime parameters.
11. Для production effects існують High/Medium/Low profiles.
12. Завершено чотири portfolio pieces; кожний окремо отримав не менше 80/100.
13. Кожний portfolio piece має creative brief, constraints, оригінальний аналіз референсів, milestones, checklist, rubric, докази продуктивності, presentation captures і повний breakdown.
14. У портфоліо немає вилучених або повторно використаних пропрієтарних ресурсів.
15. Студент може пояснити власні material graphs, Niagara stacks, optimization decisions і відомі обмеження без підглядання в solution.

Завершення курсу формує набір навичок і портфоліо для подання на junior-позиції, але не є гарантією працевлаштування.
