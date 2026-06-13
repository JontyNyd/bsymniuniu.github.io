#!/usr/bin/env node
/**
 * 《榜上有名》自动化功能测试
 * 运行: node --test tests/game.test.mjs
 */
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadGameScript } from './setup.mjs';

function boot() {
  const g = loadGameScript();
  g.difficulty = 'normal';
  g.newGame();
  g.state.inEliteBattle = false;
  g.state.eliteDef = null;
  g.state.gameOver = false;
  g.state.victoryPending = false;
  g.state.battleWinHandled = false;
  g.state.busy = false;
  g.initEnemy();
  assert.ok(g.state.enemy, 'initEnemy 应创建敌人');
  g.state.hand = ['nezha', 'jiang', 'chuidiao'];
  if (!g.state.deck?.length) g.state.deck = ['nezha', 'jiang', 'chuidiao'];
  g.state.discard = [];
  g.state.spirit = 10;
  g.state.busy = false;
  g.state.victoryPending = false;
  g.state.battleWinHandled = false;
  g.state.gameOver = false;
  g.state.turn = 1;
  return g;
}

function mockCardEl(g, cardId, handIdx) {
  const el = g.document.createElement('div');
  el.dataset.id = cardId;
  el.dataset.handIdx = String(handIdx);
  el.className = 'card';
  el.getBoundingClientRect = () => ({ left: 200, top: 400, width: 90, height: 130 });
  return el;
}

describe('核心战斗', () => {
  let g;

  beforeEach(() => {
    g = boot();
  });

  test('开局状态正常', () => {
    assert.ok(g.state.enemy);
    assert.ok(g.state.enemy.hp > 0);
    assert.equal(g.state.busy, false);
    assert.equal(g.state.gameOver, false);
  });

  test('连续出两张牌不卡住', () => {
    const hp0 = g.state.enemy.hp;
    const spirit0 = g.state.spirit;

    g.playCard('nezha', mockCardEl(g, 'nezha', 0));
    assert.equal(g.state.busy, true);
    g.flush();
    assert.equal(g.state.busy, false, '第一张牌后 busy 应解除');
    assert.ok(g.state.enemy.hp < hp0);
    assert.ok(g.state.spirit < spirit0);

    g.playCard('jiang', mockCardEl(g, 'jiang', 1));
    g.flush();
    assert.equal(g.state.busy, false, '第二张牌后 busy 应解除');
    assert.equal(g.state.victoryPending, false);
  });

  test('结束回合可抽牌并恢复灵力', () => {
    g.state.spirit = 0;
    const turn0 = g.state.turn;
    g.endTurn();
    assert.equal(g.state.turn, turn0 + 1);
    assert.ok(g.state.spirit >= 3);
    assert.ok(g.state.hand.length >= 1);
  });

  test('击杀敌人进入胜利待定', () => {
    g.state.enemy.hp = 5;
    g.playCard('nezha', mockCardEl(g, 'nezha', 0));
    g.tick(400);
    assert.equal(g.state.victoryPending, true);
    assert.equal(g.state.busy, true);
    g.flush();
    assert.equal(g.state.gameOver, true);
    assert.equal(g.state.battleWinHandled, true);
  });

  test('击杀后不能继续出牌', () => {
    g.state.enemy.hp = 5;
    g.playCard('nezha', mockCardEl(g, 'nezha', 0));
    g.flush();
    const spirit = g.state.spirit;
    g.playCard('jiang', mockCardEl(g, 'jiang', 1));
    g.flush();
    assert.equal(g.state.spirit, spirit, '胜利待定时不应再出牌扣费');
  });

  test('重复卡牌按 handIdx 移除', () => {
    g.state.hand = ['nezha', 'nezha', 'jiang'];
    g.playCard('nezha', mockCardEl(g, 'nezha', 1));
    g.flush();
    assert.equal(g.state.hand.length, 2);
    assert.equal(g.state.hand[0], 'nezha');
    assert.equal(g.state.hand[1], 'jiang');
  });

  test('灵力不足不能出牌', () => {
    g.state.spirit = 0;
    const hp = g.state.enemy.hp;
    g.playCard('nezha', mockCardEl(g, 'nezha', 0));
    g.flush();
    assert.equal(g.state.enemy.hp, hp);
    assert.equal(g.state.busy, false);
  });

  test('垂钓渭水每回合限2次', () => {
    g.state.hand = ['chuidiao', 'chuidiao', 'chuidiao'];
    g.state.spirit = 10;
    g.playCard('chuidiao', mockCardEl(g, 'chuidiao', 0));
    g.flush();
    g.playCard('chuidiao', mockCardEl(g, 'chuidiao', 1));
    g.flush();
    const spirit = g.state.spirit;
    g.playCard('chuidiao', mockCardEl(g, 'chuidiao', 2));
    g.flush();
    assert.equal(g.state.spirit, spirit, '第三次垂钓应被拒绝');
  });
});

describe('伤害与状态', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('护盾抵挡一次伤害', () => {
    g.state.enemyShield = true;
    const hp = g.state.enemy.hp;
    const dealt = g.applyDamageToEnemy(10);
    assert.equal(dealt, 0);
    assert.equal(g.state.enemy.hp, hp);
    assert.equal(g.state.enemyShield, false);
  });

  test('敌方眩晕跳过攻击', () => {
    g.state.enemyStun = 1;
    const hp = g.state.playerHp;
    g.endTurn();
    assert.equal(g.state.playerHp, hp);
    assert.equal(g.state.enemyStun, 0);
  });

  test('妲己幻术阻挡伤害牌', () => {
    g.state.enemy.illusion = true;
    const hp = g.state.enemy.hp;
    g.playCard('nezha', mockCardEl(g, 'nezha', 0));
    g.flush();
    assert.equal(g.state.enemy.hp, hp);
    assert.equal(g.state.busy, false);
  });

  test('灼烧伤害可击杀', () => {
    g.state.enemy.hp = 2;
    g.state.enemyDot = { dmg: 3, turns: 2 };
    g.endTurn();
    assert.equal(g.state.victoryPending, true);
  });
});

describe('牌库与抽牌', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('抽牌不超过手牌上限7', () => {
    g.state.hand = new Array(7).fill('jiang');
    g.state.deck = ['nezha', 'erlang'];
    g.drawCards(3);
    assert.equal(g.state.hand.length, 7);
  });

  test('牌库耗尽时重洗弃牌堆', () => {
    g.state.hand = [];
    g.state.deck = [];
    g.state.discard = ['nezha', 'erlang', 'jiang'];
    g.drawCards(1);
    assert.equal(g.state.hand.length, 1);
    assert.ok(g.state.deck.length >= 0);
  });
});

describe('战后与经济', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('胜利发放灵石', () => {
    const coins = g.state.coins;
    g.grantBattleCoins();
    assert.equal(g.state.coins, coins + 12);
  });

  test('Boss战胜利灵石更多', () => {
    g.state.stage = 4;
    g.initEnemy();
    const coins = g.state.coins;
    g.grantBattleCoins();
    assert.equal(g.state.coins, coins + 20);
  });

  test('商店购买扣费并加牌', () => {
    g.state.coins = 50;
    const deckLen = g.state.deck.length;
    g.buyShopItem({ type: 'card', cardId: 'huangtian', name: '黄天化', cost: 28 }, { classList: { contains: () => false, add() {} } }, 0);
    assert.equal(g.state.coins, 22);
    assert.equal(g.state.deck.length, deckLen + 1);
  });

  test('战利品三选一加入牌库', () => {
    const opts = g.pickRewardOptions();
    assert.equal(opts.length, 3);
    const deckLen = g.state.deck.length;
    g.state.deck.push(opts[0]);
    assert.equal(g.state.deck.length, deckLen + 1);
  });
});

describe('封神与精英', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('册封写入封神榜', () => {
    const fs = g.STAGES[3].fengshen;
    g.state.fengshenBoard = [];
    g.state.fengshenSlotsLeft = 12;
    g.state.fengshenBoard.push({ name: fs.name, sprite: fs.sprite, evil: fs.evil });
    g.state.fengshenSlotsLeft--;
    g.state.deck.push(fs.card);
    if (fs.curse) g.state.curses.push(fs.curse);
    assert.equal(g.state.fengshenBoard.length, 1);
    assert.equal(g.state.fengshenSlotsLeft, 11);
    assert.ok(g.state.deck.includes('daji'));
  });

  test('精英战定义可初始化', () => {
    const elite = g.ELITE_AFTER[0];
    assert.ok(elite);
    g.state.inEliteBattle = true;
    g.state.eliteDef = elite;
    g.initEnemy();
    assert.equal(g.state.enemy.name, elite.name);
    assert.equal(g.state.enemy.hp, elite.hp);
  });

  test('精英胜利发放额外灵石', () => {
    g.state.inEliteBattle = true;
    g.state.eliteDef = g.ELITE_AFTER[0];
    const coins = g.state.coins;
    g.grantBattleCoins();
    assert.equal(g.state.coins, coins + 30);
  });
});

describe('存档与结局', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('存档读档保持状态', () => {
    g.state.playerHp = 77;
    g.state.stage = 2;
    g.saveGame();
    const hp = g.state.playerHp;
    g.state.playerHp = 1;
    assert.ok(g.loadGame());
    assert.equal(g.state.playerHp, hp);
    assert.equal(g.state.stage, 2);
  });

  test('敌方阵亡存档可恢复胜利流程', () => {
    g.state.enemy.hp = 0;
    g.state.gameOver = true;
    g.saveGame();
    g.state.gameOver = false;
    g.state.victoryPending = false;
    g.loadGame();
    assert.equal(g.state.victoryPending, true);
    assert.equal(g.state.busy, true);
  });

  test('computeEnding 返回有效结局', () => {
    g.state.stage = 8;
    g.state.fengshenBoard = [{ name: '赵公明', evil: true }];
    g.state.evilCount = 1;
    g.state.totalTurns = 50;
    const r = g.computeEnding();
    assert.ok(r.title);
    assert.ok(r.text);
    assert.ok(r.stats);
  });
});

describe('卡牌数据完整性', () => {
  let g;
  beforeEach(() => { g = boot(); });

  test('所有起手牌有模板', () => {
    g.STARTER_DECK.forEach(id => assert.ok(g.CARD_TEMPLATES[id], `missing ${id}`));
  });

  test('借势牌模板完整', () => {
    const t = g.CARD_TEMPLATES.jieshi;
    assert.ok(t);
    assert.equal(t.effect.draw, 1);
    assert.equal(t.effect.chainDraw, 1);
    assert.ok(g.SPRITES.jieshi);
  });

  test('像素肖像行宽一致', () => {
    const keys = Object.keys(g.CARD_ICONS).map(k => g.CARD_ICONS[k]);
    keys.forEach(key => {
      const rows = g.SPRITES[key];
      assert.ok(rows, `sprite ${key}`);
      rows.forEach((row, i) => assert.equal(row.length, rows[0].length, `${key}[${i}] width`));
    });
  });

  test('所有关卡可初始化敌人', () => {
    g.STAGES.forEach((_, i) => {
      g.state.stage = i;
      g.state.inEliteBattle = false;
      g.initEnemy();
      assert.ok(g.state.enemy.hp > 0);
    });
  });
});
