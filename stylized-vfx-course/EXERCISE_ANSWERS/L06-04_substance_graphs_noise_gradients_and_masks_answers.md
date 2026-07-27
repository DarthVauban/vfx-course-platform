# Рішення до уроку 06.04

## EX-L06-04-A

### 1. Package/graph

```text
Package: EX_L06_04_A_masks.sbs
Graph: G_TwoMaskStudy
Parent size: 1024×1024
Type: grayscale
```

### 2. Список nodes

```text
Gradient Linear 1
Perlin Noise
Levels_SoftNoise
Levels_HardNoise
Blend_SoftMultiply
Levels_SoftFinal
Output_soft_smoke_mask
Output_hard_breakup_mask
```

### 3. Connections

```text
Perlin Noise.Output → Levels_SoftNoise.Input
Perlin Noise.Output → Levels_HardNoise.Input
Gradient Linear 1.Output → Blend_SoftMultiply.Background
Levels_SoftNoise.Output → Blend_SoftMultiply.Foreground
Blend_SoftMultiply.Output → Levels_SoftFinal.Input
Levels_SoftFinal.Output → Output_soft_smoke_mask.Input
Levels_HardNoise.Output → Output_hard_breakup_mask.Input
```

### 4. Parameters

```text
Graph: 1024×1024
Gradient Tiling: 1
Gradient Rotation: verified white source→black fade

Perlin Scale: 5
Perlin Disorder: .35

SoftNoise Levels:
in low=.12
in mid=.50
in high=.90

Blend:
mode=Multiply
opacity=1

SoftFinal Levels:
in low=.06
in mid=.52
in high=.94

HardNoise Levels:
in low=.34
in mid=.50
in high=.68
```

Точне розташування в UI залежить від установленої версії Designer.

### 5. Контракти output

| Identifier | Чорний | Сірий | Білий | Tiling |
|---|---|---|---|---|
| `soft_smoke_mask` | Smoke відсутній | М’яка часткова body | Core/body | Directional; відсутність tiling на осі fade допустима |
| `hard_breakup_mask` | Прибрано | Transition edge | Збережені islands | Має пройти тест 2×2 |

### 6. Перевірка проміжних результатів

- Perlin: плавні values середнього масштабу.
- Soft Levels: широкий сірий range.
- Hard Levels: чіткі islands, але зі згладженим сірим edge.
- Multiply: чорний кінець gradient завжди залишається чорним.
- Фінальний результат: видима body плюс м’який breakup.

### 7. 512 vs 1024

Macro distribution збігається. 1024 зберігає тонші transitions edge. Якщо запланована card відображається малою, 512 може бути достатньо, але рішення потребує тесту в UE, а не лише preview Designer.

### 8. Чому рішення працює

Одне джерело noise гарантує споріднену візуальну мову; окремі branches Levels створюють різні контракти. Soft smoke зберігає transitions; hard breakup залишається корисним як input erosion/dissolve.

### 9. Допустимі альтернативи

- `Clouds 2` може замінити `Perlin Noise`, якщо це задокументовано.
- Hard output у подальшій роботі може використовувати Histogram Scan, але ця вправа обмежує набір nodes.
- Напрямок Gradient можна перевернути, якщо цього потребує контракт UV/material.

### 10. Поширені хибні рішення

- Hard output є суто binary із jagged edge.
- Soft output повністю сірий і без білого core.
- Перетворення Color без мети.
- Identifiers Output дублюються.

### 11. Перевірка

1. Повторно відкрий package.
2. Перевір nodes за порядком.
3. Перевір histogram/range.
4. Перевір breakup 2×2.
5. 512/1024.
6. Вимкни color views.
7. Підтвердь, що outputs render.

### 12. Performance

Graph залишається малим і grayscale. Runtime assessment виконується після стандартного bitmap import/material sampling.

---

## EX-L06-04-B

### 1. Setup

Inputs:

```text
Background = Gradient
Foreground = Perlin/Levels
Opacity = 1
```

Чотири nodes `Blend`:

```text
B_Multiply
B_Add
B_Max
B_Min
```

До outputs немає post-Levels.

### 2. Доказ values

| a Background | b Foreground | Multiply | Add/clamped | Max | Min |
|---:|---:|---:|---:|---:|---:|
| .6 | .4 | .24 | 1.0 | .6 | .4 |
| .2 | .8 | .16 | 1.0 | .8 | .2 |
| .9 | .3 | .27 | 1.0 | .9 | .3 |
| .1 | .2 | .02 | .3 | .2 | .1 |
| .5 | .5 | .25 | 1.0 | .5 | .5 |

### 3. Таблиця use/avoid

| Режим | Корисний для | Ризик |
|---|---|---|
| Multiply | Обмеження noise через gradient | Може стати надто темним |
| Add | Об’єднання яскравих masks/energy | Швидко втрачає сірі detail через clipping |
| Max | Union зі збереженням сильнішого input | Може ігнорувати тонкий overlap |
| Min | Intersection або темніша спільна область | Може прибрати забагато |

### 4. Обраний режим smoke

`Multiply`, тому що directional gradient має гарантувати fade до нуля, тоді як noise прибирає внутрішні areas. Add підвищував би яскравість із clamp і міг би зруйнувати fade.

### 5. Чому рішення працює

Однакові inputs ізолюють лише режим blending. Ручні values відповідають задокументованій математиці; вибір ґрунтується на семантичній потребі, а не на перевазі screenshot.

### 6. Допустимі альтернативи

- `Min` також може обмежувати masks, але результат відрізняється від Multiply у сірих transitions.
- `Max` може об’єднувати два незалежні clusters іскор.
- `Add` валідний, якщо values навмисно низькі, а post-remap контрольований.

### 7. Поширені хибні рішення

- Різні inputs для кожного режиму.
- Levels після кожного режиму до порівняння.
- Стверджувати Add=.6 для .6+.4.
- Плутати Max із Add.

### 8. Перевірка

- За бажанням візьми sample відомих values Uniform Color.
- Підтвердь Blend Opacity 1 для всіх nodes.
- Підтвердь відсутність mismatch type.
- Порівняй з обчисленою таблицею.
- Збережи outputs з унікальними identifiers.

### 9. Performance

Цей доказ є навчанням authoring. У фінальному graph прибери невикористані comparison branches або вимкни їх; UE отримує лише експортовані bitmaps.
