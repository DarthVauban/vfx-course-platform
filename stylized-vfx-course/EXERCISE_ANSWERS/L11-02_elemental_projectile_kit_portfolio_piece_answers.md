# Рішення вправ — 11.02 Elemental projectile kit

Version-sensitive UI: **Потребує ручної перевірки в Unreal Engine 5.8.**

## EX-L11-02-A

### Концепція й оригінальність

`Grainsurge` — четвертий Stone/Sand element, визначений через dense shedding, low-frequency tumbling і settling residue. Reference principles походять із власних recordings/photos dry soil, rock fracture і wind-blown grains; commercial projectile або extracted texture не використані.

### Shared runtime contract

Повторно використайте `BP_P11_ElementalProjectile` і встановіть:

```text
ElementIndex=3
PrimaryColor=(.55,.22,.05,1)
SecondaryColor=(1,.62,.18,1)
Direction=normalized gameplay velocity
Speed=projectile gameplay value
Scale=1
Intensity=1
HitNormal=actual hit
```

Усі setters виконуються до component activation та під час кожного pooled reuse.

### Повна phase architecture і точні start values

```text
Launch
  Ring Mesh: Burst1, lifetime .3, scale .35→1.1
  Grain Sprite: Burst10, sphere radius5, speed80–180, lifetime .3–.6

Flight
  Body Mesh: Burst1, SM_EX11_GrainsurgeCore, scale .7, slow Update Mesh Orientation
  Trail Ribbon: Rate32, lifetime .22, width5, tiling25
  Grain Motifs: Rate10, box/sphere radius6, inherit/short backward velocity, lifetime .25

Impact
  Flash Sprite: Burst1, life .08
  Low Radial Grains: Burst24, tangent velocity140–320, gravity-500, drag1.2
  Chunks Mesh: Burst5, velocity180–300, lifetime .8–1.2
  Settle Residue: Burst8, life .7–1.1, no gameplay-area expansion
```

Materials використовують original packed grain texture і одну shared projectile function; hue-only duplication немає. Local Z impact вирівнюється за `HitNormal`.

### H/M/L

- High: усі layers/rates.
- Medium: trail 24, motif 6, grains 16, chunks 3, без secondary residue.
- Low: body mesh, trail 16, contact flash + 12 grains + один compact ring.

Body/path/contact зберігаються.

### Performance, rubric і presentation

Виконайте той самий target scenario `one/12-flight/6-impact`. Порівняйте з Ember/Frost/Storm за fixed conditions. Подайте source sheet, material/Niagara/Blueprint breakdown, H/M/L, до й після і category scores. Pass вимагає `≥80` та всіх floors.

### Неправильні рішення

Не приймаються brown-tinted Frostglass, copied desert-game asset, excessive opaque screen dust, residue більший за damage radius або окремий Blueprint.

## EX-L11-02-B

### Matrix вимірювань

Знімайте кожен element за однакових умов:

```text
Development/target build
declared PC/console hardware
resolution/scalability
12 flight + 6 impacts / 10 s
same path/camera/warm-up
```

Запишіть Niagara instance/particle counts, renderer/material contributors, CPU/GPU frame evidence і overdraw. Не ранжуйте за виглядом у editor.

### Reference-набір defect/fix

1. **Highest-cost layer:** Storm ribbon `Rate=56/lifetime=.5` створює приблизно 28 points і broad translucent width. Спочатку зменште width, потім Rate до 44 лише якщо path sampling лишається stable; повторіть capture того самого route.
2. **Stale pooled value:** Frost launch після Ember зберігає `SecondaryColor` Ember через conditional setter. Установлюйте кожен shared і variant parameter до `Activate`; чергуйте 12 activations.
3. **Radius mismatch:** Frost impact ring візуально досягає 260 cm, тоді як gameplay debug radius дорівнює 200 cm. Прив’яжіть ring scale до задокументованого ігрового радіуса або зменште base mesh scale; збережіть inner contact flash.

### Regression і presentation

- усі variants досі відрізняються у grayscale;
- body/path/contact зберігаються в H/M/L;
- hit normals проходять floor/wall/slope;
- mixed stress виконує declared target;
- до й після використовує identical settings;
- limitations описують remaining close-camera translucent overlap.

### Неприпустимі виправлення

Неприпустимо змінювати quality лише в after, приховувати debug radius, скорочувати gameplay lifetime, вимикати entire variant або заявляти «35% faster» без compatible timing evidence.
