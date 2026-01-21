// Dummy statement for testing
console.log("Dummy statement: Portfolio loaded successfully.");

// Typing Effect
const textToType = "Krishna";
const typingElement = document.querySelector('.typing-text');
let typeIndex = 0;

function typeText() {
    if (typeIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeText, 150);
    }
}

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');

            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            observer.unobserve(counter);
        }
    });
};

const counterObserver = new IntersectionObserver(animateCounters, {
    threshold: 0.5
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Initialize Typing on Load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000); // Start after 1s delay
});

// Three.js 3D Background
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Geometry - Floating Shapes
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const shapes = [];
    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 10;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        // Custom properties for animation
        mesh.userData = {
            rotationSpeed: 0.005 + Math.random() * 0.01,
            floatSpeed: 0.005 + Math.random() * 0.01,
            yOffset: Math.random() * Math.PI * 2
        };

        scene.add(mesh);
        shapes.push(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;
        const scrollY = window.scrollY;

        shapes.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed;
            mesh.rotation.y += mesh.userData.rotationSpeed;
            mesh.position.y += Math.sin(time + mesh.userData.yOffset) * mesh.userData.floatSpeed;
        });

        // Scroll Interaction
        camera.position.y = -scrollY * 0.002;
        scene.rotation.y = scrollY * 0.0002;

        // Mouse interaction (gentle camera movement)
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    // Mouse Move Handler
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
};

// 3D Tilt Effect
const initTilt = () => {
    const cards = document.querySelectorAll('.skill-card, .project-card, .service-card, .cert-card, .stat-item, .timeline-content');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    setTimeout(typeText, 1000); // Start typing after 1s
    initTilt();
});


document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;

    const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
    };

    try {
        const res = await fetch(
            "https://back-end-vvhk.onrender.com/emailService/send-email",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        if (!res.ok) throw new Error("Failed");

        alert("Email sent successfully ✅");
        form.reset();

    } catch (err) {
        alert("Failed to send email ❌");
        console.error(err);
    }
});
