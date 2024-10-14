import Player from './player/player'
import Skill from './player/skill'
import Enemy from './enemy/enemy'
import BackGround from './runtime/background'
import Music from './runtime/music'
import EnemyStatusManager from './statusManager/enemyStatusManager'
import PlayerInfo from './playerInfo/playerInfo'
import Equipment from './equipment/equipment'
const ctx = canvas.getContext('2d')


/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.isGameStarted = false;  // 新增：用于追踪游戏是否已经开始  
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;
    this.skill = null; // 用于保存当前的技能实例
    this.currentSkillType = null; // 新增，用于保存当前技能类型
    this.player = new Player(ctx);
    this.playerInfo = new PlayerInfo(ctx);
    this.equipment = new Equipment(ctx);
    // 初始化游戏，显示开始界面
    this.initStartScreen();

    this.restart();
  }

   // 初始化开始界面
  initStartScreen() {
    // 绘制开始界面
    this.renderStartScreen();

    // 绑定点击事件，启动游戏
    canvas.addEventListener('touchstart', this.startGame.bind(this), { once: true });
  }

  // 开始界面的渲染方法
  renderStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景色或背景图片
    ctx.fillStyle = '#000';  // 黑色背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制游戏标题
    ctx.font = '40px Arial';
    ctx.fillStyle = '#fff';  // 白色字体
    ctx.textAlign = 'center';
    ctx.fillText('肌腱炎神话', canvas.width / 2, canvas.height / 2 - 50);

    // 绘制“点击开始”提示
    ctx.font = '30px Arial';
    ctx.fillText('点击屏幕开始游戏', canvas.width / 2, canvas.height / 2 + 50);
  }

  respawnEnemy() {
    console.log('敌人已死亡，生成新的敌人...');
  
    // 销毁当前敌人
    if (this.enemy) {
      this.enemy.destroyEnemy(); // 确保调用销毁方法
      this.enemy = null; // 销毁后将敌人设置为 null，确保不再渲染
      this.playerInfo.updateMp(1)
    }
  
    // 禁用玩家点击事件
    this.player.setClickEnabled(false); // 禁用玩家点击
  
    // 使用 setTimeout 实现延迟调用 respawn 方法
    setTimeout(() => {
      // 确保生成的怪物与之前的不同
      let newEnemyType;
      do {
        newEnemyType = Enemy.getRandomMonsterType();
      } while (newEnemyType === this.lastEnemyType); // 确保不同的怪物类型
  
      this.lastEnemyType = newEnemyType; // 记录当前生成的怪物类型
  
      // 创建一个新的敌人实例，但不要立即调用 respawn
      this.enemy = new Enemy();
  
      // 延迟后重置敌人的位置、动画等
      this.enemy.respawn();  // 只在这里调用 respawn
  
      // 重置敌人的生命状态
      this.enemyStatusManager.resetHp(); // 重置敌人的血量
  
      // 启用玩家点击事件
      this.player.setClickEnabled(true); // 启用玩家点击
    }, 2000); // 延迟1秒（1000毫秒）
  }

  restart() {
    canvas.removeEventListener('touchstart', this.touchHandler);
    // 确保只有一次初始化，且回调函数正确传递
    this.enemyStatusManager = new EnemyStatusManager(() => this.respawnEnemy());

    this.bg = new BackGround(ctx);
    this.enemy = new Enemy(ctx);
    this.skill = null;
    this.currentSkillType = null; // 重置技能类型

    this.bindLoop = this.loop.bind(this);
    this.hasEventBind = false;

    // 在restart中绑定技能触发的回调
    this.player.triggerSkill = this.releaseSkill.bind(this);

    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);

  }

  /**
   * 释放技能
  */
  releaseSkill(skillType) {
    // 如果已有技能在播放，则不触发新的技能
    if (this.skill) return;

    // 创建技能实例，传入怪物的 X 和 Y 坐标
    const skill = new Skill(skillType, () => {
      console.log('技能播放完毕，自动销毁');
      this.skill = null;  // 自动销毁技能
      this.currentSkillType = null; // 技能播放完后，重置技能类型
    }, this.enemyStatusManager,this.enemy);

    // 保存当前技能类型
    this.currentSkillType = skill.type;
    console.log('currentSkillType9999', this.currentSkillType);

    this.skill = skill;  // 保存技能对象以便渲染时使用
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.bg.render(ctx);
    this.playerInfo.render(ctx);
    this.equipment.render(ctx);
    // 渲染敌人的状态，比如血条
    this.enemyStatusManager.render(ctx);
    
     // 只有在敌人存在时才渲染敌人
    if (this.enemy !== null) {
      if (this.currentSkillType === 3) {
        this.skill && this.skill.render(ctx); 
         this.enemy.drawToCanvas(ctx);
    } else {
        this.enemy.drawToCanvas(ctx); 
        this.skill && this.skill.render(ctx); 
      }
    }
    this.player.drawToCanvas(ctx); // 绘制玩家
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {

  }

  // 全局碰撞检测
  collisionDetection() {
    // const that = this

    // databus.bullets.forEach((bullet) => {
    //   for (let i = 0, il = databus.enemys.length; i < il; i++) {
    //     const enemy = databus.enemys[i]

    //     if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
    //       enemy.playAnimation()
    //       //that.music.playExplosion()

    //       bullet.visible = false
    //       databus.score += 1

    //       break
    //     }
    //   }
    // })

    // for (let i = 0, il = databus.enemys.length; i < il; i++) {
    //   const enemy = databus.enemys[i]

    //   if (this.player.isCollideWith(enemy)) {
    //     databus.gameOver = true

    //     break
    //   }
    // }
  }

  // 游戏逻辑更新主函数
  update() {
    this.bg.update()
    //this.enemyGenerate()

    this.collisionDetection()
  }

  // 实现游戏帧循环
  loop() {
    // 如果游戏没有开始，则显示开始界面
    if (!this.isGameStarted) {
      this.renderStartScreen();
    } else {
      this.update();
      this.render();
    }

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

   // 启动游戏
   startGame() {
    this.isGameStarted = true;  // 改变状态以进入游戏画面
    canvas.removeEventListener('touchstart', this.touchHandler);  // 移除开始界面监听
    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);  // 开始游戏循环
  }

}
