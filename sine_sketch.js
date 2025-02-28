let waves = [];
let numWaves = 5;
let baseFrequency = 0.05;
let baseAmplitude = 50;
let speedFactor = 0.02;
let colorPalette;
let time = 0;
let controlPanel;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorPalette = [color(0, 255, 255, 100), color(0, 150, 255, 100), color(100, 0, 255, 100)];
    for (let i = 0; i < numWaves; i++) {
        waves.push(new Wave(i));
    }
    setupControls();
}

function draw() {
    background(0);
    for (let wave of waves) {
        wave.update();
        wave.display();
    }
    time += speedFactor;
}

class Wave {
    constructor(index) {
        this.index = index;
        this.phase = random(TWO_PI);
        this.frequency = baseFrequency * (1 + index * 0.1);
        this.amplitude = baseAmplitude * (1 + index * 0.2);
        this.color = colorPalette[index % colorPalette.length];
    }
    
    update() {
        this.phase += speedFactor;
    }
    
    display() {
        noFill();
        stroke(this.color);
        strokeWeight(2);
        beginShape();
        for (let x = 0; x < width; x += 10) {
            let y = height / 2 + sin(this.phase + x * this.frequency) * this.amplitude;
            vertex(x, y);
        }
        endShape();
    }
}

function setupControls() {
    controlPanel = createDiv('').style('position', 'absolute').style('top', '10px').style('left', '10px');
    createSliderControl('Speed', 0.001, 0.1, speedFactor, 0.001, (val) => speedFactor = val);
    createSliderControl('Frequency', 0.01, 0.2, baseFrequency, 0.01, (val) => updateWaves('frequency', val));
    createSliderControl('Amplitude', 10, 200, baseAmplitude, 5, (val) => updateWaves('amplitude', val));
    createButton('Randomize Colors').mousePressed(() => randomizeColors());
}

function createSliderControl(label, min, max, value, step, callback) {
    let container = createDiv('').parent(controlPanel);
    createSpan(label + ': ').parent(container);
    let slider = createSlider(min, max, value, step).parent(container);
    slider.input(() => callback(slider.value()));
}

function updateWaves(property, value) {
    for (let i = 0; i < waves.length; i++) {
        waves[i][property] = value * (1 + i * 0.1);
    }
}

function randomizeColors() {
    colorPalette = [color(random(255), random(255), random(255), 100), color(random(255), random(255), random(255), 100), color(random(255), random(255), random(255), 100)];
    for (let wave of waves) {
        wave.color = colorPalette[wave.index % colorPalette.length];
    }
}
