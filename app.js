  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const segments = ["Die famosen Dosen", "KOSTENLOSE MÜNZE", "Bogenschießen Extrem", "Der tolle Hecht", "KOSTENLOSE MÜNZE", "Pikante Peinlichkeiten", "Wer zuletzt lacht", "KOSTENLOSE MÜNZE", "Der betrunkene Elch", "Armageddon", "KOSTENLOSE MÜNZE", "Quizzen mit Freunden"];
  const originalColors = ["#FF6384", "#FFCC00", "#FFCE56", "#8AFF33", "#FFCC00", "#FF8A33", "#33FFD5", "#FFCC00", "#A64AFF", "#FF6F00", "#FFCC00", "#36A2EB"];
  let colorIndex = 0;
  let colors = originalColors;
  const size = segments.length;
  const angle = 2 * Math.PI / size;
  const width = document.getElementById("wheel").width;
  let counter = 0;
  let rotation = 0;

  function drawWheel() {
    for (let i = 0; i < size; i++) {
      ctx.beginPath();
      ctx.moveTo(width / 2, width / 2);
      ctx.arc(width / 2, width / 2, width / 2, i * angle, (i + 1) * angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(width / 2, width / 2);
      ctx.rotate(i * angle + angle * 0.4);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(segments[i], width * 3.6 / 8, 20);
      ctx.restore();
    }
  }

  function drawArrow() {
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(width - 40,  width / 2);
    ctx.lineTo(width + 20,  width / 2 - 20);
    ctx.lineTo(width + 20,  width / 2 + 20);
    ctx.closePath();
    ctx.fill();
  }

  function rerollColors()
  {
    const mappings = [];
    mappings.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    mappings.push([3, 1, 0, 9, 4, 5, 2, 7, 8, 6, 10, 11]);
    mappings.push([3, 1, 5, 8, 4, 0, 11, 7, 2, 9, 10, 6]);
    mappings.push([5, 1, 2, 3, 4, 11, 8, 7, 6, 0, 10, 9]);
    mappings.push([5, 1, 8, 2, 4, 0, 9, 7, 3, 6, 10, 11]);
    mappings.push([6, 1, 0, 11, 4, 5, 2, 7, 9, 3, 10, 8]);
    mappings.push([6, 1, 9, 5, 4, 3, 2, 7, 0, 11, 10, 8]);
    mappings.push([8, 1, 11, 3, 4, 9, 2, 7, 6, 0, 10, 5]);
    mappings.push([9, 1, 11, 0, 4, 8, 6, 7, 2, 5, 10, 3]);

    const remapProb = counter == 3 ? 1 : (counter > 4 ? 0.1 : 0);

    colorIndex = (Math.random() < remapProb) ? Math.floor(Math.random() * mappings.length) : colorIndex;
    const mapping = mappings[colorIndex];

    const newColors = [];
    for (let i = 0; i < mapping.length; i ++)
    {
      newColors.push(originalColors[mapping[i]]);
    }

    colors = newColors;
  }

  function spinWheel() {
    rerollColors();    
    document.getElementById("winner").textContent = "";

    const spins = Math.floor(Math.random() * 2) + 6;
    const randomSegment = Math.floor(Math.random() * size);
    let finalAngle = counter == 2 ? (11.5 * Math.PI + 1.2 * angle) : (spins * 2 * Math.PI + randomSegment * angle + (Math.random() * angle));
    let manipulatedAngle = (randomSegment == 0) ? finalAngle : ((spins + 1) * 2 * Math.PI + (Math.random() * 2 * angle / 3) - 0.9 * angle);
    manipulatedAngle = counter == 2 ? 11.5 * Math.PI + 2.6 * angle : manipulatedAngle;

    let start = null;

    const fakeAnimationMode = counter == 2 ? 10 : (counter == 3 || counter == 4 ? 0 : Math.random() * 10);
    // 0: Keine Sichtbare animation
    // 1: Statisches Weiterdrehen kurz vor Ende

    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const duration = 1000 * spins + 750;
      const easing = 1 - Math.pow(1 - progress / duration, 3); // ease out cubic

      if (fakeAnimationMode < 7 || counter < 2) finalAngle = manipulatedAngle;

      rotation = (progress < duration - (200 + 100 * Math.floor((manipulatedAngle - finalAngle) / angle)) || finalAngle == manipulatedAngle) ? finalAngle * easing : rotation + (angle * 0.1);

      ctx.clearRect(0, 0, width, width);

      // Rad rotieren
      ctx.save();
      ctx.translate(width / 2, width / 2);
      ctx.rotate(rotation);
      ctx.translate(0 - (width / 2), 0 - (width / 2));
      drawWheel();
      ctx.restore();

      // Pfeil festzeichnen
      drawArrow();

        if (rotation < manipulatedAngle || size - 1 - Math.floor((rotation % (2 * Math.PI)) / angle) > 0) {
            requestAnimationFrame(animate);
        } else {
            const winnerIndex = 0;
            document.getElementById("winner").textContent = "Gewonnen: " + segments[(winnerIndex + size) % size];
            counter++;
        }
    }
    requestAnimationFrame(animate);
  }

  ctx.save();
  ctx.translate(width / 2, width / 2);
  ctx.rotate(angle / 2);
  ctx.translate(0 - (width / 2), 0 - (width / 2));
  drawWheel();
  ctx.restore();
  drawArrow();
  document.getElementById("spinButton").addEventListener("click", spinWheel);