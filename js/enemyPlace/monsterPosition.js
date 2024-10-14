// monsterPosition.js

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export function getCenteredTopMonsterPosition() {
  const x = screenWidth / 2 - 130;
  const y = screenHeight / 2 - 200 / 2 * 3;  // 偏向上方的坐标
  return { x, y };
}

