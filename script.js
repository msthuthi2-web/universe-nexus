
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const container = document.getElementById('universe');

if (!container) {
    throw new Error("Universe container not found!");
}

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02010a);
scene.fog = new THREE.FogExp2(0x02010a, 0.004);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(0, 0, 13);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);


// PLANET TEXTURE
function makePlanetTexture() {

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');

    const base = ctx.createLinearGradient(0, 0, 1024, 512);

    base.addColorStop(0, '#101b55');
    base.addColorStop(0.5, '#30205f');
    base.addColorStop(1, '#092d52');

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 512);

    const colors = [
        '#426ed1',
        '#8051c7',
        '#25a0b5',
        '#b45a9e',
        '#293b85'
    ];

    for (let i = 0; i < 350; i++) {

        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = 12 + Math.random() * 65;

        const gradient = ctx.createRadialGradient(
            x, y, 1, x, y, radius
        );

        gradient.addColorStop(
            0,
            colors[Math.floor(Math.random() * colors.length)]
        );

        gradient.addColorStop(1, 'rgba(10,15,50,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}


// MAIN PLANET
const planetGroup = new THREE.Group();
scene.add(planetGroup);

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.55, 96, 96),

    new THREE.MeshStandardMaterial({
        map: makePlanetTexture(),
        roughness: 0.75,
        metalness: 0.12
    })
);

planetGroup.add(planet);


// CLOUD LAYER
const cloudLayer = new THREE.Mesh(
    new THREE.SphereGeometry(2.59, 64, 64),

    new THREE.MeshBasicMaterial({
        color: 0x8d75ff,
        transparent: true,
        opacity: 0.09,
        side: THREE.FrontSide
    })
);

planetGroup.add(cloudLayer);


// ATMOSPHERE
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.75, 64, 64),

    new THREE.MeshBasicMaterial({
        color: 0x6278ff,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide
    })
);

planetGroup.add(atmosphere);


// OUTER GLOW
const outerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.95, 64, 64),

    new THREE.MeshBasicMaterial({
        color: 0x653bff,
        transparent: true,
        opacity: 0.045,
        side: THREE.BackSide
    })
);

planetGroup.add(outerGlow);


// PLANET RING
const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.2, 4.35, 180),

    new THREE.MeshBasicMaterial({
        color: 0xb49aff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72
    })
);

ring.rotation.x = Math.PI / 2.35;
planetGroup.add(ring);


// SECOND RING
const secondRing = new THREE.Mesh(
    new THREE.RingGeometry(4.4, 4.48, 180),

    new THREE.MeshBasicMaterial({
        color: 0x5c9dff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
    })
);

secondRing.rotation.x = Math.PI / 2.35;
planetGroup.add(secondRing);


// LIGHTING
scene.add(new THREE.AmbientLight(0xaaa0ff, 1.6));

const keyLight = new THREE.PointLight(0xffffff, 130);
keyLight.position.set(6, 5, 8);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x7545ff, 85);
fillLight.position.set(-7, -3, -4);
scene.add(fillLight);

const blueLight = new THREE.PointLight(0x237dff, 55);
blueLight.position.set(0, 5, -8);
scene.add(blueLight);


// STAR FIELD
const starPositions = [];

for (let i = 0; i < 8500; i++) {

    starPositions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 130,
        (Math.random() - 0.5) * 150
    );
}

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starsMaterial);
scene.add(stars);


// SMALL TWINKLING STARS
const tinyStarPositions = [];

for (let i = 0; i < 1800; i++) {

    tinyStarPositions.push(
        (Math.random() - 0.5) * 170,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 120
    );
}

const tinyGeometry = new THREE.BufferGeometry();

tinyGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(tinyStarPositions, 3)
);

const tinyStars = new THREE.Points(
    tinyGeometry,

    new THREE.PointsMaterial({
        color: 0x9bbcff,
        size: 0.09,
        transparent: true,
        opacity: 0.7
    })
);

scene.add(tinyStars);


// NEBULA GLOW
function addGlow(color, x, y, z, size) {

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
        64, 64, 2, 64, 64, 64
    );

    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.65
        })
    );

    sprite.position.set(x, y, z);
    sprite.scale.set(size, size, 1);

    scene.add(sprite);

    return sprite;
}

const glow1 = addGlow('rgba(104,55,220,.8)', -8, 3, -12, 18);
const glow2 = addGlow('rgba(30,105,220,.8)', 8, -4, -15, 20);
const glow3 = addGlow('rgba(180,55,150,.7)', 0, 7, -20, 15);


// ORBITING MOONS
function createMoon(size, color, distance) {

    const orbitGroup = new THREE.Group();
    planetGroup.add(orbitGroup);

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),

        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.2
        })
    );

    moon.position.set(distance, 0, 0);
    orbitGroup.add(moon);

    const moonGlow = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.35, 24, 24),

        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        })
    );

    moon.add(moonGlow);

    return orbitGroup;
}

const moonOne = createMoon(0.25, 0x9c86ff, 5.1);
const moonTwo = createMoon(0.17, 0x65caff, 5.8);

moonOne.rotation.x = 0.6;
moonTwo.rotation.x = 1.2;


// FLOATING SPACE PARTICLES
const particlePositions = [];

for (let i = 0; i < 700; i++) {

    particlePositions.push(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
    );
}

const particleGeometry = new THREE.BufferGeometry();

particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(particlePositions, 3)
);

const particles = new THREE.Points(
    particleGeometry,

    new THREE.PointsMaterial({
        color: 0x9c83ff,
        size: 0.035,
        transparent: true,
        opacity: 0.65
    })
);

scene.add(particles);


// MOUSE MOVEMENT
let mouseX = 0;
let mouseY = 0;

window.addEventListener('pointermove', (event) => {

    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.35;

    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.35;

});


// ENTER BUTTON
let entering = false;

const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');

const hub = document.getElementById('universeHub');
const loading = document.getElementById('loading');

if (enterBtn && intro && hub) {

    enterBtn.addEventListener('click', () => {

        if (entering) return;

        entering = true;
        enterBtn.disabled = true;

        intro.classList.add('leave');

        if (loading) {
            loading.style.opacity = '0';
        }

        setTimeout(() => {

            hub.classList.add('show');
            hub.setAttribute('aria-hidden', 'false');

        }, 1250);

    });

}


// SEPARATE WORLD PAGE NAVIGATION
const worldPages = {
    "Talent World": "talent.html",
    "Project World": "project.html",
    "Events World": "events.html",
    "Achievement World": "achievement.html"
};

document.querySelectorAll('.world-card').forEach((card) => {

    card.addEventListener('click', () => {

        const world = card.dataset.world;

        if (worldPages[world]) {
            window.location.href = worldPages[world];
        }

    });

});


// ANIMATION
const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Planet rotation
    planet.rotation.y += 0.0015;

    cloudLayer.rotation.y += 0.0018;

    // Ring movement
    ring.rotation.z += 0.0007;
    secondRing.rotation.z -= 0.0004;

    // Moons orbit
    moonOne.rotation.y += 0.003;
    moonTwo.rotation.y -= 0.002;

    // Star movement
    stars.rotation.y += 0.00012;
    tinyStars.rotation.y -= 0.00008;

    // Floating particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.00008;
    glow1.material.opacity = 0.48 + Math.sin(time * 0.7) * 0.12;
    glow2.material.opacity = 0.48 + Math.sin(time * 0.9) * 0.12;
    glow3.material.opacity = 0.45 + Math.sin(time * 0.6) * 0.15;

    // Mouse camera movement
    planetGroup.rotation.y +=
        (mouseX * 0.16 - planetGroup.rotation.y) * 0.012;

    camera.position.x +=
        (mouseX * 1.2 - camera.position.x) * 0.02;

    camera.position.y +=
        (-mouseY * 1.2 - camera.position.y) * 0.02;

    // Enter universe camera zoom
    if (entering) {

        camera.position.z +=
            (6.8 - camera.position.z) * 0.025;

    }

    renderer.render(scene, camera);

}

animate();


// RESPONSIVE SCREEN
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});
