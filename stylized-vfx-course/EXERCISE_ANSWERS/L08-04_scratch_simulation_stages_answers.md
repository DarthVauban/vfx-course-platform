# Розв’язки L08-04 — Scratch Pad, modules і Simulation Stages

## EX08-04-A — `NMS_VFX_OrbitVelocity`

### API

```text
Module.CenterWS           Position/Vector in documented world space
Module.AxisWS             Vector3, default (0,0,1)
Module.AngularSpeedRadS   Float, default 1
Module.RadialPullCmS2     Float, default 0
Module.Strength01         Float 0–1, default 1
Module.EpsilonCm          Float, default .01
Module.WriteDebug         Static Bool, default false
```

Читає `Particles.Position`, `Particles.Velocity`, `Engine.DeltaTime`. Записує `Particles.Velocity`, опційно validity/color.

### Безпечна математика

```text
AxisLen = length(AxisWS)
SafeAxis = AxisLen > Epsilon ? AxisWS/AxisLen : (0,0,1)

Radial = Particles.Position - CenterWS
Radius = length(Radial)
RadialValid = Radius > Epsilon
RadialDir = RadialValid ? Radial/Radius : any stable perpendicular/no-motion fallback

TangentRaw = cross(SafeAxis, RadialDir)
TangentLen = length(TangentRaw)
OrbitValid = RadialValid && TangentLen > Epsilon
Tangent = OrbitValid ? TangentRaw/TangentLen : (0,0,0)

TangentialSpeed = AngularSpeedRadS × Radius
OrbitDeltaV = Tangent × TangentialSpeed
PullDeltaV = -RadialDir × max(RadialPullCmS2,0) × DeltaTime

NewVelocity = lerp(
  OldVelocity,
  OldVelocity + OrbitDeltaV + PullDeltaV,
  saturate(Strength01)
)
```

Важливий нюанс: додавання повної цільової тангенціальної швидкості щокадру призводить до необмеженого прискорення. Краще implementation:

- спрямовує поточну velocity до `Tangent×AngularSpeed×Radius` за допомогою response/DeltaTime; або
- обчислює лише потрібну різницю velocity.

Еталонний steering:

```text
DesiredV = Tangent × AngularSpeedRadS × Radius
SteerAlpha = 1 - exp(-ResponsePerSecond × DeltaTime)
OrbitV = lerp(OldVelocity, DesiredV, SteerAlpha × Strength01)
NewV = OrbitV + PullDeltaV × Strength01
```

Якщо точна доступність exponential node/function відрізняється, використай наближення з обмеженим `Response×DeltaTime` і задокументуй це.

### У центрі

`Radius<=Epsilon`:

- без orbit tangent;
- validity 0/magenta;
- зберегти попередню velocity або застосувати авторський fallback;
- ніколи не нормалізувати нульовий radial.

### Від’ємні та великі значення

- Від’ємна angular speed навмисно змінює напрямок orbit.
- Обмеж Strength діапазоном 0–1.
- Radial pull обмежено значенням ≥0, якщо outward push не є явним окремим режимом.
- Задокументуй авторський діапазон angular speed; не застосовуй довільне універсальне обмеження без вимоги брифу.

### Матриця тестів

| Випадок | Очікуваний результат |
|---|---|
| Вісь +Z, точка +X | tangent +Y або −Y залежно від домовленості cross, послідовно |
| Довжина Axis дорівнює 10 | той самий нормалізований результат |
| Нульовий Axis | fallback +Z |
| Частинка в центрі | без NaN / без orbit |
| Strength 0 | velocity не змінюється |
| Різна частота кадрів | подібна траєкторія за однаковий час у секундах |
| Від’ємне angular-значення | напрямок протилежний |

### Повторне використання у двох Systems

- `NS_OrbitSparks`: висока angular speed, короткий lifetime.
- `NS_AuraOrbit`: низька angular speed, довгий lifetime.

Обидва використовують той самий asset; відрізняються лише inputs module.

### Рубрика

| Критерій | Бали |
|---|---:|
| Чіткі типізовані API/metadata | 15 |
| Безпечні axis/radial/tangent | 25 |
| Коректна поведінка time/steering | 20 |
| Тести центра й edge cases | 15 |
| Повторне використання у двох Systems | 15 |
| Примітка про debug/performance | 10 |

## EX08-04-B — Досьє iterative relaxation

### Очікувана формула

Початкова відстань `D0`. На кожній iteration:

```text
Dnext = Dcurrent × (1 - Alpha)
Dn = D0 × (1 - Alpha)^n
EffectiveAlpha = 1 - (1 - Alpha)^n
```

### Очікувана таблиця

| Alpha | Залишок за n=1 | n=2 | n=4 | n=8 |
|---:|---:|---:|---:|---:|
| .10 | .9000 | .8100 | .6561 | .4305 |
| .25 | .7500 | .5625 | .3164 | .1001 |
| .50 | .5000 | .2500 | .0625 | .0039 |

Спостережувані значення можуть відрізнятися через timing/precision/order; велика розбіжність вимагає debug.

### Контрольоване дослідження

```text
Seed/initial particles = identical
Count = 64
Initial radius = 300 cm
Target = origin
No other forces
One simulation step/fixed comparison frame
Same camera/material
Stage only changed by iterations/alpha
```

### Еквівалент за один pass

Якщо мета — лише незалежний Lerp до target, обчисли effective alpha один раз:

```text
AlphaEffective = 1 - pow(1 - AlphaPerIteration, NumIterations)
Position = lerp(Position,Target,AlphaEffective)
```

Це може відтворити математичний результат без кількох passes, тому Simulation Stage не виправданий для цього простого production-випадку. Stage залишається корисним як навчальна модель і для алгоритмів, у яких iterations залежать від проміжного стану, grid або сусідів.

### Production-рекомендація

Для незалежного target relaxation кожної частинки: відхили iterative stage і використай аналітичний one-pass update. Для grid/neighbor solver: stage може бути виправданим після профілювання target/platform і тестів стабільності.

### Перевірка target/package

Запиши:

- UE 5.8.x build;
- Sim Target;
- platform/RHI;
- stage usage/iteration source;
- editor vs packaged result;
- compiler warnings;
- GPU capture;
- fallback without stage.

### Хибні рішення

- Порівнювати різні випадкові початкові positions.
- Вважати, що 4 iterations дають ту саму response, що й 1, без коригування alpha.
- Використовувати Alpha>1 і називати overshoot «точнішим».
- Стверджувати, що stage покращує якість, без мети або метрики.
- Ігнорувати підтримку packaged/target.
- Вигадувати числові значення вартості.

### Performance

Очікуване масштабування обсягу роботи:

```text
64 particles × 8 iterations = 512 particle-stage executions/update
```

Це не GPU timing. Фактичний timing залежить від shader/work/data/hardware. Надай виміряний capture або вкажи вимогу ручної перевірки на цільовій платформі.

### Рубрика

| Критерій | Бали |
|---|---:|
| Коректні формула / таблиця | 20 |
| Контрольований експеримент | 20 |
| Конфігурація stage / докази | 15 |
| Порівняння з one-pass | 20 |
| Production-рекомендація | 15 |
| Обмеження target/performance | 10 |

Поріг опанування: ≥80; математика й контрольоване порівняння є обов’язковими.
