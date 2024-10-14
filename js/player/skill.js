import Sprite from '../base/sprite';
import { getCenteredTopMonsterPosition } from '../enemyPlace/monsterPosition';  // 引入坐标函数

// 法师技能1 - 宽高450x450
const PLAYER_FS_SKILL_1 = [
  'res/effect/fs/ice1/images/effect_026u_01.png',
  'res/effect/fs/ice1/images/effect_026u_02.png',
  'res/effect/fs/ice1/images/effect_026u_03.png',
  'res/effect/fs/ice1/images/effect_026u_04.png',
  'res/effect/fs/ice1/images/effect_026u_05.png',
  'res/effect/fs/ice1/images/effect_026u_06.png',
  'res/effect/fs/ice1/images/effect_026u_07.png',
  'res/effect/fs/ice1/images/effect_026u_08.png',
  'res/effect/fs/ice1/images/effect_026u_09.png',
  'res/effect/fs/ice1/images/effect_026u_10.png',
  'res/effect/fs/ice1/images/effect_026u_11.png',
  'res/effect/fs/ice1/images/effect_026u_12.png',
  'res/effect/fs/ice1/images/effect_026u_13.png',
  'res/effect/fs/ice1/images/effect_026u_14.png'
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

// 法师技能2 - 宽高387x580  
const PLAYER_FS_SKILL_3 = [
  'res/effect/fs/ice2/images/effect_027d_01.png',
  'res/effect/fs/ice2/images/effect_027d_02.png',
  'res/effect/fs/ice2/images/effect_027d_03.png',
  'res/effect/fs/ice2/images/effect_027d_04.png',
  'res/effect/fs/ice2/images/effect_027d_05.png',
  'res/effect/fs/ice2/images/effect_027d_06.png',
  'res/effect/fs/ice2/images/effect_027d_07.png',
  'res/effect/fs/ice2/images/effect_027d_08.png',
  'res/effect/fs/ice2/images/effect_027d_09.png',
  'res/effect/fs/ice2/images/effect_027d_10.png',
  'res/effect/fs/ice2/images/effect_027d_11.png',
  'res/effect/fs/ice2/images/effect_027d_12.png',
  'res/effect/fs/ice2/images/effect_027d_13.png'
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
    type: 1, // 法师技能1
    frames: PLAYER_FS_SKILL_1, 
    width: 400, 
    height: 400, 
    // x: (enemyX) => enemyX - 50,  // Skill X position relative to player
    // y: (enemyY) => enemyY - 10  // Skill Y position relative to player
    x: (monsterX) => monsterX - 60,  // Skill X position relative to monster
    y: (monsterY) => monsterY  // Skill Y position relative to monster
  },
  { 
    type: 2, // 法师技能2
    frames: PLAYER_FS_SKILL_2, 
    width: 387, 
    height: 580, 
    // x: (enemyX) => enemyX - 100,  // Skill X position relative to player
    // y: (enemyY) => enemyY - 200  // Skill Y position relative to player
    x: (monsterX) => monsterX - 110,  // Skill X position relative to monster
    y: (monsterY) => monsterY - 220 // Skill Y position relative to monster
  },
  { 
    type: 3, // 法师技能3
    frames: PLAYER_FS_SKILL_3, 
    width: 500, 
    height: 500, 
    // x: (enemyX) => enemyX - 100,  // Skill X position relative to player
    // y: (enemyY) => enemyY - 80  // Skill Y position relative to player
    x: (monsterX) => monsterX - 110,  // Skill X position relative to monster
    y: (monsterY) => monsterY - 100 // Skill Y position relative to monster
  }
];

export default class Skill extends Sprite {
  constructor(skillType, onComplete, enemyStatusManager, enemy) {
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
    this.type = skill.type; // 保存技能类型
    this.enemyStatusManager = enemyStatusManager; // 传入敌人状态管理器
    this.enemy = enemy;
    // 用于标记是否已经检测过命中
    this.hasHit = false;
    // 使用 getCenteredTopMonsterPosition 函数来设置技能相对屏幕中心上方的 x 和 y 位置
    const { x: monsterX, y: monsterY } = getCenteredTopMonsterPosition();
    
    // 设置技能相对怪物的 x 和 y 位置
    this.x = skill.x(monsterX);  // 通过 skill 定义的位置函数计算 X 坐标
    this.y = skill.y(monsterY);  // 通过 skill 定义的位置函数计算 Y 坐标
    console.log("x ",this.x)
    console.log("y ",this.y)
    // 预加载所有帧
    this.cachedImages = this.preloadImages(this.frames);

    this.startAnimation();
  }

  // 预加载帧图像
  preloadImages(frames) {
    return frames.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
  }

  static getRandomSkill(watchPlayerSkillSet) {
    let skillSet;
  
    switch (watchPlayerSkillSet) {
      case 1:
        skillSet = PLAYER_FS_SKILLS; // 法师技能集合
        break;
      case 2:
        skillSet = PLAYER_ZS_SKILLS; // 战士技能集合
        break;
      default:
        skillSet = PLAYER_FS_SKILLS; // 默认使用法师技能集合
        break;
    }
  
    const randomIndex = Math.floor(Math.random() * skillSet.length);
    return skillSet[randomIndex]; // 返回带有frames和宽高信息的技能对象
  }

  startAnimation(fps = 30) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const frameDelay = 1000 / fps; // 每帧的延迟时间
    let lastFrameTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        this.img = this.cachedImages[this.frameIndex]; // 更新为已缓存的帧
        lastFrameTime = now;
      }

      if (this.isAnimating) {
        requestAnimationFrame(animate);
      }

      // 如果动画播放完一轮，停止动画
      if (this.frameIndex === this.frameCount - 1) {
        this.stopAnimation();

        // 检测是否命中敌人（只执行一次）
        // if (!this.hasHit && this.checkHit(
        //     this.enemyStatusManager.hpBarX, 
        //     this.enemyStatusManager.hpBarY, 
        //     this.enemyStatusManager.width, 
        //     this.enemyStatusManager.height
        //   )) {
        //   // 如果命中，扣除敌人的血量
        //   this.enemyStatusManager.updateHp(-1); 
    
        //   console.log('技能命中敌人，扣除 1 点血量');
          
        //   // 标记为已经检测过命中
        //   this.hasHit = true;
        // }
        
        // 检测是否命中敌人
        if (!this.hasHit && this.checkHit(200, 200)) {  // 假设怪物的宽高为200x200
          console.log('技能命中怪物，扣除 1 点血量');
          this.enemyStatusManager.updateHp(-1);
          this.hasHit = true;  // 标记为已经命中
        }

        this.onComplete && this.onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  stopAnimation() {
    this.isAnimating = false;
  }

  render(ctx) {
    if (this.img && this.isAnimating) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  // checkHit(enemyX, enemyY, enemyWidth, enemyHeight , enemy) {
  //   const isHit = (
  //     this.x < enemyX + enemyWidth &&
  //     this.x + this.width > enemyX &&
  //     this.y < enemyY + enemyHeight &&
  //     this.y + this.height > enemyY
  //   );
  //   this.enemy.takeHit();
  //   console.log(`技能位置: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
  //   console.log(`敌人位置: x=${enemyX}, y=${enemyY}, width=${enemyWidth}, height=${enemyHeight}`);
  //   console.log(`是否命中: ${isHit}`);

  //   return isHit;
  // }

   // 修改后的 checkHit 函数
   checkHit(monsterWidth, monsterHeight) {
    // 获取怪物的居中坐标
    const { x: monsterX, y: monsterY } = getCenteredTopMonsterPosition(monsterWidth, monsterHeight);
    
    // 判定技能是否与怪物的坐标重叠
    const isHit = (
      this.x < monsterX + monsterWidth &&
      this.x + this.width > monsterX &&
      this.y < monsterY + monsterHeight &&
      this.y + this.height > monsterY
    );
    this.enemy.takeHit();
    console.log(`技能位置: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
    console.log(`怪物位置: x=${monsterX}, y=${monsterY}, width=${monsterWidth}, height=${monsterHeight}`);
    console.log(`是否命中: ${isHit}`);

    return isHit;
  }
}

