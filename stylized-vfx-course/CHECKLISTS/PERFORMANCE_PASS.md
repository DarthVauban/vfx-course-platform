# Performance pass

## 1. Test contract

Заповніть до вимірювання:

```text
UE version / patch:
Platform / hardware:
Build/RHI:
Resolution:
Frame-rate target:
Test map:
Gameplay camera / FOV:
Effect instances: 1 / stress count:
Capture duration:
Comparison baseline:
```

Числові budgets не переносіть між проєктами без профілювання. Усі limits у course exercises — навчальні стартові constraints, а не універсальні shipping guarantees.

## 2. Reproducibility

- [ ] Однакові camera, background, instance count і duration для A/B.
- [ ] Deterministic seed або repeatable gameplay trigger.
- [ ] Warm-up/first-use compilation не змішано зі steady-state measurement.
- [ ] Editor overhead враховано; critical verdict перевірено в representative build.

## 3. Visual cost

- [ ] Shader Complexity переглянуто.
- [ ] Worst-case translucent overlap переглянуто.
- [ ] Screen coverage записано.
- [ ] Texture memory/resource sizes перевірено.
- [ ] Mesh triangle/section count перевірено.
- [ ] Ribbon segment/width/overlap cost перевірено.
- [ ] Dynamic lights вимкнено або обґрунтовано.
- [ ] Sorting correctness і cost перевірено.

## 4. Simulation cost

- [ ] Active Systems і Emitters записано.
- [ ] Average/max particle count записано.
- [ ] CPU/GPU Sim Target перевірено A/B там, де доречно.
- [ ] Collision method/cost перевірено.
- [ ] Data Interfaces/Skeletal sampling/events оцінено.
- [ ] Spawn spikes від burst і activation зафіксовано.
- [ ] System/Emitter scripts враховано навіть для GPU particle sim.

## 5. Lifecycle, bounds, culling

- [ ] One-shot деактивується.
- [ ] Looping effect має явний owner/lifetime.
- [ ] Bounds достатні, але не надмірні.
- [ ] Distance/visibility culling протестовано.
- [ ] Effect Type і scalability settings перевірено.
- [ ] Pooling test виконано для часто повторюваного effect.

## 6. H/M/L profiles

| Aspect | High | Medium | Low |
|---|---|---|---|
| Emitters | | | |
| Particle counts | | | |
| Texture/flipbook | | | |
| Mesh/ribbon | | | |
| Collision | | | |
| Lights | | | |
| Material features | | | |
| Culling distance | | | |

- [ ] Medium зберігає primary shape, contact і gameplay cue.
- [ ] Low зберігає gameplay information, навіть якщо accents/residue скорочено.
- [ ] Profile switch не змінює damage area/telegraph meaning.

## 7. Evidence

```text
Before:
- CPU:
- GPU:
- particles/systems:
- texture/mesh notes:
- visual problem:

Change:
- one controlled change:

After:
- CPU:
- GPU:
- particles/systems:
- visual difference:

Decision:
- keep / revert / test further:
```

- [ ] Є Niagara Debugger capture.
- [ ] Є Shader Complexity/overdraw evidence.
- [ ] Є profiler evidence для великого effect.
- [ ] Є gameplay capture High/Medium/Low.

## 8. Verdict

- [ ] Немає unbounded or immortal systems.
- [ ] Немає critical visual regression.
- [ ] Cost відповідає локальному budget проєкту.
- [ ] На цільовому PC/console hardware потрібна окрема фінальна перевірка.

