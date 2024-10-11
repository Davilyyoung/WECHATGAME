import Sprite from '../base/sprite'
import Skill from '../player/skill'

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

const PLAYER_WIDTH = 288
const PLAYER_HEIGHT = 250

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_FRAMES[0], PLAYER_WIDTH, PLAYER_HEIGHT); // 初始帧为第一帧

    // 任务在手机屏幕中间
    this.x = screenWidth / 2 - this.width / 2;
    this.y = screenHeight / 2 - this.height / 2;

    this.frameIndex = 0;
    this.frameCount = PLAYER_FRAMES.length;
    this.currentFrames = PLAYER_FRAMES;
    this.isAnimating = false;
    this.isShaking = false;

    this.initEvent();
    this.startAnimation(); // 初始化时启动动画
  }

  /**
   * 开始播放序列帧动画
   */
  startAnimation() {
    if (this.isAnimating) return; // 防止重复调用
    this.isAnimating = true;

    this.animationInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.img.src = this.currentFrames[this.frameIndex]; // 更新当前帧图片
    }, 100); // 每帧切换的时间间隔 (100ms)
  }

  /**
   * 停止动画播放
   */
  stopAnimation() {
    clearInterval(this.animationInterval); // 停止定时器
    this.isAnimating = false;
  }

  /**
   * 玩家攻击动作 + 抖动，同时发出技能触发事件
   */
  attackAndShake(triggerSkillCallback) {
    if (this.isShaking) return; // 防止重复触发抖动
    if (this.skill) return; // 如果已有技能在播放，阻止新的技能释放
  
    // 切换到攻击帧并抖动
    this.switchFrames(PLAYER_ATTACK);
    this.isShaking = true;
    const shakeDuration = 500;
    const shakeAmplitude = 10;
  
    const originalX = this.x;
    const originalY = this.y;
  
    const shakeInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * shakeAmplitude;
      const offsetY = (Math.random() - 0.5) * shakeAmplitude;
      this.x = originalX + offsetX;
      this.y = originalY + offsetY;
    }, 50);
  
    // 抖动结束并且攻击动画结束后，切换回等待帧
    setTimeout(() => {
      clearInterval(shakeInterval);
      this.x = originalX;
      this.y = originalY;
      this.isShaking = false;
  
      this.switchFrames(PLAYER_FRAMES); // 切换回等待帧
  
      this.triggerOtherTasks(); // 触发其他任务
    }, shakeDuration);
  
    // 在攻击动作期间，调用回调函数触发技能释放
    if (triggerSkillCallback) {
      triggerSkillCallback(1); // 假设技能类型为1
    }
  }

  /**
   * 切换帧序列
   * @param {Array} newFrames 新的帧序列
   */
  switchFrames(newFrames) {
    this.currentFrames = newFrames;
    this.frameIndex = 0; // 重置帧索引
    this.frameCount = newFrames.length; // 更新帧数量
  }

  initEvent() {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      // 点击玩家时，触发攻击动画和技能释放
      if (this.checkIsFingerOnAir(x, y)) {
        this.attackAndShake(this.triggerSkill); // 传递技能释放的回调
      }
    });
  }

  /**
   * 触发其他任务的占位符方法
   */
  triggerOtherTasks() {
    console.log("攻击动画完成，触发其他任务");
  }

  /**
   * 判断手指是否在角色上
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30; // 允许的误差范围

    return !!(
      x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation
    );
  }
}