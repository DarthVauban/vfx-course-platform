# Рішення вправ L09-07

Тривалі ефекти потребують явного життєвого циклу, правдивих radius/state і доказів concurrency.

## EX-L09-07-A — Aura з читабельним станом

### Повна побудова

1. Контракт User: `OwnerRadius=70`, `StateSign=+1/−1`, `Intensity`, `IsActive`, colors.
2. `NE_EnterPulse`: Burst1, lifetime `.25`, scale petal/ring `.3→1.05→1`.
3. `NE_OrbitLeaves`: 12/s, life `1.4–1.8`, torus radius 70–95, tangent 90, Z 20.
4. `NE_StateMotes`: 10/s, life `1–1.4`.
5. Buff `StateSign=+1`: radial +40, Z +80, outward/open petal mask.
6. Debuff `−1`: radial −40, Z −65, inward thorn mask, коротший різкий enter.
7. Під час exit зупиніть безперервні spawns і відтворіть специфічний для стану exit тривалістю `.4 s`.
8. Обмежте максимальні height/opacity aura, щоб не втратити читабельність face/weapon.
9. Перевірте ефект у відтінках сірого за п’ятьма підписаними й перемішаними захопленнями.
10. H/M/L: leaves 12/6/0, motes 10/5/4; enter/state/exit лишаються завжди.

### Чому це працює

Форма й velocity передають позитивний/негативний стан ще до кольору. Явний життєвий цикл запобігає різкому обрізанню або нескінченному loop, а зменшені height/opacity захищають анімацію персонажа.

### Допустимі альтернативи

- Mesh petals замість sprites.
- Buff за годинниковою стрілкою, debuff проти неї, плюс різний знак вертикального руху.
- Явний enum/int, відображений у state, замість знака float.

### Типові неправильні рішення

- Лише green проти red.
- Той самий motion з інвертованим color.
- Миттєве знищення component наприкінці state.
- Aura перекриває torso/face.
- Persistent particles переживають повторне використання pool.

### Перевірка

Подайте класифікацію у відтінках сірого, захоплення enter/loop/exit, перевірки руху owner/teleport/deactivate, runtime update стану, H/M/L, bounds і 8 одночасних auras. Додайте provenance для leaf/thorn assets.

### Performance

Low зберігає один state pulse і 4 motes/s. Leaves декоративні й є першим кандидатом на вилучення. Attached bounds мають враховувати рух/animation owner, не стаючи розміром із весь світ.

## EX-L09-07-B — Оригінальна міцеліальна lingering area

### Повна побудова

#### Етап 1

Побудуйте точну круглу boundary, 20 spores/s і 8 sprouts кожні 1.8 s.

#### Етап 2

Запишіть із референсу співвідношення enter:loop:exit, контраст boundary, щільність і масштаб owner/area. Використайте власні assets і перелічіть відхилення.

#### Етап 3

1. Власна п’ятилопатева mycelial/petal boundary; зовнішній радіус і далі відображається на User.AreaRadius.
2. Germination `.25`; період breathing `.9`, scale `.94→1.06`.
3. Stagger виходу lobes `.06 s` за годинниковою стрілкою.
4. Spores проростають назовні, рухаються зустрічними спіралями з angular speeds ±1.8 rad/s, потім в’януть усередину.
5. Палітра: ivory Core, verdant Body, violet accent ≤15%.
6. Перевірте radii 250/450/700 і перекриття 1/5/12 areas.
7. High: interior 20/s +8 sprouts; Medium: 10/s+4; Low: лише boundary.

### Чому це працює

Лопатева boundary змінює форму, зберігаючи радіус; germination/breath/exit змінюють таймінг; sprout/counter-spiral/wilt — рух; ієрархія палітри — колір.

### Допустимі альтернативи

- Грибкова мережа із шести cells.
- Branching root mask, що завершується чистою зовнішньою boundary.
- Рідкі spores, схожі на світляків, якщо природний рух лишається growth/wilt.

### Типові неправильні рішення

- Декоративні lobes виходять за ігровий радіус.
- Low прибирає boundary.
- Нескінченний interior spawn після deactivation.
- Violet домінує й перетворює ефект на void/magic.
- Коло референсу скопійовано точно.

### Перевірка

Подайте накладення трьох радіусів із похибкою ≤5%, життєвий цикл, природну мову у відтінках сірого, дошку чотирьох осей, provenance, перекриття 12 areas, H/M/L і world-space bounds/culling.

### Performance

Boundary обов’язкова; щільність interior масштабується. Великого translucent fill уникають або тримають із низькою alpha. Persistent instances потребують політики concurrency/pooling у блоці 10.
