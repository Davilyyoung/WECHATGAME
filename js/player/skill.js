import Sprite from '../base/sprite';

// 法师技能1 - 宽高450x450
const PLAYER_FS_SKILL_1 = [
  'res/effect/fs/darkholl/images/effect_200_01.png',
  'res/effect/fs/darkholl/images/effect_200_02.png',
  'res/effect/fs/darkholl/images/effect_200_03.png',
  'res/effect/fs/darkholl/images/effect_200_04.png',
  'res/effect/fs/darkholl/images/effect_200_05.png',
  'res/effect/fs/darkholl/images/effect_200_06.png',
  'res/effect/fs/darkholl/images/effect_200_07.png',
  'res/effect/fs/darkholl/images/effect_200_08.png',
  'res/effect/fs/darkholl/images/effect_200_09.png',
  'res/effect/fs/darkholl/images/effect_200_10.png',
  'res/effect/fs/darkholl/images/effect_200_11.png',
  'res/effect/fs/darkholl/images/effect_200_12.png',
  'res/effect/fs/darkholl/images/effect_200_13.png'
];

// 法师技能2 - 宽高387x580  
const PLAYER_FS_SKILL_2 = [
  'res/effect/fs/ice/images/effect_025u_01.png',
  'res/effect/fs/ice/images/effect_025u_02.png',
  'res/effect/fs/ice/images/effect_025u_03.png',
  'res/effect/fs/ice/images/effect_025u_04.png',
  'res/effect/fs/ice/images/effect_025u_05.png',
  'res/effect/fs/ice/images/effect_025u_06.png',
  'res/effect/fs/ice/images/effect_025u_07.png',
  'res/effect/fs/ice/images/effect_025u_08.png',
  'res/effect/fs/ice/images/effect_025u_09.png',
  'res/effect/fs/ice/images/effect_025u_10.png',
  'res/effect/fs/ice/images/effect_025u_11.png',
  'res/effect/fs/ice/images/effect_025u_12.png',
  'res/effect/fs/ice/images/effect_025u_13.png',
  'res/effect/fs/ice/images/effect_025u_14.png'
];

// 战士技能1 展示不需要 
const PLAYER_ZS_SKILL_1 = [
  'res/effect/other/images/other_skill_01.png',
  'res/effect/other/images/other_skill_02.png',
  // 继续添加其他技能的帧
];

// 战士技能2 展示不需要
const PLAYER_ZS_SKILL_2 = [
  'res/effect/other/images/other_skill_01.png',
  'res/effect/other/images/other_skill_02.png',
  // 继续添加其他技能的帧
];

const PLAYER_FS_SKILLS = [
  { 
    frames: PLAYER_FS_SKILL_1, 
    width: 450, 
    height: 450, 
    x: (playerX) => playerX + 50,  // Skill X position relative to player
    y: (playerY) => playerY - 50  // Skill Y position relative to player
  },
  { 
    frames: PLAYER_FS_SKILL_2, 
    width: 387, 
    height: 580, 
    x: (playerX) => playerX + 30,  // Skill X position for second skill
    y: (playerY) => playerY - 210  // Skill Y position for second skill
  }
];

export default class Skill extends Sprite {
  constructor(skillType, onComplete, playerX, playerY) {
    // 获取技能的随机对象，包括frames、width、height、x、y
    let skill = Skill.getRandomSkill(skillType);

    super(skill.frames[0], skill.width, skill.height); // 初始化技能的第一帧，并使用宽高
    this.frames = skill.frames;
    this.width = skill.width; // 设定技能宽度
    this.height = skill.height; // 设定技能高度
    this.frameIndex = 0;
    this.frameCount = this.frames.length;
    this.isAnimating = false;
    this.onComplete = onComplete;

    // 设置技能相对玩家的 x 和 y 位置
    this.x = skill.x(playerX);  // 通过 skill 定义的位置函数计算 X 坐标
    this.y = skill.y(playerY);  // 通过 skill 定义的位置函数计算 Y 坐标
  
    // 确保图片被初始化
    this.img = new Image();
    this.img.src = this.frames[0];

    this.startAnimation();
  }

  static getRandomSkill(skillType) {
    let skillSet;
  
    // 根据 skillType 选择技能集合
    switch (skillType) {
      case 1:
        skillSet = PLAYER_FS_SKILLS; // 法师技能集合
        break;
      case 2:
        skillSet = PLAYER_ZS_SKILLS; // 战士技能集合（假设你有战士技能集合）
        break;
      default:
        skillSet = PLAYER_FS_SKILLS; // 默认使用法师技能集合
        break;
    }
  
    const randomIndex = Math.floor(Math.random() * skillSet.length); // 随机选择技能
    return skillSet[randomIndex]; // 返回带有frames和宽高信息的技能对象
  }

  startAnimation() {
    this.isAnimating = true;
    this.animationInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.img.src = this.frames[this.frameIndex];

      if (this.frameIndex === this.frameCount - 1) {
        this.stopAnimation();
        this.onComplete && this.onComplete();
      }
    }, 100);
  }

  stopAnimation() {
    this.isAnimating = false;
    clearInterval(this.animationInterval);
    this.onComplete && this.onComplete();
  }

  /**
   * 添加render方法来绘制技能到canvas
   * @param {CanvasRenderingContext2D} ctx - canvas的上下文
   */
  render(ctx) {
    if (this.img && this.isAnimating) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 根据帧宽高绘制当前帧
    }
  }
}