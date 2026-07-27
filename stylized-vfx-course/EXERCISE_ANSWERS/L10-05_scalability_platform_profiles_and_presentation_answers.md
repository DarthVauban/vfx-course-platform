# Рішення до уроку 10.05

## EX-L10-05-A

### 1. Обраний effect та evidence

Обрано `NS_VoidUltimate`, уже інтегрований через gameplay Blueprint і профільований у 10.04. Ledger визначає:

- essential telegraph/core/contact;
- signature void ring;
- secondary sparks/smoke;
- optional light і expensive distortion layer;
- measured GPU/overdraw contributor;
- bounds/culling observations.

### 2. Effect Type

Створено `NET_HeroAbility` і призначено в Niagara System settings. Він не стає global default для unrelated impacts/ambient loops.

Configured categories включають significance, update frequency, cull reaction та evidence-derived distance/instance/budget candidates.

Exact labels/options: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 3. Semantic profile matrix

| Layer | High | Medium | Low |
|---|---|---|---|
| Telegraph | full | preserve | preserve |
| Core silhouette/contact | full | preserve | simplified readable |
| Signature ring | full | cheaper/reduced overlap | cheapest recognizable form |
| Secondary sparks | full | reduced by measured rule | minimal/off |
| Smoke/residue | full | shorter/reduced | off, якщо readability passes |
| Distortion | approved full | cheaper branch | off |
| Light | measured | reduced/off | off |
| Collision/sorting | лише де required | reduced | disabled, якщо semantics safe |

Final counts/thresholds переносяться з actual target captures, а не з answer key.

### 4. Significance і culling

Policy зберігає:

1. local player essential telegraph;
2. найближчу active enemy ability;
3. інші active gameplay effects;
4. decorative residue в останню чергу.

Distance та instance candidates перевірено sweep-test. Debugger captures cull reason та retained instance.

### 5. Bounds/re-entry

Bounds охоплюють full measured motion без великої empty region. Burst і loop переміщуються beyond/inside relevance:

- visual clipping відсутній;
- cull reaction predictable;
- return не дублює burst;
- parameters/ActionID залишаються current;
- після cooldown counts повертаються.

### 6. Platform profiles

Два rows називають actual hardware/platform, build, resolution, concurrency та H/M/L mapping. Кожний містить Debugger, CPU, GPU і memory evidence. Жодної «PC» або «console» claim без named metadata немає.

### 7. Gameplay validation

Для H/M/L:

- character action і notify timing не змінені;
- target/direction/color/scale correct;
- single/representative/stress concurrency captured;
- telegraph/direction/contact розпізнано у самостійній blind review після паузи та deterministic shuffle;
- local/remote culling behavior перевірено.

### 8. Presentation

`LS_L10_HeroPresentation` містить лише camera/shot/comparison presentation. Effect і далі запускається approved gameplay action. Жодний Sequencer Event Track не замінює spawn/target logic.

### 9. Чому рішення працює

Profile changes наслідують measured contributors, захищаючи gameplay layers. Effect Type централізує aggregate decisions, а platform evidence не дозволяє одному hardware assumption стати false budget.

### 10. Допустимі альтернативи

- Окремі Effect Types для local hero і remote abilities, якщо policies справді різні.
- Інший System asset для Low, коли overrides не можуть прибрати structural cost.
- Dynamic bounds для long-travel effect, коли fixed bounds надто broad.
- Proxy/replacement path, де його підтримано й validated.

### 11. Поширені неправильні рішення

- Копіювати arbitrary distances/counts з іншого project.
- Прибрати telegraph у Low, але лишити smoke.
- Назвати Editor Epic profile доказом High.
- Зробити Sequencer єдиним trigger.
- Задати надмірно великі фіксовані межі, щоб припинити popping.
- Ігнорувати cull re-entry.

### 12. Висновок щодо продуктивності

H/M/L decisions чинні для named profiles і scenarios. Additional platforms/build modes потребують власного capture.

---

## EX-L10-05-B

### 1. Інжектовані failures

1. Fixed bounds розширено далеко за visual motion.
2. Low вимикає telegraph і зберігає decorative residue.
3. Significance віддає перевагу distant residue над nearby active attack.
4. Cull return resets age і несподівано refires burst.

### 2. Oversized bounds

**Симптом:** off-screen/far system лишається relevant.

**Test:** debugger bounds overlay та active/cull state уздовж camera path.

**Fix:** derive tight full-motion bounds або обрати dynamic strategy після measurement. Повторно перевірити WPO/fast motion і всі camera angles.

### 3. Unsafe Low

**Симптом:** player не може визначити area/direction/contact.

**Fix:** restore telegraph/core/contact, спершу remove optional smoke/light/distortion, потім simplify signature implementation. Blind gameplay review має pass.

### 4. Wrong significance

**Симптом:** decorative distant instance лишається, а nearby active ability culls.

**Test:** known ordered instances з IDs, roles і distances.

**Fix:** choose/configure the significance policy that matches gameplay priority and local-player rule. Exact handler options: **Потребує ручної перевірки в Unreal Engine 5.8.**

### 5. Burst refire

**Симптом:** return to relevance створює другий contact burst.

**Test:** log system age, ActionID, cull reason/reaction і spawn count до й після.

**Fix:** select tested cull reaction/re-entry behavior або залишити critical finite burst gameplay-owned замість sleep/reset.

### 6. Повтор на двох profiles

Кожна correction повторюється на обох named profiles з identical scene/camera/concurrency. Thresholds можуть різнитися лише за profile evidence.

### 7. Результат

- bounds охоплюють visuals і дозволяють relevance change;
- Low gameplay message проходить перевірку;
- правильний active instance survives;
- unintended refire/stale state відсутні;
- clean CPU/GPU/memory captures записано.

### 8. Чому рішення працює

Кожна remediation спрямована на policy root: spatial relevance, layer priority, relative significance або lifecycle reaction. Generic count reduction не виправив би ці failures.

### 9. Допустимі альтернативи

- Keep critical effect uncullable на short gameplay window за наявності aggregate evidence.
- Використати cheaper proxy для distant signature.
- Розділити finite contact burst і long residue, щоб кожний мав proper culling.

### 10. Поширені неправильні рішення

- Lower усі particle counts.
- Збільшувати bounds indefinitely.
- Restart усі systems на relevance return.
- Judge Low лише в isolated close-up.
- Тестувати одну unnamed platform.

### 11. Перевірка

Evidence містить чотири failure captures, cull logs, самостійну blind review після паузи й deterministic shuffle, дані про продуктивність до й після, clean gameplay camera і post-cooldown active count.

### 12. Висновок щодо продуктивності

Remediation приймається лише там, де measured aggregate work покращується або correctness відновлено без перенесення cost в інший unmeasured domain.
