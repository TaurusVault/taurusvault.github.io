// ----- Global Variables -----
let menuActive = true;
let cnv;
let enableGyroButton;

// UI Buttons and DOM elements
let startButton, menuFunModeButton, menuLanguageButton;
let funToggleButton, languageToggleButton, answerInput;
let hintStartTime = 0;
let highScoreAnimTimer = 0;
let highScoreAnimType = '';
let initialScoreAnimTimer = 25;
let initialHighScoreAnimTimer = 25;

// Scoring variables
let currentScore = 0;
let highScore = 0;
let scoreAnimTimer = 50;
let scoreAnimType = '';  // 'plus' or 'minus'
let baseScoreTextSize = 32;

let modeNames = ["Spell", "Fun", "Quiz"];
let currentModeIndex = 0;
let learningMode = false;  // true when modeNames[currentModeIndex] === "Quiz"

// Global array for Quiz choice buttons
let choiceButtons = [];

// Bubbles
let bubbles = [];
class Bubble {
  constructor() {
    // Spawn along the bottom at a random horizontal position
    this.x = random(width);
    this.y = height;
    this.r = random(2, 6);      // Bubble size
    this.speedY = random(5, 10); // Upward speed
    this.speedX = random(-2, 2); // Horizontal drift
    this.alpha = 255;           // Opacity
  }
  update() {
    this.x += this.speedX + gravityX * 9.9;
    this.y -= this.speedY;
    this.alpha -= 6.4;
  }
  display() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

// Audio and images
let bgMusic, tapSound, mergeSound, correctSound, errorSound;
let fruitImages = {};

// Fruit game variables
let circles = [];  // holds all fruit objects
const restitution = 0.1;

// New fixedSizes: starting at 20, increasing by 3 up to 128.
const fixedSizes = [20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125, 128];
const maxSize = 128;
// Spawnable sizes: use the first five sizes.
let spawnableSizes = [20, 23, 26, 29, 32];

// Language and fruit data
let languageBG = {
  en: [191,236,255],
  zh: [205,193,255],
  kr: [255,204,234],
  id: [251,231,198],
  ms: [180,248,200],
  jp: [183,201,242]
};

let currentLanguage = 'en';
let languageList = ['en','jp','id','ms','zh','kr'];
let languageNames = {
  en: 'English',
  jp: 'Japanese',
  id: 'Indonesia',
  ms: 'Malay',
  zh: 'Chinese',
  kr: 'Korean'
};

let fruitMaps = {
  en: {
    20: ["blueberry"],
    23: ["cranberry"],
    26: ["lychee"],
    29: ["strawberry"],
    32: ["kiwi"],
    35: ["lemon"],
    38: ["mangosteen"],
    41: ["passionfruit"],
    44: ["peach"],
    47: ["apple"],
    50: ["orange"],
    53: ["grapefruit"],
    56: ["guava"],
    59: ["avocado"],
    62: ["pomegranate"],
    65: ["pear"],
    68: ["mango"],
    71: ["dragonfruit"],
    74: ["honeydew"],
    77: ["papaya"],
    80: ["coconut"],
    83: ["watermelon"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  },
  jp: {
    20: ["ブルーベリー","buru-beri"],
    23: ["クランベリー","kuranberi"],
    26: ["ライチ","レイシ","茘枝","raichi","reishi"],
    29: ["イチゴ","ストロベリー","いちご","苺","ichigo"],
    32: ["キウイ","キウイフルーツ","kiui"],
    35: ["レモン","檸檬","remon"],
    38: ["マンゴスチン","mangosuchin"],
    41: ["パッションフルーツ","passhonfuru-tsu"],
    44: ["ピーチ","もも","桃","momo"],
    47: ["アップル","リンゴ","りんご","林檎","ringo"],
    50: ["オレンジ","橙","orenji"],
    53: ["グレープフルーツ","gure-pufuru-tsu"],
    56: ["グアバ","guaba"],
    59: ["アボカド","abokado"],
    62: ["ザクロ","zakuro","石榴","柘榴","若榴"],
    65: ["ペア","なし","梨","nashi"],
    68: ["マンゴー","檬果","芒果","mango"],
    71: ["ドラゴンフルーツ","ピタヤ","pitaya","doragonfuru-tsu"],
    74: ["ハネデューメロン","hanedhu-meron","メロン"],
    77: ["パパイヤ","万寿果","papaiya"],
    80: ["ココナッツ","kokonattsu"],
    83: ["スイカ","水瓜","西柿","suika"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  },
  id: {
    20: ["beri biru"],
    23: ["cranberi"],
    26: ["leci"],
    29: ["stroberi"],
    32: ["kiwi"],
    35: ["lemon","limun"],
    38: ["manggis"],
    41: ["markisa"],
    44: ["persik"],
    47: ["apel"],
    50: ["jeruk"],
    53: ["jeruk bali"],
    56: ["jambu"],
    59: ["alpukat"],
    62: ["delima"],
    65: ["pir"],
    68: ["mangga"],
    71: ["buah naga"],
    74: ["melon"],
    77: ["pepaya"],
    80: ["kelapa"],
    83: ["semangka"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  },
  ms: {
    20: ["blueberry"],
    23: ["kranberi"],
    26: ["laici"],
    29: ["strawberi"],
    32: ["kiwi"],
    35: ["lemon"],
    38: ["manggis"],
    41: ["passionfruit"],
    44: ["pic"],
    47: ["epal"],
    50: ["oren"],
    53: ["grapefruit"],
    56: ["jambu batu"],
    59: ["avokado"],
    62: ["delima"],
    65: ["pir"],
    68: ["mangga"],
    71: ["buah naga"],
    74: ["honeydew"],
    77: ["betik"],
    80: ["kelapa"],
    83: ["tembikai"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  },
  zh: {
    20: ["蓝莓"],
    23: ["蔓越莓"],
    26: ["荔枝"],
    29: ["草莓"],
    32: ["猕猴桃","奇异果"],
    35: ["柠檬"],
    38: ["山竹"],
    41: ["百香果"],
    44: ["桃子","桃"],
    47: ["苹果"],
    50: ["橙子","橙"],
    53: ["葡萄柚","西柚"],
    56: ["番石榴","芭乐"],
    59: ["鳄梨","牛油果"],
    62: ["石榴"],
    65: ["梨"],
    68: ["芒果"],
    71: ["火龙果"],
    74: ["哈密瓜"],
    77: ["木瓜"],
    80: ["椰子"],
    83: ["西瓜"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  },
  kr: {
    20: ["블루베리"],
    23: ["크랜베리"],
    26: ["여지"],
    29: ["딸기"],
    32: ["키위"],
    35: ["레몬"],
    38: ["망고스틴"],
    41: ["패션프루트"],
    44: ["복숭아"],
    47: ["사과"],
    50: ["오렌지"],
    53: ["자몽"],
    56: ["구아바"],
    59: ["아보카도"],
    62: ["석류"],
    65: ["배"],
    68: ["망고"],
    71: ["드래곤프루츠"],
    74: ["멜론"],
    77: ["파파야"],
    80: ["코코넛"],
    83: ["수박"],
    86: [""],
    89: [""],
    92: [""],
    95: [""],
    98: [""],
    101: [""],
    104: [""],
    107: [""],
    110: [""],
    113: [""],
    116: [""],
    119: [""],
    122: [""],
    125: [""],
    128: [""]
  }
};

let fruitPoints = {
  20: 10,
  23: 15,
  26: 20,
  29: 25,
  32: 30,
  35: 35,
  38: 40,
  41: 45,
  44: 50,
  47: 55,
  50: 60,
  53: 65,
  56: 70,
  59: 75,
  62: 80,
  65: 85,
  68: 90,
  71: 95,
  74: 100,
  77: 105,
  80: 110,
  83: 115,
  86: 120,
  89: 125,
  92: 130,
  95: 135,
  98: 140,
  101: 145,
  104: 150,
  107: 155,
  110: 160,
  113: 165,
  116: 170,
  119: 175,
  122: 180,
  125: 185,
  128: 190
};

let currentFruit = null;  // ensure currentFruit is declared

// Fixed buoyancy values based on fruit size (linear decrease from 0.54 at 20 to ~0.11 at 128)
let fixedBuoyancy = {
  20: 0.54,
  23: 0.53,
  26: 0.52,
  29: 0.50,
  32: 0.49,
  35: 0.48,
  38: 0.47,
  41: 0.46,
  44: 0.44,
  47: 0.43,
  50: 0.42,
  53: 0.41,
  56: 0.40,
  59: 0.38,
  62: 0.37,
  65: 0.36,
  68: 0.35,
  71: 0.34,
  74: 0.32,
  77: 0.31,
  80: 0.30,
  83: 0.29,
  86: 0.28,
  89: 0.26,
  92: 0.25,
  95: 0.24,
  98: 0.23,
  101: 0.22,
  104: 0.20,
  107: 0.19,
  110: 0.18,
  113: 0.17,
  116: 0.16,
  119: 0.14,
  122: 0.13,
  125: 0.12,
  128: 0.11
};

// ----- Water Simulation Globals -----
let springs = [];
const numSprings = 101;
const waterLevel = 220;
const k = 0.008;
const damping = 0.028;
const spread = 0.016;
const floatFactor = 0.05;
const gravity = 0.99;
let tiltOffset = 0;
let gravityX = 0;
let gravityY = gravity;

// ----- Preload Assets -----
function preload() {
  // Load both normal and "ow" images for each fruit.
  for (let size of fixedSizes) {
    let fruitNameArr = fruitMaps['en'][size];
    if (fruitNameArr && fruitNameArr[0]) {
      let name = fruitNameArr[0];
      // Images are now in subfolders:
      fruitImages[name] = loadImage('normtextures/' + name + '.png');
      fruitImages[name + "_ow"] = loadImage('owtextures/' + name + '_ow.png');
    }
  }
  bgMusic = loadSound('audio/BGM_Tranquil.mp3');
  tapSound = loadSound('audio/bubble_pop.mp3');
  mergeSound = loadSound('audio/pop.mp3');
  correctSound = loadSound('audio/correct.mp3');
  errorSound = loadSound('audio/error.mp3');
  logo = loadImage('logo.png');
}

// ----- Setup -----
function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.elt.style.zIndex = '0';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  textFont('Yomogi');
  frameRate(30);
  
  let dx = width / (numSprings - 1);
  for (let i = 0; i < numSprings; i++) {
    let x = i * dx;
    springs.push(new Spring(x, waterLevel));
  }
  
  if (menuActive) {
    startButton = createButton('Start');
    startButton.position(width/2, height/2);
    startButton.style('transform', 'translate(-50%, -50%)');
    startButton.style('z-index', '1000');
    startButton.mousePressed(startGame);
  
    menuFunModeButton = createButton('Mode: ' + modeNames[currentModeIndex]);
    menuFunModeButton.position(width/2, height/2 + 50);
    menuFunModeButton.mousePressed(toggleMode);
    menuFunModeButton.style('z-index', '1000');
    menuFunModeButton.style('transform', 'translate(-50%, -50%)');
  
    menuLanguageButton = createButton('Language: ' + languageNames[currentLanguage]);
    menuLanguageButton.position(width/2, height/2 + 100);
    menuLanguageButton.mousePressed(toggleLanguage);
    menuLanguageButton.style('z-index', '1000');
    menuLanguageButton.style('transform', 'translate(-50%, -50%)');
  }
  
  funToggleButton = createButton('Mode: ' + modeNames[currentModeIndex]);
  funToggleButton.position(20, 480);
  funToggleButton.mousePressed(toggleMode);
  funToggleButton.style('z-index', '1000');
  funToggleButton.hide();
  
  languageToggleButton = createButton('Language: ' + languageNames[currentLanguage]);
  languageToggleButton.position(20, 520);
  languageToggleButton.mousePressed(toggleLanguage);
  languageToggleButton.style('z-index', '1000');
  languageToggleButton.hide();
  
  answerInput = createInput();
  answerInput.position(width/2, height/5);
  answerInput.style('transform', 'translateX(-50%)');
  let placeholderText = 'Type fruit name in ' + languageNames[currentLanguage];
  answerInput.attribute('placeholder', placeholderText);
  let w = textWidth(placeholderText) + 40;
  answerInput.style('width', '250px');
  answerInput.style('font-size', '18px');
  answerInput.style('z-index', '1000');
  answerInput.hide();
  answerInput.elt.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      checkAnswer();
    }
  });
  
  enableGyroButton = createButton('Enable Gyro');
  enableGyroButton.position(10, 10);
  enableGyroButton.mousePressed(requestDeviceOrientationPermission);
}

// ----- Mode Toggle Function -----
function toggleMode() {
  currentModeIndex = (currentModeIndex + 1) % modeNames.length;
  funToggleButton.html("Mode: " + modeNames[currentModeIndex]);
  if (menuFunModeButton) {
    menuFunModeButton.html("Mode: " + modeNames[currentModeIndex]);
  }
  learningMode = (modeNames[currentModeIndex] === "Quiz");
  if (!menuActive) {
    if (modeNames[currentModeIndex] === "Spell") {
      answerInput.show();
    } else {
      answerInput.hide();
    }
  }
}

// ----- Draw Loop -----
function draw() {
  let bgColor = languageBG[currentLanguage];
  background(bgColor[0], bgColor[1], bgColor[2]);
  
  if (menuActive) {
    drawMenu();
    return;
  }
  
  updateWaterTargets();
  updateWater();
  
  // Update and draw fruits
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    if (circle.radius >= maxSize) {
      circles.splice(i, 1);
      if (circle === currentFruit) {
        currentFruit = null;
        answerInput.hide();
      }
      continue;
    }
    circle.vx += gravityX;
    circle.vy += gravityY;
    circle.x += circle.vx;
    circle.y += circle.vy;
    
    let index = floor(map(circle.x, 0, width, 0, springs.length - 1));
    index = constrain(index, 0, springs.length - 1);
    let waterSurface = springs[index].height;
    let bottom = circle.y + circle.radius;
    
    if (bottom > waterSurface) {
      let submersion = bottom - waterSurface;
      let netAcceleration = gravity * (0.01 - circle.buoyancy) * (submersion / circle.radius);
      circle.vy += netAcceleration;
      circle.vx *= 0.95;
      circle.vy *= 0.95;
      if (!circle.hasSplashed) {
        springs[index].speed = -random(4, 16);
        circle.hasSplashed = true;
      }
    }
    
    let t = (0.54 - circle.buoyancy) / (0.54 - 0.10);
    let targetY = lerp(waterSurface, height - circle.radius, t);
    circle.y = lerp(circle.y, targetY, 0.01);
    
    if (circle.x - circle.radius < 0) {
      circle.x = circle.radius;
      circle.vx *= -restitution;
    } else if (circle.x + circle.radius > width) {
      circle.x = width - circle.radius;
      circle.vx *= -restitution;
    }
    if (circle.y - circle.radius < 0) {
      circle.y = circle.radius;
      circle.vy *= -restitution;
    } else if (circle.y + circle.radius > height) {
      circle.y = height - circle.radius;
      circle.vy *= -restitution;
    }
    
    // Collision detection and merging
    for (let j = i - 1; j >= 0; j--) {
      let other = circles[j];
      let dx = other.x - circle.x;
      let dy = other.y - circle.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = circle.radius + other.radius;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let overlap = (minDist - distance) / 2;
        let minOverlapThreshold = 12;
        if (overlap > minOverlapThreshold) {
          let smoothingFactor = 10;
          circle.x -= (overlap * cos(angle)) / smoothingFactor;
          circle.y -= (overlap * sin(angle)) / smoothingFactor;
          other.x += (overlap * cos(angle)) / smoothingFactor;
          other.y += (overlap * sin(angle)) / smoothingFactor;
        }
        let normalX = cos(angle);
        let normalY = sin(angle);
        let relVelX = other.vx - circle.vx;
        let relVelY = other.vy - circle.vy;
        let dotProduct = relVelX * normalX + relVelY * normalY;
        if (dotProduct < 0) {
          let impulse = -dotProduct * (1 + restitution) * 0.1;
          circle.vx -= impulse * normalX;
          circle.vy -= impulse * normalY;
          other.vx += impulse * normalX;
          other.vy += impulse * normalY;
        }
        circle.vx *= 0.95;
        circle.vy *= 0.95;
        other.vx *= 0.95;
        other.vy *= 0.95;
        // Merging: In Spell and Quiz modes, merge only if no current fruit is active; in Fun mode, merge always.
        if (circle.radius === other.radius && (modeNames[currentModeIndex] === "Fun" || currentFruit === null)) {
          let idx = fixedSizes.indexOf(circle.radius);
          if (idx !== -1 && idx < fixedSizes.length - 1) {
            let newRadius = fixedSizes[idx + 1];
            let mergedFruitType = fruitMaps[currentLanguage][newRadius];
            let mergedCircle = {
              x: (circle.x + other.x) / 2,
              y: (circle.y + other.y) / 2,
              radius: newRadius,
              vx: (circle.vx + other.vx) / 2,
              vy: (circle.vy + other.vy) / 2,
              fruitType: mergedFruitType,
              hasSplashed: false,
              buoyancy: fixedBuoyancy[newRadius]
            };
            circles.splice(i, 1);
            circles.splice(j, 1);
            circles.push(mergedCircle);
            if (!spawnableSizes.includes(newRadius)) {
              spawnableSizes.push(newRadius);
            }
            if (currentModeIndex === 0) {  // Spell mode
              currentFruit = mergedCircle;
              answerInput.show();
              hintStartTime = millis();
            } else if (currentModeIndex === 2) {  // Quiz mode
              currentFruit = mergedCircle;
              hintStartTime = millis();
            } else {
              currentFruit = null;
              answerInput.hide();
            }
            if (mergeSound) {
              mergeSound.play();
            }
            break;
          }
        }
      }
    }
    
    // Draw fruit image (if "ow" was triggered, use that image)
    let fruitName = fruitMaps['en'][circle.radius][0];
    let img;
    if (circle.owTimestamp && millis() - circle.owTimestamp < 1000) {
      img = fruitImages[fruitName + "_ow"];
    } else {
      img = fruitImages[fruitName];
    }
    imageMode(CENTER);
    if (img) {
      if (fruitName === 'peach') {
        image(img, circle.x, circle.y, circle.radius * 2, circle.radius * 2 * 0.9);
      } else {
        image(img, circle.x, circle.y, circle.radius * 2, circle.radius * 2);
      }
    }
    
    // In Spell and Quiz modes, mark current fruit for highlight
    if (circle === currentFruit && (currentModeIndex === 0 || currentModeIndex === 2)) {
      circle.highlightMe = true;
    } else {
      circle.highlightMe = false;
    }
  }
  
  // 4) Draw water overlay AFTER fruits
  drawWaterOverlay();
  
  // 5) Draw bubbles
  if (!menuActive) {
    for (let i = 0; i < 5; i++) {
      if (random(1) < 0.9) {
        bubbles.push(new Bubble());
      }
    }
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].alpha <= 0 || bubbles[i].y < 0) {
      bubbles.splice(i, 1);
    }
  }
  
  // 6) In Spell and Quiz modes, show hint after 10 seconds
  if (currentFruit && (currentModeIndex === 0 || currentModeIndex === 2) && millis() - hintStartTime >= 10000) {
    if (!currentFruit.hinted) {
      currentFruit.hinted = true;
    }
    push();
    fill(0);
    textAlign(CENTER, BOTTOM);
    textSize(35);
    text(currentFruit.fruitType[0], width/2, height/6 - 10);
    pop();
  }
  
  // 7) Score animations
  push();
  textAlign(RIGHT, TOP);
  
  // Animate Highscore
  let hsMultiplier = 0.5;
  if (highScoreAnimTimer > 0) {
    let progress = 1 - (highScoreAnimTimer / initialHighScoreAnimTimer);
    if (highScoreAnimType === 'plus') {
      hsMultiplier = 0.5 + 0.1 * sin(progress * PI);
    }
    highScoreAnimTimer--;
    if (highScoreAnimType === 'plus') {
      fill('magenta');
    } else {
      fill(0);
    }
  } else {
    fill(0);
    hsMultiplier = 0.5;
    highScoreAnimType = '';
  }
  textSize(baseScoreTextSize * hsMultiplier);
  text("Highscore: " + highScore, width - 20, 20);
  
  // Animate current Score
  let csMultiplier = 1;
  if (scoreAnimTimer > 0) {
    let progress = 1 - (scoreAnimTimer / initialScoreAnimTimer);
    if (scoreAnimType === 'plus') {
      csMultiplier = 1 + 0.3 * sin(progress * PI);
    } else if (scoreAnimType === 'minus') {
      csMultiplier = 1 - 0.3 * sin(progress * PI);
    }
    scoreAnimTimer--;
    if (scoreAnimType === 'plus') {
      fill('green');
    } else if (scoreAnimType === 'minus') {
      fill('red');
    }
  } else {
    fill(0);
    csMultiplier = 1;
    scoreAnimType = '';
  }
  textSize(baseScoreTextSize * csMultiplier);
  text(currentScore, width - 20, 50);
  pop();
  
  // 8) Draw highlight ellipse on top for current fruit (if applicable)
  for (let circle of circles) {
    if (circle.highlightMe) {
      push();
      noFill();
      stroke(255,255,0);
      strokeWeight(6);
      ellipse(circle.x, circle.y, circle.radius * 2.5);
      pop();
    }
  }
  
  // 9) (Solution 1) In Spell mode, show a small box with the current fruit's image at the top left.
  if (currentFruit && currentModeIndex === 0) {
    push();
    fill(255,255,255,200);
    noStroke();
    let boxSize = 70;
    rect(10, 10, boxSize, boxSize, 5);
    let fruitName = fruitMaps['en'][currentFruit.radius][0];
    let img = fruitImages[fruitName];
    if (img) {
      imageMode(CENTER);
      image(img, 10 + boxSize/2, 10 + boxSize/2, boxSize * 0.8, boxSize * 0.8);
    }
    pop();
  }
  
  // 10) (Solution 2) In Quiz mode, hide answerInput and show 4 choice buttons arranged as 2 rows x 2 columns.
  if (learningMode) {
    answerInput.hide();
    if (choiceButtons.length === 0 && currentFruit) {
      let correctAnswer = currentFruit.fruitType[0];
      let choices = [correctAnswer];
      while (choices.length < 4) {
        let randomSize = random(fixedSizes);
        let candidate = fruitMaps[currentLanguage][randomSize][0];
        if (candidate && !choices.includes(candidate)) {
          choices.push(candidate);
        }
      }
      choices = shuffle(choices);
      
      // Arrange 4 buttons in 2 rows (2 per row)
      let horizontalSpacing = 160;  // adjust horizontal spacing as desired
      let verticalSpacing = 50;     // adjust vertical spacing as desired
      let startX = width / 2 - 100 - horizontalSpacing / 2;
      let startY_top = height / 2 - 140 - verticalSpacing / 2;
      let startY_bottom = height / 2 - 140 + verticalSpacing / 2;
      
      for (let i = 0; i < choices.length; i++) {
        let btn = createButton(choices[i]);
        let x, y;
        if (i < 2) {
          x = startX + i * horizontalSpacing;
          y = startY_top;
        } else {
          x = startX + (i - 2) * horizontalSpacing;
          y = startY_bottom;
        }
        btn.position(x, y);
        btn.style('z-index', '1000');
        btn.style('background', 'none');
        btn.style('width', '200px');
        btn.style('text-align', 'center');
        btn.style('border', 'none');
        btn.style('font-size', '20px');
        btn.style('font-weight', 'bold');
        // Set random dark text color:
        let r = floor(random(0, 150));
        let g = floor(random(0, 150));
        let b = floor(random(0, 150));
        btn.style('color', `rgb(${r},${g},${b})`);
        btn.mousePressed(() => {
          if (btn.html().toLowerCase() === correctAnswer.toLowerCase()) {
            if (correctSound) { correctSound.play(); }
            currentScore += fruitPoints[currentFruit.radius];
            if (currentScore > highScore) {
              highScore = currentScore;
              highScoreAnimType = 'plus';
              highScoreAnimTimer = initialHighScoreAnimTimer;
            }
            scoreAnimType = 'plus';
            scoreAnimTimer = initialScoreAnimTimer;
          } else {
            if (errorSound) { errorSound.play(); }
            currentScore -= fruitPoints[currentFruit.radius];
            scoreAnimType = 'minus';
            scoreAnimTimer = initialScoreAnimTimer;
          }
          for (let b of choiceButtons) { b.remove(); }
          choiceButtons = [];
          currentFruit = null;
        });
        // Save base Y-position and a random phase for independent bobbing
        btn.baseY = y;
        btn.phase = random(TWO_PI);
        btn.style('position', 'absolute');
        choiceButtons.push(btn);
      }
    } else {
      for (let btn of choiceButtons) {
        let offset = 3 * sin(frameCount * 0.05 + btn.phase);
        btn.position(btn.elt.offsetLeft, btn.baseY + offset);
      }
    }
  } else {
    for (let btn of choiceButtons) { btn.remove(); }
    choiceButtons = [];
  }
}

// ----- Water Simulation Functions -----
function updateWaterTargets() {
  for (let s of springs) {
    s.targetHeight = waterLevel + (s.x - width/2) * tiltOffset;
  }
}

function updateWater() {
  for (let s of springs) {
    s.update();
  }
  let leftDeltas = new Array(springs.length).fill(0);
  let rightDeltas = new Array(springs.length).fill(0);
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < springs.length; i++) {
      if (i > 0) {
        leftDeltas[i] = spread * (springs[i].height - springs[i-1].height);
        springs[i-1].speed += leftDeltas[i];
      }
      if (i < springs.length-1) {
        rightDeltas[i] = spread * (springs[i].height - springs[i+1].height);
        springs[i+1].speed += rightDeltas[i];
      }
    }
    for (let i = 0; i < springs.length; i++) {
      if (i > 0) springs[i-1].height += leftDeltas[i];
      if (i < springs.length-1) springs[i+1].height += rightDeltas[i];
    }
  }
}

function drawWaterOverlay() {
  noStroke();
  fill(0,120,255,50);
  beginShape();
  vertex(0,height);
  for (let s of springs) {
    vertex(s.x, s.height);
  }
  vertex(width,height);
  endShape(CLOSE);
}

class Spring {
  constructor(x, targetHeight) {
    this.x = x;
    this.targetHeight = targetHeight;
    this.height = targetHeight;
    this.speed = 0.5;
  }
  update() {
    let displacement = this.height - this.targetHeight;
    let accel = -k * displacement - damping * this.speed;
    this.speed += accel;
    this.height += this.speed;
  }
}

// ----- Device Orientation (for water physics) -----
function handleOrientation(event) {
  let gammaRad = radians(event.gamma);
  gravityX = gravity * sin(gammaRad);
  gravityY = gravity * cos(gammaRad);
  tiltOffset = -event.gamma * 0.017;
}

function requestDeviceOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener("deviceorientation", handleOrientation);
          enableGyroButton.remove();
        } else {
          console.log("Device Orientation permission not granted.");
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
    enableGyroButton.remove();
  }
}

// ----- Menu and Game Functions -----
function drawMenu() {
  let bgColor = languageBG[currentLanguage];
  background(bgColor[0], bgColor[1], bgColor[2]);
  let scaleFactor = 0.1;
  let logoWidth = logo.width * scaleFactor;
  let logoHeight = logo.height * scaleFactor;
  let logoX = width/2 - logoWidth/2;
  let logoY = height/4 - logoHeight/2;
  image(logo, logoX, logoY, logoWidth, logoHeight);
}

function startGame() {
  menuActive = false;
  startButton.hide();
  menuFunModeButton.hide();
  menuLanguageButton.hide();
  funToggleButton.show();
  languageToggleButton.show();
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

function toggleLanguage() {
  let currentIndex = languageList.indexOf(currentLanguage);
  currentLanguage = languageList[(currentIndex + 1) % languageList.length];
  languageToggleButton.html('Language: ' + languageNames[currentLanguage]);
  menuLanguageButton.html('Language: ' + languageNames[currentLanguage]);
  menuLanguageButton.style('white-space', 'nowrap');
  answerInput.attribute('placeholder', 'Type fruit name in ' + languageNames[currentLanguage]);
  for (let circle of circles) {
    circle.fruitType = fruitMaps[currentLanguage][circle.radius];
  }
  if (currentFruit) {
    currentFruit.fruitType = fruitMaps[currentLanguage][currentFruit.radius];
  }
}

function touchMoved(e) {
  if (!menuActive) {
    e.preventDefault();
  }
  return false;
}

function touchStarted(e) {
  if (e.target !== cnv.elt) return;
  
  // Check if touch is on an existing fruit (trigger "ow" state)
  let touchPoint = touches[0] || { x: mouseX, y: mouseY };
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    if (dist(touchPoint.x, touchPoint.y, circle.x, circle.y) < circle.radius) {
      circle.owTimestamp = millis();
      return false;
    }
  }
  
  if (menuActive) {
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
    }
    return false;
  }
  
  // For Spell and Quiz modes, do not spawn a new fruit if one is already active.
  if ((currentModeIndex === 0 || currentModeIndex === 2) && currentFruit !== null) {
    return false;
  }
  
  let sizeIndex = floor(random(spawnableSizes.length));
  let radius = spawnableSizes[sizeIndex];
  let newCircle = {
    x: touchPoint.x,
    y: touchPoint.y,
    radius: radius,
    vx: random(-1,1),
    vy: 0,
    fruitType: fruitMaps[currentLanguage][radius],
    hasSplashed: false,
    buoyancy: fixedBuoyancy[radius]
  };
  
  circles.push(newCircle);
  
  if (tapSound) {
    tapSound.play();
  }
  
  // For Spell and Quiz modes, set currentFruit and start the hint timer.
  if (currentModeIndex === 0 || currentModeIndex === 2) {
    currentFruit = newCircle;
    if (currentModeIndex === 0) {
      answerInput.show();
      answerInput.elt.focus();
    }
    hintStartTime = millis();
  }
  
  return false;
}

function checkAnswer() {
  if (!currentFruit) return;
  if (currentFruit.hinted) {
    answerInput.value('');
    answerInput.hide();
    currentFruit = null;
    return;
  }
  let userAnswer = answerInput.value().trim().toLowerCase();
  let acceptedAnswers = currentFruit.fruitType;
  let points = fruitPoints[currentFruit.radius];
  let correct = acceptedAnswers.some(answer => answer.toLowerCase() === userAnswer);
  if (correct) {
    if (correctSound) { correctSound.play(); }
    currentScore += points;
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreAnimType = 'plus';
      highScoreAnimTimer = initialHighScoreAnimTimer;
    }
    scoreAnimType = 'plus';
    scoreAnimTimer = initialScoreAnimTimer;
    answerInput.value('');
    answerInput.hide();
    currentFruit = null;
  } else {
    if (errorSound) { errorSound.play(); }
    currentScore -= points;
    scoreAnimType = 'minus';
    scoreAnimTimer = initialScoreAnimTimer;
    answerInput.value('');
  }
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreAnimType = 'plus';
    highScoreAnimTimer = initialHighScoreAnimTimer;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
