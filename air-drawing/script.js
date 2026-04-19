const videoElement = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let camera = null;
let running = false;
let aiMode = true;

let drawing = false;
let lastX = 0;
let lastY = 0;

let colors = ["cyan", "red", "lime", "yellow", "magenta", "orange"];
let colorIndex = 0;

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColor(){
    colorIndex = (colorIndex + 1) % colors.length;
    alert("🎨 Color changed: " + colors[colorIndex]);
}

function toggleMode(){
    aiMode = !aiMode;
    document.getElementById("modeBtn").innerText =
        aiMode ? "AI MODE: ON" : "AI MODE: OFF";
}

canvas.addEventListener("mousemove", (e) => {
    if (aiMode) return;
    if (e.buttons !== 1) return;
    draw(e.clientX, e.clientY);
});

function draw(x, y){
    ctx.beginPath();
    ctx.strokeStyle = colors[colorIndex];
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
}

function isIndexFingerUp(lm){
    return (
        lm[8].y < lm[6].y &&
        lm[12].y > lm[10].y &&
        lm[16].y > lm[14].y &&
        lm[20].y > lm[18].y
    );
}

const hands = new Hands({
    locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults(onResults);

async function startCamera(){
    camera = new Camera(videoElement, {
        onFrame: async () => {
            if (aiMode){
                await hands.send({ image: videoElement });
            }
        },
        width: 1280,
        height: 720
    });

    videoElement.style.display = "block";
    camera.start();
    running = true;

    document.getElementById("startBtn").innerText = "Camera ON";
    alert("📷 Camera ON");
}

function stopCamera(){
    if (camera) camera.stop();

    videoElement.style.display = "none";
    running = false;

    document.getElementById("startBtn").innerText = "Start Camera";
    alert("📷 Camera OFF");
}

function toggleCamera(){
    running ? stopCamera() : startCamera();
}

function onResults(results){
    if (!aiMode) return;

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0){
        drawing = false;
        return;
    }

    const lm = results.multiHandLandmarks[0];

    const x = lm[8].x * canvas.width;
    const y = lm[8].y * canvas.height;

    if (isIndexFingerUp(lm)){
        if (!drawing){
            drawing = true;
            lastX = x;
            lastY = y;
        } else {
            draw(x, y);
        }
    } else {
        drawing = false;
    }
}