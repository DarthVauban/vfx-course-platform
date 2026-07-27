# Рішення вправ L09-06

Crack є #10; secondary wave — його обов’язкова реакція.

## EX-L09-06-A — Ground crack, безпечний для поверхні

### Повна побудова

1. Власна crack mask 1024 і ground card/mesh із виміряним радіусом.
2. User center, normal, direction, radius 500, offset 1.5.
3. `NE_Heave`: один disc `.18`, displacement вздовж normal `0→12→0 cm`.
4. `NE_Crack`: spawn `.06`, lifetime 3, reveal `.25`, hold 2, fade `.75`.
5. `NE_Wave`: spawn `.08`, lifetime `.50`, точний target radius.
6. `NE_Debris`: 16 власних meshes у `.12`, lifetime `.8–1.4`, radial 180–520, normal 180–460, gravity −980.
7. `NE_Dust`: 10 у `.25`, lifetime 1–1.8, низькі speed/contrast.
8. Перевірте offsets `.1/1.5/5 cm` на рівній поверхні, схилі 20° і краю сходинки.
9. Задокументуйте межі: плоска card не може ідеально повторити різкий перепад рельєфу.
10. H/M/L зберігають crack і wave.

### Чому це працює

Мінімальний bias вздовж normal балансує z-fight/float. Рознесені в часі heave/wave/debris/dust створюють вагу. Власна ground mark зберігається протягом явно заданого життєвого циклу й має точний радіус.

### Допустимі альтернативи

- Перевірений decal/projection path.
- Кілька малих conforming cards замість однієї великої plane.
- Ballistic debris без collision.

### Типові неправильні рішення

- Успіх лише на площині подано як універсальне повторення terrain.
- Decal texture скопійовано.
- Усе з’являється в момент контакту.
- Lifetime crack нескінченний.
- Low прибирає wave або сигнал радіуса.

### Перевірка

Подайте матрицю поверхонь, накладення радіуса, крупні плани z-fight/float, bounds вершини debris, земну мову у відтінках сірого, перевірку 1/6/20 перекриттів, H/M/L і provenance.

### Performance

Тривалі overlapping cards можуть домінувати у вартості. Medium використовує 10 debris/6 dust; Low — crack і просту wave. Collision та dust прибирають раніше, ніж основний зміст ground response.

## EX-L09-06-B — Оригінальна реакція тектонічного розлому

### Повна побудова

#### Етап 1

Збережіть baseline із radial crack/wave/debris.

#### Етап 2

Запишіть із референсу співвідношення fault length:radius, щільність branching, затримку debris та співвідношення тривалості dust:action. Відбудуйте власні mask/meshes.

#### Етап 3

1. Три plate cards зорієнтовано на `−18°,12°,38°`; diagonal fault іде вздовж ImpactDirection.
2. Затримки Heave `0/.04/.08`, height 8/14/10 cm.
3. Пауза `.08`; collapse починається у `.28`, порядок plates чергується.
4. Velocity debris: 70% ImpactDirection, 30% radial; асиметрія scale ліворуч/праворуч.
5. Secondary wave лишається центрованою й досягає того самого радіуса.
6. Colors: slate Body, ochre Edge і moss accent ≤12%.

### Чому це працює

Геометрія plates/fault змінює форму; stagger/pause/collapse — таймінг; directional uplift/debris — рух; slate/ochre/moss — колір. Центрована wave зберігає ігрову правду.

### Допустимі альтернативи

- Дві великі fault plates і чотири chips.
- Вигнутий fault із затриманою однією стороною.
- Без emissive moss accent для приземленішого стилю.

### Типові неправильні рішення

- Асиметрія зміщує ігрові center/radius.
- Plate meshes перетинаються на піку.
- Коричневий radial baseline лише зі зміною кольору.
- Dust ховає fault.
- Скопійовано terrain fracture.

### Перевірка

Подайте білі силуети plates, таблицю timing, vectors руху, колірну смугу, центроване накладення радіуса, три поверхні, provenance і H/M/L. Самоперевірка має прочитати вагу earth без кольору.

### Performance

Medium поєднує plates в одному renderer/mesh, де це доцільно, і зменшує debris. Low використовує одну fault mask плюс wave. Тривалий lifetime і concurrency лишаються явно задокументованими.
