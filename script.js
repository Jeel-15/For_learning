const story = document.getElementById('workflowStory');
const cards = Array.from(document.querySelectorAll('.stage-card'));
const chips = Array.from(document.querySelectorAll('.step-chip'));
const progressFill = document.getElementById('topProgressFill');
const glowA = document.querySelector('.glow-a');
const glowB = document.querySelector('.glow-b');

const totalSteps = cards.length;
let activeIndex = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setActiveStep(index) {
  activeIndex = clamp(index, 0, totalSteps - 1);

  cards.forEach((card, i) => {
    const offset = i - activeIndex;
    const absOffset = Math.abs(offset);
    const depth = clamp(1 - absOffset * 0.18, 0.42, 1);

    const translateY = offset * 52;
    const translateX = offset * 30;
    const rotateX = offset * -5;
    const rotateY = offset * 6;
    const scale = depth;
    const opacity = clamp(1 - absOffset * 0.4, 0, 1);

    card.style.transform = `translate3d(${translateX}px, ${translateY}px, ${-absOffset * 130}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.opacity = opacity;
    card.classList.toggle('is-active', i === activeIndex);
  });

  chips.forEach((chip, i) => chip.classList.toggle('is-active', i === activeIndex));
}

function updateByScroll() {
  const rect = story.getBoundingClientRect();
  const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
  const consumed = clamp(-rect.top, 0, scrollable);
  const progress = consumed / scrollable;

  progressFill.style.width = `${progress * 100}%`;

  const float = progress * (totalSteps - 1);
  const idx = Math.round(float);
  setActiveStep(idx);

  glowA.style.transform = `translate(${-progress * 70}px, ${progress * 35}px)`;
  glowB.style.transform = `translate(${progress * 80}px, ${-progress * 30}px)`;
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const target = Number(chip.dataset.target || 0);
    const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
    const targetProgress = target / Math.max(totalSteps - 1, 1);
    const y = story.offsetTop + scrollable * targetProgress;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

window.addEventListener('scroll', updateByScroll, { passive: true });
window.addEventListener('resize', updateByScroll);

if (window.matchMedia('(max-width: 920px)').matches) {
  cards.forEach((card, index) => {
    card.style.opacity = index === 0 ? '1' : '0';
    card.style.transform = index === 0 ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)';
  });
}

setActiveStep(0);
updateByScroll();
