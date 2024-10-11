import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/player/1.zs/0/monster103_wait_001.png'
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 80

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕中央位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight / 2 - this.height / 2

    // 标识手指是否已经在飞机上了
    this.touched = false
    this.isShaking = false // 标识是否在抖动

    // 初始化事件监听
    this.initEvent()

    // 自动行为（可添加额外逻辑）
    this.autoBehavior()
  }

  /**
   * 玩家抖动效果
   * 抖动持续一小段时间，并且在一定范围内变动
   */
  shake() {
    if (this.isShaking) return // 防止重复触发

    this.isShaking = true
    const shakeDuration = 500 // 抖动持续时间 500ms
    const shakeAmplitude = 10 // 抖动幅度

    const originalX = this.x
    const originalY = this.y

    const shakeInterval = setInterval(() => {
      // 随机偏移位置
      const offsetX = (Math.random() - 0.5) * shakeAmplitude
      const offsetY = (Math.random() - 0.5) * shakeAmplitude
      this.x = originalX + offsetX
      this.y = originalY + offsetY
    }, 50)

    // 抖动结束后恢复原始位置并清除定时器
    setTimeout(() => {
      clearInterval(shakeInterval)
      this.x = originalX
      this.y = originalY
      this.isShaking = false

      // 触发其他任务的占位符
      this.triggerOtherTasks()

    }, shakeDuration)
  }

  /**
   * 触发其他任务的占位符方法
   * 可以在这里定义其他需要执行的任务
   */
  triggerOtherTasks() {
    // 这里可以添加你未来想要触发的任务
    console.log("抖动完成，触发其他任务")
  }

  /**
   * 玩家响应手指的触摸事件
   * 点击玩家时触发抖动效果
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      // 点击玩家时触发抖动效果
      if (this.checkIsFingerOnAir(x, y)) {
        this.shake()
      }
    }))
  }

  /**
   * 判断手指是否在飞机上
   * @param {Number} x 手指的X轴坐标
   * @param {Number} y 手指的Y轴坐标
   * @return {Boolean} 是否手指在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30 // 允许的误差范围

    return !!(
      x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation
    )
  }
  /**
   * 玩家自动行为（例如，闪烁等其他动画）
   */
  autoBehavior() {
    // 这里可以添加玩家的自动行为逻辑，比如闪烁动画等
  }
}
