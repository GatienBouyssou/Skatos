const arcWidth = 3;
const radiusPlainCircle = 23;
const gap = 2;

function buildCanvasRate(canvas, rate, curAngle) {
    let ctx = canvas.getContext("2d");

    canvas.width = (radiusPlainCircle + arcWidth + gap) * 2 + arcWidth;
    canvas.height = canvas.width;

    ctx.beginPath();
    ctx.arc((canvas.width / 2), (canvas.height / 2), radiusPlainCircle, 0, Math.PI * 2, false);
    ctx.fillStyle = "#d1c4e9";
    ctx.fill();
    ctx.closePath();

    ctx.font = 'bold 20px arial, sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(rate, (canvas.width / 2), (canvas.height / 2));

    ctx.beginPath();
    ctx.lineWidth = arcWidth;
    ctx.strokeStyle = "#6200ea";

    ctx.arc((canvas.width / 2), (canvas.height / 2), radiusPlainCircle + arcWidth + gap, 1.5 * Math.PI, (1.5 + 2 * curAngle) * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function buildRateCanvasWithAnimation(canvas, rate) {
    let angleMax = rate / 10;
    let curAngle = 0;


    const myInterval = setInterval(() => {
        if(curAngle >= angleMax) {
            clearInterval(myInterval);
        }
        buildCanvasRate(canvas, rate, curAngle);
        curAngle += 0.01
    }, 10);
}