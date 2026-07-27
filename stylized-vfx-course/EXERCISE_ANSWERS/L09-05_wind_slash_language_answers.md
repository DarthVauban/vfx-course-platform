# Рішення вправ L09-05

Sword ribbon і released arc мають різні функції та lifecycle.

## EX-L09-05-A — Чистий sword ribbon

### Повна побудова

1. Передавайте `BladeBase`, `BladeTip`, `AttackActive`, `BladeWidth`.
2. На початку атаки очистьте й повторно ініціалізуйте історію ribbon.
3. Поки атака активна, spawn 60/s, lifetime `.16`, positions у світовому просторі.
4. Position candidate = midpoint Base/Tip; width = measured distance або authored 12 cm contract depending renderer strategy.
5. Крива Alpha `0→1 at .08 normalized→0`; width `.2→1→0`.
6. Наприкінці атаки задайте spawn 0; дозвольте fade протягом `.16 s`.
7. Перевірте horizontal, rising і diagonal swing, потім секунду idle й нову атаку в іншому місці.
8. Білий material має показувати path, не перекриваючи torso/face персонажа.
9. H/M/L створюють 90/60/30 samples за секунду з lifetimes `.20/.16/.12`.

### Чому це працює

Active gating запобігає idle particles; reset — застарілим connectors; короткий lifetime показує лише недавню траєкторію леза. Захоплення з білим матеріалом відокремлює форму й рух від кольору.

### Допустимі альтернативи

- Два edge ribbons із samples Base і Tip.
- Spawn-per-distance, якщо встановлений workflow перевірено.
- Mesh trail, створений animation tool, якщо source власний, а timing лишається керованим.

### Типові неправильні рішення

- Постійно увімкнений Spawn Rate.
- Trail у локальному просторі рухається з персонажем після swing.
- Порядок Base/Tip змінюється між кадрами.
- Висока alpha ховає animation.
- Миттєвий kill обрізає fade.

### Перевірка

Подайте три swings, reset після idle/зміни місця, slow/fast animation, debug осей Base/Tip, дошку білого ефекту на фонах, H/M/L і bounds. Лінії connector між атаками немає.

### Performance

Живі сегменти ≈rate×life: 60×.16≈10. Велика width або довгий lifetime можуть коштувати більше через overdraw, ніж через кількість сегментів. Low зберігає основну траєкторію леза.

## EX-L09-05-B — Оригінальна вітряна Slash Combo

### Повна побудова

#### Етап 1

Побудуйте один sword ribbon і один випущений crescent із reveal `.14`, lifetime `.32`.

#### Етап 2

Запишіть із референсу лише arc angle, співвідношення thickness:length, reveal/contact/fade та інтервали combo. Відтворіть власні mesh/texture.

#### Етап 3

1. Hit 1: висхідний split hook, active `.18`.
2. Gap `.06`.
3. Hit 2: короткий спадний counter-cut, active `.12`.
4. Gap `.12`.
5. Hit 3: широка S arc, active `.28`, із тонкими echoes у +`.06` і +`.11`.
6. Wisps обертаються проти кожної primary arc; speeds 100–180, curl 24.
7. Colors: біло-зелений Core, приглушений teal Body, теплий accent лише в контакті.
8. Кожен hit використовує окремий власний mask/mesh variant, але спільний material contract.

### Чому це працює

Силуети й ритм кодують три hits ще до кольору. Counter-motion додає потік вітру; стриманий accent зберігає контакт. Змінено всі чотири осі оригінальності.

### Допустимі альтернативи

- Hook, straight cut і майже круглий finisher.
- Combo з двох hits плюс затриманий cross echo.
- S reveal лише через material на одному власному mesh, якщо силуети лишаються різними.

### Типові неправильні рішення

- Три rotations того самого crescent.
- Усі hits перекриваються на піку.
- Wisps яскравіші за arcs.
- Точний contour референсу обведено.
- Low прибирає один primary hit.

### Перевірка

У відтінках сірого самоперевірка визначає порядок; timeline фіксує три contacts; UV debug підтверджує reveal; силует animation лишається видимим. Подайте provenance, дошку чотирьох осей і H/M/L concurrency/bounds.

### Performance

High може використовувати echoes/wisps; Medium — лише echo фінального удару; Low — одну primary arc на hit. Зберігайте ритм і контакт. Профілюйте повне combo, а не один ізольований кадр.
