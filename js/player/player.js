import Sprite from '../base/sprite'
import Skill from './skill'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const PLAYER_FRAMES = [
  'res/player/fs/wait/images/monster119_wait_001.png',
  'res/player/fs/wait/images/monster119_wait_002.png',
  'res/player/fs/wait/images/monster119_wait_003.png',
  'res/player/fs/wait/images/monster119_wait_004.png',
  'res/player/fs/wait/images/monster119_wait_005.png',
  'res/player/fs/wait/images/monster119_wait_006.png',
  'res/player/fs/wait/images/monster119_wait_007.png',
  'res/player/fs/wait/images/monster119_wait_008.png',
  'res/player/fs/wait/images/monster119_wait_009.png',
  'res/player/fs/wait/images/monster119_wait_010.png',
  'res/player/fs/wait/images/monster119_wait_011.png',
  'res/player/fs/wait/images/monster119_wait_012.png'
];

const PLAYER_ATTACK = [
  'res/player/fs/attack/images/monster119_attack_001.png',
  'res/player/fs/attack/images/monster119_attack_002.png',
  'res/player/fs/attack/images/monster119_attack_003.png',
  'res/player/fs/attack/images/monster119_attack_004.png',
  'res/player/fs/attack/images/monster119_attack_005.png',
  'res/player/fs/attack/images/monster119_attack_006.png',
  'res/player/fs/attack/images/monster119_attack_007.png',
  'res/player/fs/attack/images/monster119_attack_008.png',
  'res/player/fs/attack/images/monster119_attack_009.png',
  'res/player/fs/attack/images/monster119_attack_010.png',
  'res/player/fs/attack/images/monster119_attack_011.png',
  'res/player/fs/attack/images/monster119_attack_012.png'
];

const PLAYER_WIDTH = 288 / 1.5
const PLAYER_HEIGHT = 250 / 1.5

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_FRAMES[0], PLAYER_WIDTH, PLAYER_HEIGHT); // 初始帧为第一帧

    this.x = screenWidth / 2 - this.width / 2;
    this.y = screenHeight / 2 - this.height + 300;

    this.frameIndex = 0;
    this.frameCount = PLAYER_FRAMES.length;
    this.currentFrames = PLAYER_FRAMES;
    this.isAnimating = false;
    this.animationFrameRequest = null; // 用于存储requestAnimationFrame返回的ID
    this.canClick = true; // 允许点击

    this.initEvent();
    this.startAnimation(); // 初始化时启动动画
  }

   /**
   * 设置点击状态
   */
  setClickEnabled(enabled) {
    this.canClick = enabled;
  }
  /**
   * 开始播放序列帧动画
   */
  startAnimation(fps = 30) {
    this.stopAnimation(); // 确保每次启动动画前停止之前的动画

    const frameDelay = 1000 / fps;
    let lastFrameTime = Date.now();

    // 缓存当前帧的图像资源，避免频繁加载
    const cachedImages = this.currentFrames.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        this.img = cachedImages[this.frameIndex];
        lastFrameTime = now;
      }

      if (this.isAnimating) {
        this.animationFrameRequest = requestAnimationFrame(animate);
      }
    };

    this.isAnimating = true;
    this.animationFrameRequest = requestAnimationFrame(animate);
  }

  /**
   * 只播放一次的动画
   */
  startAnimationOnce(onComplete, fps = 30) {
    this.stopAnimation(); // 确保每次启动动画前停止之前的动画

    const frameDelay = 1000 / fps;
    let lastFrameTime = Date.now();

    const cachedImages = this.currentFrames.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        this.img = cachedImages[this.frameIndex];
        lastFrameTime = now;
      }

      // 动画播放完毕后，调用回调
      if (this.frameIndex === this.frameCount - 1) {
        this.isAnimating = false;
        onComplete && onComplete();
      } else if (this.isAnimating) {
        this.animationFrameRequest = requestAnimationFrame(animate);
      }
    };

    this.isAnimating = true;
    this.animationFrameRequest = requestAnimationFrame(animate);
  }

  /**
   * 停止动画播放
   */
  stopAnimation() {
    if (this.animationFrameRequest) {
      cancelAnimationFrame(this.animationFrameRequest);
      this.animationFrameRequest = null;
    }
    this.isAnimating = false;
  }

  /**
   * 玩家攻击动作 + 抖动，同时发出技能触发事件
   */
  attackAndShake(triggerSkillCallback) {
    if (this.isShaking) return;
    if (this.skill) return;

    this.isShaking = true;
    const shakeDuration = 500;
    const shakeAmplitude = 10;

    const originalX = this.x;
    const originalY = this.y;

    this.switchFrames(PLAYER_ATTACK);

    // 停止当前动画
    this.stopAnimation();

    // 启动攻击动画，只播放一次攻击动画
    this.startAnimationOnce(() => {
      this.switchFrames(PLAYER_FRAMES); // 动画完成后切换回等待帧
      this.startAnimation(); // 启动等待动画
    });

    // 抖动效果
    const shakeInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * shakeAmplitude;
      const offsetY = (Math.random() - 0.5) * shakeAmplitude;
      this.x = originalX + offsetX;
      this.y = originalY + offsetY;
    }, 50);

    // 抖动结束后恢复位置
    setTimeout(() => {
      clearInterval(shakeInterval);
      this.x = originalX;
      this.y = originalY;
      this.isShaking = false;

      this.triggerOtherTasks(); // 触发其他任务
    }, shakeDuration);

    // 触发技能释放回调
    if (triggerSkillCallback) {
      triggerSkillCallback(1); // 假设触发法师技能
    }
  }

  /**
   * 切换帧序列
   */
  switchFrames(newFrames) {
    this.currentFrames = newFrames;
    this.frameIndex = 0; // 重置帧索引
    this.frameCount = newFrames.length; // 更新帧数量
  }

  initEvent() {
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();

      // 如果点击被禁用，不触发任何事件
      if (!this.canClick) {
        console.log("点击被禁用，无法触发攻击");
        return;
      }

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      // 点击玩家时，触发攻击动画和技能释放
      if (this.checkIsFingerOnAir(x, y)) {
        console.log('触发点击事件');
        this.attackAndShake(this.triggerSkill); // 传递技能释放的回调
      }
    });
  }

  triggerOtherTasks() {
    console.log("攻击动画完成，触发其他任务");
  }

  checkIsFingerOnAir(x, y) {
    const deviation = 30; // 允许的误差范围

    return (
      x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation
    );
  }
}

