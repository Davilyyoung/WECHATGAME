const MP_BAR_IMG = 'res/playerinfo/mp/images/m1_hp.png'; // 能量图片
const MP_BAR_BAR_IMG = 'res/playerinfo/mp/images/m1_hp_bar.png'; // 能量背景

const MP_BAR_WIDTH = 12;
const MP_BAR_HEIGHT = 161;

const MP_BAR_BAR_WIDTH = 25;
const MP_BAR_BAR_HEIGHT = 174;

const INITIAL_MP = 0; // 初始能量值为 0
const MAX_MP = 3; // 最大能量为 3
const INITIAL_COMBAT_POWER = 0; // 初始战斗力为 0

export default class PlayerInfo {
  constructor() {
    this.maxMp = MAX_MP; // 设置最大能量
    
    // 从 LocalStorage 读取数据，并确保值为有效数字
    const savedMp = localStorage.getItem('playerMp');
    const savedMpFullCount = localStorage.getItem('playerMpFullCount');
    const savedCombatPower = localStorage.getItem('playerCombatPower');

    // 使用 parseInt 检查并确保是有效数字
    this.mp = savedMp !== null && !isNaN(parseInt(savedMp, 10)) ? parseInt(savedMp, 10) : INITIAL_MP; // 当前能量值
    // 使用 parseInt 检查并确保有效数字
    this.mpFullCount = savedMpFullCount !== null && !isNaN(parseInt(savedMpFullCount, 10)) ? parseInt(savedMpFullCount, 10) : 0; // 能量满的次数
    // 修改这里，确保从 localStorage 读取的值为有效数字
    this.combatPower = savedCombatPower !== null && !isNaN(parseInt(savedCombatPower, 10)) ? parseInt(savedCombatPower, 10) : INITIAL_COMBAT_POWER; // 战斗力
    // 战斗力
    console.log("this.combatPower", this.combatPower)
    // 计算能量条位置，使其靠近屏幕右边并垂直居中
    this.mpBarX = window.innerWidth - MP_BAR_BAR_WIDTH - 20; // 靠近屏幕右边，留20px的间距
    this.mpBarY = (window.innerHeight - MP_BAR_BAR_HEIGHT) / 2 + 100; // 垂直居中
  
    this.loadImages(); // 预加载能量条图片
  }

  // 预加载图片
  loadImages() {
    this.mpImage = new Image();
    this.mpImage.src = MP_BAR_IMG;

    this.mpBarImage = new Image();
    this.mpBarImage.src = MP_BAR_BAR_IMG;
  }

  // 更新能量值，正值表示增加能量，负值表示减少能量
  updateMp(value) {
    this.mp = Math.max(0, Math.min(this.maxMp, this.mp + value)); // 限制能量值在 0 到 maxMp 之间
    console.log("当前能量值：", this.mp);
    // 保存当前 mp 到 LocalStorage
    localStorage.setItem('playerMp', this.mp);

    // 能量满时，重置能量并增加满能量次数
    if (this.mp === this.maxMp) {
      console.log("能量已满，重置能量");
      this.mpFullCount++; // 每次满3时计数器加1
      localStorage.setItem('playerMpFullCount', this.mpFullCount); // 保存能量满的次数
      this.resetMp();
    }
  }

  // 更新战斗力
  updateCombatPower(value) {
    this.combatPower += value; // 增加或减少战斗力
    console.log("当前战斗力：", this.combatPower);
    localStorage.setItem('playerCombatPower', this.combatPower); // 保存战斗力到 LocalStorage
  }

  // 重置能量值
  resetMp() {
    this.mp = INITIAL_MP; // 重置能量为 0
    localStorage.setItem('playerMp', this.mp); // 保存重置后的 mp
  }

  // 绘制能量条背景
  renderBackground(ctx) {
    ctx.drawImage(this.mpBarImage, this.mpBarX, this.mpBarY, MP_BAR_BAR_WIDTH, MP_BAR_BAR_HEIGHT);
  }

   // 绘制战斗力
   renderCombatPower(ctx) {
    ctx.font = '20px Arial'; // 设置字体大小和样式
    ctx.fillStyle = 'yellow'; // 设置字体颜色为黄色
    ctx.textAlign = 'center'; // 文本居中
    ctx.fillText(`战斗力: ${this.combatPower}`, window.innerWidth / 2, window.innerHeight / 2 + 350); // 在能量条下方显示战斗力
  }

  // 绘制能量满的次数
  renderMpFullCount(ctx) {
    ctx.font = '20px Arial'; // 设置字体大小和样式
    ctx.fillStyle = 'white'; // 设置字体颜色
    ctx.textAlign = 'center'; // 文本居中
    ctx.fillText(this.mpFullCount, this.mpBarX + MP_BAR_BAR_WIDTH / 2, this.mpBarY - 10); // 在能量条上方绘制计数器
  }
 
  // 绘制
  render(ctx) {
    // 根据当前能量值从下往上绘制能量条
    for (let i = 0; i < this.mp; i++) {
      const yPosition = this.mpBarY + MP_BAR_BAR_HEIGHT - 6.5 - (i + 1) * (MP_BAR_HEIGHT / this.maxMp); // 从底部往上计算 Y 位置
      ctx.drawImage(this.mpImage, this.mpBarX + 6.5, yPosition, MP_BAR_WIDTH, MP_BAR_HEIGHT / this.maxMp);
    }
    this.renderBackground(ctx); // 绘制背景
    this.renderMpFullCount(ctx); // 绘制能量满的次数
    this.renderCombatPower(ctx); // 绘制战斗力
  }
}
