import Sprite from '../base/sprite';
import { MONSTER_TYPES } from './enemyConfig';  // 引入配置文件
import { getCenteredTopMonsterPosition } from '../enemyPlace/monsterPosition';  // 引入坐标函数

export default class Enemy extends Sprite {
  static lastMonsterIndex = null; // 保存上一次生成的怪物索引

  constructor() {
    const monsterType = Enemy.getRandomMonsterType(); // 随机选择怪物类型
    super(monsterType.frames[0], monsterType.width, monsterType.height); // 初始帧为第一个等待帧

    this.monsterType = monsterType;
    this.currentFrames = monsterType.frames;
    this.frameIndex = 0;
    this.frameCount = monsterType.frames.length;
    this.isAnimating = false;

    // 这里使用固定的怪物位置，而不是动态计算
    const { x, y } = getCenteredTopMonsterPosition(); // 可以替换为你想要的固定位置函数
    this.x = x; // 或者直接设置为固定值
    this.y = y; // 或者直接设置为固定值

    this.cachedImages = this.preloadImages(this.currentFrames); // 预加载图片

    this.startAnimation(); // 启动等待动画
    this.startAutoAttack(); // 启动自动攻击
  }

  // 获取随机怪物类型，避免连续生成相同的类型
  static getRandomMonsterType() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * MONSTER_TYPES.length);
    } while (randomIndex === Enemy.lastMonsterIndex); // 确保不生成相同的怪物

    Enemy.lastMonsterIndex = randomIndex; // 记录这次生成的怪物类型索引
    return MONSTER_TYPES[randomIndex];
  }
  
  // 预加载图片
  preloadImages(framePaths) {
    const images = framePaths.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    return images;
  }

  // 绘制到 Canvas 的方法，确保图片已经加载完成
  drawToCanvas(ctx) {
    if (this.cachedImages && this.cachedImages[this.frameIndex] && this.cachedImages[this.frameIndex].complete) {
      ctx.drawImage(this.cachedImages[this.frameIndex], this.x, this.y, this.width, this.height);
    }
  }

  // 开始播放动画
  startAnimation(fps = 30) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const frameDelay = 1000 / fps;
    let lastFrameTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        lastFrameTime = now;
      }

      if (this.isAnimating) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // 停止动画
  stopAnimation() {
    this.isAnimating = false;
  }

  // 怪物攻击
  attack() {
    if (this.currentFrames === this.monsterType.attackFrames) return;

    this.switchFrames(this.monsterType.attackFrames);

    setTimeout(() => {
      this.switchFrames(this.monsterType.frames); // 攻击结束后切回等待帧
    }, 800); // 攻击动画持续500ms
  }

   // 受击动画
   takeHit() {
    if (this.currentFrames === this.monsterType.hitFrames) return;

    this.switchFrames(this.monsterType.hitFrames);

    setTimeout(() => {
      this.switchFrames(this.monsterType.frames); // 受击动画结束后切回等待帧
    }, 300); // 受击动画持续300ms
  }

  // 自动攻击
  startAutoAttack() {
    this.autoAttackInterval = setInterval(() => {
      this.attack();
    }, 3000);
  }

  // 停止自动攻击
  stopAutoAttack() {
    clearInterval(this.autoAttackInterval);
  }

   // 切换帧序列
  switchFrames(newFrames) {
    this.currentFrames = newFrames;
    this.cachedImages = this.preloadImages(newFrames); // 重新预加载新帧序列
    this.frameIndex = 0;
    this.frameCount = newFrames.length;
  }

  // 重生新怪物
  respawn() {
    const monsterType = Enemy.getRandomMonsterType(); // 获取随机怪物类型
    this.monsterType = monsterType;
    this.width = monsterType.width;
    this.height = monsterType.height;
    this.switchFrames(monsterType.frames); // 切换帧

    // 这里使用固定的怪物位置，而不是动态计算
    const { x, y } = getCenteredTopMonsterPosition(); // 可以替换为你想要的固定位置函数
    this.x = x; // 或者直接设置为固定值
    this.y = y; // 或者直接设置为固定值
    
    this.startAnimation(); // 重新开始动画
    this.startAutoAttack(); // 重新开始自动攻击
  }

   // 销毁敌人时调用
  destroyEnemy() {
    console.log('敌人已被销毁');

    // 停止自动攻击
    this.stopAutoAttack();

    // 停止动画
    this.stopAnimation();

    // 清理图片资源（可选，视需要而定）
    this.cachedImages = null;

  }
}
