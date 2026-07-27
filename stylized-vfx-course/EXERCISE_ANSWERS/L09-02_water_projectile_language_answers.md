# Рішення вправ L09-02

Усі візуальні assets мають бути створені студентом. Ігровий projectile лишається авторитетним джерелом руху й зіткнення.

## EX-L09-02-A — Авторитетний водяний bolt

### Повна побудова

1. Test actor рухається зі швидкістю 1800 cm/s і володіє collision.
2. Прикріпіть `NS_EX_L09_02_WaterBolt`; задавайте Velocity/Forward/Radius під час кожного update.
3. `NE_Head`: одна локальна постійна orb/card, діаметр 56; розтягнення від speed `X 1→1.8`, YZ `1→.72`; пульсація color.
4. `NE_Ribbon`: world space, 45/s, life `.35`, width `34→3`, alpha `0→1→0`.
5. `NE_Droplets`: 18/s, life `.35–.7`, velocity `−Forward×80–220 + random cone 120`, gravity `−380`, drag 1.4.
6. Під час hit задайте `IsTraveling=false`; не знищуйте компонент до `.7 s` або фактичного завершення останньої частинки.
7. Під час teleport деактивуйте й скиньте ribbon перед стрибком transform, а потім активуйте знову.
8. Перевірте пряму, поворот на 90°, S-криву, teleport і hit.
9. H/M/L: ribbon rate 45/30/20; droplets 18/8/0; head присутня завжди.

### Чому це працює

Actor визначає поточну правду. Локальна head слідує за ним, а world ribbon зберігає історію траєкторії. Stop-spawn/fade не обрізає trail, а reset запобігає довгим лініям після teleport.

### Допустимі альтернативи

- Spawn per unit/distance замість rate, якщо workflow перевірено.
- Одна card для head замість mesh.
- Ігровий component може передавати transform безпосередньо замість окремих vectors.

### Типові неправильні рішення

- Частинка Niagara самостійно симулює collision/path.
- Local space усього System змушує trail рухатися разом з actor.
- Миттєве знищення component.
- Ribbon зберігає історію між pooling/teleport.
- Low прибирає head.

### Перевірка

Накладіть position під час поворотів: видимого розходження head/collision немає. Лінія teleport відсутня. Trail природно завершується після hit. Швидкості 600/1800/3200 зберігають напрямок і розумну щільність сегментів. H/M/L та bounds захоплено.

### Performance

Живі сегменти ribbon ≈ rate×life: 45×.35≈16. Перевірте 1/10/30 projectiles. Широкий translucent trail, імовірно, становить більший ризик, ніж кількість droplets.

## EX-L09-02-B — Оригінальний припливний projectile trail

### Повна побудова

#### Етап 1

Створіть orb head, один ribbon, рівномірні wake rings кожні `.16 s` і прямі droplets.

#### Етап 2

Запишіть із референсу співвідношення head:trail, taper, інтервали pulse, запізнення на вигині й щільність breakup. Відбудуйте ефект із власних assets і перелічіть три відхилення.

#### Етап 3

1. Дві crescent cards head дзеркально розташовано навколо forward axis; rotations ±18°.
2. Цикл інтервалів wake `.10/.16/.24 s`; ширина pulse `34→18→42 cm`.
3. Droplets використовують дві фази `0` і `π` навколо forward axis, radius `18→3 cm`, angular speed `8 rad/s`, rearward speed 140.
4. Pulse ширини Ribbon використовує той самий тридольний цикл із меншою амплітудою.
5. Палітра: глибокий teal `(0.01,.5,.7)`, pearl `(2.5,4,4)`, violet accent `(.5,.08,1.5)`.
6. Скидайте фази й ribbon під час retarget або повторного використання pool.

### Чому це працює

Розділені crescents змінюють поперечний силует, нерівномірний wake — ритм, helix — рух, а нова ієрархія — колір. Вода лишається цілісною, бо head/trail спільно використовують фазу pulse.

### Допустимі альтернативи

- Трилопатева head й одна спіраль.
- UV distortion, що закручує ribbon, замість фізичних helix droplets.
- Ритм `.12/.12/.22`, якщо його виміряно й він відрізняється від baseline.

### Типові неправильні рішення

- Лише recolor із blue у purple.
- Паралельні дублікати ribbons, названі braid.
- Надмірний radius helix ховає head.
- Wake pulses керують ігровим collision.
- Імпортовано texture projectile з референсу.

### Перевірка

Білий силует відрізняє crescent від orb. Timeline показує тридольний pulse. Захоплення path зверху й спереду показують дві фази helix. Перевірки straight/S-curve/teleport/hit пройдено. Подано provenance, H/M/L, bounds і профіль одночасних екземплярів.

### Performance

Medium може прибрати одну сім’ю helix і зменшити ribbon rate. Low використовує одну crescent head і короткий ribbon без wake/droplets. Авторитетний сигнал head/path не зникає.
