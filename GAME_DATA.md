# Nightfall Survivors — Game Data Reference

This document records the playable content and combat values currently implemented in `game.js`. Names shown in the game are kept in English. Values are implementation values, not balance recommendations; damage can change with rarity, weapon level, character stats, critical hits, and upgrades.

## 1. Player and combat basics

- The game currently has 18 selectable wanderers: 3 in each rarity tier.
- The gameplay viewport uses a fixed logical resolution of 1280 × 720 and scales uniformly to fit each display. Any unused space is letterboxed; enemy targeting and weapon hits are limited to enemies visible in this fixed viewport, so changing monitor resolution does not expand the arena or attack reach.
- Default vitality is 100, movement speed is 180 world units/second, and attack interval is 0.72 seconds. A character's stat modifiers are listed below.
- Weapons attack automatically. Weapon inventory is limited to 5 distinct weapons; weapon levels cap at 5.
- Press Space to dash in the current movement direction (or the last facing direction when standing still). A dash lasts 0.16 seconds, moves at 3.2× normal movement speed, grants 0.2 seconds of invulnerability, and has a 1.1-second cooldown.
- A level-up offers up to 3 choices. The first XP threshold is 9; each later threshold is `ceil((previous threshold × 1.4 + 4) × 1.1)`, requiring about 10% more XP per level than the previous curve.
- At a level-up, spending one reroll replaces the offered choices. Skipping a level-up grants 2 rerolls for later level-ups; rerolls reset when a new run begins.
- Weapon level affects its base damage by `1 + 0.12 × weapon level` (so level 1 is ×1.12 and level 5 is ×1.60). Some weapons also improve count, range, or behavior separately.
- General weapon base damage is:

  `base damage = weapon base × current Might × item rarity multiplier × (1 + 0.12 × weapon level) × evolution multiplier`

  Weapon bases are 19 for Magic Wand, 28 for Cross, and 22 for other weapons. Evolved attacks use a ×1.65 evolution multiplier unless their individual behavior below specifies another coefficient.
- Current Might includes character/shop Might and these multiplicative bonuses: Spinach `+7% per effective rank`, Small Gem `+3.5% per effective rank`, Dragon Heart `×1.5`, and Crown of Midas `+1% per 100 gold earned this run`. A Might level-up adds 0.06 to the Might stat; each permanent Manor training rank adds 3% Might.
- Critical hits normally double damage. Critical chance is up to `6% × effective Optic Lens rank + 10% × Precision Gloves rank`, capped at 85%; Starlight Shard has an additional built-in chance.
- Attack interval is reduced by character attack speed, Empty Tome, Tactical Timer, and owning Rusted Dagger. Rusted Dagger applies a ×1.7 attack-speed factor to the shared weapon timer.
- Extra projectiles from Arcane Bandolier and Grand Staff of Duplication are capped at 4 total. The passive rarity multiplier affects effective ranks where the game uses `passivePower`; one-rank effects often use their raw rank.
- Passive levels generally cap at 5. Minor Potion and the listed single-rank passives cannot be levelled.

## 2. Wanderers

All unspecified stats use the default: 100 maximum vitality, 1.0× movement speed, 1.0× attack speed, and 1.0 Might.

| Tier | Wanderer | Starting weapon | Implemented character stat |
|---|---|---|---|
| Common | The Arcanist | Magic Wand | 1.10× attack speed |
| Common | The Duelist | Whip | 1.10× movement speed |
| Common | The Acolyte | Garlic | 120 maximum vitality |
| Uncommon | Gideon | Cross | 1.06× attack speed |
| Uncommon | Moss | King Bible | 110 maximum vitality |
| Uncommon | Vesper | Spiked Rotor | 1.10× movement speed |
| Rare | Valerius | Soul Bind Chain | 110 maximum vitality |
| Rare | Nyx | Soul Flintlock | 1.04× attack speed |
| Rare | Tempest | Lightning Rod | 1.10× movement speed |
| Epic | Lyra | Starlight Shard | 0.95× attack speed |
| Epic | Ignatius | Infernal Flask | 105 maximum vitality |
| Epic | Selene | Solar Discus | 1.05× attack speed |
| Legendary | Aurelia | Holy Wand | 1.15× attack speed |
| Legendary | Draven | Heaven Sword | 1.08× attack speed |
| Legendary | Seraphine | Soul Eater | 120 maximum vitality |
| Mythic | Mimi | Chrono Gear | 1.05× movement speed |
| Mythic | Mortis | Grim Reaper's Scythe | 1.20 Might |
| Mythic | Solara | Armageddon Cannon | 120 maximum vitality |

The “bonus” label shown on some selection cards is descriptive. The implemented stat in this table is authoritative where the two differ.

## 3. Rarity

Rarity is an item's fixed tier, not its upgrade level. The following multiplier is used for weapon damage and effective passive ranks where applicable.

| Tier | Display color | Power multiplier | Base level-up weight |
|---|---|---:|---:|
| Common | White | 1.00× | 50 |
| Uncommon | Green | 1.06× | 25 |
| Rare | Blue | 1.14× | 14 |
| Epic | Purple | 1.23× | 8 |
| Legendary | Yellow | 1.65× | 3 |
| Mythic | Red | 1.95× | 0.6 |

Level-up choices are sampled by tier weight, then by an available item in that tier. Clover and Lucky Coin increase the higher-tier weights. Because tiers may have different numbers of available choices, these weights are not direct per-item probabilities.

### Items by tier

- **Common:** Magic Wand, Whip, Garlic, Hollow Heart, Pummarola, Empty Tome, Spinach, Wings, Might, Magnet, Vitality, Rusted Dagger, Apprentice Wand, Light Armor, Hiking Boots, Minor Potion, Small Gem.
- **Uncommon:** Cross, King Bible, Clover, Spellbinder, Spiked Rotor, Poison Flask, Tactical Timer, Precision Gloves, Magnet Ring, Tome of Area.
- **Rare:** Soul Bind Chain, Iron Plate, Soul Flintlock, Lightning Rod, Arcane Bandolier, Spike Mail, Vampiric Gem, Lucky Coin.
- **Epic:** Starlight Shard, Optic Lens, Infernal Flask, Volatile Oil, Solar Discus, Grave Siphon, Eye of Cataclysm, Venom Master's Seal, Aegis Barrier, Chronos Charm.
- **Legendary:** Cages of Torment, Supernova Prism, Phlogiston Abyss, Bloody Tear, Soul Eater, Holy Wand, Heaven Sword, Unholy Vespers, Temporal Paradox, Dragon Heart, Grand Staff of Duplication, Crown of Midas.
- **Mythic:** Chrono Gear, Hourglass, Grim Reaper's Scythe, Armageddon Cannon, Phoenix Immortal Heart, Soul Reaper's Covenant, Omniscience Eye.

## 4. Weapons and damage behavior

The damage coefficients below multiply the base damage formula in section 1 unless a different formula is stated. Damage is per hit or per hazard tick, not total damage over an effect's full lifetime. Standard automatic firing interval is 0.72 seconds before speed modifiers.

| Weapon | Tier | Implemented attack and damage |
|---|---|---|
| Magic Wand | Common | Homing bolt at nearest foe within 550 units; damage `1.00× base`. Holy Wand range is 760 and bolt speed increases. |
| Whip | Common | Instant horizontal slash, 105 range; hits foes within 30 vertical units for `1.00× base`. Bloody Tear has 155 range, 44 vertical tolerance, and `1.25×` its evolved base per hit. |
| Garlic | Common | Damages all nearby enemies every attack; radius 68, damage `0.48× base`. Soul Eater radius is 100 and restores 0.15 vitality on each attack. |
| Cross | Uncommon | Throws a returning sword at nearest foe within 440; projectile hit deals `1.00× base`. |
| King Bible | Uncommon | Persistent orbiting books deal `10 × current Might` per second-scaled contact (damage is `projectile damage × dt × 3`). Starts with `2 + floor(level/3)` books. Unholy Vespers uses 5 books, a 68-unit orbit, faster rotation, and a ×1.65 evolution damage factor. |
| Soul Bind Chain | Rare | Hits all enemies in range 112 (168 evolved), damage `1.00× base` (1.15× evolved), and heals 2.5% of hit damage (5% evolved). Vampiric hits have a separate 10% chance to restore 0.75 vitality. |
| Starlight Shard | Epic | Homing shot within 760; normal damage `1.00× base`, with built-in critical chance starting at 20%, plus 6% per effective Optic Lens rank and 10% per Precision Gloves rank (capped at 85%). A built-in critical deals 4.4× base damage after the normal critical multiplier. Supernova Prism fires 8 radial piercing stars, each flagged critical: 2.80× its unevolved-form damage formula per hit, with 2 pierces. |
| Infernal Flask | Epic | Throws toward nearest foe within 560; impact creates a 72-radius fire field for 3.8 seconds. Each field tick deals `0.25× projectile damage × (1 + 0.16 × burn stacks)`, applies a slow, and adds burn stacks. Phlogiston Abyss uses radius 105, 12 seconds, and `0.38×` projectile damage per tick, with up to 12 burn stacks. |
| Chrono Gear | Mythic | Directly hits the nearest foe within 520 and slows it. Damage multiplier roll: 7% chance ×4, next 25% ×0.35, next 38% ×1, remaining 30% ×2.1. Temporal Paradox targets within 700, extends slow, and has a 20% stun chance. |
| Rusted Dagger | Common | Straight projectile at nearest foe within 500; `0.72× base`, no pierce. Owning it also raises the shared attack cadence by ×1.7. |
| Apprentice Wand | Common | Homing bolt within 520; `0.80× base`. |
| Spiked Rotor | Uncommon | Creates 3 orbiting blades (plus extra projectiles), each hit `0.72× base`, with a 0.35-second per-target hit cooldown. After 1.8 seconds, blades fly outward. |
| Poison Flask | Uncommon | Throws at a foe within 560; impact leaves an 82-radius poison cloud for 3 seconds. Each field tick deals `0.18× projectile damage × (1 + 0.16 × poison stacks)`, adds poison stacks, and slows. |
| Soul Flintlock | Rare | Straight piercing round within 760; `1.65× base`, pierces up to 6 foes. |
| Lightning Rod | Rare | Instantly strikes 3 random foes (plus extra projectiles), each for `1.25× base`. |
| Solar Discus | Epic | Bouncing disc aimed at a foe within 760; `1.15× base` per hit, with up to 99 arena ricochets and repeat hits after a short cooldown. |
| Grave Siphon | Epic | Creates a 135-radius black hole at a nearby target; pulls foes inward and deals `0.38× base` per 0.42-second tick for 3.5 seconds. |
| Grim Reaper's Scythe | Mythic | Sweeps forward within 270; ordinary enemies have a 0.5% chance per attack to be slain instantly, otherwise each hit deals `1.9× base`. Elites cannot be instantly slain. |
| Armageddon Cannon | Mythic | Every 16 seconds, hits foes within 0.72× the larger viewport dimension; ordinary foes lose 58% of current HP and elites lose 42%. |
| Bloody Tear | Legendary | Evolved Whip; see Whip. Hits can restore vitality through its vampiric proc. |
| Soul Eater | Legendary | Evolved Garlic; see Garlic. |
| Holy Wand | Legendary | Evolved Magic Wand; homing bolt range 760 and the ×1.65 evolution damage multiplier. |
| Heaven Sword | Legendary | Evolved Cross; returning sword behavior and the ×1.65 evolution damage multiplier. |
| Unholy Vespers | Legendary | Evolved King Bible; permanent 5-book orbit, faster rotation, expanded orbit and ×1.65 orbit damage. |
| Cages of Torment | Legendary | Evolved Soul Bind Chain; see chain behavior. |
| Supernova Prism | Legendary | Evolved Starlight Shard; radial piercing-star behavior. |
| Phlogiston Abyss | Legendary | Evolved Infernal Flask; see fire-field behavior. |
| Temporal Paradox | Legendary | Evolved Chrono Gear; see time-control behavior. |

### Evolution pairs

Evolution occurs when a chest is collected while the matching base weapon is level 5 and its paired passive is owned at level 1 or higher. The base weapon is replaced by the evolved weapon, the chest restores 45 vitality, and the evolved item retains the weapon level.

| Base weapon | Required passive | Evolved weapon |
|---|---|---|
| Magic Wand | Empty Tome | Holy Wand |
| Whip | Hollow Heart | Bloody Tear |
| Garlic | Pummarola | Soul Eater |
| Cross | Clover | Heaven Sword |
| King Bible | Spellbinder | Unholy Vespers |
| Soul Bind Chain | Iron Plate | Cages of Torment |
| Starlight Shard | Optic Lens | Supernova Prism |
| Infernal Flask | Volatile Oil | Phlogiston Abyss |
| Chrono Gear | Hourglass | Temporal Paradox |

Several wanderers begin with an evolved weapon. Their paired passive is not automatically granted.

## 5. Passive items and level-up stats

Passive effects below describe implemented behavior. “Rank” is item level; effects that use effective ranks also receive the rarity multiplier described above.

| Item | Tier | Implemented effect |
|---|---|---|
| Hollow Heart | Common | +10% maximum vitality per effective rank. |
| Pummarola | Common | Regenerate 0.15 vitality/second per effective rank. |
| Empty Tome | Common | +8% attack speed per effective rank. |
| Spinach | Common | +7% weapon damage per effective rank. |
| Wings | Common | +8% movement speed per effective rank. |
| Clover | Uncommon | Affects luck and gold: +10% gold per effective rank; contributes luck to higher rarity level-up chances. |
| Spellbinder | Uncommon | Extends selected weapon ranges/durations; adds range to Garlic, chain, and book orbit. |
| Iron Plate | Rare | Reduces incoming damage by 7% per effective rank, with damage reduction capped by a 0.45 multiplier floor. |
| Optic Lens | Epic | +6% critical chance and +60 range per effective rank where those bonuses apply. |
| Volatile Oil | Epic | Fire fields last 20% longer per rank. |
| Hourglass | Mythic | Adds 0.35 seconds of slow per effective rank to Chrono Gear. |
| Light Armor | Common | Reduces incoming contact damage by 1 per rank. |
| Hiking Boots | Common | +5% movement speed per rank. |
| Minor Potion | Common | One-time pickup: restore 15 vitality; only offered when injured. |
| Small Gem | Common | +3.5% weapon damage per effective rank. |
| Tactical Timer | Uncommon | Reduces weapon interval by 8% per rank, to a minimum 35% of the original interval. |
| Precision Gloves | Uncommon | +10% critical chance per rank. |
| Magnet Ring | Uncommon | +30% experience-gem collection range per rank. |
| Tome of Area | Uncommon | +15% area/radius to supported area effects per effective rank. |
| Arcane Bandolier | Rare | +1 projectile; counted toward the shared maximum of 4 extra projectiles. |
| Spike Mail | Rare | +3 armor per rank; when hit, damages nearby enemies within 105 units for the incoming damage amount. |
| Vampiric Gem | Rare | Each weapon hit has a 3% chance per rank to restore 1 vitality. |
| Lucky Coin | Rare | +20% luck per rank for higher-tier level-up choices. |
| Eye of Cataclysm | Epic | Critical hits cause an area blast with radius `78 × (1 + 0.15 × effective Tome of Area rank)`; nearby enemies take 42% of the critical hit damage. |
| Venom Master's Seal | Epic | Burn/poison ticks happen faster; burning/poisoned enemy deaths spread the current status stacks to foes within 105 units. |
| Aegis Barrier | Epic | Blocks one incoming hit; recharges every 15 seconds. |
| Chronos Charm | Epic | Below 30% vitality, stuns all current foes for 3 seconds; 60-second cooldown. |
| Dragon Heart | Legendary | ×1.5 damage and, every 2 seconds, damages foes within 145 units and applies burn. |
| Grand Staff of Duplication | Legendary | +2 projectiles, subject to the shared cap. |
| Crown of Midas | Legendary | Every 100 gold earned in the current run adds +1% damage for that run. |
| Phoenix Immortal Heart | Mythic | Once per run, revives at full vitality, grants 5 seconds of invulnerability, and kills ordinary enemies on screen. |
| Soul Reaper's Covenant | Mythic | Each weapon hit has a 1% chance to instantly slay a non-elite enemy; each kill grants +1 maximum vitality. |
| Omniscience Eye | Mythic | Forces critical hits; eligible non-sword projectiles ricochet up to 3 times. |
| Might | Common stat choice | Adds 0.06 to the run's Might stat. |
| Magnet | Common stat choice | Adds 0.45 to the run's gem-attraction stat. |
| Vitality | Common stat choice | Adds 5 maximum vitality and restores 30 vitality. |

## 6. Monsters

Base speeds are world units/second. Contact damage is the raw damage before player armor and the 0.3-second contact-damage interval.

| Monster | Shape | Base HP | Speed | Contact damage | XP | Gold |
|---|---|---:|---:|---:|---:|---:|
| Hollow | Circle | 34 | 42 | 9 | 1 | 1 |
| Imp | Triangle | 26 | 67 | 8 | 1 | 1 |
| Crypt Knight | Square | 95 | 26 | 17 | 3 | 4 |
| Wraith | Diamond | 48 | 50 | 12 | 2 | 2 |
| Mimic | Hexagon | 145 | 29 | 21 | 6 | 10 |
| Hexer | Hexagon | 68 | 31 | 15 | 3 | 3 |
| Ravager | Triangle | 82 | 39 | 18 | 4 | 4 |
| Red Death | Circle | 100,000 before spawn scaling | 115 before spawn scaling | 9,999 before elite scaling | 50 before elite scaling | 100 before elite scaling |

### Enemy scaling and special spawns

- Normal enemy HP is `base HP × (1 + elapsed seconds / 400 + (elapsed seconds / 820)²)`. This makes enemy health grow more quickly in the late game: about 3.03× at 10 minutes, 6.14× at 20 minutes, and 10.32× at 30 minutes.
- Normal movement speed is `base speed × (1 + elapsed seconds / 1800)` (about 1.33× at 10 minutes and 2× at 30 minutes).
- Enemy contact damage also scales with time: `base damage × (1 + elapsed seconds / 1200)` (1.5× at 10 minutes and 2.5× at 30 minutes).
- Elite enemies receive a further `+0.6` in the HP multiplier, 1.8× radius, 1.5× contact damage, and 12× XP and gold.
- At 10:00, an elite Mimic guardian spawns with 4× the already-scaled elite HP. Defeating an elite creates a treasure chest.
- A wave begins every 2 minutes. It includes up to `min(84, 32 + 6 × wave number)` regular enemies and one elite Mimic captain, without exceeding the 180-enemy field limit. If there is only room for regular wave enemies, the captain is skipped. The captain has an extra HP multiplier of `1.4 + 0.15 × wave number`. The wave also increases regular spawn frequency for 24 seconds.
- Regular spawn interval is half its previous value and shortens with elapsed time, down to a base minimum interval of 0.11 seconds (0.1265 seconds during the wave-frequency modifier). After 1:30, each spawn has an increasing chance of producing a second enemy (capped at 65%). The 180-enemy field limit remains in effect, so actual numbers may be lower when the field is full.
- Hexers begin appearing after 4:00. They stop at range and mark the player's current location with a visible danger circle; after 0.95 seconds, the area deals 1.2× their scaled contact damage. Ravagers appear after 6:00; they telegraph a straight charge for 0.72 seconds, then rush along the indicated direction.
- At 30:00, Red Death spawns as an elite. Applying the elapsed-time/elite scaling to its base values gives approximately 935,000 HP, 230 speed, 37,500 contact damage, 600 XP, and 1,200 gold at that moment.
- Standard contact hits are reduced by Light Armor, Spike Mail armor, and Iron Plate; at least 1 damage is taken when the hit is not blocked by Aegis.
- Contact and telegraphed enemy attacks share the same armor, Aegis, invulnerability, and revival rules.
- Slow makes enemies move at 42% speed; stun stops movement.

## 7. Environment, pickups, and run end

- Experience gems are dropped on enemy defeat and pulled toward the player within collection range. Magnet increases attraction; Magnet Ring multiplies pickup range.
- Enemy gold is paid on defeat. Clover increases the gold payout.
- Elite enemies drop a treasure chest. Multiple dropped chests are queued rather than replacing one another. If an eligible evolution is available it evolves and restores 45 vitality; otherwise the chest awards 25 gold (plus Clover bonus) and restores 35 vitality.
- Contact damage cooldown is updated once per game frame rather than once per overlapping enemy. After a hit, 0.35 seconds of invulnerability limits contact damage to at most one hit per 0.35 seconds, regardless of how many enemies overlap the player.
- Standard run duration is 30 minutes. Red Death appears at that time. The run can end earlier if vitality reaches zero and no Phoenix Immortal Heart revive remains.
- Passive damage-over-time: burn deals `1.4 × burn stacks × current Might` every 0.55 seconds; poison deals `0.8 × poison stacks × current Might` every 0.5 seconds. Venom Master's Seal increases their tick rates.

## 8. Notes about implementation values

- Weapon base damage is a shared formula, while each weapon applies its own coefficient, target rules, and effect duration. Therefore the table is not a single fixed damage value for every run.
- Player power growth has been reduced for Common through Epic: rarity multipliers are 1.00×, 1.06×, 1.14× and 1.23×. Legendary and Mythic retain stronger endgame power at 1.65× and 1.95×. Weapon-level damage rises by 12% per level, Might level-ups add 6%, and the later XP threshold grows by 10% over the previous curve. Enemy base HP and its time-scaling curve have also been raised, so basic enemies take more than one hit to defeat from the start and continue gaining durability later.
- Weapon rarity and evolution damage have been tuned down to make damage progression less explosive. Grim Reaper's Scythe damage is reduced to 1.9× base per regular hit; Soul Bind Chain life-steal is 2.5% of damage (5% evolved) plus a separate 10% chance per vampiric hit to restore 0.75 vitality; Armageddon Cannon fires every 16 seconds and deals 58% of current HP to ordinary foes and 42% to elites rather than instantly defeating them.
- Evolved weapons are not ordinary level-up weapon choices; they are produced by chest evolution. Some Legendary wanderers start with an evolved weapon.
- Item rarity multipliers are applied where the implementation calls `itemPower`/`passivePower`; not every effect uses rarity scaling in the same way.
- Some rarity-tier weighting and item descriptions are presentation-level systems; gameplay behavior is determined by the implemented rules summarized above.
- This guide reflects the current solo web build and does not describe unimplemented modes or content.
