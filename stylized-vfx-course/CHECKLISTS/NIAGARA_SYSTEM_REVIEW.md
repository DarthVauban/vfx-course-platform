# Niagara System review

## Intent і structure

- [ ] System має одне речення purpose.
- [ ] Кожен Emitter має одну основну responsibility.
- [ ] Sprite/Mesh/Ribbon Renderer обрано через shape/motion need.
- [ ] Зайві Emitters/Renderers видалено.
- [ ] CPU або GPU `Sim Target` обґрунтовано й виміряно.
- [ ] `Local Space`/world space choice перевірено рухом owning component.

## Execution stack

- [ ] `System Spawn`/`System Update` містять лише system-level logic.
- [ ] `Emitter Spawn`/`Emitter Update` містять lifecycle/spawn logic.
- [ ] `Spawn Burst Instantaneous`/`Spawn Rate` стоять в `Emitter Update`, якщо застосовано.
- [ ] `Initialize Particle` стоїть на початку `Particle Spawn`.
- [ ] Location modules виконуються до velocity modules, які залежать від position.
- [ ] Forces стоять до `Solve Forces and Velocity`.
- [ ] `Particle State`/age logic не видалено випадково.
- [ ] Scale/color/animation modules використовують правильний stage.
- [ ] Event Handler order і source задокументовано.

## Attributes і parameters

- [ ] `Particles.Lifetime` та `Particles.NormalizedAge` дають очікуваний timing.
- [ ] `Particles.Position`, `Velocity`, `Color`, `SpriteSize`, `MeshOrientation`, ribbon attributes читаються/записуються свідомо.
- [ ] Namespace (`User.`, `System.`, `Emitter.`, `Particles.`, `Module.`) правильний.
- [ ] Parameter Map flow можна пояснити.
- [ ] Randomness deterministic там, де потрібне repeatable testing.
- [ ] User Parameters мають defaults і documented ranges.

## Renderers і materials

- [ ] Material призначено кожному Renderer.
- [ ] Renderer Color/Size/Orientation/Material bindings перевірено.
- [ ] Facing Mode й Alignment відповідають attributes.
- [ ] Ribbon ID/link order/width/twist перевірено, якщо є ribbon.
- [ ] Mesh pivot, forward axis і scale правильні.
- [ ] Translucent sorting перевірено з camera motion.

## Lifecycle і gameplay

- [ ] One-shot System завершується й не лишається active.
- [ ] Looping effect деактивується контрольовано.
- [ ] Auto Activate/Auto Destroy/Pooling Method обрані свідомо.
- [ ] Spawned/attached behavior перевірено на socket motion.
- [ ] Position/direction/color/scale/target data реально змінюють effect.
- [ ] System поводиться коректно при повторній активації.

## Debugging

- [ ] Compile issues і stack warnings вирішено, а не dismiss-нуто без причини.
- [ ] Niagara Debugger або Debug HUD використано для relevant attributes.
- [ ] Fixed Bounds/estimated bounds візуально перевірено.
- [ ] Off-screen/culling behavior перевірено.
- [ ] Collision method і limitation задокументовано.
- [ ] Events не використовуються як GPU baseline.

## Performance

- [ ] Active System/Emitter/particle counts записано.
- [ ] CPU/GPU timing виміряно в representative scene.
- [ ] Overdraw і material cost перевірено.
- [ ] Sorting, collision, ribbons, dynamic lights і Data Interfaces оцінено.
- [ ] Effect Type/scalability strategy застосована для великого effect.
- [ ] High/Medium/Low variants візуально й технічно перевірено.

## Manual verification

- [ ] Exact modules, categories, pins і renderer properties звірено у UE 5.8.x.
- [ ] Experimental/Beta feature не є обов’язковою залежністю.

