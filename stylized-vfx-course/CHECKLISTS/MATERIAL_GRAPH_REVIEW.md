# Material Graph review

## Material properties

- [ ] `Material Domain` задокументовано.
- [ ] `Blend Mode` обрано через потрібну compositing behavior.
- [ ] `Shading Model` задокументовано; для більшості VFX `Unlit` обрано свідомо.
- [ ] `Two Sided` увімкнено лише якщо потрібне.
- [ ] Використані inputs (`Emissive Color`, `Opacity`, `Opacity Mask`, `World Position Offset`, `Refraction` тощо) відповідають properties.
- [ ] Translucency/sorting trade-offs перевірено.

## Data flow

- [ ] Кожна branch має comment із її purpose.
- [ ] Scalar/Vector2/Vector3/Vector4 types відомі.
- [ ] Component Mask використано свідомо.
- [ ] Діапазон кожної mask відомий; 0, 0.5 і 1 мають очікуване значення.
- [ ] Values поза 0–1 залишено лише там, де вони потрібні.
- [ ] Немає division by zero або неконтрольованого Power із проблемним base.
- [ ] UV pivot і coordinate space задокументовано.
- [ ] Intermediate outputs перевірялися через `Emissive Color`.

## Parameters

- [ ] Names описують intent: `Dissolve`, `EdgeWidth`, `FlowSpeed`, а не `Param1`.
- [ ] Scalar/Vector/Texture/Static Switch parameter types указані.
- [ ] Defaults дають валідний, видимий result.
- [ ] Min/Max usage range записано в comment або lesson.
- [ ] Parameters згруповано в Material Instance.
- [ ] Непотрібні parameters видалено.

## Textures

- [ ] Texture purpose і channels задокументовано.
- [ ] `sRGB` перевірено для color vs data.
- [ ] Compression Settings перевірено в UE 5.8 для цього asset.
- [ ] Alpha channel справді потрібен.
- [ ] Mips перевірено на distance/scale; `NoMipMaps` не використано автоматично.
- [ ] Atlas/flipbook має padding і не bleeding-ить.
- [ ] Texture resolution відповідає screen size.

## Reuse

- [ ] Повторювана logic винесена в Material Function лише якщо має стабільний contract.
- [ ] Function inputs/outputs названо й описано.
- [ ] Material Instances створено замість дублювання parent graph.
- [ ] Static Switch не створює невиправдані permutations.
- [ ] DMI/MPC використано лише для потрібного runtime/global scope.

## Niagara bindings

- [ ] `Particle Color`/renderer Color Binding узгоджені.
- [ ] `Dynamic Parameter` channels і Niagara `Dynamic Material Parameters` узгоджені.
- [ ] Mesh/Ribbon/Sprite usage перевірено на реальному renderer.
- [ ] User Parameter або renderer binding не покладається на magic default.

## Performance

- [ ] Material Stats/compile messages переглянуто.
- [ ] Shader Complexity перевірено в scene, а не лише preview.
- [ ] Overdraw перевірено для worst-case overlap.
- [ ] Texture sample count і expensive branches виправдані.
- [ ] WPO не виходить за bounds без плану.
- [ ] H/M/L variant strategy задокументовано.

## Manual verification

- [ ] Exact node names і pins звірено у встановленому UE 5.8.x.
- [ ] Platform-specific behavior перевірено у цільовій збірці.

