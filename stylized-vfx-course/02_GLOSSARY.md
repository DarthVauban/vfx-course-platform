# Глосарій Stylized Real-Time VFX

## Як користуватися

English terms у цьому файлі збігаються з назвами, які ви шукаєте в Unreal Engine та інших DCC tools. У колонці «Перше використання» наведено перший урок, де термін стає практичною навичкою. Посилання веде на файл уроку; використовуйте пошук усередині файла, якщо anchor змінився після оновлення документації.

Визначення тут короткі. Повна mental model, exact settings і вправи розміщені в уроках.

## Unreal Engine і production workflow

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Asset | Збережений ресурс проєкту: Material, Texture, Static Mesh, Niagara System тощо. | `M_VFX_Sprite_Master` — Material asset. | [01.01](01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md) |
| Actor | Об’єкт, який можна розмістити в Level; може містити Components. | `BP_VFX_TestRig` у test map. | [01.01](01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md) |
| Component | Функціональна частина Actor. | `Niagara Component` відтворює System усередині Blueprint Actor. | [01.01](01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md) |
| Project | Контейнер code, settings, content і maps для однієї Unreal application. | `SVFX_Course_58.uproject`. | [01.01](01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md) |
| Level / Map | Сцена з Actors, camera context, lighting і test geometry. | `L_VFX_Test_Neutral`. | [01.03](01_UE_FOUNDATIONS/03_vfx_test_level_and_import_pipeline.md) |
| Content Browser | Панель перегляду, створення, пошуку й організації Assets. | Знайти всі `NS_` assets у `/Game/SVFX/`. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Content Drawer | Тимчасово висувний доступ до Content Browser у нижній частині Editor. | Імпортувати `T_VFX_Slash_A.png`. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Viewport | Вікно перегляду сцени або asset preview. | Перевірити impact із gameplay camera. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Details panel | Контекстна панель properties вибраного Actor, Component, node або asset. | Змінити `Auto Activate` у Niagara Component. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Outliner | Ієрархічний список Actors поточного Level. | Знайти `BP_VFX_TestRig_01`. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Blueprint | Visual scripting system і тип asset для gameplay logic. | Передати `User.ImpactColor` у Niagara System. | [10.01](10_GAMEPLAY_AND_OPTIMIZATION/01_niagara_components_spawning_and_lifecycle.md) |
| Static Mesh | Неригіджена polygonal geometry asset. | Slash arc mesh або debris shard. | [01.03](01_UE_FOUNDATIONS/03_vfx_test_level_and_import_pipeline.md) |
| Skeletal Mesh | Mesh, деформація якого керується skeleton. | Персонаж, із surface якого spawn-яться particles. | [08.02](08_NIAGARA_ADVANCED/02_events_data_interfaces_and_skeletal_sampling.md) |
| Socket | Іменована attachment point на skeleton/mesh. | Прикріпити sword trail до `weapon_tip`. | [10.02](10_GAMEPLAY_AND_OPTIMIZATION/02_sockets_animation_notifies_and_attachment.md) |
| Animation Notify | Подія на timeline Animation Sequence/Montage. | Запустити impact у frame контакту. | [10.02](10_GAMEPLAY_AND_OPTIMIZATION/02_sockets_animation_notifies_and_attachment.md) |
| Source asset | Оригінальний файл поза UE або первинний graph/mesh. | PSD, SBS, BLEND або FBX, із якого імпортовано asset. | [01.03](01_UE_FOUNDATIONS/03_vfx_test_level_and_import_pipeline.md) |
| Dependency | Інший asset, без якого поточний asset не працює або виглядає інакше. | Niagara System залежить від Material, Texture і Mesh. | [01.02](01_UE_FOUNDATIONS/02_editor_navigation_and_asset_workflow.md) |
| Migrate | Інструмент перенесення selected assets разом із dependencies в інший UE project. | Перенести власну Material Library у копію UE 5.8 project. | [01.01](01_UE_FOUNDATIONS/01_course_setup_and_ue58_workflow.md) |
| Gameplay camera | Камера й FOV, із яких player реально бачить effect. | Оцінювати telegraph із third-person distance, а не в close-up. | [01.03](01_UE_FOUNDATIONS/03_vfx_test_level_and_import_pipeline.md) |
| Baseline | Зафіксований початковий результат або measurement для порівняння. | GPU/CPU capture до optimization. | [01.04](01_UE_FOUNDATIONS/04_debugging_iteration_and_performance_baseline.md) |
| Root cause | Найглибша перевірена причина symptom. | Не «sprite чорний», а «непризначений translucent Material». | [01.04](01_UE_FOUNDATIONS/04_debugging_iteration_and_performance_baseline.md) |

## Художня мова stylized VFX

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Reference | Візуальне або технічне джерело для аналізу, не asset для копіювання. | Gameplay capture із timestamp. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Layer breakdown | Поділ effect на шари за функцією, timing і renderer. | Core flash, arc, sparks, debris, smoke, residue. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Primary shape | Головна форма, що першою повідомляє action. | Великий crescent у sword slash. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Secondary shape | Форма, що підтримує primary, але не конкурує з ним. | Менші arcs після головного slash. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Accent | Короткий висококонтрастний елемент, що підсилює beat. | One-frame core flash. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Supporting particles | Дрібні частинки, які пояснюють енергію, material або direction. | Sparks, droplets, leaves. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Residue | Слабший слід після main action. | Smoke wisp або ground glow після impact. | [02.01](02_VFX_DESIGN/01_reference_analysis_and_layer_breakdown.md) |
| Silhouette | Зовнішній контур effect, який має читатися без внутрішніх деталей. | Lightning має broken angular contour. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Negative space | Навмисно порожня область, що відділяє форми й покращує читабельність. | Розриви між electric branches. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Value | Відносна світлість незалежно від hue. | Білий core, mid-value body, темний/прозорий edge. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Value hierarchy | Порядок візуальної важливості, створений співвідношенням світлого й темного. | Contact point найяскравіший, residue слабший. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Dominant color | Колір, що займає найбільшу смислову частину effect. | Cyan у water projectile. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Accent color | Менша контрастна color area для focal point. | Warm yellow core у cyan lightning. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Screen coverage | Частка кадру, яку займає effect із gameplay camera. | Boss ultimate має більшу coverage, ніж basic hit. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Gameplay readability | Здатність effect швидко й правильно повідомити action, danger, direction і ownership. | Telegraph точно показує небезпечну area. | [02.02](02_VFX_DESIGN/02_shape_value_color_and_readability.md) |
| Anticipation | Фаза підготовки, яка попереджає про main action. | Energy стискається перед burst. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Activation | Початок переходу зі спокою в активний effect. | Поява runes перед cast. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Main action | Основна дія з найбільшим змістом. | Sword arc проходить через target. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Contact | Момент фізичного або ігрового зіткнення. | Projectile торкається surface. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Impact | Візуальна реакція на contact і передачу енергії. | Flash, shockwave, sparks і debris. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Accent frame | Дуже короткий кадр/beat із перебільшеною формою або value. | Білий star flash на один frame. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Dissipation | Контрольоване згасання й розпад forms. | Smoke розширюється, слабшає й зникає. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Staggered timing | Запуск layers із невеликими offsets, а не одночасно. | Core у 0.00 s, sparks у 0.03 s, smoke у 0.08 s. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Delayed secondary motion | Secondary motion, що відстає від primary через інерцію або стилізацію. | Ribbon tip доганяє sword path. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Overshoot | Коротке перевищення target state перед поверненням. | Ring розширюється до 110%, потім сідає на 100%. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Smear shape | Витягнута форма, що підкреслює швидкий motion між positions. | Wide slash streak. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Stepped animation | Навмисне утримання shape кілька frames із дискретними змінами. | Anime spark змінює 4 намальовані silhouettes. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| 2D/3D hybrid | Effect, що поєднує camera-facing graphic shapes і world-space meshes/ribbons. | Sprite flash + mesh arc + ribbon trail. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Camera dependence | Залежність читабельності від view direction, FOV і distance. | Flat magic circle читається зверху, але зникає на grazing angle. | [02.03](02_VFX_DESIGN/03_timing_motion_and_animation_phases.md) |
| Shape language | Повторювані правила contour, proportion і rhythm, що передають theme. | Ice — sharp wedges і brittle gaps. | [02.04](02_VFX_DESIGN/04_elemental_style_language_workbook.md) |
| Motion language | Повторювані правила acceleration, path, oscillation і decay. | Water — connected arcs і flowing follow-through. | [02.04](02_VFX_DESIGN/04_elemental_style_language_workbook.md) |

## Material Editor і shader math

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Shader | Програма/набір calculations, що визначає, як geometry обробляється й виглядає під час rendering. | Material Graph компілюється у shader code. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Vertex calculation | Операція, виконана для vertices; може змінювати position або передавати data далі. | `World Position Offset` рухає vertices mesh. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Pixel calculation | Операція, виконана для covered pixels/fragments поверхні. | Texture mask визначає Emissive кожного pixel. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Scalar / float1 | Одне число. | `Dissolve = 0.4`. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Vector2 / float2 | Два числа, часто U і V. | UV coordinate `(0.25, 0.75)`. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Vector3 / float3 | Три числа, часто XYZ або RGB. | World direction `(1, 0, 0)` або cyan color. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Vector4 / float4 | Чотири числа, часто RGBA. | Color + alpha parameter. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Channel | Одна component vector/texture data. | R channel зберігає spark mask. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Component Mask | Node, що вибирає потрібні channels vector. | Взяти лише R і G як UV offset. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Mask | Значення, що керує змішуванням або видимістю; зазвичай 0–1. | 0 — outside ring, 1 — ring body. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Alpha | Четвертий channel або окреме значення opacity/coverage; значення залежить від workflow. | Texture alpha керує `Opacity`. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| 0–1 range | Нормалізований діапазон від 0 до 1. | `Lerp` із alpha 0.25 дає 25% B. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Linear color | Color values, пропорційні світловій енергії; потрібні для коректної математики. | Multiply двох linear colors. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| sRGB | Нелінійне color encoding для display-oriented color textures. | Color ramp зазвичай імпортується як color data. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| HDR | Значення color/intensity вище display 0–1, що можуть створювати сильний Emissive/bloom. | Emissive intensity 8.0. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Emissive Color | Material input, що задає self-lit output; для Unlit VFX це основний color output. | Gradient × intensity → `Emissive Color`. | [03.01](03_MATERIAL_FOUNDATIONS/01_shader_mental_model_and_value_types.md) |
| Add | Сума A + B. | Об’єднати дві non-overlapping masks. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Subtract | Різниця A − B. | Вирізати inner circle з outer circle. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Multiply | Добуток A × B; маскує або масштабує. | Color × opacity mask. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Divide | Частка A ÷ B. | Нормалізувати value до відомого range; denominator не має бути 0. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Linear Interpolate / Lerp | Змішує A і B за Alpha: `A × (1−α) + B × α`. | Gradient map між двома colors. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Clamp | Обмежує value між Min і Max. | Затиснути mask у 0–1. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Saturate | Спеціальне обмеження до 0–1. | Прибрати negative і >1 у opacity mask. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| OneMinus | Обчислює `1 − X`; інвертує 0–1 mask. | Зробити center white замість edge. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Power | Підносить Base до Exponent; змінює distribution/contrast. | Стиснути soft gradient до core. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Remap | Переводить value з одного range в інший. | `[20,80] → [0,1]`. | [03.02](03_MATERIAL_FOUNDATIONS/02_material_math_and_remapping.md) |
| Frac | Повертає дробову частину й створює repetition. | Repeating stripes із UV × 8. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Floor / Ceil | Округлення вниз / вгору до цілого. | Quantized cells або stepped values. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Step | Жорсткий threshold. | Перетворити gradient на binary mask. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| SmoothStep | Плавний threshold між двома edges. | Anti-aliased soft ring edge. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Distance | Відстань між двома points/vectors. | Радіальна distance від UV center. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Length | Довжина vector від origin. | Радіус centered UV vector. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Dot Product | Міра спрямованої подібності двох vectors. | Front-facing mask або directional gradient. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| Normalize | Зберігає direction vector, роблячи його length рівним 1. | Єдина direction без залежності від magnitude. | [03.03](03_MATERIAL_FOUNDATIONS/03_procedural_math_and_threshold_masks.md) |
| UV coordinates | 2D coordinates, що адресують texture/процедурний простір поверхні. | `(0,0)`–`(1,1)` на card. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Tiling | Частота повторення texture/pattern у UV. | UV × 4 повторює pattern чотири рази. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Offset | Зсув coordinates або values. | UV + `(0.1,0)` зміщує pattern по U. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Pivot | Точка, відносно якої відбувається rotation/scale. | Відняти 0.5, rotate, додати 0.5. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Panner | Material Expression, що рухає coordinates із часом. | Noise повзе вгору зі SpeedY 0.2. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Rotator | Material Expression, що обертає coordinates навколо center. | Magic circle повільно обертається. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Coordinate space | Система координат, у якій інтерпретуються position/direction. | Local, World, Object, Camera або Screen space. | [03.04](03_MATERIAL_FOUNDATIONS/04_uv_coordinates_and_coordinate_spaces.md) |
| Polar coordinates | Опис 2D point через radius і angle. | Arc або radial repeats. | [03.05](03_MATERIAL_FOUNDATIONS/05_procedural_shapes_polar_and_sdf_masks.md) |
| Signed Distance Field-like mask | Mask, побудована з distance до shape boundary; у курсі — прості SDF-подібні 2D functions. | Circle distance із контрольованим edge width. | [03.05](03_MATERIAL_FOUNDATIONS/05_procedural_shapes_polar_and_sdf_masks.md) |
| Texture Sample | Читання texture value за UV. | Взяти R channel distortion map. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Channel packing | Збереження різних grayscale masks у R/G/B/A одного texture. | R=spark, G=smoke, B=noise, A=distortion. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Compression | Кодування texture для зменшення memory/size з можливими artifacts. | Перевірити data mask після UE compression. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Mipmap | Послідовність менших versions texture для distance/minification. | 1024→512→256… | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Texture bleeding | Потрапляння colors/masks сусідньої atlas cell через filtering/mips. | Bright edge з іншого flipbook frame. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Flipbook | Texture atlas, де cells є послідовними animation frames. | 8×8 smoke simulation. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| SubUV | Workflow вибору/анімації cells texture atlas у particle renderer/material. | `SubUVAnimation` керує frame index. | [03.06](03_MATERIAL_FOUNDATIONS/06_texture_sampling_channels_and_flipbooks.md) |
| Material Domain | Визначає, де й для чого працює Material. | `Surface` або `Deferred Decal`. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Blend Mode | Формула змішування Material із background/framebuffer. | `Additive`, `Translucent`, `Masked`. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Shading Model | Модель взаємодії Material зі світлом. | `Unlit` для багатьох emissive VFX. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Unlit | Shading Model без стандартного lighting response. | Emissive sprite не залежить від scene lights. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Opacity | Безперервна прозорість у compatible Blend Mode. | Soft smoke alpha. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Opacity Mask | Binary/thresholded coverage у `Masked` material. | Hard graphic cutout. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Translucency | Rendering напівпрозорих surfaces із blending і sorting/overdraw costs. | Smoke або energy veil. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Overdraw | Повторне shading одного screen pixel кількома overlapping surfaces. | 100 великих smoke sprites один над одним. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Depth Fade | Fade translucent surface біля intersection з opaque geometry. | Прибрати hard seam smoke card із ground. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Scene Depth | Відстань до scene geometry, прочитана з depth buffer у supported context. | Порівняти particle surface з geometry позаду. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Pixel Depth | Depth поточного rendered pixel від camera. | Distance-based fade/logic. | [03.07](03_MATERIAL_FOUNDATIONS/07_material_domains_blending_depth_and_overdraw.md) |
| Material Instance | Asset, що успадковує parent Material і змінює exposed parameters без копії graph. | Fire і ice instances одного master. | [03.08](03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) |
| Material Function | Reusable Material Graph fragment із визначеними inputs/outputs. | `MF_Remap01`. | [03.08](03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) |
| Static Switch | Compile-time вибір branch; може створювати shader permutations. | Увімкнути/вимкнути distortion feature в instance. | [03.08](03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) |
| Shader permutation | Окрема compiled variant shader для комбінації static options/platform settings. | 4 switches потенційно створюють багато variants. | [03.08](03_MATERIAL_FOUNDATIONS/08_instances_functions_switches_and_debugging.md) |

## Stylized VFX materials і runtime data

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Dissolve | Поступова зміна visibility через порівняння mask і threshold. | Shape зникає від noise threshold. | [04.01](04_STYLIZED_VFX_MATERIALS/01_dissolve_erosion_and_edge_control.md) |
| Erosion | Звуження/роз’їдання visible mask. | Smoke shape розпадається по краях. | [04.01](04_STYLIZED_VFX_MATERIALS/01_dissolve_erosion_and_edge_control.md) |
| Edge mask | Вузька зона між двома thresholds. | Bright rim на dissolve frontier. | [04.01](04_STYLIZED_VFX_MATERIALS/01_dissolve_erosion_and_edge_control.md) |
| Distortion | Зміщення sample coordinates для візуального викривлення. | Heat haze offsets scene/texture lookup. | [04.02](04_STYLIZED_VFX_MATERIALS/02_distortion_flow_and_fake_refraction.md) |
| Flow map | Texture, channels якої кодують 2D direction/offset field. | Water streak рухається вздовж curved direction. | [04.02](04_STYLIZED_VFX_MATERIALS/02_distortion_flow_and_fake_refraction.md) |
| Fake refraction | Стилізоване screen/texture distortion без повної фізичної моделі. | Soft water lens. | [04.02](04_STYLIZED_VFX_MATERIALS/02_distortion_flow_and_fake_refraction.md) |
| Gradient ramp | 1D/2D texture або function, що перетворює grayscale value на color/value sequence. | 0–1 heat value → purple→orange→white. | [04.03](04_STYLIZED_VFX_MATERIALS/03_gradient_mapping_hdr_and_stylized_color.md) |
| Fresnel | View-dependent response, часто сильніший на grazing angles. | Rim glow на aura sphere. | [04.04](04_STYLIZED_VFX_MATERIALS/04_fresnel_wpo_and_vertex_animation.md) |
| World Position Offset / WPO | Material input, що зміщує mesh vertices у world space. | Пульсуючий ring mesh. | [04.04](04_STYLIZED_VFX_MATERIALS/04_fresnel_wpo_and_vertex_animation.md) |
| Vertex Color | RGBA data, збережені на mesh vertices або передані renderer-ом для material control. | R керує WPO, G — edge fade. | [04.04](04_STYLIZED_VFX_MATERIALS/04_fresnel_wpo_and_vertex_animation.md) |
| Decal Material | Material для projected effect на surface. | Ground crack або scorch mark. | [04.05](04_STYLIZED_VFX_MATERIALS/05_sprite_mesh_ribbon_and_decal_materials.md) |
| Particle Color | Material Expression/particle attribute path для color/alpha від Niagara renderer. | Niagara curve змінює Material color over life. | [04.06](04_STYLIZED_VFX_MATERIALS/06_niagara_material_data_and_runtime_parameters.md) |
| Dynamic Parameter | Канали data, які particle system передає в Material через відповідний binding/workflow. | Передати per-particle dissolve і edge width. | [04.06](04_STYLIZED_VFX_MATERIALS/06_niagara_material_data_and_runtime_parameters.md) |
| Dynamic Material Instance / DMI | Runtime instance, parameters якого Blueprint/code може змінювати під час гри. | Змінити charge amount на mesh material. | [04.06](04_STYLIZED_VFX_MATERIALS/06_niagara_material_data_and_runtime_parameters.md) |
| Material Parameter Collection / MPC | Global collection parameters, доступна багатьом Materials. | Глобальний world pulse; не per-particle data. | [04.06](04_STYLIZED_VFX_MATERIALS/06_niagara_material_data_and_runtime_parameters.md) |

## Texture authoring і mesh pipeline

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Grayscale | Зображення з одним value dimension від black до white. | Dissolve/noise mask. | [05.01](05_PHOTOSHOP_VFX_TEXTURES/01_photoshop_vfx_texture_workflow.md) |
| Alpha channel | Додатковий grayscale channel для selection/transparency/mask data. | Slash silhouette у PNG/TGA alpha. | [05.01](05_PHOTOSHOP_VFX_TEXTURES/01_photoshop_vfx_texture_workflow.md) |
| Layer mask | Неруйнівна mask видимості layer у Photoshop/Krita. | Приховати частину smoke без стирання pixels. | [05.01](05_PHOTOSHOP_VFX_TEXTURES/01_photoshop_vfx_texture_workflow.md) |
| Levels | Tonal remapping через black point, white point і midpoint. | Підсилити contrast noise mask. | [05.01](05_PHOTOSHOP_VFX_TEXTURES/01_photoshop_vfx_texture_workflow.md) |
| Curves | Точніше remapping input→output через curve. | Стиснути midtones, зберігши soft edge. | [05.01](05_PHOTOSHOP_VFX_TEXTURES/01_photoshop_vfx_texture_workflow.md) |
| Seamless texture | Texture, протилежні edges якої з’єднуються без шва при tiling. | Looping smoke noise. | [05.02](05_PHOTOSHOP_VFX_TEXTURES/02_seamless_noise_smoke_and_masks.md) |
| UV unwrap | Розгортання 3D mesh surface у 2D UV space. | Slash mesh уздовж U від 0 до 1. | [06.03](06_BLENDER_AND_SUBSTANCE/03_uv_normals_vertex_color_and_fbx_export.md) |
| Normal | Direction, перпендикулярний surface/vertex, що впливає на orientation і shading. | Mesh shards facing outward. | [06.03](06_BLENDER_AND_SUBSTANCE/03_uv_normals_vertex_color_and_fbx_export.md) |
| Object Transform | Location, Rotation і Scale object. | Apply Scale перед FBX export. | [06.03](06_BLENDER_AND_SUBSTANCE/03_uv_normals_vertex_color_and_fbx_export.md) |
| Triangulation | Перетворення polygon faces у triangles. | Зафіксувати topology slash mesh перед import. | [06.03](06_BLENDER_AND_SUBSTANCE/03_uv_normals_vertex_color_and_fbx_export.md) |
| FBX | Обмінний формат для meshes та інших 3D data. | Експортувати `SM_VFX_Ring_A.fbx`. | [06.03](06_BLENDER_AND_SUBSTANCE/03_uv_normals_vertex_color_and_fbx_export.md) |
| Procedural graph | Node network, що генерує output із operations/parameters, а не ручного painting. | Substance noise → warp → levels → packed output. | [06.04](06_BLENDER_AND_SUBSTANCE/04_substance_graphs_noise_gradients_and_masks.md) |

## Niagara

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Niagara System | Контейнер повного effect, що поєднує Emitters і system-level settings. | `NS_Impact_Fire_A`. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Emitter | Частина System, що створює й оновлює particles для однієї responsibility. | Emitter sparks або core flash. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Module | Програмований block behavior у конкретній stack group. | `Initialize Particle`, `Gravity Force`. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Parameter | Іменовані data певного type. | `Particles.Lifetime` або `User.ImpactColor`. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Execution stack | Послідовність groups/modules, що виконується top-to-bottom. | Location до velocity; forces до solver. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Spawn stage | Logic, що виконується при створенні System/Emitter/Particle. | Initialize size один раз при particle spawn. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Update stage | Logic, що виконується кожен active frame/tick. | Scale size over age. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Namespace | Prefix, що визначає scope data. | `User.`, `System.`, `Emitter.`, `Particles.`, `Module.` | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Parameter Map | Data flow, через який Niagara modules читають і записують parameters/attributes. | Module читає `Particles.Position` і записує velocity. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Attribute | Data, що належать particle/system/emitter instance і змінюються під час simulation. | `Particles.Color`, `Particles.SpriteSize`. | [07.01](07_NIAGARA_FOUNDATIONS/01_niagara_system_emitter_module_and_stack.md) |
| Lifetime | Тривалість життя particle в секундах. | Spark живе 0.25 s. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Normalized Age | `Age / Lifetime`, зазвичай 0 на spawn і 1 перед death. | Curve size over 0–1 незалежно від lifetime. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Burst | Разовий spawn певної кількості particles. | `Spawn Burst Instantaneous` на impact. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Rate | Безперервний spawn particles за час. | `Spawn Rate = 30 particles/s`. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Curve | Mapping input, часто time/age, у output value. | Size 0→1.2→0 за Normalized Age. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Determinism | Повторюваний random result за однакових умов і seed. | Однаковий burst для A/B profiling. | [07.02](07_NIAGARA_FOUNDATIONS/02_spawn_lifetime_normalized_age_and_curves.md) |
| Local Space | Positions/directions відносно owning emitter/component transform. | Aura рухається разом із character. | [07.03](07_NIAGARA_FOUNDATIONS/03_shape_location_velocity_and_forces.md) |
| World Space | Positions/directions у координатах world. | Ground residue лишається на місці. | [07.03](07_NIAGARA_FOUNDATIONS/03_shape_location_velocity_and_forces.md) |
| Sprite Renderer | Renderer camera-facing quads/particles. | Smoke, sparks, flashes. | [07.05](07_NIAGARA_FOUNDATIONS/05_sprite_renderer_and_material_bindings.md) |
| Mesh Renderer | Renderer Static Mesh per particle. | Debris shards або ring meshes. | [07.06](07_NIAGARA_FOUNDATIONS/06_mesh_renderer_and_space_control.md) |
| Ribbon Renderer | Renderer, що з’єднує ordered particles у continuous strip. | Sword/projectile trail. | [07.07](07_NIAGARA_FOUNDATIONS/07_ribbon_renderer_and_trail_construction.md) |
| Renderer binding | Відповідність Renderer property конкретному Niagara attribute. | Color Binding → `Particles.Color`. | [07.05](07_NIAGARA_FOUNDATIONS/05_sprite_renderer_and_material_bindings.md) |
| CPU simulation | Particle scripts виконуються на CPU; потрібна для деяких gameplay/event workflows. | Event-driven small impact emitter. | [08.01](08_NIAGARA_ADVANCED/01_cpu_gpu_simulation_and_collision_choices.md) |
| GPU simulation | Particle Spawn/Update/Simulation Stages виконуються на GPU; корисна для багатьох particles, але має limitations. | Dense ambient sparks. | [08.01](08_NIAGARA_ADVANCED/01_cpu_gpu_simulation_and_collision_choices.md) |
| Collision | Виявлення/реакція на перетин particle із scene representation. | Spark bounce від ground. | [08.01](08_NIAGARA_ADVANCED/01_cpu_gpu_simulation_and_collision_choices.md) |
| Distance Field | Просторові data про відстань до geometry; можуть використовуватися supported Niagara workflows. | GPU particles уникають surfaces. | [08.01](08_NIAGARA_ADVANCED/01_cpu_gpu_simulation_and_collision_choices.md) |
| Event | Data, згенеровані emitter-ом і оброблені Event Handler; у Niagara Events є CPU limitations. | Death Event spawn-ить secondary particles. | [08.02](08_NIAGARA_ADVANCED/02_events_data_interfaces_and_skeletal_sampling.md) |
| Persistent ID | Стабільний ідентифікатор particle протягом його життя, потрібний для певних event workflows. | Event source tracking. | [08.02](08_NIAGARA_ADVANCED/02_events_data_interfaces_and_skeletal_sampling.md) |
| Data Interface | Об’єкт/інтерфейс, що надає Niagara functions і data із зовнішнього source. | Skeletal Mesh sampling. | [08.02](08_NIAGARA_ADVANCED/02_events_data_interfaces_and_skeletal_sampling.md) |
| User Parameter | Parameter namespace для data, які задаються ззовні Niagara simulation. | `User.TargetPosition`. | [08.03](08_NIAGARA_ADVANCED/03_user_parameters_renderer_bindings_and_blueprint_data.md) |
| Scratch Pad Module | Local visual-scripted Niagara module у scope System/Emitter; може бути експортований у reusable Module Script. | Власний axis offset module. | [08.04](08_NIAGARA_ADVANCED/04_scratch_pad_reusable_modules_and_simulation_stages.md) |
| Simulation Stage | Advanced GPU stage для додаткових iterative operations над simulation data. | Grid-based iteration. | [08.04](08_NIAGARA_ADVANCED/04_scratch_pad_reusable_modules_and_simulation_stages.md) |
| Fixed Bounds | Явно заданий 3D box, у межах якого renderer очікує effect для visibility/culling. | Aura bounds навколо character. | [08.05](08_NIAGARA_ADVANCED/05_bounds_culling_scalability_and_optional_fluids.md) |
| Culling | Пропуск simulation/rendering за visibility, distance, significance або budget rules. | Не відтворювати distant minor impacts. | [08.05](08_NIAGARA_ADVANCED/05_bounds_culling_scalability_and_optional_fluids.md) |
| Effect Type | Asset зі спільними Niagara scalability/budget settings для групи Systems. | `NET_WeaponImpacts`. | [08.05](08_NIAGARA_ADVANCED/05_bounds_culling_scalability_and_optional_fluids.md) |
| Scalability | Система зміни quality/cost за platform, quality level, distance, count або budget. | High/Medium/Low particle counts. | [08.05](08_NIAGARA_ADVANCED/05_bounds_culling_scalability_and_optional_fluids.md) |

## Gameplay integration і performance

| English term | Українське пояснення | Практичний приклад | Перше використання |
|---|---|---|---|
| Niagara Component | Scene Component, що інстанціює й контролює Niagara System. | Component на character Blueprint. | [10.01](10_GAMEPLAY_AND_OPTIMIZATION/01_niagara_components_spawning_and_lifecycle.md) |
| Spawn System at Location | Blueprint function для one-shot System у world transform. | Impact у hit location. | [10.01](10_GAMEPLAY_AND_OPTIMIZATION/01_niagara_components_spawning_and_lifecycle.md) |
| Spawn System Attached | Blueprint function для System, прикріпленого до Scene Component/socket. | Aura на character pelvis. | [10.01](10_GAMEPLAY_AND_OPTIMIZATION/01_niagara_components_spawning_and_lifecycle.md) |
| Activation / Deactivation | Запуск / припинення active Niagara Component lifecycle. | Start/stop looping charge effect. | [10.01](10_GAMEPLAY_AND_OPTIMIZATION/01_niagara_components_spawning_and_lifecycle.md) |
| Pooling | Повторне використання Niagara Components замість постійних allocations/GC. | Часті weapon impacts. | [10.03](10_GAMEPLAY_AND_OPTIMIZATION/03_blueprint_parameters_targets_and_reuse.md) |
| Particle count | Кількість живих particles; лише один із cost drivers. | Max 120 sparks у stress test. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Active System count | Кількість одночасно active System instances. | 30 impacts у combat arena. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Shader Complexity | UE view mode, що допомагає оцінювати pixel shader instruction pressure; не повна GPU cost model. | Знайти дорогий translucent overlap. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Niagara Debugger | Інструмент перегляду Niagara simulations, attributes і performance data. | FX Outliner і Performance tab. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Unreal Insights | Suite для capture/аналізу timing та інших telemetry tracks. | Порівняти CPU spike під час burst spawn. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Profiling | Вимірювання resource cost у визначених test conditions. | Before/after capture на target-like scene. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| Performance budget | Локальний допустимий cost для feature/scene/platform, підтверджений measurement. | Weapon FX budget у конкретній combat scene. | [10.04](10_GAMEPLAY_AND_OPTIMIZATION/04_cpu_gpu_profiling_and_cost_budgets.md) |
| High/Medium/Low profiles | Варіанти quality/cost, що зберігають gameplay meaning із різною деталізацією. | Low видаляє accents, але лишає telegraph boundary. | [10.05](10_GAMEPLAY_AND_OPTIMIZATION/05_scalability_platform_profiles_and_presentation.md) |
| Definition of Done | Спостережувані умови, після яких asset/project справді завершено. | 80/100, no critical fail, H/M/L і breakdown готові. | [11.01](11_PORTFOLIO_PROJECTS/01_stylized_melee_combo_portfolio_piece.md) |

## Маркер непідтвердженого факту

Якщо exact UI label, pin, module input, plugin status або platform behavior не підтверджено в установленому UE 5.8.x, використовується точна фраза:

`Потребує ручної перевірки в Unreal Engine 5.8.`

## Джерела

- [Unreal Engine 5.8 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine)
- [Unreal Engine Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials)
- [Material Data Types](https://dev.epicgames.com/documentation/unreal-engine/material-data-types-in-unreal-engine)
- [Niagara Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine)
- [Niagara System and Emitter Module Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-and-emitter-module-reference-for-niagara-effects-in-unreal-engine)
- [Niagara Renderers](https://dev.epicgames.com/documentation/unreal-engine/render-module-reference-for-niagara-effects-in-unreal-engine)
- [Introduction to Performance Profiling](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine)

