
    (() => {
      "use strict";

      const canvas = document.getElementById("arena");
      const ctx = canvas.getContext("2d");
      const $ = (id) => document.getElementById(id);
      const STORE_KEY = "nightfall-survivors-save-v1";
      const GAME_WIDTH = 1280;
      const GAME_HEIGHT = 720;
      const characters = [
        { id: "arcanist", name: "The Arcanist", rarity: "Common", weapon: "Magic Wand", icon: "✦", description: "A scholar of forbidden stars.", bonus: "+10% attack speed", stats: { attackSpeed: 1.1 } },
        { id: "duelist", name: "The Duelist", rarity: "Common", weapon: "Whip", icon: "⚔", description: "A swift blade in the dark.", bonus: "+10% movement speed", stats: { moveSpeed: 1.1 } },
        { id: "acolyte", name: "The Acolyte", rarity: "Common", weapon: "Garlic", icon: "☼", description: "A steadfast keeper of wards.", bonus: "+20 maximum vitality", stats: { maxHp: 120 } },
        { id: "gideon", name: "Gideon", rarity: "Uncommon", weapon: "Cross", icon: "✣", description: "A pilgrim whose sacred blades find their mark.", bonus: "+6% attack speed", stats: { attackSpeed: 1.06 } },
        { id: "moss", name: "Moss", rarity: "Uncommon", weapon: "King Bible", icon: "❖", description: "A hedge mystic guarded by circling pages.", bonus: "+10% maximum vitality", stats: { maxHp: 110 } },
        { id: "vesper", name: "Vesper", rarity: "Uncommon", weapon: "Spiked Rotor", icon: "✥", description: "A wandering duelist with a storm of steel.", bonus: "+10% movement speed", stats: { moveSpeed: 1.1 } },
        { id: "valerius", name: "Valerius", rarity: "Rare", weapon: "Soul Bind Chain", icon: "⛓", description: "A condemned knight who binds the restless dead.", bonus: "Chain sweep · life-steal", stats: { maxHp: 110 } },
        { id: "nyx", name: "Nyx", rarity: "Rare", weapon: "Soul Flintlock", icon: "◉", description: "A silent hunter firing rounds through the dark.", bonus: "+4% attack speed", stats: { attackSpeed: 1.04 } },
        { id: "tempest", name: "Tempest", rarity: "Rare", weapon: "Lightning Rod", icon: "ϟ", description: "A stormcaller who commands the thunder.", bonus: "+10% movement speed", stats: { moveSpeed: 1.1 } },
        { id: "lyra", name: "Lyra", rarity: "Epic", weapon: "Starlight Shard", icon: "✧", description: "An astral huntress who never misses twice.", bonus: "Long range · critical hits", stats: { attackSpeed: .95 } },
        { id: "ignatius", name: "Ignatius", rarity: "Epic", weapon: "Infernal Flask", icon: "♨", description: "An alchemist carrying a furnace in a bottle.", bonus: "Burning fields · enemy slow", stats: { maxHp: 105 } },
        { id: "selene", name: "Selene", rarity: "Epic", weapon: "Solar Discus", icon: "☼", description: "A moonlit champion whose sun-disc ricochets through foes.", bonus: "+15% area damage", stats: { attackSpeed: 1.05 } },
        { id: "mimi", name: "Mimi", rarity: "Mythic", weapon: "Chrono Gear", icon: "◷", description: "A curious clockmaker with unreliable luck.", bonus: "Time control · random damage", stats: { moveSpeed: 1.05 } },
        { id: "aurelia", name: "Aurelia", rarity: "Legendary", weapon: "Holy Wand", icon: "✧", description: "A radiant oracle whose spell never rests.", bonus: "+15% attack speed", stats: { attackSpeed: 1.15 } },
        { id: "draven", name: "Draven", rarity: "Legendary", weapon: "Heaven Sword", icon: "⚔", description: "A fallen champion wielding a blade of judgment.", bonus: "+8% attack speed", stats: { attackSpeed: 1.08 } },
        { id: "seraphine", name: "Seraphine", rarity: "Legendary", weapon: "Soul Eater", icon: "☼", description: "A saint whose endless aura drains the horde.", bonus: "+20 maximum vitality", stats: { maxHp: 120 } },
        { id: "mortis", name: "Mortis", rarity: "Mythic", weapon: "Grim Reaper's Scythe", icon: "☠", description: "An avatar of endings, sweeping whole ranks aside.", bonus: "+20% weapon might", stats: { might: 1.2 } },
        { id: "solara", name: "Solara", rarity: "Mythic", weapon: "Armageddon Cannon", icon: "☄", description: "A star-forged artillery master calling down ruin.", bonus: "+20% maximum vitality", stats: { maxHp: 120 } }
      ];
      const retiredCharacterNames = new Map([
        ["rook", "Rook"], ["piper", "Piper"], ["briar", "Sister Briar"],
        ["bastion", "Bastion"], ["graveborn", "Graveborn"], ["noctis", "Noctis"], ["oracle", "The Oracle"]
      ]);
      const weaponData = {
        "Magic Wand": { icon: "✦", desc: "Fires a seeking bolt at the nearest foe.", evolution: "Holy Wand", passive: "Empty Tome", color: "#8be7f5" },
        "Whip": { icon: "〰", desc: "Strikes enemies in a wide horizontal arc.", evolution: "Bloody Tear", passive: "Hollow Heart", color: "#f2e0bc" },
        "Garlic": { icon: "☼", desc: "Damages and repels nearby enemies.", evolution: "Soul Eater", passive: "Pummarola", color: "#ded7a3" },
        "Cross": { icon: "✣", desc: "Hurls a returning cross at a nearby enemy.", evolution: "Heaven Sword", passive: "Clover", color: "#eee0b8" },
        "King Bible": { icon: "❖", desc: "Summons a book that circles around you.", evolution: "Unholy Vespers", passive: "Spellbinder", color: "#c3a8ed" },
        "Soul Bind Chain": { icon: "⛓", desc: "Sweeps a cursed chain around you and steals vitality.", evolution: "Cages of Torment", passive: "Iron Plate", color: "#b4a2a0" },
        "Starlight Shard": { icon: "✧", desc: "Snipes the farthest threat with a chance to critically strike.", evolution: "Supernova Prism", passive: "Optic Lens", color: "#9cdfff" },
        "Infernal Flask": { icon: "♨", desc: "Shatters into a burning, slowing pool that stacks fire.", evolution: "Phlogiston Abyss", passive: "Volatile Oil", color: "#ff9a56" },
        "Chrono Gear": { icon: "◷", desc: "Deals unpredictable damage and briefly slows its target.", evolution: "Temporal Paradox", passive: "Hourglass", color: "#a9a1ff" },
        "Rusted Dagger": { icon: "†", desc: "Throws a rapid, straight dagger at the nearest foe.", color: "#ded2b4" },
        "Apprentice Wand": { icon: "✦", desc: "Fires a small seeking arcane bolt at the nearest foe.", color: "#8be7f5" },
        "Spiked Rotor": { icon: "✥", desc: "Unleashes spinning blades that orbit and then sweep outward.", color: "#91d69b" },
        "Poison Flask": { icon: "☠", desc: "Throws a flask that leaves a damaging poison cloud for 3 seconds.", color: "#86d46f" },
        "Soul Flintlock": { icon: "◉", desc: "Fires a large soul round that pierces through foes in a line.", color: "#72c9ff" },
        "Lightning Rod": { icon: "ϟ", desc: "Calls lightning down on three random enemies at once.", color: "#81caff" },
        "Solar Discus": { icon: "◉", desc: "Sends a blazing disc ricocheting across the arena.", color: "#c18aff" },
        "Grave Siphon": { icon: "◉", desc: "Creates a black hole that pulls nearby enemies inward and damages them.", color: "#bd8dff" },
        "Grim Reaper's Scythe": { icon: "☠", desc: "Sweeps a huge arc; ordinary enemies have a 0.5% chance to be slain instantly.", color: "#ff7385" },
        "Armageddon Cannon": { icon: "☄", desc: "Calls down a screen-shaking meteor that devastates the arena.", color: "#ff755f" }
      };
      const passiveData = {
        "Hollow Heart": { icon: "♡", desc: "Increase maximum vitality by 10% per rank." },
        "Pummarola": { icon: "❀", desc: "Regenerate 0.15 vitality per second per rank." },
        "Empty Tome": { icon: "⌛", desc: "Increase attack speed by 8% per rank." },
        "Spinach": { icon: "♜", desc: "Increase weapon damage by 7% per rank." },
        "Wings": { icon: "➤", desc: "Move 8% faster per rank." },
        "Clover": { icon: "☘", desc: "Increase luck and treasure quality." },
        "Spellbinder": { icon: "⌘", desc: "Extend weapon duration and reach." },
        "Iron Plate": { icon: "▣", desc: "Reduce incoming damage by 7% per rank." },
        "Optic Lens": { icon: "◎", desc: "Gain 6% critical chance and 60 range per rank." },
        "Volatile Oil": { icon: "♨", desc: "Burning fields last 20% longer per rank." },
        "Hourglass": { icon: "⌛", desc: "Chrono Gear slows targets for longer." },
        "Light Armor": { icon: "▣", desc: "Reduce incoming damage by 1 per hit." },
        "Hiking Boots": { icon: "➤", desc: "Move 5% faster per rank." },
        "Minor Potion": { icon: "🧪", desc: "Instantly restore 15 vitality." },
        "Small Gem": { icon: "✹", desc: "Increase all weapon damage by 3.5% per rank." },
        "Tactical Timer": { icon: "◷", desc: "Reduce all weapon cooldowns by 8% per rank." },
        "Precision Gloves": { icon: "✣", desc: "Gain 10% critical chance per rank." },
        "Magnet Ring": { icon: "⊙", desc: "Increase experience gem pickup range by 30% per rank." },
        "Tome of Area": { icon: "⌘", desc: "Increase area weapon effects by 15% per rank." },
        "Arcane Bandolier": { icon: "➹", desc: "Add 1 projectile to each weapon attack." },
        "Spike Mail": { icon: "▣", desc: "Gain 3 armor and reflect damage to nearby enemies when hit." },
        "Vampiric Gem": { icon: "♦", desc: "Weapon hits have a 3% chance to restore 1 vitality." },
        "Lucky Coin": { icon: "♧", desc: "Increase luck by 20%, improving high-rarity level-up odds." },
        "Eye of Cataclysm": { icon: "◉", desc: "Critical hits erupt in a damaging energy burst." },
        "Venom Master's Seal": { icon: "☠", desc: "Burning damage ticks twice as fast and spreads when foes die." },
        "Aegis Barrier": { icon: "⬡", desc: "Block one hit every 15 seconds." },
        "Chronos Charm": { icon: "⌛", desc: "Below 30% vitality, freeze all foes for 3 seconds (60-second cooldown)." },
        "Dragon Heart": { icon: "♥", desc: "Deal 50% more damage and burn nearby foes every 2 seconds." },
        "Grand Staff of Duplication": { icon: "✦", desc: "Add 2 projectiles to each weapon attack." },
        "Crown of Midas": { icon: "♛", desc: "Every 100 gold grants 1% more damage for this run." },
        "Phoenix Immortal Heart": { icon: "♥", desc: "Once per run, revive at full vitality and become invulnerable for 5 seconds." },
        "Soul Reaper's Covenant": { icon: "☠", desc: "Weapon hits have a 1% chance to slay ordinary foes; kills grant 1 max vitality." },
        "Omniscience Eye": { icon: "◎", desc: "All weapons critically strike; projectiles ricochet up to 3 times." }
      };
      const singleRankPassives = new Set([
        "Minor Potion", "Arcane Bandolier", "Spike Mail", "Vampiric Gem", "Lucky Coin",
        "Eye of Cataclysm", "Venom Master's Seal", "Aegis Barrier", "Chronos Charm",
        "Dragon Heart", "Grand Staff of Duplication", "Crown of Midas",
        "Phoenix Immortal Heart", "Soul Reaper's Covenant", "Omniscience Eye"
      ]);
      const evolutionData = {
        "Bloody Tear": { weapon: "Whip", passive: "Hollow Heart", icon: "♥", desc: "A vampiric lash that restores vitality." },
        "Soul Eater": { weapon: "Garlic", passive: "Pummarola", icon: "☼", desc: "A vast, life-draining ward." },
        "Holy Wand": { weapon: "Magic Wand", passive: "Empty Tome", icon: "✧", desc: "An instant, relentless stream of bolts." },
        "Heaven Sword": { weapon: "Cross", passive: "Clover", icon: "⚔", desc: "A heavy sword with a chance to strike twice." },
        "Unholy Vespers": { weapon: "King Bible", passive: "Spellbinder", icon: "❖", desc: "A permanent, faster orbit of sacred books." },
        "Cages of Torment": { weapon: "Soul Bind Chain", passive: "Iron Plate", icon: "⛓", desc: "A vast chain prison that lashes and drains every nearby foe." },
        "Supernova Prism": { weapon: "Starlight Shard", passive: "Optic Lens", icon: "✧", desc: "A piercing star beam with devastating critical hits." },
        "Phlogiston Abyss": { weapon: "Infernal Flask", passive: "Volatile Oil", icon: "♨", desc: "A lingering inferno that stacks searing damage." },
        "Temporal Paradox": { weapon: "Chrono Gear", passive: "Hourglass", icon: "◷", desc: "A time fracture that freezes and randomly annihilates foes." }
      };
      const rarityTiers = [
        { name: "Common", className: "white", power: 1, weight: 50 },
        { name: "Uncommon", className: "green", power: 1.06, weight: 25 },
        { name: "Rare", className: "blue", power: 1.14, weight: 14 },
        { name: "Epic", className: "purple", power: 1.23, weight: 8 },
        { name: "Legendary", className: "yellow", power: 1.65, weight: 3 },
        { name: "Mythic", className: "red", power: 1.95, weight: .6 }
      ];
      const itemRarity = {
        "Magic Wand": "Common", "Whip": "Common", "Garlic": "Common",
        "Hollow Heart": "Common", "Pummarola": "Common", "Empty Tome": "Common",
        "Spinach": "Common", "Wings": "Common", "Might": "Common",
        "Magnet": "Common", "Vitality": "Common",
        "Rusted Dagger": "Common", "Apprentice Wand": "Common", "Light Armor": "Common",
        "Hiking Boots": "Common", "Minor Potion": "Common", "Small Gem": "Common",
        "Cross": "Uncommon", "King Bible": "Uncommon", "Clover": "Uncommon",
        "Spellbinder": "Uncommon", "Spiked Rotor": "Uncommon", "Poison Flask": "Uncommon",
        "Tactical Timer": "Uncommon", "Precision Gloves": "Uncommon", "Magnet Ring": "Uncommon", "Tome of Area": "Uncommon",
        "Soul Bind Chain": "Rare", "Iron Plate": "Rare",
        "Soul Flintlock": "Rare", "Lightning Rod": "Rare", "Arcane Bandolier": "Rare",
        "Spike Mail": "Rare", "Vampiric Gem": "Rare", "Lucky Coin": "Rare",
        "Starlight Shard": "Epic", "Optic Lens": "Epic",
        "Infernal Flask": "Epic", "Volatile Oil": "Epic",
        "Solar Discus": "Epic", "Grave Siphon": "Epic", "Eye of Cataclysm": "Epic",
        "Venom Master's Seal": "Epic", "Aegis Barrier": "Epic", "Chronos Charm": "Epic",
        "Cages of Torment": "Legendary", "Supernova Prism": "Legendary", "Phlogiston Abyss": "Legendary",
        "Bloody Tear": "Legendary", "Soul Eater": "Legendary", "Holy Wand": "Legendary",
        "Heaven Sword": "Legendary", "Unholy Vespers": "Legendary", "Temporal Paradox": "Legendary",
        "Dragon Heart": "Legendary", "Grand Staff of Duplication": "Legendary", "Crown of Midas": "Legendary",
        "Chrono Gear": "Mythic", "Hourglass": "Mythic",
        "Grim Reaper's Scythe": "Mythic", "Armageddon Cannon": "Mythic",
        "Phoenix Immortal Heart": "Mythic", "Soul Reaper's Covenant": "Mythic", "Omniscience Eye": "Mythic"
      };
      function rarityForItem(name) {
        return rarityTiers.find((tier) => tier.name === itemRarity[name]) || rarityTiers[0];
      }
      function itemPower(name) {
        return rarityForItem(name).power;
      }
      function nextXpThreshold(currentThreshold) {
        return Math.ceil((currentThreshold * 1.4 + 4) * 1.1);
      }
      const enemyTypes = [
        { name: "Hollow", shape: "circle", color: "#8b5b86", hp: 34, speed: 42, radius: 11, damage: 9, xp: 1, gold: 1 },
        { name: "Imp", shape: "triangle", color: "#d26751", hp: 26, speed: 67, radius: 9, damage: 8, xp: 1, gold: 1 },
        { name: "Crypt Knight", shape: "square", color: "#87909c", hp: 95, speed: 26, radius: 15, damage: 17, xp: 3, gold: 4 },
        { name: "Wraith", shape: "diamond", color: "#58b8c2", hp: 48, speed: 50, radius: 11, damage: 12, xp: 2, gold: 2 },
        { name: "Mimic", shape: "hex", color: "#c49b49", hp: 145, speed: 29, radius: 17, damage: 21, xp: 6, gold: 10 },
        { name: "Hexer", shape: "hex", color: "#a76ddd", hp: 68, speed: 31, radius: 13, damage: 15, xp: 3, gold: 3, behavior: "caster" },
        { name: "Ravager", shape: "triangle", color: "#e05c47", hp: 82, speed: 39, radius: 14, damage: 18, xp: 4, gold: 4, behavior: "charger" }
      ];
      const upgradePool = [
        ...Object.keys(weaponData).map((name) => ({ type: "weapon", name, ...weaponData[name] })),
        ...Object.keys(passiveData).map((name) => ({ type: "passive", name, ...passiveData[name] })),
        { type: "stat", name: "Might", icon: "✹", desc: "Increase all weapon damage by 6%." },
        { type: "stat", name: "Magnet", icon: "⊙", desc: "Draw experience gems from farther away." },
        { type: "stat", name: "Vitality", icon: "♥", desc: "Restore 30 vitality and increase max vitality by 5." }
      ];
      const state = {
        mode: "menu", selected: "arcanist", player: null, enemies: [], projectiles: [], gems: [], particles: [], slashes: [], hazards: [], enemyAttacks: [], hitTexts: [],
        time: 0, kills: 0, gold: 0, totalGold: 0, level: 1, xp: 0, xpNext: 9, rerolls: 0,
        inventory: {}, passives: {}, might: 1, magnet: 1, moveSpeed: 180,
        spawnTimer: 0, attackTimer: 0, damageTimer: 0, guardianSpawned: false, bossDefeated: false, redDeathSpawned: false,
        chest: null, chestQueue: [], keys: {}, lastFrame: 0, shopLevel: 0, history: [],
        wave: 0, nextWaveAt: 120, waveEndAt: 0, runRecorded: false, nextEnemyId: 1,
        passiveTimers: {}, totalGoldEarned: 0, weaponCooldowns: {},
        dashRequested: false, dashCooldown: 0, dashTime: 0, dashDx: 0, dashDy: 0
      };

      function loadSave() {
        try {
          const data = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
          state.totalGold = Number.isFinite(data.gold) ? data.gold : 0;
          state.shopLevel = Number.isInteger(data.shopLevel) ? data.shopLevel : 0;
          state.history = Array.isArray(data.history) ? data.history.filter((run) =>
            run && typeof run.date === "string" &&
            (characters.some((character) => character.id === run.character) || retiredCharacterNames.has(run.character)) &&
            ["Victory", "Defeat", "Abandoned"].includes(run.outcome) &&
            Number.isFinite(run.time) && Number.isFinite(run.kills) &&
            Number.isFinite(run.gold) && Number.isFinite(run.level)
          ).slice(0, 20) : [];
        } catch (error) {
          console.warn("Could not read saved game progress:", error);
        }
      }
      function save() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify({ gold: state.totalGold, shopLevel: state.shopLevel, history: state.history })); }
        catch (error) { console.warn("Could not save game progress:", error); }
      }
      function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(innerWidth * ratio);
        canvas.height = Math.round(innerHeight * ratio);
        canvas.style.width = innerWidth + "px";
        canvas.style.height = innerHeight + "px";
        const scale = Math.min(innerWidth / GAME_WIDTH, innerHeight / GAME_HEIGHT);
        const offsetX = (innerWidth - GAME_WIDTH * scale) / 2;
        const offsetY = (innerHeight - GAME_HEIGHT * scale) / 2;
        const gameElement = $("game");
        gameElement.style.setProperty("--viewport-left", offsetX + "px");
        gameElement.style.setProperty("--viewport-top", offsetY + "px");
        gameElement.style.setProperty("--viewport-scale", scale);
        gameElement.style.setProperty("--viewport-center-x", offsetX + GAME_WIDTH / 2 * scale + "px");
        gameElement.style.setProperty("--viewport-toast-top", offsetY + 120 * scale + "px");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#000";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(ratio * scale, 0, 0, ratio * scale, ratio * offsetX, ratio * offsetY);
      }
      function formatTime(seconds) {
        const total = Math.floor(seconds);
        return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
      }
      function setOverlay(id) {
        document.querySelectorAll(".overlay").forEach((element) => element.classList.add("hidden"));
        if (id) $(id).classList.remove("hidden");
      }
      function showHud(show) {
        $("hud").classList.toggle("hidden", !show);
        $("hud-bottom").classList.toggle("hidden", !show);
      }
      function showModeScreen() {
        $("mode-screen").classList.remove("hidden");
        $("character-screen").classList.add("hidden");
        $("character-confirm").classList.add("hidden");
      }
      function showCharacterScreen() {
        $("mode-screen").classList.add("hidden");
        $("character-screen").classList.remove("hidden");
        $("character-confirm").classList.add("hidden");
      }
      function confirmCharacter() {
        const character = characters.find((item) => item.id === state.selected);
        $("confirm-character-message").textContent = `Will you play as ${character.name}?`;
        $("character-confirm").classList.remove("hidden");
      }
      function updateMenu() {
        $("lifetime-gold").textContent = state.totalGold;
        $("lifetime-gold-characters").textContent = state.totalGold;
        $("character-grid").innerHTML = rarityTiers.map((tier) => {
          const tierCharacters = characters.filter((character) => character.rarity === tier.name);
          if (!tierCharacters.length) return "";
          return `<section class="character-tier rarity-${tier.className}">
            <h3 class="character-tier-heading"><span>${tier.name} Tier</span><small>${tierCharacters.length} wanderers</small></h3>
            <div class="character-tier-grid">${tierCharacters.map((character) => `
              <button class="character-card ${state.selected === character.id ? "selected" : ""}" data-character="${character.id}">
                <canvas class="character-icon" width="80" height="80" data-skin="${character.id}" aria-label="${character.name} skin"></canvas>
                <strong>${character.name}</strong>
                <small>${character.description}</small>
                <span class="card-meta"><span class="character-tier-label">${tier.name}</span><br>Starts with ${character.weapon}<br>${character.bonus}</span>
              </button>`).join("")}</div>
          </section>`;
        }).join("");
        document.querySelectorAll("[data-character]").forEach((button) => {
          button.addEventListener("click", () => {
            state.selected = button.dataset.character;
            confirmCharacter();
          });
        });
        document.querySelectorAll("[data-skin]").forEach((preview) => {
          drawCharacterSkin(preview.getContext("2d"), preview.width / 2, preview.height / 2 + 4, 64, preview.dataset.skin);
        });
        const cost = 20 + state.shopLevel * 25;
        $("shop").innerHTML = `
          <div class="shop-row">
            <div><strong>Manor training · +3% weapon might</strong><small>Permanent bonus · Rank ${state.shopLevel}</small></div>
            <button class="shop-button" id="buy-upgrade" ${state.totalGold < cost || state.shopLevel >= 10 ? "disabled" : ""}>${state.shopLevel >= 10 ? "MAX RANK" : "Buy · " + cost + " gold"}</button>
          </div>`;
        $("buy-upgrade").addEventListener("click", () => {
          if (state.totalGold < cost || state.shopLevel >= 10) return;
          state.totalGold -= cost;
          state.shopLevel++;
          save();
          updateMenu();
        });
      }
      function showHistory() {
        $("history-summary").textContent = state.history.length ? `${state.history.length} recent runs` : "";
        $("history-list").innerHTML = state.history.length ? state.history.map((run) => {
          const character = characters.find((item) => item.id === run.character);
          const date = new Date(run.date);
          const dateLabel = Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
          return `<div class="history-row">
            <div><strong>${character ? character.name : retiredCharacterNames.get(run.character) || "Unknown Wanderer"}</strong><small>${dateLabel}</small></div>
            <div><strong>${run.outcome === "Victory" ? "Victory" : run.outcome === "Abandoned" ? "Abandoned" : "Defeat"}</strong><small>Level ${run.level || 1}</small></div>
            <div class="history-stat">${formatTime(run.time || 0)}<small>Time</small></div>
            <div class="history-stat">${run.kills || 0}<small>Slain</small></div>
            <div class="history-stat">${run.gold || 0}<small>Gold</small></div>
          </div>`;
        }).join("") : '<div class="history-empty">No runs recorded yet. Your first attempt awaits.</div>';
        setOverlay("history-overlay");
      }
      function startGame() {
        const character = characters.find((item) => item.id === state.selected);
        canvas.focus({ preventScroll: true });
        const maxHp = (character.stats.maxHp || 100);
        state.mode = "running";
        state.player = {
          x: 0, y: 0, radius: 12, hp: maxHp, maxHp, baseMaxHp: maxHp, bonusMaxHp: 0,
          skinId: character.id,
          moveSpeed: state.moveSpeed * (character.stats.moveSpeed || 1),
          attackSpeed: character.stats.attackSpeed || 1,
          invulnerable: 0, facing: 1
        };
        state.inventory = { [character.weapon]: 1 };
        $("active-character-label").textContent = character.name;
        state.passives = {};
        state.enemies = [];
        state.projectiles = [];
        state.gems = [];
        state.particles = [];
        state.slashes = [];
        state.hazards = [];
        state.enemyAttacks = [];
        state.hitTexts = [];
        state.time = 0;
        state.kills = 0;
        state.gold = 0;
        state.level = 1;
        state.xp = 0;
        state.xpNext = 9;
        state.rerolls = 0;
        state.might = (character.stats.might || 1) + state.shopLevel * .03;
        state.magnet = 1;
        state.passiveTimers = {};
        state.totalGoldEarned = 0;
        state.midasGoldRank = 0;
        state.midasDamageBonus = 0;
        state.revived = false;
        state.weaponCooldowns = {};
        state.dashRequested = false;
        state.dashCooldown = 0;
        state.dashTime = 0;
        state.dashDx = 0;
        state.dashDy = 0;
        state.spawnTimer = .5;
        state.attackTimer = 0;
        state.damageTimer = 0;
        state.guardianSpawned = false;
        state.bossDefeated = false;
        state.redDeathSpawned = false;
        state.wave = 0;
        state.nextWaveAt = 120;
        state.waveEndAt = 0;
        state.runRecorded = false;
        state.nextEnemyId = 1;
        state.chest = null;
        state.chestQueue = [];
        state.keys = {};
        showHud(true);
        setOverlay(null);
        toast("Survive the night. Your weapons strike on their own.");
        updateHud();
        state.lastFrame = performance.now();
      }
      function addEnemy(x, y, type, elite) {
        const elapsed = state.time;
        const scale = 1 + elapsed / 400 + (elapsed / 820) ** 2 + (elite ? .6 : 0);
        state.enemies.push({
          id: state.nextEnemyId++, x, y, type, hp: type.hp * scale, maxHp: type.hp * scale,
          speed: type.speed * (1 + elapsed / 1800), radius: type.radius * (elite ? 1.8 : 1),
          damage: type.damage * (1 + elapsed / 1200) * (elite ? 1.5 : 1), xp: type.xp * (elite ? 12 : 1),
          gold: type.gold * (elite ? 12 : 1), elite: !!elite, hitFlash: 0,
          attackCooldown: 2 + Math.random() * 2, chargeWindup: 0, chargeTime: 0, chargeDx: 0, chargeDy: 0,
          slowTimer: 0, stunTimer: 0,           burnTimer: 0, burnStacks: 0, burnTick: 0, poisonTimer: 0, poisonStacks: 0, poisonTick: 0
        });
      }
      function spawnEnemy() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(GAME_WIDTH, GAME_HEIGHT) * .62 + 50;
        const roll = Math.random();
        let index = roll < .47 ? 0 : roll < .69 ? 1 : roll < .82 ? 2 : 3;
        if (state.time > 150 && roll > .94) index = 4;
        if (state.time >= 240 && roll > .84 && roll <= .94) index = 5;
        if (state.time >= 360 && roll > .78 && roll <= .84) index = 6;
        const type = enemyTypes[index];
        addEnemy(state.player.x + Math.cos(angle) * distance, state.player.y + Math.sin(angle) * distance, type, false);
      }
      function spawnWave() {
        state.wave++;
        state.nextWaveAt += 120;
        state.waveEndAt = state.time + 24;
        const count = Math.max(0, Math.min(180 - state.enemies.length, 84, 32 + state.wave * 6));
        const distance = Math.max(GAME_WIDTH, GAME_HEIGHT) * .57 + 90;
        for (let i = 0; i < count; i++) {
          const angle = i / count * Math.PI * 2 + (Math.random() - .5) * .28;
          const availableTypes = state.time >= 360 ? 7 : state.time >= 240 ? 6 : 5;
          const type = enemyTypes[(i * 3 + state.wave) % availableTypes];
          addEnemy(state.player.x + Math.cos(angle) * distance, state.player.y + Math.sin(angle) * distance, type, false);
        }
        if (state.enemies.length < 180) {
          const captain = enemyTypes[4];
          addEnemy(state.player.x - distance, state.player.y, captain, true);
          const champion = state.enemies[state.enemies.length - 1];
          champion.hp *= 1.4 + state.wave * .15;
          champion.maxHp = champion.hp;
          champion.isWaveCaptain = true;
        }
        toast(`Nightfall wave ${state.wave} · A captain leads the horde!`);
      }
      function nearestEnemy(maxDistance) {
        let target = null;
        let distance = maxDistance;
        for (const enemy of state.enemies) {
          if (!isEnemyOnScreen(enemy)) continue;
          const d = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
          if (d < distance) { target = enemy; distance = d; }
        }
        return target;
      }
      function isEnemyOnScreen(enemy) {
        const radius = enemy.radius || 0;
        return Math.abs(enemy.x - state.player.x) <= GAME_WIDTH / 2 + radius &&
          Math.abs(enemy.y - state.player.y) <= GAME_HEIGHT / 2 + radius;
      }
      function currentMight() {
        return state.might * (1 + passivePower("Spinach") * .07) *
          (1 + passivePower("Small Gem") * .035) *
          (state.passives["Dragon Heart"] ? 1.5 : 1) *
          (1 + (state.midasDamageBonus || 0));
      }
      function passivePower(name) {
        return (state.passives[name] || 0) * itemPower(name);
      }
      function extraProjectileCount() {
        return Math.min(4, (state.passives["Arcane Bandolier"] || 0) + (state.passives["Grand Staff of Duplication"] || 0) * 2);
      }
      function syncPassiveStats() {
        const p = state.player;
        p.maxHp = p.baseMaxHp * (1 + passivePower("Hollow Heart") * .1) + p.bonusMaxHp;
        p.hp = Math.min(p.hp, p.maxHp);
      }
      function fireWeaponSingle(name, evolved, weaponLevel) {
        const level = weaponLevel || state.inventory[name] || 1;
        const damageItemName = evolved && weaponData[name].evolution ? weaponData[name].evolution : name;
        const baseDamage = (name === "Magic Wand" ? 19 : name === "Cross" ? 28 : 22) * currentMight() * itemPower(damageItemName) * (1 + level * .12) * (evolved ? 1.65 : 1);
        if (name === "Magic Wand") {
          const target = nearestEnemy((evolved ? 760 : 550) + passivePower("Optic Lens") * 60);
          if (!target) return;
          state.projectiles.push({ kind: "bolt", x: state.player.x, y: state.player.y, target, speed: evolved ? 740 : 490, damage: baseDamage, radius: evolved ? 6 : 5, color: evolved ? "#fff1b5" : "#78d4ed", homing: true, life: 2.2 });
        } else if (name === "Whip") {
          const direction = state.player.facing || 1;
          const range = evolved ? 155 : 105;
          const struck = state.enemies.filter((enemy) =>
            isEnemyOnScreen(enemy) &&
            Math.abs(enemy.y - state.player.y) < (evolved ? 44 : 30) &&
            (enemy.x - state.player.x) * direction > -18 &&
            (enemy.x - state.player.x) * direction < range
          );
          state.slashes.push({ x: state.player.x, y: state.player.y, direction, life: .22, maxLife: .22, evolved });
          struck.forEach((enemy) => damageEnemy(enemy, baseDamage * (evolved ? 1.25 : 1), evolved));
          if (struck.length) burst(state.player.x + direction * 45, state.player.y, evolved ? "#f47c89" : "#e1b970", 7);
        } else if (name === "Garlic") {
          const range = ((evolved ? 100 : 68) + passivePower("Spellbinder") * 5) * (1 + passivePower("Tome of Area") * .15);
          for (const enemy of state.enemies) {
            if (isEnemyOnScreen(enemy) && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) < range + enemy.radius) {
              damageEnemy(enemy, baseDamage * .48, evolved);
            }
          }
          if (evolved) state.player.hp = Math.min(state.player.maxHp, state.player.hp + .15);
        } else if (name === "Cross") {
          const target = nearestEnemy(440);
          if (!target) return;
          const dx = target.x - state.player.x;
          const dy = target.y - state.player.y;
          const mag = Math.hypot(dx, dy) || 1;
          state.projectiles.push({ kind: "sword", x: state.player.x, y: state.player.y, vx: dx / mag * 390, vy: dy / mag * 390, damage: baseDamage, radius: 9, color: "#f2e5b5", homing: false, life: 1.6, boomerang: true, originX: state.player.x, originY: state.player.y });
        } else if (name === "Soul Bind Chain") {
          const range = ((evolved ? 168 : 112) + level * 5 + (state.passives.Spellbinder || 0) * 6) * (1 + passivePower("Tome of Area") * .15);
          let drained = 0;
          for (const enemy of [...state.enemies]) {
            if (isEnemyOnScreen(enemy) && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= range + enemy.radius) {
              const hit = baseDamage * (evolved ? 1.15 : 1);
              damageEnemy(enemy, hit, true);
              drained += hit;
            }
          }
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + drained * (evolved ? .05 : .025));
          state.slashes.push({ x: state.player.x, y: state.player.y, life: .3, maxLife: .3, radius: range, kind: "chain", evolved });
        } else if (name === "Starlight Shard") {
          if (evolved) {
            for (let i = 0; i < 8; i++) {
              const angle = i / 8 * Math.PI * 2;
              state.projectiles.push({
                kind: "star", x: state.player.x, y: state.player.y,
                vx: Math.cos(angle) * 720, vy: Math.sin(angle) * 720,
                damage: baseDamage * 1.4, radius: 8, color: "#d8b4ff",
                life: 1.8, pierce: 2, hitTargets: [], critical: true
              });
            }
            return;
          }
          const target = nearestEnemy(760 + passivePower("Optic Lens") * 60);
          if (!target) return;
          const critChance = state.passives["Omniscience Eye"] ? 1 :
            Math.min(.85, .2 + passivePower("Optic Lens") * .06 + (state.passives["Precision Gloves"] || 0) * .1);
          const critical = Math.random() < critChance;
          const damage = baseDamage * (critical ? (evolved ? 3.2 : 2.2) : 1);
          state.projectiles.push({
            kind: "star", x: state.player.x, y: state.player.y, target,
            speed: evolved ? 1050 : 820, damage, radius: critical ? 8 : 6,
            color: critical ? "#fff1a8" : "#9cdfff", homing: true, life: 2.8, critical
          });
        } else if (name === "Infernal Flask") {
          const target = nearestEnemy(evolved ? 680 : 560);
          if (!target) return;
          const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
          state.projectiles.push({
            kind: "flask", x: state.player.x, y: state.player.y,
            vx: Math.cos(angle) * 300, vy: Math.sin(angle) * 300,
            target, damage: baseDamage, radius: 8, color: "#ff9a56", life: 1.8, evolved
          });
        } else if (name === "Chrono Gear") {
          const target = nearestEnemy(evolved ? 700 : 520);
          if (!target) return;
          const roll = Math.random();
          const multiplier = roll < .07 ? 4 : roll < .32 ? .35 : roll < .7 ? 1 : 2.1;
          const damage = baseDamage * multiplier;
          damageEnemy(target, damage, false, roll < .07);
          target.slowTimer = Math.max(target.slowTimer || 0, (evolved ? 1.5 : .72) + passivePower("Hourglass") * .35);
          if (evolved && roll < .2) target.stunTimer = Math.max(target.stunTimer || 0, .6);
          state.projectiles.push({
            kind: "gear", x: target.x, y: target.y, radius: 12,
            color: roll < .07 ? "#fff1a8" : "#a9a1ff", life: .38, damage: 0, critical: roll < .07
          });
        } else if (name === "Rusted Dagger" || name === "Soul Flintlock") {
          const target = nearestEnemy(name === "Soul Flintlock" ? 760 : 500);
          if (!target) return;
          const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
          const speed = name === "Soul Flintlock" ? 620 : 570;
          state.projectiles.push({
            kind: "dagger", x: state.player.x, y: state.player.y,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            damage: baseDamage * (name === "Soul Flintlock" ? 1.65 : .72),
            radius: name === "Soul Flintlock" ? 8 : 4, color: weaponData[name].color,
            life: 1.5, pierce: name === "Soul Flintlock" ? 6 : 0, hitTargets: []
          });
        } else if (name === "Apprentice Wand") {
          const target = nearestEnemy(520);
          if (!target) return;
          state.projectiles.push({ kind: "bolt", x: state.player.x, y: state.player.y, target, speed: 430, damage: baseDamage * .8, radius: 4, color: "#a8ebff", homing: true, life: 2 });
        } else if (name === "Spiked Rotor") {
          if (state.projectiles.some((projectile) => projectile.orbit && projectile.weapon === name)) return;
          const count = 3 + extraProjectileCount();
          for (let i = 0; i < count; i++) state.projectiles.push({
            orbit: true, weapon: name, angle: i / count * Math.PI * 2, radius: 8,
            damage: baseDamage * .72, color: "#a2df9a", life: Infinity, hitCooldown: {}
          });
        } else if (name === "Poison Flask") {
          const target = nearestEnemy(560);
          if (!target) return;
          const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
          state.projectiles.push({ kind: "flask", x: state.player.x, y: state.player.y, vx: Math.cos(angle) * 280, vy: Math.sin(angle) * 280, target, damage: baseDamage * .65, radius: 8, color: "#88df6d", life: 1.8, poison: true });
        } else if (name === "Lightning Rod") {
          const targets = state.enemies.filter(isEnemyOnScreen).sort(() => Math.random() - .5).slice(0, 3 + extraProjectileCount());
          if (!targets.length) return;
          for (const target of targets) {
            damageEnemy(target, baseDamage * 1.25);
            state.slashes.push({ kind: "lightning", x: target.x, y: target.y - 120, targetX: target.x, targetY: target.y, life: .2, maxLife: .2 });
            burst(target.x, target.y, "#a7e6ff", 7);
          }
        } else if (name === "Solar Discus") {
          const target = nearestEnemy(760);
          if (!target) return;
          const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
          state.projectiles.push({ kind: "discus", x: state.player.x, y: state.player.y, vx: Math.cos(angle) * 390, vy: Math.sin(angle) * 390, damage: baseDamage * 1.15, radius: 11, color: "#ffd478", life: 5, bouncy: true, ricochets: 99, hitCooldown: {} });
        } else if (name === "Grave Siphon") {
          const target = nearestEnemy(680);
          if (!target) return;
          state.hazards.push({ kind: "blackhole", x: target.x, y: target.y, radius: 135 * (1 + passivePower("Tome of Area") * .15), damage: baseDamage * .38, life: 3.5, tick: 0 });
        } else if (name === "Grim Reaper's Scythe") {
          const range = 270 * (1 + passivePower("Tome of Area") * .15);
          const direction = state.player.facing || 1;
          for (const enemy of [...state.enemies]) {
            if (!isEnemyOnScreen(enemy)) continue;
            const dx = enemy.x - state.player.x;
            const dy = enemy.y - state.player.y;
            if (Math.hypot(dx, dy) <= range && dx * direction >= -enemy.radius) {
              if (!enemy.elite && Math.random() < .005) damageEnemy(enemy, enemy.hp, false, false, false, true);
              else damageEnemy(enemy, baseDamage * 1.9);
            }
          }
          state.slashes.push({ kind: "scythe", x: state.player.x, y: state.player.y, direction, radius: range, life: .42, maxLife: .42 });
        } else if (name === "Armageddon Cannon") {
          if (state.time < (state.weaponCooldowns[name] || 0)) return;
          state.weaponCooldowns[name] = state.time + 16;
          const radius = Math.hypot(GAME_WIDTH / 2, GAME_HEIGHT / 2);
          for (const enemy of [...state.enemies]) {
            if (isEnemyOnScreen(enemy) && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) < radius) {
              damageEnemy(enemy, enemy.hp * (enemy.elite ? .42 : .58));
            }
          }
          state.hazards.push({ kind: "meteor", x: state.player.x, y: state.player.y, radius, damage: 0, life: .8, tick: 1 });
          burst(state.player.x, state.player.y, "#ff875e", 54);
        }
      }
      function fireWeapon(name, evolved, weaponLevel) {
        const start = state.projectiles.length;
        fireWeaponSingle(name, evolved, weaponLevel);
        const extraCount = extraProjectileCount();
        if (state.projectiles.length === start) {
          if (name !== "Lightning Rod") for (let i = 0; i < extraCount; i++) fireWeaponSingle(name, evolved, weaponLevel);
          return;
        }
        if (name === "Chrono Gear") {
          for (let i = 0; i < extraCount; i++) fireWeaponSingle(name, evolved, weaponLevel);
        }
        const originals = state.projectiles.slice(start);
        for (const projectile of originals) {
          if (projectile.orbit) continue;
          if (state.passives["Omniscience Eye"] && projectile.kind !== "sword") {
            projectile.bouncy = true;
            projectile.ricochets = Math.max(projectile.ricochets || 0, 3);
          }
          if (!extraCount) continue;
          for (let i = 1; i <= extraCount; i++) {
            const copy = { ...projectile, hitTargets: projectile.hitTargets ? [...projectile.hitTargets] : undefined, hitCooldown: projectile.hitCooldown ? { ...projectile.hitCooldown } : undefined };
            if (Number.isFinite(copy.vx) && Number.isFinite(copy.vy)) {
              const offset = i * .14;
              const cos = Math.cos(offset), sin = Math.sin(offset);
              [copy.vx, copy.vy] = [copy.vx * cos - copy.vy * sin, copy.vx * sin + copy.vy * cos];
            }
            if (copy.target) {
              copy.x += i * 4;
              copy.y -= i * 4;
            }
            state.projectiles.push(copy);
          }
        }
      }
      function damageEnemy(enemy, amount, vampiric, critical, suppressSpecials, executed) {
        if (enemy.hp <= 0) return;
        if (critical === undefined) {
          const critChance = state.passives["Omniscience Eye"] ? 1 :
            Math.min(.85, passivePower("Optic Lens") * .06 + (state.passives["Precision Gloves"] || 0) * .1);
          critical = Math.random() < critChance;
        }
        if (state.passives["Omniscience Eye"]) critical = true;
        if (!enemy.elite && state.passives["Soul Reaper's Covenant"] && Math.random() < .01) {
          amount = enemy.hp;
          executed = true;
        }
        if (critical) amount *= 2;
        enemy.hp -= amount;
        enemy.hitFlash = .08;
        enemy.damageTextCooldown = Math.max(0, (enemy.damageTextCooldown || 0) - .08);
        if (amount >= 2 && enemy.damageTextCooldown <= 0 && state.hitTexts.length < 80) {
          state.hitTexts.push({ x: enemy.x, y: enemy.y - enemy.radius, text: executed ? "SLAIN!" : critical ? `CRIT ${Math.round(amount)}` : Math.round(amount).toString(), life: .58, maxLife: .58, color: executed ? "#ff7182" : critical ? "#fff17a" : "#fff2d2" });
          enemy.damageTextCooldown = .14;
        }
        if ((vampiric && Math.random() < .1) ||
          (state.passives["Vampiric Gem"] && Math.random() < .03 * state.passives["Vampiric Gem"])) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + .75);
        }
        if (critical && state.passives["Eye of Cataclysm"] && !suppressSpecials) {
          const blastRadius = 78 * (1 + passivePower("Tome of Area") * .15);
          state.slashes.push({ kind: "critBlast", x: enemy.x, y: enemy.y, radius: blastRadius, life: .24, maxLife: .24 });
          burst(enemy.x, enemy.y, "#d9a4ff", 10);
          for (const nearby of [...state.enemies]) {
            if (nearby !== enemy && Math.hypot(nearby.x - enemy.x, nearby.y - enemy.y) < blastRadius) {
              damageEnemy(nearby, amount * .42, false, false, true);
            }
          }
        }
        if (enemy.hp <= 0) killEnemy(enemy);
      }
      function killEnemy(enemy) {
        const index = state.enemies.indexOf(enemy);
        if (index < 0) return;
        state.enemies.splice(index, 1);
        state.kills++;
        if (enemy.hp <= 0 && state.passives["Soul Reaper's Covenant"]) {
          state.player.bonusMaxHp++;
          syncPassiveStats();
        }
        if (state.passives["Venom Master's Seal"] && (enemy.burnStacks || enemy.poisonStacks)) {
          const spreadRadius = 105;
          for (const nearby of state.enemies) {
            if (Math.hypot(nearby.x - enemy.x, nearby.y - enemy.y) < spreadRadius) {
              nearby.burnStacks = Math.max(nearby.burnStacks || 0, enemy.burnStacks || 0);
              nearby.burnTimer = Math.max(nearby.burnTimer || 0, 1.5);
              nearby.poisonStacks = Math.max(nearby.poisonStacks || 0, enemy.poisonStacks || 0);
              nearby.poisonTimer = Math.max(nearby.poisonTimer || 0, 1.5);
            }
          }
        }
        const orbCount = Math.min(8, Math.ceil(enemy.xp / 4));
        for (let i = 0; i < orbCount; i++) {
          state.gems.push({ x: enemy.x + (Math.random() - .5) * 12, y: enemy.y + (Math.random() - .5) * 12, xp: enemy.xp / orbCount, radius: 5, color: "#66cde4" });
        }
        const coins = Math.max(1, Math.ceil(enemy.gold * (1 + passivePower("Clover") * .1)));
        state.gold += coins;
        state.totalGoldEarned += coins;
        if (state.passives["Crown of Midas"]) {
          const goldRanks = Math.floor(state.totalGoldEarned / 100);
          if (goldRanks > (state.midasGoldRank || 0)) {
            state.midasDamageBonus = (state.midasDamageBonus || 0) + (goldRanks - (state.midasGoldRank || 0)) * .01;
            state.midasGoldRank = goldRanks;
            toast("Crown of Midas · Damage increased!");
          }
        }
        if (enemy.elite) {
          state.chestQueue.push({ x: enemy.x, y: enemy.y, opened: false });
          if (!state.chest) state.chest = state.chestQueue.shift();
          state.bossDefeated = true;
          toast(enemy.isWaveCaptain ? "Wave captain defeated. A treasure chest has appeared!" : "The guardian falls. A treasure chest has appeared!");
        }
        burst(enemy.x, enemy.y, enemy.type.color, enemy.elite ? 20 : 4);
        if (enemy.isReaper) endRun(true);
      }
      function burst(x, y, color, count) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 25 + Math.random() * 110;
          state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .25 + Math.random() * .3, maxLife: .55, color, size: 1.5 + Math.random() * 2 });
        }
      }
      function collectGem(gem) {
        state.xp += gem.xp;
        while (state.xp >= state.xpNext) {
          state.xp -= state.xpNext;
          state.level++;
          state.xpNext = nextXpThreshold(state.xpNext);
          openLevelUp();
          break;
        }
      }
      function openLevelUp() {
        if (state.mode !== "running") return;
        state.mode = "levelup";
        renderUpgradeChoices();
        setOverlay("level-overlay");
      }
      function renderUpgradeChoices() {
        const candidates = [];
        const available = upgradePool.filter((item) => {
          if (item.type === "weapon") return !state.inventory[item.name] && Object.keys(state.inventory).length < 5;
          if (item.type === "passive") {
            if (item.name === "Minor Potion") return state.player.hp < state.player.maxHp;
            return (state.passives[item.name] || 0) < (singleRankPassives.has(item.name) ? 1 : 5);
          }
          return true;
        });
        candidates.push(...available);
        for (const name of Object.keys(state.inventory)) {
          if (weaponData[name] && state.inventory[name] < 5) candidates.push({ type: "weaponLevel", name, icon: weaponData[name].icon, desc: "Increase damage and improve this weapon's power." });
        }
        for (const name of Object.keys(state.passives)) {
          if (state.passives[name] < 5) candidates.push({ type: "passiveLevel", name, icon: passiveData[name].icon, desc: passiveData[name].desc });
        }
        const selected = [];
        while (selected.length < 3 && candidates.length) {
          const tiers = rarityTiers.filter((tier) => candidates.some((item) => rarityForItem(item.name).name === tier.name));
          const luck = passivePower("Clover") * .1 + (state.passives["Lucky Coin"] || 0) * .2;
          const weightedTiers = tiers.map((tier) => ({ tier, weight: tier.weight * (1 + luck * rarityTiers.indexOf(tier) * .7) }));
          const totalWeight = weightedTiers.reduce((sum, entry) => sum + entry.weight, 0);
          let roll = Math.random() * totalWeight;
          let chosenTier = tiers[0];
          for (const entry of weightedTiers) {
            roll -= entry.weight;
            if (roll < 0) { chosenTier = entry.tier; break; }
          }
          const tierOptions = candidates.filter((item) => rarityForItem(item.name).name === chosenTier.name);
          const chosen = tierOptions[Math.floor(Math.random() * tierOptions.length)];
          selected.push(chosen);
          candidates.splice(candidates.indexOf(chosen), 1);
        }
        $("choices").innerHTML = selected.map((item, index) => `
          <button class="choice-card rarity-${rarityForItem(item.name).className}" data-choice="${index}">
            <span class="choice-icon">${item.icon}</span>
            <strong>${item.name}</strong>
            <small>${item.desc}</small>
            <span class="level-tag">${item.type.includes("Level") ? "Upgrade · Level " + (state.inventory[item.name] || state.passives[item.name] || 0) + " → " + ((state.inventory[item.name] || state.passives[item.name] || 0) + 1) : item.name === "Minor Potion" ? "Instant heal · +15 vitality" : item.type === "weapon" ? "New weapon · Level 1" : item.type === "passive" ? "New passive · Level 1" : "Character power"}</span>
            <span class="rarity-label">${rarityForItem(item.name).name} · ${rarityForItem(item.name).power.toFixed(2)}× item power</span>
          </button>`).join("");
        document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => chooseUpgrade(selected[Number(button.dataset.choice)])));
        $("level-reroll").disabled = state.rerolls < 1;
        $("level-reroll").textContent = `Reroll · ${state.rerolls}`;
      }
      function rerollUpgrades() {
        if (state.mode !== "levelup" || state.rerolls < 1) return;
        state.rerolls--;
        renderUpgradeChoices();
      }
      function skipLevelUp() {
        if (state.mode !== "levelup") return;
        state.rerolls += 2;
        continueAfterLevelUp();
      }
      function continueAfterLevelUp() {
        state.mode = "running";
        setOverlay(null);
        updateHud();
        if (state.xp >= state.xpNext) {
          state.xp -= state.xpNext;
          state.level++;
          state.xpNext = nextXpThreshold(state.xpNext);
          openLevelUp();
        }
      }
      function chooseUpgrade(item) {
        if (!item) return;
        if (item.type === "weapon") state.inventory[item.name] = 1;
        else if (item.type === "passive") {
          if (item.name === "Minor Potion") {
            state.player.hp = Math.min(state.player.maxHp, state.player.hp + 15);
          } else {
            state.passives[item.name] = 1;
            if (item.name === "Crown of Midas") state.midasGoldRank = Math.floor(state.totalGoldEarned / 100);
            syncPassiveStats();
          }
        }
        else if (item.type === "weaponLevel") state.inventory[item.name]++;
        else if (item.type === "passiveLevel") {
          state.passives[item.name]++;
          syncPassiveStats();
        }
        else if (item.name === "Might") state.might += .06;
        else if (item.name === "Magnet") state.magnet += .45;
        else if (item.name === "Vitality") {
          state.player.bonusMaxHp += 5;
          syncPassiveStats();
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 30);
        }
        continueAfterLevelUp();
      }
      function tryEvolution() {
        if (!state.chest || state.chest.opened) return;
        const ready = Object.entries(evolutionData).find(([name, evo]) =>
          state.inventory[evo.weapon] >= 5 && state.passives[evo.passive] >= 1 && !state.inventory[name]
        );
        if (ready) {
          const [name, evo] = ready;
          const evolvedLevel = state.inventory[evo.weapon];
          const chestX = state.chest.x, chestY = state.chest.y;
          delete state.inventory[evo.weapon];
          state.inventory[name] = evolvedLevel;
          state.chest.opened = true;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 45);
          toast(name + " evolved! Restored 45 vitality.");
          burst(chestX, chestY, "#ffe3a0", 24);
          updateHud();
        } else {
          state.chest.opened = true;
          const chestGold = 25 + (state.passives.Clover || 0) * 5;
          state.gold += chestGold;
          state.totalGoldEarned += chestGold;
          if (state.passives["Crown of Midas"]) {
            const goldRanks = Math.floor(state.totalGoldEarned / 100);
            if (goldRanks > (state.midasGoldRank || 0)) {
              state.midasDamageBonus = (state.midasDamageBonus || 0) + (goldRanks - (state.midasGoldRank || 0)) * .01;
              state.midasGoldRank = goldRanks;
            }
          }
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 35);
          toast(`Treasure found: ${chestGold} gold and restored vitality.`);
        }
        state.chest = state.chestQueue.shift() || null;
      }
      function updateHud() {
        if (!state.player) return;
        $("health-label").textContent = Math.ceil(state.player.hp) + " / " + Math.ceil(state.player.maxHp);
        $("health-fill").style.width = Math.max(0, state.player.hp / state.player.maxHp * 100) + "%";
        $("xp-label").textContent = Math.floor(state.xp) + " / " + state.xpNext + " XP";
        $("xp-fill").style.width = Math.min(100, state.xp / state.xpNext * 100) + "%";
        $("level-label").textContent = state.level;
        $("time-label").textContent = formatTime(state.time);
        $("wave-label").textContent = state.wave ? String(state.wave) : "—";
        $("kills-label").textContent = state.kills;
        $("gold-label").textContent = state.gold;
        const inventory = Object.entries(state.inventory).map(([name, level]) => {
          const rarity = rarityForItem(itemRarity[name] ? name : evolutionData[name] ? evolutionData[name].weapon : name);
          return `<span class="build-chip rarity-${rarity.className}">${(evolutionData[name] || weaponData[name] || { icon: "✦" }).icon} ${name} <b>${evolutionData[name] ? "EVOLVED · Lv." + level : "Lv." + level}</b><small>${rarity.name}</small></span>`;
        });
        const passives = Object.entries(state.passives).map(([name, level]) =>
          `<span class="build-chip rarity-${rarityForItem(name).className}">${passiveData[name].icon} ${name} <b>Lv.${level}</b><small>${rarityForItem(name).name}</small></span>`);
        $("pause-build-list").innerHTML = inventory.concat(passives).join("") || '<span class="build-chip">No upgrades yet</span>';
      }
      let toastTimer;
      function toast(message) {
        $("toast").textContent = message;
        $("toast").classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2400);
      }
      function endRun(won) {
        if (state.mode === "gameover") return;
        state.mode = "gameover";
        recordRun(won ? "Victory" : "Defeat");
        showHud(false);
        $("end-eyebrow").textContent = won ? "A legend is born" : "The night claims another";
        $("end-title").textContent = won ? "Dawn at last" : "Run ended";
        $("end-message").textContent = won
          ? "You survived the night. But the manor whispers of another."
          : "Your story ends here, but the gold you gathered remains yours.";
        $("result-time").textContent = formatTime(state.time);
        $("result-kills").textContent = state.kills;
        $("result-gold").textContent = state.gold;
        setOverlay("end-overlay");
      }
      function recordRun(outcome) {
        if (state.runRecorded) return;
        state.runRecorded = true;
        state.totalGold += state.gold;
        const character = characters.find((item) => item.id === state.selected);
        state.history.unshift({
          date: new Date().toISOString(),
          character: character ? character.id : state.selected,
          time: Math.floor(state.time),
          kills: state.kills,
          gold: state.gold,
          level: state.level,
          outcome
        });
        state.history = state.history.slice(0, 20);
        save();
      }
      function hurtPlayer(rawDamage) {
        const p = state.player;
        if (state.damageTimer > 0 || p.invulnerable > 0) return;
        const armor = (state.passives["Light Armor"] || 0) + (state.passives["Spike Mail"] || 0) * 3;
        const incomingDamage = Math.max(1, rawDamage - armor) * Math.max(.45, 1 - passivePower("Iron Plate") * .07);
        if (state.passives["Aegis Barrier"] && (state.passiveTimers.aegis || 0) <= 0) {
          state.passiveTimers.aegis = 15;
          burst(p.x, p.y, "#c18aff", 16);
        } else {
          p.hp -= incomingDamage;
          if (state.passives["Spike Mail"]) {
            for (const nearby of [...state.enemies]) {
              if (Math.hypot(nearby.x - p.x, nearby.y - p.y) < 105) damageEnemy(nearby, incomingDamage, false, false, true);
            }
          }
        }
        if (state.passives["Chronos Charm"] && p.hp / p.maxHp < .3 && (state.passiveTimers.chronos || 0) <= 0) {
          state.passiveTimers.chronos = 60;
          for (const foe of state.enemies) foe.stunTimer = Math.max(foe.stunTimer || 0, 3);
          burst(p.x, p.y, "#c18aff", 24);
        }
        p.invulnerable = .35;
        state.damageTimer = .3;
        burst(p.x, p.y, "#ef645f", 5);
        if (p.hp <= 0 && state.passives["Phoenix Immortal Heart"] && !state.revived) {
          state.revived = true;
          p.hp = p.maxHp;
          p.invulnerable = 5;
          for (const foe of [...state.enemies]) if (!foe.elite) killEnemy(foe);
          burst(p.x, p.y, "#ffab5e", 50);
        } else if (p.hp <= 0) {
          p.hp = 0;
          updateHud();
          endRun(false);
        }
      }
      function update(dt) {
        if (state.mode !== "running") return;
        const p = state.player;
        state.time += dt;
        state.damageTimer = Math.max(0, state.damageTimer - dt);
        if (state.time >= state.nextWaveAt) spawnWave();
        if (state.time >= 1800 && !state.redDeathSpawned) {
          state.redDeathSpawned = true;
          const angle = Math.random() * Math.PI * 2;
          const redDeath = { name: "Red Death", shape: "circle", color: "#e34c53", hp: 100000, speed: 115, radius: 20, damage: 9999, xp: 50, gold: 100 };
          addEnemy(p.x + Math.cos(angle) * 360, p.y + Math.sin(angle) * 360, redDeath, true);
          state.enemies[state.enemies.length - 1].isReaper = true;
          toast("The Red Death has come for you.");
        }
        if (state.time >= 600 && !state.guardianSpawned) {
          state.guardianSpawned = true;
          const angle = Math.random() * Math.PI * 2;
          const eliteType = enemyTypes[4];
          addEnemy(p.x + Math.cos(angle) * 360, p.y + Math.sin(angle) * 360, eliteType, true);
          state.enemies[state.enemies.length - 1].hp *= 4;
          state.enemies[state.enemies.length - 1].maxHp *= 4;
          toast("A guardian approaches. Defeat it for a treasure chest!");
        }
        const dx = (state.keys.ArrowRight || state.keys.d ? 1 : 0) - (state.keys.ArrowLeft || state.keys.a ? 1 : 0);
        const dy = (state.keys.ArrowDown || state.keys.s ? 1 : 0) - (state.keys.ArrowUp || state.keys.w ? 1 : 0);
        const length = Math.hypot(dx, dy) || 1;
        if (dx) p.facing = Math.sign(dx);
        state.dashCooldown = Math.max(0, state.dashCooldown - dt);
        if (state.dashRequested) {
          state.dashRequested = false;
          if (state.dashCooldown <= 0) {
            state.dashDx = dx || p.facing || 1;
            state.dashDy = dy;
            const dashLength = Math.hypot(state.dashDx, state.dashDy) || 1;
            state.dashDx /= dashLength;
            state.dashDy /= dashLength;
            state.dashTime = .16;
            state.dashCooldown = 1.1;
            p.invulnerable = Math.max(p.invulnerable, .2);
            burst(p.x, p.y, "#f4d477", 9);
          }
        }
        const dashing = state.dashTime > 0;
        state.dashTime = Math.max(0, state.dashTime - dt);
        for (const key of Object.keys(state.passiveTimers)) state.passiveTimers[key] = Math.max(0, state.passiveTimers[key] - dt);
        const moveX = (dashing ? state.dashDx : dx / length) * p.moveSpeed * (dashing ? 3.2 : 1) *
          (1 + passivePower("Wings") * .08 + (state.passives["Hiking Boots"] || 0) * .05) * dt;
        const moveY = (dashing ? state.dashDy : dy / length) * p.moveSpeed * (dashing ? 3.2 : 1) *
          (1 + passivePower("Wings") * .08 + (state.passives["Hiking Boots"] || 0) * .05) * dt;
        if (!collidesWithTerrain(p.x + moveX, p.y, p.radius)) p.x += moveX;
        if (!collidesWithTerrain(p.x, p.y + moveY, p.radius)) p.y += moveY;
        p.invulnerable = Math.max(0, p.invulnerable - dt);
        p.hp = Math.min(p.maxHp, p.hp + passivePower("Pummarola") * .15 * dt);
        if (state.passives["Dragon Heart"]) {
          state.passiveTimers.dragon = (state.passiveTimers.dragon || 0) - dt;
          if (state.passiveTimers.dragon <= 0) {
            state.passiveTimers.dragon = 2;
            burst(p.x, p.y, "#ff8d50", 18);
            for (const enemy of [...state.enemies]) {
              if (isEnemyOnScreen(enemy) && Math.hypot(enemy.x - p.x, enemy.y - p.y) < 145 * (1 + passivePower("Tome of Area") * .15)) {
                enemy.burnStacks = Math.min(12, (enemy.burnStacks || 0) + 1);
                enemy.burnTimer = Math.max(enemy.burnTimer || 0, 1.5);
                damageEnemy(enemy, 28 * currentMight());
              }
            }
          }
        }

        state.spawnTimer -= dt;
        const spawnRate = Math.max(.11, .29 - state.time / 8400) * (state.time < state.waveEndAt ? 1.15 : 1);
        if (state.spawnTimer <= 0) {
          if (state.enemies.length < 180) {
            spawnEnemy();
            if (state.enemies.length < 180 && state.time > 90 && Math.random() < Math.min(.65, state.time / 900)) spawnEnemy();
          }
          state.spawnTimer = spawnRate;
        }
        state.attackTimer -= dt;
        if (state.attackTimer <= 0) {
          const interval = .72 / (p.attackSpeed * (1 + passivePower("Empty Tome") * .08) * (state.inventory["Rusted Dagger"] ? 1.7 : 1)) *
            Math.max(.35, 1 - (state.passives["Tactical Timer"] || 0) * .08);
          for (const [name, level] of Object.entries(state.inventory)) {
            const evolved = !!evolutionData[name];
            const baseName = evolved ? evolutionData[name].weapon : name;
            if (baseName === "King Bible") {
              if (!state.projectiles.some((projectile) => projectile.orbit && projectile.weapon === name)) {
                const count = (evolved ? 5 : 2 + Math.floor(level / 3)) + extraProjectileCount();
                for (let i = 0; i < count; i++) state.projectiles.push({ orbit: true, weapon: name, angle: i / count * Math.PI * 2, radius: 7, damage: 10 * currentMight() * (evolved ? 1.65 : 1), color: evolved ? "#f3d98b" : "#b29bda", life: Infinity });
              }
            } else if (baseName === "Spiked Rotor") {
              if (!state.projectiles.some((projectile) => projectile.orbit && projectile.weapon === name)) fireWeapon(baseName, evolved, level);
            } else fireWeapon(baseName, evolved, level);
          }
          state.attackTimer = interval;
        }
        for (const projectile of state.projectiles) {
          if (projectile.orbit) {
            projectile.angle += dt * (state.inventory["Unholy Vespers"] ? 3.2 : 2.1);
            const rotor = projectile.weapon === "Spiked Rotor";
            if (rotor) projectile.orbitTime = (projectile.orbitTime || 0) + dt;
            const orbitRadius = rotor ? 28 + Math.min(projectile.orbitTime * 30, 50) :
              (state.inventory["Unholy Vespers"] ? 68 : 48) + passivePower("Spellbinder") * 5;
            projectile.x = p.x + Math.cos(projectile.angle) * orbitRadius;
            projectile.y = p.y + Math.sin(projectile.angle) * orbitRadius;
            for (const enemy of state.enemies) {
              if (!isEnemyOnScreen(enemy)) continue;
              const key = enemy.id;
              if (Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) < enemy.radius + 8) {
                if (!rotor) damageEnemy(enemy, projectile.damage * dt * 3, false);
                else if ((projectile.hitCooldown[key] || 0) <= state.time) {
                  damageEnemy(enemy, projectile.damage, false);
                  projectile.hitCooldown[key] = state.time + .35;
                }
              }
            }
            if (rotor && projectile.orbitTime >= 1.8) {
              projectile.orbit = false;
              projectile.kind = "dagger";
              projectile.vx = Math.cos(projectile.angle) * 300;
              projectile.vy = Math.sin(projectile.angle) * 300;
              projectile.life = 1.6;
            }
            continue;
          }
          projectile.life -= dt;
          if (projectile.homing && projectile.target && projectile.target.hp > 0) {
            const angle = Math.atan2(projectile.target.y - projectile.y, projectile.target.x - projectile.x);
            projectile.x += Math.cos(angle) * projectile.speed * dt;
            projectile.y += Math.sin(angle) * projectile.speed * dt;
          } else if (projectile.kind === "flask") {
            projectile.x += projectile.vx * dt;
            projectile.y += projectile.vy * dt;
          } else if (projectile.kind === "gear") {
            projectile.rotation = (projectile.rotation || 0) + dt * 12;
          } else if (projectile.boomerang) {
            const returning = projectile.life < .8;
            if (returning) {
              const angle = Math.atan2(p.y - projectile.y, p.x - projectile.x);
              projectile.vx = Math.cos(angle) * 450;
              projectile.vy = Math.sin(angle) * 450;
            }
            projectile.x += projectile.vx * dt;
            projectile.y += projectile.vy * dt;
          } else if (Number.isFinite(projectile.vx) && Number.isFinite(projectile.vy)) {
            projectile.x += projectile.vx * dt;
            projectile.y += projectile.vy * dt;
            if (projectile.bouncy) {
              const halfWidth = GAME_WIDTH / 2, halfHeight = GAME_HEIGHT / 2;
              if (Math.abs(projectile.x - p.x) > halfWidth) { projectile.vx *= -1; projectile.ricochets--; }
              if (Math.abs(projectile.y - p.y) > halfHeight) { projectile.vy *= -1; projectile.ricochets--; }
              if (projectile.ricochets <= 0) projectile.life = 0;
            }
          } else {
            projectile.life = 0;
          }
          for (const enemy of [...state.enemies]) {
            if (!isEnemyOnScreen(enemy)) continue;
            if (projectile.hitTargets && projectile.hitTargets.includes(enemy)) continue;
            if (projectile.hitCooldown && (projectile.hitCooldown[enemy.id] || 0) > state.time) continue;
            if (Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) < enemy.radius + projectile.radius) {
              if (projectile.kind === "flask") {
                state.hazards.push({
                  x: projectile.x, y: projectile.y,
                  radius: (projectile.evolved ? 105 : projectile.poison ? 82 : 72) * (1 + passivePower("Tome of Area") * .15),
                  damage: projectile.damage * (projectile.evolved ? .38 : projectile.poison ? .18 : .25),
                  life: (projectile.evolved ? 12 : projectile.poison ? 3 : 3.8) * (1 + passivePower("Volatile Oil") * .2),
                  tick: 0, evolved: projectile.evolved, poison: projectile.poison
                });
                burst(projectile.x, projectile.y, projectile.poison ? "#8be56a" : "#ff8a3d", projectile.evolved ? 22 : 13);
                projectile.life = 0;
              } else {
                damageEnemy(enemy, projectile.damage, state.inventory["Bloody Tear"] > 0 || state.inventory["Cages of Torment"] > 0, projectile.critical);
                if (projectile.bouncy) {
                  if (projectile.hitTargets) projectile.hitTargets.push(enemy);
                  projectile.homing = false;
                  projectile.target = null;
                  if (!Number.isFinite(projectile.vx) || !Number.isFinite(projectile.vy)) {
                    const angle = Math.atan2(enemy.y - p.y, enemy.x - p.x);
                    projectile.vx = Math.cos(angle) * 390;
                    projectile.vy = Math.sin(angle) * 390;
                  }
                  if (projectile.hitCooldown) projectile.hitCooldown[enemy.id] = state.time + .3;
                } else {
                  if (projectile.hitTargets) projectile.hitTargets.push(enemy);
                  if (projectile.pierce > 0) projectile.pierce--;
                  else projectile.life = 0;
                }
              }
              if (projectile.kind === "flask") break;
            }
          }
        }
        state.projectiles = state.projectiles.filter((projectile) => projectile.orbit || projectile.life > 0);

        for (const hazard of state.hazards) {
          hazard.life -= dt;
          hazard.tick -= dt;
          if (hazard.kind === "blackhole") {
            for (const enemy of state.enemies) {
              if (!isEnemyOnScreen(enemy)) continue;
              const distance = Math.hypot(enemy.x - hazard.x, enemy.y - hazard.y);
              if (distance < hazard.radius + enemy.radius && distance > 6) {
                enemy.x += (hazard.x - enemy.x) / distance * Math.min(110 * dt, distance);
                enemy.y += (hazard.y - enemy.y) / distance * Math.min(110 * dt, distance);
              }
            }
          }
          if (hazard.tick <= 0) {
            hazard.tick = hazard.poison || state.passives["Venom Master's Seal"] ? .21 : .42;
            for (const enemy of [...state.enemies]) {
              if (isEnemyOnScreen(enemy) && Math.hypot(enemy.x - hazard.x, enemy.y - hazard.y) < hazard.radius + enemy.radius) {
                if (hazard.kind === "blackhole") {
                  damageEnemy(enemy, hazard.damage, false);
                } else if (hazard.kind !== "meteor") {
                  enemy.slowTimer = Math.max(enemy.slowTimer || 0, .55);
                  if (hazard.poison) {
                    enemy.poisonStacks = Math.min(10, (enemy.poisonStacks || 0) + 1);
                    enemy.poisonTimer = Math.max(enemy.poisonTimer || 0, .8);
                  } else {
                    enemy.burnStacks = Math.min(hazard.evolved ? 12 : 8, (enemy.burnStacks || 0) + 1);
                    enemy.burnTimer = Math.max(enemy.burnTimer || 0, hazard.evolved ? 2.2 : 1.6);
                  }
                  damageEnemy(enemy, hazard.damage * (1 + (enemy.burnStacks || enemy.poisonStacks || 0) * .16), false);
                }
              }
            }
          }
        }
        state.hazards = state.hazards.filter((hazard) => hazard.life > 0);
        for (const attack of [...state.enemyAttacks]) {
          attack.life -= dt;
          if (attack.life <= 0) {
            if (Math.hypot(p.x - attack.x, p.y - attack.y) < attack.radius + p.radius) hurtPlayer(attack.damage);
            state.enemyAttacks.splice(state.enemyAttacks.indexOf(attack), 1);
            if (state.mode !== "running") return;
          }
        }
        for (const enemy of [...state.enemies]) {
          enemy.slowTimer = Math.max(0, (enemy.slowTimer || 0) - dt);
          enemy.stunTimer = Math.max(0, (enemy.stunTimer || 0) - dt);
          enemy.burnTimer = Math.max(0, (enemy.burnTimer || 0) - dt);
          enemy.poisonTimer = Math.max(0, (enemy.poisonTimer || 0) - dt);
          enemy.burnTick = (enemy.burnTick || 0) - dt;
          if (enemy.burnTimer > 0 && enemy.burnTick <= 0) {
            enemy.burnTick = state.passives["Venom Master's Seal"] ? .275 : .55;
            damageEnemy(enemy, (enemy.burnStacks || 0) * 1.4 * currentMight(), false);
          }
          enemy.poisonTick = (enemy.poisonTick || 0) - dt;
          if (enemy.poisonTimer > 0 && enemy.poisonTick <= 0) {
            enemy.poisonTick = state.passives["Venom Master's Seal"] ? .25 : .5;
            damageEnemy(enemy, (enemy.poisonStacks || 0) * .8 * currentMight(), false);
          }
          if (enemy.hp <= 0) continue;
          const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
          const distanceToPlayer = Math.hypot(p.x - enemy.x, p.y - enemy.y);
          if (enemy.stunTimer <= 0 && enemy.type.behavior === "caster") {
            enemy.attackCooldown -= dt;
            if (enemy.attackCooldown <= 0 && distanceToPlayer < 620 && distanceToPlayer > 115 && isEnemyOnScreen(enemy)) {
              enemy.attackCooldown = 3.2 + Math.random() * .8;
              state.enemyAttacks.push({ x: p.x, y: p.y, radius: 62, life: .95, maxLife: .95, damage: enemy.damage * 1.2 });
            }
          } else if (enemy.stunTimer <= 0 && enemy.type.behavior === "charger") {
            if (enemy.chargeWindup > 0) {
              enemy.chargeWindup = Math.max(0, enemy.chargeWindup - dt);
              if (!enemy.chargeWindup) enemy.chargeTime = .42;
            } else if (enemy.chargeTime > 0) {
              enemy.chargeTime = Math.max(0, enemy.chargeTime - dt);
            } else {
              enemy.attackCooldown -= dt;
              if (enemy.attackCooldown <= 0 && distanceToPlayer < 430 && isEnemyOnScreen(enemy)) {
                enemy.attackCooldown = 3.8;
                enemy.chargeWindup = .72;
                enemy.chargeDx = Math.cos(angle);
                enemy.chargeDy = Math.sin(angle);
              }
            }
          }
          const movementScale = enemy.stunTimer > 0 || enemy.chargeWindup > 0 ? 0 : enemy.slowTimer > 0 ? .42 : 1;
          const movingX = enemy.chargeTime > 0 ? enemy.chargeDx * enemy.speed * 3.8 : Math.cos(angle) * enemy.speed * movementScale;
          const movingY = enemy.chargeTime > 0 ? enemy.chargeDy * enemy.speed * 3.8 : Math.sin(angle) * enemy.speed * movementScale;
          const stepX = movingX * dt;
          const stepY = movingY * dt;
          if (!collidesWithTerrain(enemy.x + stepX, enemy.y, enemy.radius)) enemy.x += stepX;
          else if (!collidesWithTerrain(enemy.x + Math.cos(angle + .8) * enemy.speed * dt, enemy.y, enemy.radius)) enemy.x += Math.cos(angle + .8) * enemy.speed * dt;
          if (!collidesWithTerrain(enemy.x, enemy.y + stepY, enemy.radius)) enemy.y += stepY;
          else if (!collidesWithTerrain(enemy.x, enemy.y + Math.sin(angle - .8) * enemy.speed * dt, enemy.radius)) enemy.y += Math.sin(angle - .8) * enemy.speed * dt;
          enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
          if (Math.hypot(enemy.x - p.x, enemy.y - p.y) < enemy.radius + p.radius) {
            hurtPlayer(enemy.damage);
            if (state.mode !== "running") return;
          }
        }
        for (const gem of [...state.gems]) {
          const distance = Math.hypot(gem.x - p.x, gem.y - p.y);
          const magnetRange = (80 + state.magnet * 100 + passivePower("Clover") * 8) * (1 + (state.passives["Magnet Ring"] || 0) * .3);
          if (distance < magnetRange) {
            const speed = distance < 36 ? 320 : 180;
            gem.x += (p.x - gem.x) / (distance || 1) * speed * dt;
            gem.y += (p.y - gem.y) / (distance || 1) * speed * dt;
          }
          if (distance < p.radius + gem.radius + 3) {
            state.gems.splice(state.gems.indexOf(gem), 1);
            collectGem(gem);
            if (state.mode !== "running") break;
          }
        }
        if (state.chest && !state.chest.opened) {
          const chestDistance = Math.hypot(state.chest.x - p.x, state.chest.y - p.y);
          if (chestDistance < 115) {
            state.chest.x += (p.x - state.chest.x) / (chestDistance || 1) * 105 * dt;
            state.chest.y += (p.y - state.chest.y) / (chestDistance || 1) * 105 * dt;
          }
          if (chestDistance < 68) tryEvolution();
        }
        for (const particle of state.particles) {
          particle.x += particle.vx * dt; particle.y += particle.vy * dt;
          particle.life -= dt;
        }
        state.particles = state.particles.filter((particle) => particle.life > 0);
        for (const slash of state.slashes) slash.life -= dt;
        state.slashes = state.slashes.filter((slash) => slash.life > 0);
        for (const text of state.hitTexts) {
          text.y -= 22 * dt;
          text.life -= dt;
        }
        state.hitTexts = state.hitTexts.filter((text) => text.life > 0);
        updateHud();
      }
      const TERRAIN_CELL = 190;
      function hash2(x, y) {
        let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
        value = Math.imul(value ^ (value >>> 13), 1274126177);
        return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
      }
      function terrainAt(x, y) {
        const cellX = Math.floor(x / TERRAIN_CELL);
        const cellY = Math.floor(y / TERRAIN_CELL);
        const typeRoll = hash2(cellX, cellY);
        if (typeRoll > .58 || Math.hypot(cellX * TERRAIN_CELL, cellY * TERRAIN_CELL) < 155) return null;
        const kind = typeRoll < .25 ? "tree" : typeRoll < .39 ? "rock" : typeRoll < .52 ? "grave" : "stump";
        return {
          kind,
          x: (cellX + .5) * TERRAIN_CELL + (hash2(cellX + 71, cellY) - .5) * 70,
          y: (cellY + .5) * TERRAIN_CELL + (hash2(cellX, cellY + 93) - .5) * 70,
          radius: kind === "tree" ? 20 : kind === "rock" ? 17 : kind === "grave" ? 13 : 12,
          cellX, cellY
        };
      }
      function collidesWithTerrain(x, y, radius) {
        const minX = Math.floor((x - radius - 28) / TERRAIN_CELL);
        const maxX = Math.floor((x + radius + 28) / TERRAIN_CELL);
        const minY = Math.floor((y - radius - 28) / TERRAIN_CELL);
        const maxY = Math.floor((y + radius + 28) / TERRAIN_CELL);
        for (let cellY = minY; cellY <= maxY; cellY++) {
          for (let cellX = minX; cellX <= maxX; cellX++) {
            const obstacle = terrainAt(cellX * TERRAIN_CELL, cellY * TERRAIN_CELL);
            if (obstacle && Math.hypot(x - obstacle.x, y - obstacle.y) < radius + obstacle.radius * .72) return true;
          }
        }
        return false;
      }
      function drawTerrain(camX, camY, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#30382d");
        gradient.addColorStop(.52, "#2a3027");
        gradient.addColorStop(1, "#373026");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const detailSize = 110;
        const minDetailX = Math.floor(camX / detailSize) - 1;
        const maxDetailX = Math.ceil((camX + width) / detailSize) + 1;
        const minDetailY = Math.floor(camY / detailSize) - 1;
        const maxDetailY = Math.ceil((camY + height) / detailSize) + 1;
        for (let cy = minDetailY; cy <= maxDetailY; cy++) {
          for (let cx = minDetailX; cx <= maxDetailX; cx++) {
            const roll = hash2(cx + 301, cy - 213);
            const x = (cx + .5) * detailSize - camX;
            const y = (cy + .5) * detailSize - camY;
            ctx.fillStyle = roll < .48 ? "rgba(117,119,89,.1)" : "rgba(129,105,79,.11)";
            ctx.beginPath();
            ctx.ellipse(x, y, 10 + roll * 18, 5 + roll * 9, roll * 3, 0, Math.PI * 2);
            ctx.fill();
            if (roll > .67) {
              ctx.strokeStyle = "rgba(187,175,133,.12)";
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(x - 5, y + 3); ctx.lineTo(x, y - 3); ctx.lineTo(x + 5, y + 2); ctx.stroke();
            }
          }
        }

        const minX = Math.floor(camX / TERRAIN_CELL) - 1;
        const maxX = Math.ceil((camX + width) / TERRAIN_CELL) + 1;
        const minY = Math.floor(camY / TERRAIN_CELL) - 1;
        const maxY = Math.ceil((camY + height) / TERRAIN_CELL) + 1;
        for (let cellY = minY; cellY <= maxY; cellY++) {
          for (let cellX = minX; cellX <= maxX; cellX++) {
            const item = terrainAt(cellX * TERRAIN_CELL, cellY * TERRAIN_CELL);
            if (!item) continue;
            const x = item.x - camX, y = item.y - camY;
            ctx.fillStyle = "rgba(5,7,6,.4)";
            ctx.beginPath(); ctx.ellipse(x + 3, y + item.radius * .65, item.radius * 1.1, item.radius * .55, 0, 0, Math.PI * 2); ctx.fill();
            if (item.kind === "tree") {
              ctx.fillStyle = "#543d2b";
              ctx.fillRect(x - 4, y - 1, 8, 19);
              ctx.fillStyle = "#354b37";
              ctx.beginPath(); ctx.arc(x - 7, y - 4, 15, 0, Math.PI * 2); ctx.arc(x + 7, y - 6, 14, 0, Math.PI * 2); ctx.arc(x, y - 12, 16, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = "rgba(130,153,102,.28)";
              ctx.beginPath(); ctx.arc(x - 5, y - 16, 7, 0, Math.PI * 2); ctx.arc(x + 8, y - 10, 6, 0, Math.PI * 2); ctx.fill();
            } else if (item.kind === "rock") {
              ctx.fillStyle = "#5e6059"; ctx.strokeStyle = "#858678"; ctx.lineWidth = 2;
              polygon(x, y, item.radius, 6, hash2(cellX, cellY) * .8);
              ctx.fill(); ctx.stroke();
              ctx.strokeStyle = "rgba(210,206,180,.28)"; ctx.beginPath(); ctx.moveTo(x - 6, y - 3); ctx.lineTo(x - 1, y - 9); ctx.stroke();
            } else if (item.kind === "grave") {
              ctx.fillStyle = "#65675e"; ctx.strokeStyle = "#989588"; ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.roundRect(x - 9, y - 12, 18, 25, 8); ctx.fill(); ctx.stroke();
              ctx.fillStyle = "rgba(25,28,25,.48)"; ctx.fillRect(x - 1, y - 6, 2, 11); ctx.fillRect(x - 4, y - 3, 8, 2);
            } else {
              ctx.fillStyle = "#76523a"; ctx.strokeStyle = "#ae8052"; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.ellipse(x, y, 11, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
              ctx.strokeStyle = "rgba(37,25,17,.6)"; ctx.beginPath(); ctx.ellipse(x, y, 5, 3, 0, 0, Math.PI * 2); ctx.stroke();
            }
          }
        }
      }
      function polygon(x, y, radius, sides, rotation) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = rotation + i / sides * Math.PI * 2;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      function drawCharacterSkin(context, x, y, size, characterId) {
        const palettes = {
          arcanist: ["#392253", "#21192c", "#d6b56d"], duelist: ["#57432e", "#29251f", "#c8a66e"],
          acolyte: ["#70503b", "#46362d", "#d3b27c"], gideon: ["#8996a2", "#48525d", "#d5d4ca"],
          moss: ["#477449", "#29462e", "#9dbf67"], vesper: ["#76563b", "#493521", "#d3b17d"],
          valerius: ["#64717d", "#34404b", "#b8c2cb"], nyx: ["#37383e", "#17181e", "#aeb2bb"],
          tempest: ["#858d9a", "#616c7d", "#b6ddfa"], lyra: ["#354a80", "#24334f", "#76c5e7"],
          ignatius: ["#786646", "#4d4638", "#c9a963"], selene: ["#838c99", "#4e5969", "#d0d7e1"],
          aurelia: ["#d9b54b", "#fff0b0", "#fff4c9"], draven: ["#653239", "#291e2a", "#d36157"],
          seraphine: ["#e6c878", "#c9a85f", "#fff0b4"], mimi: ["#865b35", "#493528", "#b98a55"],
          mortis: ["#484a54", "#272832", "#85d5e8"], solara: ["#e18b38", "#9d572e", "#ffd15c"]
        };
        const [main, dark, accent] = palettes[characterId] || palettes.arcanist;
        context.save();
        context.translate(x, y);
        context.scale(size / 48, size / 48);
        context.lineJoin = "round";
        context.lineCap = "round";
        const stroke = (color = "#211b22", width = 1.7) => {
          context.strokeStyle = color;
          context.lineWidth = width;
          context.stroke();
        };
        const fillPolygon = (points, fill, edge = "#211b22") => {
          context.beginPath();
          context.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length; i++) context.lineTo(points[i][0], points[i][1]);
          context.closePath();
          context.fillStyle = fill;
          context.fill();
          stroke(edge, 1.6);
        };
        const ellipse = (cx, cy, rx, ry, fill, edge = "#211b22", rotation = 0) => {
          context.beginPath();
          context.ellipse(cx, cy, rx, ry, rotation, 0, Math.PI * 2);
          context.fillStyle = fill;
          context.fill();
          stroke(edge, 1.4);
        };

        context.fillStyle = "rgba(0,0,0,.25)";
        context.beginPath(); context.ellipse(1, 19, 15, 5, 0, 0, Math.PI * 2); context.fill();
        if (["acolyte", "gideon", "moss", "valerius", "nyx", "lyra", "selene", "aurelia", "draven", "seraphine", "mimi", "mortis", "solara"].includes(characterId)) {
          ellipse(0, 1, 17, 19, dark);
        }
        ellipse(0, 5, 14, 14, characterId === "mortis" ? "#343640" : "#f2bd43");
        ellipse(-2, 2, 10, 9, characterId === "mortis" ? "#444650" : "#ffe078", "rgba(255,255,255,.18)", -.2);
        if (characterId === "mortis") {
          ellipse(-4, 4, 2, 1.4, "#a9edff", "#243b48");
          ellipse(4, 4, 2, 1.4, "#a9edff", "#243b48");
        } else {
          ellipse(-4, 4, 1.25, 1.8, "#29201b", "#29201b", -.15);
          ellipse(4, 4, 1.25, 1.8, "#29201b", "#29201b", .15);
        }

        if (characterId === "arcanist") {
          fillPolygon([[-19, -7], [-15, -14], [-8, -11], [-3, -21], [4, -14], [12, -17], [19, -8], [14, -4], [-12, -4]], main);
          context.beginPath(); context.moveTo(-18, -7); context.quadraticCurveTo(0, -1, 19, -8); context.quadraticCurveTo(4, -5, -18, -7); context.fillStyle = dark; context.fill(); stroke();
          ellipse(5, -14, 1.2, 1.2, accent, accent); ellipse(-7, -11, .8, .8, accent, accent);
          context.beginPath(); context.arc(11, -14, 4, .2, Math.PI * 1.75); stroke(accent, 1.5);
        } else if (characterId === "duelist") {
          context.beginPath(); context.moveTo(-19, -8); context.quadraticCurveTo(-7, -21, 2, -13); context.quadraticCurveTo(12, -23, 20, -8); context.quadraticCurveTo(6, -4, -8, -9); context.quadraticCurveTo(-15, -3, -19, -8); context.fillStyle = main; context.fill(); stroke();
          context.beginPath(); context.moveTo(-19, -7); context.quadraticCurveTo(0, -1, 19, -7); stroke(accent, 1.4);
        } else if (characterId === "acolyte") {
          fillPolygon([[-17, -4], [-18, -12], [-7, -23], [7, -24], [17, -12], [17, 12], [11, 18], [9, -8], [0, -17], [-10, -9], [-11, 18], [-18, 12]], main);
          context.beginPath(); context.moveTo(-11, 16); context.lineTo(-10, -7); context.quadraticCurveTo(0, -18, 10, -7); context.lineTo(11, 17); stroke(accent, 1);
        } else if (characterId === "gideon") {
          context.beginPath(); context.arc(0, -2, 15, Math.PI, Math.PI * 2); context.lineTo(15, 12); context.lineTo(-15, 12); context.closePath(); context.fillStyle = main; context.fill(); stroke();
          fillPolygon([[-4, -17], [4, -17], [4, 1], [11, 1], [11, 6], [4, 6], [4, 12], [-2, 12], [-2, 6], [-9, 6], [-9, 1], [-2, 1]], accent, dark);
        } else if (characterId === "moss") {
          for (let i = 0; i < 7; i++) {
            const a = -Math.PI + i / 6 * Math.PI;
            context.save(); context.rotate(a);
            ellipse(0, -17, 3, 6, i % 2 ? "#60894a" : "#89a958", dark, -.3);
            context.restore();
          }
          context.beginPath(); context.moveTo(-13, -8); context.quadraticCurveTo(0, -19, 13, -8); stroke("#9b7544", 3);
        } else if (characterId === "vesper") {
          context.beginPath(); context.ellipse(0, -8, 22, 4, 0, 0, Math.PI * 2); context.fillStyle = main; context.fill(); stroke();
          context.beginPath(); context.moveTo(-11, -8); context.quadraticCurveTo(-8, -20, 5, -17); context.lineTo(12, -8); context.closePath(); context.fillStyle = dark; context.fill(); stroke();
          fillPolygon([[8, -16], [13, -29], [16, -16]], "#eee3c8", dark);
        } else if (characterId === "valerius") {
          context.beginPath(); context.roundRect(-16, -14, 32, 29, 9); context.fillStyle = main; context.fill(); stroke();
          context.beginPath(); context.moveTo(-13, 0); context.lineTo(13, 0); stroke(dark, 4);
          ellipse(-8, 1, 2, 2, accent, dark); ellipse(8, 1, 2, 2, accent, dark);
          context.beginPath(); context.arc(0, -1, 18, .1, Math.PI * .9); stroke(accent, 1.2);
          fillPolygon([[-5, -5], [5, -5], [3, 1], [-3, 1]], dark);
        } else if (characterId === "nyx") {
          fillPolygon([[-17, 11], [-18, -7], [-11, -18], [4, -23], [18, -12], [16, 8], [9, 15], [8, -5], [0, -12], [-9, -4], [-9, 14]], main);
          fillPolygon([[-11, 4], [0, 0], [11, 4], [9, 11], [0, 9], [-9, 12]], dark);
          context.beginPath(); context.moveTo(-8, 3); context.lineTo(-3, 2); context.moveTo(3, 2); context.lineTo(8, 3); stroke("#bac4cf", 1);
        } else if (characterId === "tempest") {
          ellipse(-10, -11, 9, 7, "#acb8c8"); ellipse(0, -15, 10, 9, "#c5d0dd"); ellipse(10, -11, 9, 7, "#9eaaba");
          fillPolygon([[-5, -4], [1, -12], [0, -5], [6, -5], [-2, 5], [-1, -2]], "#5ce6ff", "#256884");
          fillPolygon([[9, -3], [14, -10], [13, -4], [18, -4], [11, 3], [12, -1]], "#78d8ff", "#256884");
        } else if (characterId === "lyra") {
          fillPolygon([[-17, -7], [-13, -18], [-4, -22], [8, -20], [18, -9], [14, -5], [-13, -5]], main);
          fillPolygon([[-13, -16], [-20, -28], [-15, -25], [-7, -17]], "#47c7e8");
          fillPolygon([[-7, -19], [-9, -29], [-2, -19]], "#82dbee");
          fillPolygon([[-19, -5], [-14, 1], [-16, 12], [-9, 8], [-6, 17], [0, 9], [8, 17], [12, 7], [17, 11], [16, -3]], dark, main);
          for (let i = 0; i < 4; i++) ellipse(-9 + i * 6, -14, 1, 1.5, accent, accent);
        } else if (characterId === "ignatius") {
          context.beginPath(); context.arc(0, 2, 14, Math.PI, Math.PI * 2); context.lineTo(14, 9); context.lineTo(-14, 9); context.closePath(); context.fillStyle = "#b7954d"; context.fill(); stroke();
          ellipse(-7, 3, 6, 6, "#665d48"); ellipse(7, 3, 6, 6, "#665d48");
          ellipse(-7, 3, 2.6, 2.6, "#b9d4c5", dark); ellipse(7, 3, 2.6, 2.6, "#b9d4c5", dark);
          context.beginPath(); context.roundRect(-5, 9, 10, 8, 3); context.fillStyle = main; context.fill(); stroke();
          ellipse(0, 14, 3.4, 3.4, "#a5c0ae");
        } else if (characterId === "selene") {
          context.beginPath(); context.arc(0, 2, 15, Math.PI, Math.PI * 2); context.lineTo(15, 4); context.lineTo(-15, 4); context.closePath(); context.fillStyle = main; context.fill(); stroke();
          for (const side of [-1, 1]) fillPolygon([[side * 13, -11], [side * 18, -19], [side * 18, -7]], accent, dark);
          context.beginPath(); context.arc(0, -20, 8, .2, Math.PI * 1.82); stroke("#d9f5ff", 2);
          ellipse(0, -20, 1.4, 1.4, "#d9f5ff", "#d9f5ff");
        } else if (characterId === "aurelia") {
          for (let i = 0; i < 5; i++) {
            const xx = -12 + i * 6;
            fillPolygon([[xx - 3, -8], [xx, -19 - (i % 2) * 5], [xx + 4, -8]], accent, "#9b772f");
          }
          context.beginPath(); context.moveTo(-14, -8); context.quadraticCurveTo(0, -2, 14, -8); context.lineTo(15, 16); context.quadraticCurveTo(0, 23, -15, 16); context.closePath(); context.fillStyle = "#f3e5bb"; context.fill(); stroke("#a78a47");
          ellipse(0, -13, 2, 2, "#fff6c9", "#a58949");
        } else if (characterId === "draven") {
          fillPolygon([[-16, -3], [-23, -23], [-9, -15], [-3, -22], [0, -12], [5, -22], [10, -14], [23, -24], [16, -2], [11, 10], [0, 17], [-11, 10]], dark, "#15131a");
          fillPolygon([[-10, 1], [-3, -3], [-1, 11], [-9, 7]], main, accent);
          fillPolygon([[10, 1], [3, -3], [1, 11], [9, 7]], main, accent);
          fillPolygon([[-3, 8], [0, 4], [3, 8], [0, 13]], accent, dark);
        } else if (characterId === "seraphine") {
          context.beginPath(); context.ellipse(0, -18, 15, 5, 0, Math.PI, Math.PI * 2); stroke("#ffe68c", 2.5);
          fillPolygon([[-14, -6], [-13, 8], [-19, 16], [-8, 12], [-4, 18], [0, 10], [5, 18], [10, 11], [18, 16], [13, 6], [14, -6]], accent, "#9f8344");
          ellipse(0, -10, 2, 2, "#fff3bf", "#a48646");
        } else if (characterId === "mimi") {
          context.beginPath(); context.arc(0, 3, 14, Math.PI, Math.PI * 2); context.lineTo(14, 2); context.lineTo(-14, 2); context.closePath(); context.fillStyle = "#67472e"; context.fill(); stroke();
          ellipse(-7, -1, 6, 5, "#667a7b"); ellipse(7, -1, 6, 5, "#667a7b");
          ellipse(-7, -1, 3, 3, "#a7d5d4", dark); ellipse(7, -1, 3, 3, "#a7d5d4", dark);
          context.beginPath(); context.moveTo(-1, -1); context.lineTo(1, -1); stroke("#cba263", 2);
          for (const side of [-1, 1]) {
            ellipse(side * 17, -5, 5, 5, "#987140", dark);
            ellipse(side * 17, -5, 2, 2, accent, dark);
          }
        } else if (characterId === "mortis") {
          fillPolygon([[-18, 12], [-18, -7], [-10, -19], [2, -22], [17, -12], [18, 7], [11, 17], [9, -7], [1, -13], [-9, -5], [-9, 14]], main, "#252630");
          ellipse(-5, 3, 2.2, 1.5, "#8eeaff", "#304953");
          ellipse(5, 3, 2.2, 1.5, "#8eeaff", "#304953");
          ellipse(20, -8, 2, 3, "#a4eaff", "#304953");
        } else if (characterId === "solara") {
          for (let i = 0; i < 7; i++) {
            const xx = -15 + i * 5;
            fillPolygon([[xx - 3, -8], [xx, -20 - (i % 3) * 4], [xx + 4, -8]], i % 2 ? "#ff9a42" : "#ffd056", "#9b4c2b");
          }
          context.beginPath(); context.arc(0, -2, 14, Math.PI, Math.PI * 2); context.lineTo(14, 8); context.lineTo(-14, 8); context.closePath(); context.fillStyle = main; context.fill(); stroke("#79462e");
          ellipse(0, -12, 4, 3, "#ffdc67", "#9b5b28");
          context.beginPath(); context.arc(0, -12, 7, .2, Math.PI * 1.8); stroke("#fff0a5", 1.2);
        }
        context.restore();
      }
      function drawEnemy(enemy, camX, camY) {
        const x = enemy.x - camX;
        const y = enemy.y - camY;
        ctx.save();
        ctx.translate(x, y);
        if (enemy.chargeWindup > 0) {
          ctx.strokeStyle = `rgba(255,75,64,${.45 + Math.sin(state.time * 24) * .25})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(enemy.chargeDx * 260, enemy.chargeDy * 260);
          ctx.stroke();
        }
        ctx.fillStyle = enemy.hitFlash ? "#fff4ce" : enemy.type.color;
        ctx.strokeStyle = enemy.elite ? "#ffdc85" : "rgba(15,9,17,.8)";
        ctx.lineWidth = enemy.elite ? 3 : 2;
        if (enemy.type.shape === "circle") {
          ctx.beginPath(); ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#21151f"; ctx.beginPath(); ctx.arc(-3, -1, 1.5, 0, 7); ctx.arc(3, -1, 1.5, 0, 7); ctx.fill();
        } else if (enemy.type.shape === "triangle") {
          polygon(0, 0, enemy.radius, 3, -Math.PI / 2); ctx.fill(); ctx.stroke();
        } else if (enemy.type.shape === "square") {
          ctx.rotate(Math.PI / 4); ctx.fillRect(-enemy.radius * .72, -enemy.radius * .72, enemy.radius * 1.44, enemy.radius * 1.44); ctx.strokeRect(-enemy.radius * .72, -enemy.radius * .72, enemy.radius * 1.44, enemy.radius * 1.44);
        } else if (enemy.type.shape === "diamond") {
          polygon(0, 0, enemy.radius, 4, 0); ctx.fill(); ctx.stroke();
        } else {
          polygon(0, 0, enemy.radius, 6, Math.PI / 6); ctx.fill(); ctx.stroke();
        }
        if (enemy.elite) {
          ctx.strokeStyle = "rgba(255,220,133,.45)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(0, 0, enemy.radius + 5 + Math.sin(state.time * 5) * 2, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = "#f7dfad"; ctx.font = "700 9px Inter"; ctx.textAlign = "center"; ctx.fillText("GUARDIAN", 0, -enemy.radius - 11);
        }
        if (enemy.burnTimer > 0) {
          ctx.fillStyle = "#ff9a56";
          ctx.font = "700 10px Inter";
          ctx.textAlign = "center";
          ctx.fillText(`🔥${enemy.burnStacks}`, 0, enemy.radius + 12);
        } else if (enemy.slowTimer > 0) {
          ctx.fillStyle = "#a9c9ff";
          ctx.font = "700 10px Inter";
          ctx.textAlign = "center";
          ctx.fillText("❄", 0, enemy.radius + 12);
        }
        ctx.restore();
      }
      function drawHeldWeapon(x, y) {
        const name = Object.keys(state.inventory)[0];
        if (!name) return;
        const baseName = evolutionData[name] ? evolutionData[name].weapon : name;
        const target = nearestEnemy(600);
        const angle = target ? Math.atan2(target.y - state.player.y, target.x - state.player.x) : 0;
        ctx.save();
        ctx.translate(x + 5, y + 5);
        ctx.rotate(angle);
        ctx.lineCap = "round";
        if (baseName === "Magic Wand") {
          ctx.strokeStyle = "#77502f"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(-2, 7); ctx.lineTo(22, -7); ctx.stroke();
          ctx.strokeStyle = "#d5ab68"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(2, 4); ctx.lineTo(19, -6); ctx.stroke();
          ctx.fillStyle = evolutionData[name] ? "#fff2a8" : "#8be7f5";
          ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 9;
          ctx.beginPath(); ctx.arc(24, -9, 5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        } else if (baseName === "Whip") {
          ctx.strokeStyle = "#d9bc8b"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-2, 7); ctx.quadraticCurveTo(12, -3, 21, -13); ctx.stroke();
          ctx.strokeStyle = "#f2e0bc"; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(1, 5); ctx.quadraticCurveTo(14, -5, 22, -13); ctx.stroke();
          ctx.fillStyle = "#70472d"; ctx.fillRect(-4, 4, 8, 5);
        } else if (baseName === "Garlic") {
          ctx.fillStyle = "#e5ddbd"; ctx.strokeStyle = "#898467"; ctx.lineWidth = 1;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.ellipse(9 + i * 4, -2 + (i % 2) * 5, 4, 6, .4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
        } else if (baseName === "Cross") {
          ctx.fillStyle = "#e9e0c2"; ctx.strokeStyle = "#90774f"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(23, 0); ctx.lineTo(-1, -4); ctx.lineTo(-5, 0); ctx.lineTo(-1, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#bd985c"; ctx.fillRect(2, -7, 3, 14);
        } else if (baseName === "Soul Bind Chain") {
          ctx.strokeStyle = "#bcaaa4"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-3, 4); ctx.lineTo(4, -1); ctx.lineTo(10, 4); ctx.lineTo(16, -2); ctx.lineTo(23, 2); ctx.stroke();
          ctx.fillStyle = "#d8c5a6"; ctx.beginPath(); ctx.arc(24, 1, 3, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Starlight Shard") {
          ctx.fillStyle = "#8edcff"; ctx.strokeStyle = "#e7f8ff"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(25, 0); ctx.lineTo(8, -5); ctx.lineTo(-1, 0); ctx.lineTo(8, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#fff4c1"; ctx.beginPath(); ctx.arc(4, 0, 2, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Infernal Flask") {
          ctx.fillStyle = "#a94531"; ctx.strokeStyle = "#ffc06e"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(7, -9); ctx.lineTo(14, -9); ctx.lineTo(13, -5); ctx.quadraticCurveTo(23, 0, 19, 9); ctx.quadraticCurveTo(10, 13, 3, 7); ctx.quadraticCurveTo(1, 0, 8, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#ffd15f"; ctx.beginPath(); ctx.arc(12, 3, 3, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Chrono Gear") {
          ctx.fillStyle = "#8c83d2"; ctx.strokeStyle = "#e4dcff"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(11, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#fff1bb"; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(11, -5); ctx.moveTo(11, 0); ctx.lineTo(15, 2); ctx.stroke();
          for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4;
            ctx.fillStyle = "#c3baff"; ctx.fillRect(9 + Math.cos(a) * 9, -2 + Math.sin(a) * 9, 4, 4);
          }
        } else if (baseName === "Rusted Dagger" || baseName === "Soul Flintlock") {
          if (baseName === "Soul Flintlock") {
            ctx.fillStyle = "#51413b"; ctx.strokeStyle = "#b9a795"; ctx.lineWidth = 1.5;
            ctx.fillRect(1, -5, 19, 9); ctx.strokeRect(1, -5, 19, 9);
            ctx.fillStyle = "#805b43"; ctx.fillRect(4, 4, 6, 9);
            ctx.fillStyle = "#d1c5a7"; ctx.fillRect(20, -2, 7, 3);
          } else {
            ctx.fillStyle = "#c6c1b3"; ctx.strokeStyle = "#665d54"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(25, 0); ctx.lineTo(-5, -3); ctx.lineTo(-9, 0); ctx.lineTo(-5, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#76523a"; ctx.fillRect(-2, 3, 5, 6);
          }
        } else if (baseName === "Apprentice Wand" || baseName === "Lightning Rod") {
          ctx.strokeStyle = baseName === "Lightning Rod" ? "#a4dfff" : "#8a603c"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(-1, 8); ctx.lineTo(20, -7); ctx.stroke();
          ctx.fillStyle = baseName === "Lightning Rod" ? "#d9f6ff" : "#a8ebff";
          ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.moveTo(22, -13); ctx.lineTo(17, -4); ctx.lineTo(23, -6); ctx.lineTo(19, 1); ctx.lineTo(29, -9); ctx.lineTo(23, -7); ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
        } else if (baseName === "Spiked Rotor" || baseName === "Solar Discus") {
          ctx.strokeStyle = baseName === "Solar Discus" ? "#ffda7e" : "#b6d99e"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(11, 0, 10, 0, Math.PI * 2); ctx.stroke();
          for (let i = 0; i < 4; i++) {
            const a = i * Math.PI / 2;
            ctx.beginPath(); ctx.moveTo(11 + Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(11 + Math.cos(a) * 16, Math.sin(a) * 16); ctx.stroke();
          }
        } else if (baseName === "Poison Flask") {
          ctx.fillStyle = "#4a8b43"; ctx.strokeStyle = "#c5ff9b"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(8, -9); ctx.lineTo(14, -9); ctx.lineTo(13, -5); ctx.quadraticCurveTo(23, 0, 19, 9); ctx.quadraticCurveTo(10, 13, 3, 7); ctx.quadraticCurveTo(1, 0, 8, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#b6ef75"; ctx.beginPath(); ctx.arc(12, 3, 3, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Grim Reaper's Scythe") {
          ctx.strokeStyle = "#9c7554"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-2, 9); ctx.lineTo(15, -9); ctx.stroke();
          ctx.strokeStyle = "#e7e3dc"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -9); ctx.quadraticCurveTo(22, -15, 26, -5); ctx.quadraticCurveTo(18, -10, 12, -4); ctx.stroke();
        } else if (baseName === "Armageddon Cannon") {
          ctx.fillStyle = "#614544"; ctx.strokeStyle = "#ff9b65"; ctx.lineWidth = 2;
          ctx.fillRect(1, -7, 20, 14); ctx.strokeRect(1, -7, 20, 14);
          ctx.fillStyle = "#ffc46d"; ctx.beginPath(); ctx.arc(21, 0, 5, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Grave Siphon") {
          ctx.fillStyle = "#140b20"; ctx.strokeStyle = "#ce9fff"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(12, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#a86be6"; ctx.beginPath(); ctx.ellipse(12, 0, 15, 5, .5, 0, Math.PI * 2); ctx.stroke();
        } else if (baseName === "Soul Bind Chain") {
          ctx.strokeStyle = "#b8aaa1"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(2, -1); ctx.lineTo(8, 4); ctx.lineTo(14, -2); ctx.lineTo(20, 3); ctx.stroke();
          ctx.fillStyle = "#d9c9aa"; ctx.beginPath(); ctx.arc(22, 3, 4, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Starlight Shard") {
          ctx.fillStyle = "#8edcff"; ctx.strokeStyle = "#effaff"; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(8, -5); ctx.lineTo(-1, 0); ctx.lineTo(8, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#fff4c1"; ctx.beginPath(); ctx.arc(5, 0, 2, 0, Math.PI * 2); ctx.fill();
        } else if (baseName === "Infernal Flask") {
          ctx.fillStyle = "#a94531"; ctx.strokeStyle = "#ffc06e"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(7, -9); ctx.lineTo(14, -9); ctx.lineTo(13, -5); ctx.quadraticCurveTo(23, 0, 19, 9); ctx.quadraticCurveTo(10, 13, 3, 7); ctx.quadraticCurveTo(1, 0, 8, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#ffd15f"; ctx.beginPath(); ctx.arc(12, 3, 3, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = "#805a42"; ctx.strokeStyle = "#dfca9e"; ctx.lineWidth = 1;
          ctx.fillRect(1, -7, 16, 14); ctx.strokeRect(1, -7, 16, 14);
          ctx.strokeStyle = "#dfca9e"; ctx.beginPath(); ctx.moveTo(9, -4); ctx.lineTo(9, 4); ctx.moveTo(6, 0); ctx.lineTo(12, 0); ctx.stroke();
        }
        ctx.restore();
      }
      function drawWorld() {
        const width = GAME_WIDTH;
        const height = GAME_HEIGHT;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();
        ctx.clearRect(0, 0, width, height);
        const player = state.player || { x: 0, y: 0 };
        const camX = player.x - width / 2;
        const camY = player.y - height / 2;
        drawTerrain(camX, camY, width, height);
        if (state.player) {
          const auraWeapon = state.inventory.Garlic || state.inventory["Soul Eater"];
          if (auraWeapon) {
            const evolved = !!state.inventory["Soul Eater"];
            const radius = (evolved ? 100 : 68) * (1 + passivePower("Tome of Area") * .15);
            const pulse = 1 + Math.sin(state.time * 7) * .035;
            ctx.fillStyle = evolved ? "rgba(196,207,114,.13)" : "rgba(174,178,102,.09)";
            ctx.strokeStyle = evolved ? "rgba(239,226,131,.5)" : "rgba(209,208,128,.3)";
            ctx.lineWidth = evolved ? 3 : 2;
            ctx.beginPath(); ctx.arc(width / 2, height / 2, radius * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.setLineDash([4, 8]);
            ctx.beginPath(); ctx.arc(width / 2, height / 2, radius * .78, state.time * 1.8, state.time * 1.8 + Math.PI * 1.5); ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        for (const gem of state.gems) {
          const x = gem.x - camX, y = gem.y - camY;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
          ctx.fillStyle = gem.color; ctx.shadowColor = gem.color; ctx.shadowBlur = 10;
          ctx.fillRect(-4, -4, 8, 8); ctx.restore();
        }
        for (const enemy of state.enemies) drawEnemy(enemy, camX, camY);
        for (const slash of state.slashes) {
          const x = slash.x - camX, y = slash.y - camY;
          ctx.save();
          ctx.globalAlpha = Math.max(0, slash.life / slash.maxLife);
          if (slash.kind === "lightning") {
            ctx.strokeStyle = "#b9eaff"; ctx.lineWidth = 3; ctx.shadowColor = "#65bfff"; ctx.shadowBlur = 14;
            ctx.beginPath(); ctx.moveTo(x, y);
            for (let i = 1; i < 6; i++) ctx.lineTo(x + (slash.targetX - slash.x) * i / 5 + (i % 2 ? -8 : 8), y + (slash.targetY - slash.y) * i / 5);
            ctx.stroke();
          } else if (slash.kind === "scythe" || slash.kind === "critBlast") {
            ctx.translate(x, y);
            ctx.strokeStyle = slash.kind === "scythe" ? "#ff8997" : "#dda5ff";
            ctx.lineWidth = slash.kind === "scythe" ? 11 : 5;
            ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20;
            const radius = slash.kind === "critBlast" ? slash.radius * (1 - slash.life / slash.maxLife * .25) : slash.radius;
            ctx.beginPath();
            if (slash.kind === "scythe") ctx.arc(0, 0, radius, slash.direction < 0 ? Math.PI * .52 : -Math.PI * .52, slash.direction < 0 ? Math.PI * 1.48 : Math.PI * .52);
            else ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
          } else if (slash.kind === "chain") {
            ctx.translate(x, y);
            ctx.strokeStyle = slash.evolved ? "#ff7f73" : "#c3a59b";
            ctx.lineWidth = slash.evolved ? 8 : 5;
            ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16;
            ctx.beginPath(); ctx.arc(0, 0, slash.radius * (1.05 - slash.life / slash.maxLife * .15), 0, Math.PI * 2); ctx.stroke();
            ctx.setLineDash([5, 6]);
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, slash.radius * .78, state.time * 2, state.time * 2 + Math.PI * 1.55); ctx.stroke();
          } else {
            ctx.translate(x + slash.direction * 7, y);
            if (slash.direction < 0) ctx.scale(-1, 1);
            ctx.strokeStyle = slash.evolved ? "#ff8b9a" : "#f0d394";
            ctx.lineWidth = slash.evolved ? 7 : 5;
            ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(0, 0, slash.evolved ? 47 : 35, -Math.PI * .72, Math.PI * .72); ctx.stroke();
          }
          ctx.restore();
        }
        for (const hazard of state.hazards) {
          const x = hazard.x - camX, y = hazard.y - camY;
          const flicker = .9 + Math.sin(state.time * 13 + x) * .08;
          ctx.save();
          ctx.globalAlpha = Math.min(.72, hazard.life / .7) * .75;
          if (hazard.kind === "blackhole") {
            const gradient = ctx.createRadialGradient(x, y, 2, x, y, hazard.radius);
            gradient.addColorStop(0, "rgba(5,2,12,.96)");
            gradient.addColorStop(.3, "rgba(65,30,98,.7)");
            gradient.addColorStop(1, "rgba(193,132,255,0)");
            ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, hazard.radius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#d6a7ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, hazard.radius * .72, hazard.radius * .34, state.time * 2, 0, Math.PI * 2); ctx.stroke();
          } else if (hazard.kind === "meteor") {
            const progress = 1 - hazard.life / .8;
            ctx.strokeStyle = "#ff9a62"; ctx.lineWidth = 12 * (1 - progress) + 2; ctx.shadowColor = "#ff6a45"; ctx.shadowBlur = 28;
            ctx.beginPath(); ctx.arc(x, y, hazard.radius * progress, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = `rgba(255,130,75,${Math.max(0, .35 * (1 - progress))})`; ctx.beginPath(); ctx.arc(x, y, hazard.radius * progress, 0, Math.PI * 2); ctx.fill();
          } else {
            const colors = hazard.poison
              ? ["rgba(190,255,120,.68)", "rgba(75,175,63,.42)", "rgba(31,89,36,0)"]
              : ["rgba(255,205,91,.68)", "rgba(247,94,35,.42)", "rgba(119,30,23,0)"];
            const fire = ctx.createRadialGradient(x, y, 4, x, y, hazard.radius * flicker);
            fire.addColorStop(0, colors[0]); fire.addColorStop(.45, colors[1]); fire.addColorStop(1, colors[2]);
            ctx.fillStyle = fire; ctx.beginPath(); ctx.arc(x, y, hazard.radius * flicker, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
        for (const attack of state.enemyAttacks) {
          const x = attack.x - camX, y = attack.y - camY;
          const progress = 1 - attack.life / attack.maxLife;
          ctx.save();
          ctx.globalAlpha = .25 + progress * .55;
          ctx.fillStyle = "rgba(223,77,105,.32)";
          ctx.strokeStyle = "#ff6b80";
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(x, y, attack.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, attack.radius * Math.max(.08, 1 - progress), 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }
        if (state.chest && !state.chest.opened) {
          const x = state.chest.x - camX, y = state.chest.y - camY;
          ctx.fillStyle = "#d9a84e";
          ctx.strokeStyle = "#ffe5a5"; ctx.lineWidth = 2;
          ctx.fillRect(x - 11, y - 8, 22, 16); ctx.strokeRect(x - 11, y - 8, 22, 16);
          ctx.fillStyle = "#694625"; ctx.fillRect(x - 3, y - 5, 6, 8);
          if (Math.hypot(state.chest.x - player.x, state.chest.y - player.y) < 125) {
            ctx.fillStyle = "#ffe5a5"; ctx.font = "800 9px Inter"; ctx.textAlign = "center"; ctx.fillText("TREASURE · WALK NEAR", x, y - 15);
          }
        }
        for (const projectile of state.projectiles) {
          if (!Number.isFinite(projectile.x)) continue;
          const x = projectile.x - camX, y = projectile.y - camY;
          ctx.save(); ctx.translate(x, y);
          if (projectile.kind === "sword") ctx.rotate(Math.atan2(projectile.vy, projectile.vx) + state.time * 7);
          else if (projectile.orbit) ctx.rotate(projectile.angle);
          else if (Number.isFinite(projectile.vx) && Number.isFinite(projectile.vy)) ctx.rotate(Math.atan2(projectile.vy, projectile.vx));
          ctx.fillStyle = projectile.color; ctx.shadowColor = projectile.color; ctx.shadowBlur = 12;
          if (projectile.kind === "sword") {
            ctx.fillStyle = "#eee8d4"; ctx.strokeStyle = "#ac8d5d"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-7, -4); ctx.lineTo(-11, 0); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#c29b5e"; ctx.fillRect(-3, -7, 3, 14); ctx.fillRect(-9, -2, 8, 4);
          } else if (projectile.orbit) {
            ctx.fillStyle = projectile.color;
            ctx.fillRect(-6, -8, 12, 16);
            ctx.strokeStyle = "#f3dfae"; ctx.lineWidth = 1;
            ctx.strokeRect(-6, -8, 12, 16);
            ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.stroke();
          } else if (projectile.kind === "star") {
            ctx.beginPath(); ctx.moveTo(projectile.radius + 3, 0); ctx.lineTo(0, -projectile.radius); ctx.lineTo(-projectile.radius, 0); ctx.lineTo(0, projectile.radius); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#fff9d8"; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
          } else if (projectile.kind === "flask") {
            ctx.fillStyle = "#ac482d"; ctx.strokeStyle = "#ffd083"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(-6, -8, 12, 16, 4); ctx.fill(); ctx.stroke();
          } else if (projectile.kind === "dagger") {
            ctx.fillStyle = projectile.color; ctx.strokeStyle = "#f5edda"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(projectile.radius + 6, 0); ctx.lineTo(-projectile.radius, -3); ctx.lineTo(-projectile.radius - 4, 0); ctx.lineTo(-projectile.radius, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
          } else if (projectile.kind === "discus") {
            ctx.strokeStyle = "#fff0a8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-projectile.radius, 0); ctx.lineTo(projectile.radius, 0); ctx.moveTo(0, -projectile.radius); ctx.lineTo(0, projectile.radius); ctx.stroke();
            ctx.fillStyle = "#ffe06a"; ctx.beginPath(); ctx.arc(0, 2, 3, 0, Math.PI * 2); ctx.fill();
          } else if (projectile.kind === "gear") {
            ctx.rotate(projectile.rotation || 0);
            ctx.strokeStyle = projectile.color; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -6); ctx.moveTo(0, 0); ctx.lineTo(5, 3); ctx.stroke();
            ctx.strokeRect(-projectile.radius - 3, -projectile.radius - 3, (projectile.radius + 3) * 2, (projectile.radius + 3) * 2);
          } else if (projectile.kind === "bolt") {
            ctx.rotate(state.time * 5);
            ctx.beginPath(); ctx.moveTo(projectile.radius + 3, 0); ctx.lineTo(0, -projectile.radius); ctx.lineTo(-projectile.radius, 0); ctx.lineTo(0, projectile.radius); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#fff9d8"; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        for (const particle of state.particles) {
          ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
          ctx.fillStyle = particle.color;
          ctx.beginPath(); ctx.arc(particle.x - camX, particle.y - camY, particle.size, 0, Math.PI * 2); ctx.fill();
        }
        for (const text of state.hitTexts) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, text.life / text.maxLife);
          ctx.fillStyle = text.color;
          ctx.strokeStyle = "rgba(22,14,13,.9)";
          ctx.lineWidth = 3;
          ctx.font = text.text.startsWith("CRIT") ? "800 12px Inter" : "700 10px Inter";
          ctx.textAlign = "center";
          ctx.strokeText(text.text, text.x - camX, text.y - camY);
          ctx.fillText(text.text, text.x - camX, text.y - camY);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (state.player) {
          const x = width / 2, y = height / 2;
          ctx.save();
          if (state.player.invulnerable > 0 && Math.floor(state.time * 18) % 2) ctx.globalAlpha = .45;
          ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.beginPath(); ctx.ellipse(x, y + 9, 13, 6, 0, 0, Math.PI * 2); ctx.fill();
          drawHeldWeapon(x, y);
          drawCharacterSkin(ctx, x, y, state.player.radius * 3.2, state.player.skinId);
          ctx.restore();
        } else {
          ctx.fillStyle = "#f4c94f"; ctx.strokeStyle = "#fff0a1"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(width / 2, height / 2, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      function frame(now) {
        const dt = Math.min(.04, Math.max(0, (now - state.lastFrame) / 1000));
        state.lastFrame = now;
        update(dt);
        drawWorld();
        requestAnimationFrame(frame);
      }

      $("solo-mode-button").addEventListener("click", showCharacterScreen);
      $("back-to-modes").addEventListener("click", showModeScreen);
      $("cancel-character").addEventListener("click", () => $("character-confirm").classList.add("hidden"));
      $("confirm-character").addEventListener("click", startGame);
      $("level-reroll").addEventListener("click", rerollUpgrades);
      $("level-skip").addEventListener("click", skipLevelUp);
      $("history-button").addEventListener("click", showHistory);
      $("history-back").addEventListener("click", () => { showModeScreen(); setOverlay("menu-overlay"); });
      $("pause-button").addEventListener("click", () => {
        if (state.mode === "running") { state.mode = "paused"; setOverlay("pause-overlay"); }
      });
      $("resume-button").addEventListener("click", () => { state.mode = "running"; setOverlay(null); state.lastFrame = performance.now(); });
      $("quit-button").addEventListener("click", () => {
        recordRun("Abandoned");
        state.mode = "menu"; showHud(false); showModeScreen(); setOverlay("menu-overlay"); updateMenu();
      });
      $("return-button").addEventListener("click", () => {
        state.mode = "menu"; showHud(false); showModeScreen(); setOverlay("menu-overlay"); updateMenu();
      });
      function movementKey(event) {
        const codeKeys = { KeyW: "w", KeyA: "a", KeyS: "s", KeyD: "d" };
        return codeKeys[event.code] || (event.key.length === 1 ? event.key.toLowerCase() : event.key);
      }
      document.addEventListener("keydown", (event) => {
        const key = movementKey(event);
        if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
        if (event.code === "Space" && !event.repeat && state.mode === "running") state.dashRequested = true;
        if (key === "w" || key === "a" || key === "s" || key === "d" ||
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
          state.keys[key] = true;
        }
        if (event.key === "Escape") {
          if (state.mode === "running") { state.mode = "paused"; setOverlay("pause-overlay"); }
          else if (state.mode === "paused") { state.mode = "running"; setOverlay(null); state.lastFrame = performance.now(); }
        }
      }, true);
      document.addEventListener("keyup", (event) => {
        state.keys[movementKey(event)] = false;
      }, true);
      canvas.addEventListener("pointerdown", () => canvas.focus({ preventScroll: true }));
      window.addEventListener("blur", () => { state.keys = {}; });
      window.addEventListener("resize", resize);
      loadSave();
      resize();
      updateMenu();
      requestAnimationFrame((now) => { state.lastFrame = now; frame(now); });
    })();
  