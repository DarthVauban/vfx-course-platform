# Ключ — Block 04 Assessment

## Частина A — Відповіді

1. Body — surviving shape; edge — вузька різниця між expanded і body thresholds.
2. Щоб values не виходили за intended 0–1 і не створювали undefined/fully erased states.
3. Texture neutral .5 має стати 0; нижче — negative, вище — positive direction.
4. Flow map кодує direction у channels; noise зазвичай дає scalar variation.
5. `Lower=Lerp(A,B,LowerT)`, `Final=Lerp(Lower,C,UpperT)`.
6. Palette лишається art-directable; energy/bloom control не запечений у hue.
7. Від angle/dot між normal і view direction, сформованого exponent.
8. Offset vector від original vertex position.
9. Material deformує rendered vertices, collision є окремою geometry/system.
10. WPO influence.
11. Material Domain/compile-time properties відрізняються.
12. У Niagara Ribbon Renderer; material читає coordinates.
13. Коли hard contact є важливим cue або fade з’їдає shape.
14. `Particles.Color → Renderer Color Binding → Material ParticleColor → outputs`.
15. User — per system/component exposed input; Particle Attribute — value кожної particle.
16. Для local component material state.
17. Для навмисно global shared value.
18. Вони створюють permutations і testing burden.
19. Instance → parent → function/texture.
20. Actual cost також залежить від coverage, overdraw, blend, geometry, count, simulation і hardware.

## Частина B — Reference solution

### Erode function

```text
Body = step(Threshold01, Mask)
Expanded = step(Threshold01 - max(EdgeWidth01,.001), Mask)
Edge = saturate(Expanded - Body)
```

Preview polarity. Exact `Step` input ordering:

`Потребує ручної перевірки в Unreal Engine 5.8.`

### Three-color function

```text
LowerT = saturate(Value / max(MidPoint,.01))
UpperT = saturate((Value-MidPoint) / max(1-MidPoint,.01))
Lower = lerp(ColorA,ColorB,LowerT)
Final = lerp(Lower,ColorC,UpperT)
```

### Sprite

```text
Surface / AlphaComposite / Unlit
Shape texture → Erode
Particles.Color → ParticleColor → RGB tint/A opacity
Particles.Charge01 → renderer binding M_Charge01
UseDepthFade static choice
```

### Mesh

```text
PhaseCycles = Time×Speed + TexCoord.V×Frequency
WPO = VertexNormalWS × Sine(PhaseCycles) × Amplitude × VertexColor.R
Fresnel band supports edge, never replaces BodyMask
```

Тут `sin` означає Material `Sine` expression з `Period=1`, тому input заданий у cycles. Для custom HLSL `sin()` потрібне перетворення cycles у radians через `2π`.

### Ribbon

```text
U = TexCoord.U×TileU + Time×ScrollU
V = TexCoord.V
WidthMask = pow(saturate(1-abs(V×2-1)),EdgePower)
Shape = Texture(U,V).R × WidthMask
```

### Decal

Окремий parent Deferred Decal, обмежена projection і тест floor/wall/corner/receiver. Точні inputs DBuffer/mode перевірено в цільовому проєкті.

### Three variants

Повний бал потребує відмінностей щонайменше у трьох із таких аспектів:

- silhouette/texture;
- motion/flow;
- timing intent;
- value hierarchy;
- renderer/layer role;
- palette.

Лише Hue: максимум 2/6.

## Частина C — Diagnostic key

Повні 10 балів:

1. відтворює симптом у зафіксованих умовах;
2. показує preview проміжного value;
3. визначає перший неправильний hop;
4. виправляє root cause, а не приховує симптом;
5. повторює перевірку на релевантних backgrounds/cameras;
6. надає валідні докази cost/readability до/після.

Reference roots:

| Symptom | Likely first checks |
|---|---|
| Inverted erosion | Step polarity, mask channel/sRGB |
| Missing tint | ParticleColor material node, renderer Color binding |
| Ribbon stretch | U/V debug, renderer UV distribution/tiling |
| Wall decal | projection volume/receiver, not texture blur |
| WPO pop | maximum offset vs bounds |
| Overlap | coverage/layers/sort/blend, not only priority |

## Частина D — Scoring notes

- Dependency diagram має відповідати фактичним assets.
- Таблиця даних потребує owner/source, scope, type/range, receiver і fallback.
- Tier Low має зберігати primary silhouette, timing, gameplay area і team/element cue.
- «Немає limitations» earns 0 for limitations.
- Непройдені пункти checklist допустимі лише разом із remediation/retest.

## Порогове рішення

```text
80–100 + немає critical fail: G04 пройдено
70–79: цільове доопрацювання й повторний assessment
<70: повторити слабкі уроки, потім перебудувати
Будь-який critical fail: не пройдено до виправлення, навіть якщо числовий бал ≥80
```
