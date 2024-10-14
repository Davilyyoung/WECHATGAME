const EQUIPMENT_BAR_IMG = 'res/equipment/bar/images/equipment_bar.png'; // 装备栏背景图片
const SLOT_WEAPON_IMG = 'res/equipment/slot/images/equipment_slot2.png';    // 武器槽位图片
const SLOT_HELMET_IMG = 'res/equipment/slot/images/equipment_slot2.png';    // 头盔槽位图片
const SLOT_CLOTHES_IMG = 'res/equipment/slot/images/equipment_slot2.png';  // 衣服槽位图片
const SLOT_ACCESSORY_IMG = 'res/equipment/slot/images/equipment_slot2.png'; // 首饰槽位图片

export default class Equipment {
  constructor() {
      // 装备栏尺寸
      this.barWidth = window.innerWidth;
      this.barHeight = 80; // 你可以根据需要调整高度
  
      // 装备栏位置（屏幕底部）
      this.barX = 0;
      this.barY = window.innerHeight - this.barHeight;
  
      // 槽位尺寸和位置
      this.slotWidth = this.barWidth / 4; // 四个槽位，平均分配宽度
      this.slotHeight = this.barHeight;
      this.slotY = this.barY;
  
      // 预加载图片
      this.loadImages();
  }

  // 预加载装备栏和槽位图片
  loadImages() {
     // 装备栏背景图片
     this.barImage = new Image();
     this.barImage.src = EQUIPMENT_BAR_IMG;
 
     // 槽位图片
     this.slotImages = [];
 
     this.slotImages[0] = new Image();
     this.slotImages[0].src = SLOT_WEAPON_IMG; // 武器槽
 
     this.slotImages[1] = new Image();
     this.slotImages[1].src = SLOT_HELMET_IMG; // 头盔槽
 
     this.slotImages[2] = new Image();
     this.slotImages[2].src = SLOT_CLOTHES_IMG; // 衣服槽
 
     this.slotImages[3] = new Image();
     this.slotImages[3].src = SLOT_ACCESSORY_IMG; // 首饰槽 
  }

  // 绘制装备栏
  render(ctx) {
    // 绘制装备栏背景
    ctx.drawImage(this.barImage, this.barX, this.barY, this.barWidth, 2);

    // 绘制每个槽位
    for (let i = 0; i < 4; i++) {
      const slotX = i * this.slotWidth; // 槽位的 X 位置

      ctx.drawImage(
        this.slotImages[i],
        slotX + (this.slotWidth - 80 / 2) / 2, // 将槽位图标居中
        this.slotY + (this.slotHeight - 80 / 2) / 4,
        80 /1.5, // 槽位图标宽度
        80 /1.5  // 槽位图标高度
      );
    }
  }
}
