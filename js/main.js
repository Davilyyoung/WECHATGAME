import Player from './player/index'
import Skill from './player/skill'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
//import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;
    this.skill = null; // 用于保存当前的技能实例
    this.restart();
  }

  restart() {
    databus.reset();

    canvas.removeEventListener('touchstart', this.touchHandler);

    this.bg = new BackGround(ctx);
    this.player = new Player(ctx); // 取消ctx传递 ctx？
    this.skill = null; // 清除技能
    //this.gameinfo = new GameInfo();

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
    const playerX = this.player.x;  // 获取玩家的 X 坐标
    const playerY = this.player.y;  // 获取玩家的 Y 坐标

    // 创建技能实例，传入玩家的 X 和 Y 坐标
    const skill = new Skill(skillType, () => {
      console.log('技能播放完毕，自动销毁');
      this.skill = null;  // 自动销毁技能
    }, playerX, playerY);

    this.skill = skill;  // 保存技能对象以便渲染时使用
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.bg.render(ctx);
    this.player.drawToCanvas(ctx); // 绘制玩家

    if (this.skill) {
      this.skill.render(ctx); // 绘制技能
    }

    // this.gameinfo.renderGameScore(ctx, databus.score);

    if (databus.gameOver) {
      //this.gameinfo.renderGameOver(ctx, databus.score);

      if (!this.hasEventBind) {
        this.hasEventBind = true;
        this.touchHandler = this.touchEventHandler.bind(this);
        canvas.addEventListener('touchstart', this.touchHandler);
      }
    }
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    // if (databus.frame % 30 === 0) {
    //   const enemy = databus.pool.getItemByClass('enemy', Enemy)
    //   enemy.init(6)
    //   databus.enemys.push(enemy)
    // }
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
    if (databus.gameOver) return

    this.bg.update()

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     item.update()
    //   })

    //this.enemyGenerate()

    this.collisionDetection()

    // if (databus.frame % 20 === 0) {
    //   //this.player.shoot() 不要射击
    //   //this.music.playShoot() 关闭声音
    // }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
