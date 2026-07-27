# Рішення до уроку 10.04

## EX-L10-04-A

### 1. Performance question

```text
Який renderer/layer створює найбільший GPU/overdraw contribution,
коли чотири instances NS_VoidUltimate перекриваються у gameplay camera?
```

Це не питання «чи effect оптимізований», а одна перевірювана hypothesis.

### 2. Protocol

Записано:

```text
hardware/platform
build/configuration
resolution/screen percentage
scalability profile
map і camera path
4 synchronized instances
warm-up/capture window
content revision
diagnostic tools and overhead
```

Числові значення в model submission беруться з фактичного capture; key не підставляє вигадані budgets.

### 3. Baseline Niagara evidence

Niagara Debugger filter показує:

- очікувані active systems;
- active emitters;
- particles per emitter/system;
- bounds;
- culled/active state;
- memory overview;
- повернення counts після cooldown.

Verbose particle display і GPU readback вимкнено перед clean timing.

### 4. CPU evidence

Unreal Insights capture перевіряє:

- `Niagara Manager Tick [GT]`;
- `System Simulation Tick [GT]`;
- `System Simulation Tick [CNC]`;
- `Emitter Spawn/Simulate [CNC]`;
- activation window;
- RT preparation events.

Inclusive parent/child times не сумуються. Named-event discovery capture відділено від clean capture, бо `-StatNamedEvents` має overhead.

### 5. GPU/material evidence

Контрольована camera показує:

- GPU contribution з effect on/off;
- `Shader Complexity`;
- `Quad Overdraw`;
- ізоляцію кожного renderer;
- dominant overlapping core sprite layer.

Exact GPU/UI labels: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 6. Hypothesis і одна зміна

Hypothesis: secondary full-screen core дублює opacity/brightness, які вже забезпечує primary core.

Одна зміна:

```text
Disable only SecondaryCore renderer in Medium candidate.
Keep simulation, camera, instance count, resolution and all other layers unchanged.
```

### 7. Результат і quality

Repeated GPU/view-mode captures змінюються у predicted render/overdraw domain; GT/CNC лишаються в межах run variance. Gameplay telegraph, contact timing і silhouette залишаються readable. Brightness відновлено через cheaper existing layer, а не поверненням redundant quad.

Рішення: прийняти для measured Medium profile; High лишається conditional до власного target capture.

### 8. Texture/feature ledger

Textures перевірено за dimensions, compression/mips, resource evidence та channel use. Mesh/ribbon/collision/light/sorting/bounds rows заповнено, навіть коли вони не є dominant contributor.

### 9. Чому рішення працює

Scenario зафіксований, змінюється лише один renderer, а observed profiler domain відповідає hypothesis. Visual quality оцінюється з ігрової камери, а не за isolated complexity color.

### 10. Допустимі альтернативи

- Tighten sprite/mesh silhouette замість disable layer.
- Reduce overlap/count, якщо layer семантично потрібний.
- Simplify material branch або вибірка текстури, якщо GPU evidence вказує на shader work.
- Відхилити change, якщо читабельність під час гри fails.

### 11. Поширені неправильні рішення

- Порівнювати різні camera distances.
- Використовувати лише FPS.
- Цитувати один frame.
- Читати Shader Complexity як direct milliseconds.
- Прибирати particles, коли contributor — full-screen material.
- Вмикати різний debug overhead між A/B.

### 12. Висновок щодо продуктивності

Conclusion чинний лише для recorded hardware/build/scenario/profile. Він не перетворюється на universal GPU budget.

---

## EX-L10-04-B

### 1. Controlled variants

```text
Variant CPU:
  more concurrent system instances and justified CPU update/collision work
  renderer/material/coverage held as close as possible

Variant GPU:
  same system/instance logic
  increased overlapping translucent coverage/material layer
```

### 2. CPU-variant evidence

Необхідні докази:

- Niagara Debugger підтверджує higher active systems/emitters;
- Insights показує increase у GT та/або CNC Niagara timers;
- GPU/render evidence не показує proportionate dominant increase;
- activation/re-entry spike видно, якщо це причина.

### 3. CPU correction

Model correction змінює root axis:

- зменшити unnecessary instances;
- reuse one service/persistent system, де semantics дозволяє;
- consolidate identical emitter behavior;
- прибрати unneeded collision/update work;
- покращити lifecycle/culling.

У кожному capture тестується лише одна correction.

### 4. GPU-variant evidence

Необхідні докази:

- та сама active system logic;
- GPU capture збільшується у relevant translucent/render pass;
- Shader Complexity/Quad Overdraw погіршуються при тій самій camera;
- screen coverage/overlap відповідає visible hotspot.

### 5. GPU correction

Model correction:

- remove redundant translucent layer або tighten coverage;
- зменшити overlapping quads;
- simplify material/texture branch;
- зберегти telegraph/core timing;
- rerun GPU і gameplay-camera evidence.

### 6. Чому протилежні fixes слабкі

Reducing shader work не виправляє system-instance/GT activation root cause. Перенесення CPU simulation на GPU не виправляє expensive translucent pixel work і може погіршити GPU-bound profile.

### 7. Узгодження diagnostics

Якщо tools не узгоджуються:

- підтвердити, що вони вимірюють різні domains;
- перевірити metadata;
- повторити multiple samples;
- disable GPU readback, verbose HUD і named events для clean capture;
- перевірити background scene load.

### 8. Feature matrix

| Feature | CPU candidate | GPU/render candidate | Evidence |
|---|---|---|---|
| system instances | high relevance | controlled | Debugger/Insights |
| collision/update | possible CNC | indirect | Insights |
| translucent coverage | controlled | dominant | GPU/view modes |
| mesh/ribbon/light | isolated | isolated | GPU/RT toggles |
| sorting | tested if used | tested if used | RT/GPU |
| bounds/culling | relevance check | visibility check | Debugger |

### 9. Чому рішення працює

Два variants ізолюють різні cost axes і вимагають tool agreement у відповідному domain, не дозволяючи particle-count folklore замінити measurement.

### 10. Допустимі альтернативи

- Ribbon-heavy GPU/RT variant може замінити sprite overdraw.
- Light/shadow overlap може бути render-heavy axis.
- Data-interface/event workload може бути CPU/CNC axis, якщо його виміряно.

### 11. Перевірка

Обидва corrected variants повторно запускаються через identical protocol і clean capture. Predicted domain покращується, а читабельність під час гри constraints зберігаються.

### 12. Висновок щодо продуктивності

Universal thresholds не заявляються. Результат — diagnostic method і scoped evidence для recorded target.
