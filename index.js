var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var pixel = context.createImageData(1, 1);

function drawPixel(x, y, r, g, b, a) {
  pixel.data[0] = r;
  pixel.data[1] = g;
  pixel.data[2] = b;
  pixel.data[3] = a;
  context.putImageData(pixel, x, y);
}

function makeInitialGeneration(size, displayWidth) {
  const generation = [];
  const offset = Math.round((displayWidth / 2) - (size / 2));
  for (var i = 0; i < size; i++) {
    generation.push({
      genome: [Math.random() * 255, Math.random() * 255, Math.random() * 255],
      x: i + offset,
    });
  }
  return generation;
}

function makeNextGeneration(
    generation, targetSize, variationMagnitude, maxGenerationSize) {
  if (generation.length == 0) return;

  const targetReproductionRate = targetSize / generation.length;
  var getNumChildren = function() {
    return Math.round(Math.random() * Math.max(targetReproductionRate * 2, 1));
  };

  var newGeneration = [];
  generation.forEach(function(creature) {
    const offspring =
        Math.min(getNumChildren(), maxGenerationSize - newGeneration.length);
    for (var i = 0; i < offspring; i++) {
      newGeneration.push(tweakCreature(creature, newGeneration.length));
    }
  });

  var totalParentOffset = 0;
  newGeneration.forEach(function(creature) {
    totalParentOffset += creature.parentOffset;
  });
  const averageParentOffset =
      Math.round(totalParentOffset / newGeneration.length);
  newGeneration.forEach(function(creature) {
    creature.x += averageParentOffset;
  });

  return newGeneration;

  function tweakCreature(creature, index) {
    return {
      genome: creature.genome.map(randomVariation),
      x: index,
      parentOffset: creature.x - index
    };

    function clamp(v) {
      if (v < 0) return 0;
      if (v > 255) return 255;
      return v;
    }

    function randomVariation(v) {
      return clamp(
          v + Math.random() * (variationMagnitude * 2) - variationMagnitude);
    }
  }
}

function drawGeneration(generation, y) {
  generation.forEach(function(creature, index) {
    drawPixel(
        creature.x, y, creature.genome[0], creature.genome[1],
        creature.genome[2], 255);
  });
}

const maxWidth = 900, targetSize = 200;
var generation = makeInitialGeneration(targetSize, maxWidth);
drawGeneration(generation, 0);

var i = 0;
const drawNext = function() {
  generation = makeNextGeneration(generation, targetSize, 5, maxWidth);
  drawGeneration(generation, i + 1);
  if (++i < 9000) {
    setTimeout(drawNext, 1);
  }
};
setTimeout(drawNext, 1);
