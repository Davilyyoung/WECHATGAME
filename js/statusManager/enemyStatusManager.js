import Sprite from '../base/sprite';

//const HEALTH_BAR_IMG_SRC = 'res/hp/enemy/images/h1.png'; // 血条图片
const HEALTH_BAR_IMG_SRC1 = 'res/hp/enemy/images/m1.png'; // 血条图片
const HEALTH_BAR_IMG_SRC2 = 'res/hp/enemy/images/m2.png'; // 血条图片
const HEALTH_BAR_IMG_SRC3 = 'res/hp/enemy/images/m3.png'; // 血条图片
const HEALTH_BAR_IMG_SRC4 = 'res/hp/enemy/images/m4.png'; // 血条图片
const HEALTH_BAR_WIDTH = 205 / 5;
const HEALTH_BAR_HEIGHT = 206 / 5;
const INITIAL_HP = 4; // 初始生命值为 3

export default class EnemyStatusManager{
  constructor(onDeathCallback = () => {}) {
    //super(HEALTH_BAR_IMG_SRC1, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    
    this.maxHp = INITIAL_HP; // 最大生命值
    this.hp = INITIAL_HP; // 当前生命值
    this.hpBarX = 20; // 血条初始 X 位置
    this.hpBarY = 50; // 血条初始 Y 位置
    this.hpBarSpacing = 10; // 每个血条图片之间的间隔
    this.onDeathCallback = onDeathCallback; // 保存回调函数

    // 预先加载和缓存所有血条图片
    this.healthBarImages = {};
    this.loadImages();
  }


  // 预加载所有血条图片并缓存
  loadImages() {
    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();
    const img4 = new Image();

    img1.src = HEALTH_BAR_IMG_SRC1;
    img2.src = HEALTH_BAR_IMG_SRC2;
    img3.src = HEALTH_BAR_IMG_SRC3;
    img4.src = HEALTH_BAR_IMG_SRC4;

    this.healthBarImages[4] = img1;
    this.healthBarImages[3] = img2;
    this.healthBarImages[2] = img3;
    this.healthBarImages[1] = img4;
  }

  // // 更新生命值，正值表示回血，负值表示掉血
  // updateHp(value) {
  //   this.hp = Math.max(0, Math.min(this.maxHp, this.hp + value)); // 限制血量在 0 到 maxHp 之间
  //   console.log("怪物剩余HP ", this.hp)
  //   if (this.hp === 0) {
  //     console.log("敌人已死亡");
  //     this.onDeathCallback(); // 调用死亡回调函数
  //   }
  // }

  // // 绘制血条
  // render(ctx) {
  //   for (let i = 0; i < this.hp; i++) {
  //     const xPosition = this.hpBarX + i * (HEALTH_BAR_WIDTH + this.hpBarSpacing); // 每个图片的 X 位置
  //     ctx.drawImage(this.img, xPosition, this.hpBarY, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT); // 绘制血条图片
  //   }
  // }

  // // 重置敌人的生命值
  // resetHp() {
  //   this.hp = this.maxHp;
  // }

  // 更新生命值，正值表示回血，负值表示掉血
  updateHp(value) {
    this.hp = Math.max(0, Math.min(this.maxHp, this.hp + value)); // 限制血量在 0 到 maxHp 之间
    console.log("怪物剩余HP ", this.hp);

    if (this.hp === 0) {
      console.log("敌人已死亡");
      this.onDeathCallback(); // 调用死亡回调函数
    }
  }

  // 获取当前血量对应的血条图片
  getCurrentHealthBarImage() {
    switch (this.hp) {
      case 4:
        return HEALTH_BAR_IMG_SRC1; // 4 血对应 m1
      case 3:
        return HEALTH_BAR_IMG_SRC2; // 3 血对应 m2
      case 2:
        return HEALTH_BAR_IMG_SRC3; // 2 血对应 m3
      case 1:
        return HEALTH_BAR_IMG_SRC4; // 1 血对应 m4
      default:
        return null; // 0 血不显示血条
    }
  }

  // 绘制血条
  render(ctx) {
    const currentImage = this.healthBarImages[this.hp];

    if (currentImage) {
      ctx.drawImage(currentImage, this.hpBarX, this.hpBarY, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
    }
  }

  // 重置敌人的生命值
  resetHp() {
    this.hp = this.maxHp;
  }
}
