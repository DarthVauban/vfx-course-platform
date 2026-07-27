# Ключ — Assessment блока 08

## Частина A

1. CPU або GPU як execution target для simulation emitter.
2. Niagara Events/Event Handlers.
3. Collision залежить від depth, представленої поточним view; поверхні поза екраном або не представлені у view не спрацьовують.
4. Distance field — це об’ємне наближення зі скінченною роздільністю.
5. Стабільний ідентифікатор частинки між кадрами, потрібний для Event workflow.
6. Вікно age, frequency, probability, count і обмежені source/receiver.
7. Коли transform/time для impact/death уже відомі або детерміновані.
8. Type, owner джерела, підтримка target, read/write, update, вартість, validity і fallback.
9. Області щільної топології містять більше vertices незалежно від площі.
10. Значення фіксується або копіюється один раз під час spawn/activation.
11. Значення повторно читається під час Update, щоб живі частинки реагували.
12. Length > epsilon; інакше замість normalize застосовується визначений fallback.
13. BP → User → System/Particle Charge → renderer material binding → `M_Charge01` → material output.
14. Scratch Pad — локальний prototype; Module Script — повторно використовуваний content asset.
15. Перетворює acceleration за секунду на зміну velocity за кадр.
16. Додає впорядкований або iterative pass над particles/DI elements.
17. Приблизно: elements × iterations × обсяг роботи module.
18. Початковий extent, motion/forces/lifetime, extent renderer, WPO, transform/motion component.
19. Нижчий tier зберігає timing, gameplay area, основний silhouette/direction і читабельність team/element.
20. Beta.

## Частина B — Еталонні вимоги

### Sim Target

Повний бал передбачає вимоги й відхилену альтернативу. Якщо використовуються Events, потрібен CPU. GPU дозволено лише тоді, коли DI/module/collision підтримує його в цільовому build 5.8.

### DI

Потрібно показати:

```text
Valid source assignment
Correct space
One isolated debug output
Invalid/destroyed fallback
Update-rate decision
Target support note
```

### API

```text
DirectionWS: safe normalize/fallback
TargetPositionWS: Position/world contract
Tint: Linear Color/white
Scale: positive clamp/default 1
Charge01: saturate/default 0
```

### Binding

```text
User.Charge01
→ System/Particles.Charge01
→ Renderer Material Parameter Binding
→ Material Scalar "M_Charge01"
```

### Повторно використовуваний module

Щонайменше:

- Parameter Map Get/Set;
- типізовані inputs/units/space/default;
- захист через epsilon;
- DeltaTime для rate;
- явний запис;
- матрицю debug/test;
- повторне використання у двох Systems або доказ залежностей.

### Bounds/tiers

Bounds охоплюють максимальний варіант High і WPO. Перевір край кадру, рух component і re-entry. Tier Low зберігає основний cue.

## Частина C

| Несправність | Перші перевірки |
|---|---|
| GPU collision пропускає зіткнення | Представлення Collision source/view/DF, а не restitution |
| Event не реагує | CPU → Persistent IDs → name/type generator → source/handler receiver |
| Skeletal origin | User source/type → sampling binding → validity/region → space |
| BP ігнорується | material/binding → particle/system → User override → target/name/type |
| Module створює NaN | normalize/division для нуля → epsilon/fallback → DeltaTime |
| Stage надто дорогий | particles × iterations × work; порівняти з аналітичним one-pass |
| Bounds/re-entry | envelope → mode/value → cull reaction/lifecycle |

Повний бал потребує контрольованої regression-перевірки та фактичних performance-доказів або явного зазначення межі ручної перевірки на цільовій платформі.

## Частина D

Кожен artifact має відповідати фактичному implementation. Загальне твердження «все оптимізовано» = 0. Відомі обмеження мають містити доречні перевірки UE 5.8 UI/target/manual і не можуть бути порожніми.

## Критичні рішення

- GPU Events: critical fail, доки не використано CPU або альтернативу.
- Gameplay authority для VFX: critical fail, доки відповідальність не відокремлено.
- NaN: critical fail, доки поведінка не стане безпечною.
- Надмірні bounds: critical fail, доки bounds не перевірено.
- Втрата cue: critical fail, доки tier не виправлено.
- Обов’язкові Fluids або гарантія production-ready: critical fail, доки їх не позначено як опційну Beta з fallback.
