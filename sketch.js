let anemones = [];
let bubbles = [];
let palette = ["#F72585", "#B5179E", "#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9", "#4361EE", "#4895EF", "#4CC9F0"];
let popSound;

function preload() {
  popSound = loadSound('pop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 初始化 80 條海葵的屬性
  for (let i = 0; i < 80; i++) {
    anemones.push({
      x: map(i, 0, 79, 0, width), // 均勻分布於螢幕左至右
      len: random(10, 30),        // 每條長度不一樣 (段數)
      col: random(palette),       // 隨機分配顏色
      offset: random(1000),       // 隨機的擺動相位，讓大家搖晃不同步
      thickness: random(40, 60),  // 隨機粗細
      freq: random(0.02, 0.08)    // 隨機搖晃頻率
    });
  }
}

function draw() {
  blendMode(BLEND); // 繪製背景前重置混合模式
  clear(); // 清除背景，使其變為完全透明
  blendMode(ADD); // 啟用顏色重疊透明特效 (加色模式)
  
  noFill();  

  for (let i = 0; i < anemones.length; i++) {
    let a = anemones[i];
    stroke(a.col);
    strokeWeight(a.thickness); // 套用個別粗細
    beginShape();
    for (let j = 0; j < a.len; j++) {
      let y = height - j * 15; // 從底部向上延伸
      // 搖晃邏輯：使用個別的頻率(freq)與相位(offset)
      let xOffset = a.x + sin(frameCount * a.freq + j * 0.1 + a.offset) * (j * 2);
      vertex(xOffset, y);
    }
    endShape();
  }

  // --- 水泡效果區域 ---
  blendMode(BLEND); // 切換回正常混合模式繪製水泡 (避免 ADD 模式讓白色過曝)
  
  // 隨機產生水泡
  if (random() < 0.05) { // 調整這個數字可以控制水泡產生的頻率
    bubbles.push(new Bubble());
  }

  // 更新並繪製所有水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.update();
    b.display();
    if (b.finished()) {
      bubbles.splice(i, 1);
    }
  }
}

// 水泡類別
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 10;
    this.size = random(10, 25);
    this.speed = random(2, 5);
    this.popped = false;
    this.popTime = 0; // 用來計算破掉後的動畫時間
    this.popY = random(height * 0.2, height * 0.8); // 設定隨機破掉的高度
  }

  update() {
    if (!this.popped) {
      this.y -= this.speed; // 向上移動
      this.x += sin(frameCount * 0.05 + this.y * 0.05) * 0.5; // 輕微左右搖晃
      if (this.y < this.popY) {
        this.popped = true;
        popSound.play();
      }
    } else {
      this.popTime++; // 破掉後增加計時
    }
  }

  display() {
    if (!this.popped) {
      noStroke();
      fill(255, 127); // 白色主體，透明度 0.5 (127/255)
      circle(this.x, this.y, this.size);
      
      fill(255, 204); // 左上角光點，透明度 0.8 (204/255)
      circle(this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.3);
    } else {
      // 破掉的效果：畫一個擴大並消失的圓框
      noFill();
      stroke(255, map(this.popTime, 0, 10, 255, 0)); // 透明度隨時間遞減
      strokeWeight(2);
      circle(this.x, this.y, this.size + this.popTime * 3);
    }
  }

  finished() {
    // 如果破掉且動畫播放完畢，則移除
    return this.popped && this.popTime > 10;
  }
}
