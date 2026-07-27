# Повні рішення — L11.05 Portfolio breakdowns, reel and описи проєктів

Рішення використовують умовні filenames і порядок. Замініть їх власними actual versions, contacts, licensed audio/font та measured evidence. Не копіюйте claims, яких ваші artifacts не доводять.

## EX-L11-05-A

**Повне рішення: 75-second evidence-first reel.**

### 1. Обґрунтування selection

У прикладі `Rift Crown` відкриває reel, бо найшвидше показує gameplay telegraph, large-scale timing і technical depth. Далі:

1. `Rift Crown` — найсильніша читабельність під час гри/scale;
2. `Resonant Edge` — швидкий contact/timing контраст;
3. `Triune Relay` — reuse і три distinct variants;
4. `Glassbloom Ward` — persistent state, materials і lifecycle.

Порядок не є універсальним: selection matrix з actual scores/evidence визначає ваш.

### 2. Shot list на 75 секунд

| Час | Shot | Мета caption/evidence |
|---|---|---|
| `0–3` | name + one-frame-safe contact slate | identity/contact без довгого logo |
| `3–13` | повний real-time gameplay Rift Crown | ігровий радіус і таймінг |
| `13–18` | top neutral + debug boundary + H/M/L triptych | technical truth |
| `18–28` | повне three-hit gameplay Resonant Edge | contact rhythm |
| `28–33` | side neutral + Notify/BP/layer panel | synchronization/reuse |
| `33–43` | три variants Triune Relay на тому самому route | non-hue variant identity |
| `43–48` | material instances + shared BP + before/after | architecture/performance |
| `48–58` | gameplay activation/loop/deactivation Glassbloom | persistent state |
| `58–63` | two-character isolation + H/M/L | per-instance/lifecycle |
| `63–70` | чотири читабельні 1-second technical panels | breadth textures/material/Niagara/perf |
| `70–75` | actual contact/link + role line | наступна дія |

Жоден gameplay shot не прискорено. Якщо використано slowed neutral shot, він має on-screen label.

### 3. Текст captions

```text
RIFT CROWN — ULTIMATE / BOSS ABILITY
Role: VFX design, textures, materials, Niagara, Blueprint integration
UE build: [actual] | Target/profile: [actual]
Third-party character/animation/environment: [actual source/license]
Playback: real time
```

Technical panels:

```text
GAMEPLAY RADIUS PARITY
NIAGARA + MATERIAL + BLUEPRINT
H / M / L — CRITICAL CUES PRESERVED
BEFORE / AFTER — IDENTICAL TARGET TEST
```

### 4. Перевірка audio, font і mute

- audio: лише track/effects з actual lawful license; creator/source/license записані;
- font: права redistribution/embedding перевірені;
- proprietary game audio відсутнє;
- mute pass підтверджує, що captions, phase/contact і порядок лишаються зрозумілими;
- audio не створює hits, відсутніх у gameplay.

### 5. Export and QA

- master і delivery resolution/frame rate записані, а не вигадані;
- playback перевірено за normal speed;
- crushed highlights не приховують silhouettes;
- title-safe captions читаються на laptop-size view;
- кожен role/third-party рядок відповідає authorship table;
- compressed delivery порівняно з master щодо banding/particle loss;
- filenames/version додані до manifest.

Exact Sequencer/MRQ/export UI **Потребує ручної перевірки в Unreal Engine 5.8.**

### 6. Критерій приймання

Reel дорівнює 75 s, усі чотири pieces мають gameplay+technical proof, найсильніша робота з’являється в перші 5 s, кожен playback/role claim точний, audio/font lawful, reel працює muted, а жодна weak/failed piece не прихована монтажем.

## EX-L11-05-B

**Повне рішення: interview і delivery audit.**

### 1. Випадкова piece і 5-хвилинний walkthrough

Приклад random selection: `Glassbloom Ward`.

```text
0:00–0:25
Gameplay problem: показати захисний state без перекриття character/combat cues.

0:25–0:55
Constraints: невідома loop duration, кілька characters, per-instance color,
cancel/restart, PC/console target, без proprietary assets.

0:55–1:45
Architecture: три Niagara systems; User contract; MID для кожного character;
Blueprint state owner і GenerationId; рішення local/world space.

1:45–2:25
Art decision: activation спрямована inward/locking, loop — sparse/quiet,
deactivation collapses. Shape/motion зберігають grayscale identity.

2:25–3:15
Weakness: orphan loop і chest overdraw. Відтворення, root cause,
callback token, negative space і correction `Rate×Lifetime`.

3:15–4:05
Evidence: десять cancel cycles, two-character isolation, target tests 1/4/8,
identical before/after і H/M/L cue checklist.

4:05–4:35
Authorship: точні original VFX assets/graphs; actual source/license
third-party character/animation/environment.

4:35–5:00
Limitation: назване actual limitation; наступний experiment і причина.
```

Відповіді на follow-up:

- **Чому три systems?** Різні roles/lifecycle й незалежне tier control; один loop ускладнював cleanup.
- **Як виміряно?** Відкрити target manifest, profiler captures і fixed 1/4/8 route; не переказувати з пам’яті невідомі числа.
- **Що створили ви?** Перелічити VFX textures/meshes/materials/Niagara/BP integration; окремо third-party assets.
- **Що зламалося?** Показати orphan-loop capture, root cause і regression test.

### 2. Claim audit

| Початкова фраза | Проблема | Evidence-first revision |
|---|---|---|
| «AAA-quality» | undefined/unverifiable | вилучити; показати rubric, gameplay і breakdown |
| «console optimized» | немає platform/config | `measured on [actual target/profile]` + report |
| «all assets mine» | character/environment third-party | exact authored list + source/license |
| «zero performance cost» | impossible/unmeasured | actual captured до й після і limitation |
| «production ready» | scope не визначено | назвати пройдені lifecycle, tier, packaging і target tests |

Якщо evidence немає, claim вилучається, а не маскується менш конкретним superlative.

### 3. Delivery audit для нового користувача

```text
00_README
  ✓ one-paragraph purpose and navigation
  ✓ version/date/formats/playback
  ✓ actual contact links
  ✓ limitations

01_Reel
  ✓ file opens, captions match manifest

02_Case_Studies
  ✓ four folders, same navigation, readable graphs

03_Performance_Evidence
  ✓ target conditions + identical before/after

04_Credits
  ✓ author/source/license/redistribution constraints

Security/license
  ✓ no credentials, private paths, confidential files
  ✓ no redistributable third-party source asset unless permitted
```

Broken absolute workstation links замінено на relative package links або actual public links. Files отримали versioned readable names.

### 4. Remediation missing evidence

Приклад audit знайшов:

- у `Triune Relay` відсутній mixed H/M/L capture;
- у `Resonant Edge` graph text unreadable;
- у `Rift Crown` до й після має різний exposure;
- у `Glassbloom Ward` character credit нечіткий.

Виправлення:

1. зробити capture mixed tiers на тому самому route;
2. розділити graph на два labeled high-resolution panels;
3. повторити обидва performance captures із locked exposure/conditions;
4. додати actual character/animation source/license до first caption і credits.

### 5. Критерій приймання

Після перерви відкрийте package у clean session лише через README, без editor context, і пройдіть deterministic checklist: знайдіть reel і чотири описи проєктів, перевірте роль та playback, відкрийте кожен link/file, зіставте performance claims із target evidence та перевірте відсутність confidential/unlicensed material. Walkthrough вкладається у 5 хв, а кожен claim веде до artifact або limitation. Optional peer може повторити той самий checklist, але не є умовою приймання.
