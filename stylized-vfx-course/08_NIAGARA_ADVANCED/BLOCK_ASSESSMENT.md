# Assessment блока 08 — Niagara Advanced

## Правила

- Час: 2 години в межах L08-05.
- Час assessment уже входить у практичний бюджет фінального уроку L08-05 і не додається вдруге до 28 годин блока.
- Максимум: 100.
- Поріг опанування: ≥80 і відсутність critical fail.
- Дозволено офіційну документацію UE 5.8 та власні нотатки.
- Не відкривайте [ключ](../EXERCISE_ANSWERS/B08_BLOCK_ASSESSMENT_KEY.md) до завершення.
- Під час практичної контрольної заборонено користуватися покроковим текстовим або відеоуроком чи готовим розв’язком уроку.
- Niagara Fluids не входить до оцінки або gate.

Критичні помилки:

- Events побудовані на GPU emitter або без Persistent IDs;
- косметичний particle collision оголошено авторитетним для gameplay;
- невалідний вектор створює NaN або undefined state;
- швидке виправлення bounds робить їх безмежно або необґрунтовано великими;
- tier Low прибирає основний gameplay cue;
- Beta Fluids оголошено обов’язковим production-ready рішенням.

## Частина A — Тест, 20 балів

По 1 балу.

1. Що визначає Sim Target?
2. Назвіть Niagara workflow цього блока, доступний лише на CPU.
3. Яке обмеження камери має SceneDepth collision?
4. Чому distance field не має точності рівня triangles?
5. Що таке Persistent ID?
6. Як обмежити обсяг Location Event?
7. Коли timed burst кращий за Event?
8. Що має містити DI contract?
9. Чому vertex skeletal sampling може давати зміщену вибірку?
10. Що таке snapshot input?
11. Що таке live input?
12. Як обробити нульовий direction?
13. Який повний шлях даних для Material Charge?
14. Чим Scratch Pad відрізняється від Module Script asset?
15. Навіщо DeltaTime в acceleration?
16. Що робить Simulation Stage?
17. Як вартість масштабується з кількістю iterations?
18. Що входить у bounds envelope?
19. Що означає cue parity?
20. Який статус Niagara Fluids у UE 5.8?

## Частина B — Практична робота, 60 балів

Створіть System, керований даними:

1. Обґрунтований CPU/GPU Sim Target і вибір collision/no-collision — 8.
2. Один Data Interface: skeletal/mesh/attribute reader або інше підтримуване джерело з validity/fallback — 10.
3. Runtime API: direction, target, tint, scale, charge — 10.
4. Renderer material binding `Particles.Charge01 → M_Charge01` — 6.
5. Повторно використовуваний custom module із безпечним вектором, units, DeltaTime і debug — 10.
6. Коректні bounds і тести camera/re-entry — 8.
7. High/Medium/Low cue parity — 8.

Надайте:

- точний stack;
- таблиці контрактів API/DI/module;
- setup Blueprint/instance;
- debug captures;
- список обмежень target/platform;
- performance-докази.

## Частина C — Troubleshooting і performance, 10 балів

Внесіть одну несправність:

- GPU collision пропускає зіткнення поза екраном;
- Event receiver не реагує;
- skeletal source опиняється в origin;
- параметр Blueprint ігнорується;
- custom module створює NaN;
- Simulation Stage має надмірну кількість iterations;
- bounds спричиняють pop або повторне відтворення під час re-entry.

Надайте ланцюжок: симптом → ізольована ланка → першопричина → виправлення → regression-перевірка → profile.

## Частина D — Самоперевірка, 10 балів

- запис вимог і вибору — 2;
- ownership/scope/type/space/fallback даних — 2;
- точна карта залежностей stack/module — 2;
- політика bounds/scalability — 2;
- відомі обмеження та ручні перевірки — 2.

## Завершення

```text
80–100 + немає critical fail = G08 складено
70–79 = цільове доопрацювання / повторний assessment
<70 = повторити слабкі уроки
Critical fail = виправити й повторно протестувати незалежно від бала
```
