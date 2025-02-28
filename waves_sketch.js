// Bioluminescent Waves Simulation using p5.js
let particles = [];
const numParticles = 200;
let noiseScale = 0.01;
let noiseStrength = 0.5;
let particleSize = 3;
let particleSpeed = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(220, 70, 10); // Dark blue background
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4) * particleSize,
      brightness: random(70, 100),
      speedMultiplier: random(0.7, 1.3)
    });
  }
  
  // Create a persistent offscreen graphics buffer for the wave effect
  waveGraphics = createGraphics(width, height);
  waveGraphics.colorMode(HSB, 360, 100, 100, 1);
  waveGraphics.noStroke();
}

function draw() {
  // Fade background for trail effect
  background(220, 70, 10, 0.05);
  
  // Update and draw wave effect
  drawWaves();
  
  // Draw bioluminescent particles
  drawParticles();
  
  // Apply bloom effect by blurring the whole scene
  drawingContext.filter = 'blur(2px)';
  image(get(), 0, 0);
  drawingContext.filter = 'none';
}

function drawWaves() {
  // Clear wave graphics with some transparency
  waveGraphics.background(220, 70, 10, 0.1);
  
  // Draw wave pattern
  let yoff = frameCount * 0.01;
  for (let y = 0; y < height; y += 10) {
    let xoff = 0;
    for (let x = 0; x < width; x += 5) {
      // Use Perlin noise to determine wave height
      let n = noise(xoff, yoff) * 2 - 1;
      
      // Only draw bright points above certain noise threshold
      if (n > 0.2) {
        let brightness = map(n, 0.2, 1, 0, 100);
        let alpha = map(n, 0.2, 1, 0, 0.6);
        
        waveGraphics.fill(180 + n * 20, 80, brightness, alpha);
        waveGraphics.ellipse(x, y + n * 50, 10, 10);
      }
      
      xoff += 0.03;
    }
    yoff += 0.02;
  }
  
  // Draw the wave graphics to the main canvas
  image(waveGraphics, 0, 0);
}

function drawParticles() {
  noStroke();
  
  // Update and display each particle
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Use Perlin noise to determine movement
    let angle = noise(p.x * noiseScale, p.y * noiseScale, frameCount * 0.01) * TWO_PI * noiseStrength;
    
    // Update position
    p.x += cos(angle) * particleSpeed * p.speedMultiplier;
    p.y += sin(angle) * particleSpeed * p.speedMultiplier;
    
    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Determine brightness based on movement
    let movementIntensity = abs(cos(angle) + sin(angle)) * 0.7;
    let glowBrightness = p.brightness * movementIntensity;
    
    // Create glow effect with multiple layers
    for (let j = 3; j > 0; j--) {
      let size = p.size * j * 2;
      let alpha = map(j, 3, 1, 0.05, 0.3) * movementIntensity;
      fill(190, 90, glowBrightness, alpha);
      ellipse(p.x, p.y, size, size);
    }
    
    // Draw the bright center
    fill(190, 70, 100, 0.7);
    ellipse(p.x, p.y, p.size, p.size);
  }
}

function mouseMoved() {
  // Add slight attraction to mouse position
  noiseStrength = map(mouseX, 0, width, 0.2, 1);
  particleSpeed = map(mouseY, 0, height, 0.5, 2);
  
  // Add a new particle at mouse position occasionally
  if (frameCount % 5 === 0) {
    particles.push({
      x: mouseX + random(-20, 20),
      y: mouseY + random(-20, 20),
      size: random(1, 3) * particleSize,
      brightness: random(80, 100),
      speedMultiplier: random(0.9, 1.5)
    });
    
    // Remove oldest particle if we have too many
    if (particles.length > numParticles + 50) {
      particles.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  waveGraphics = createGraphics(width, height);
  waveGraphics.colorMode(HSB, 360, 100, 100, 1);
  waveGraphics.noStroke();
  background(220, 70, 10);
}
