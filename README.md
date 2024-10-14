## quickstart

## 源码目录介绍
```
./js
├── res                                    // 存放资源地
│   ├── xxx
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── enemy
│   └── enemy.js                           // 敌人类
│   └── enemyConfig.js                     // 敌人资源配置类
├── enemyPlace
│   └── enemyPlace.js                      // 敌人出生位子类
├── equiment
│   └── equiment.js                        // 装备类
├── player
│   └── player.js                          // 玩家类
│   └── skill.js                           // 技能类
├── playerInfo
│   └── playerInfo.js                      // 玩家状态类
├── statusManager
│   └── enemyStatusManager.js              // 敌人状态类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面 展示没用到
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态 已删除
└── main.js                                // 游戏入口主函数

```