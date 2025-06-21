document.addEventListener('DOMContentLoaded', () => {
    // --- Inisialisasi Library ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Efek Kursor Kustom ---
    const cursor = document.querySelector('.custom-cursor');
    const linksAndButtons = document.querySelectorAll('a, button, .project-card, .skill-item');

    window.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            duration: 0.2,
            x: e.clientX,
            y: e.clientY,
            ease: 'power2.out'
        });
    });

    linksAndButtons.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('grow');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
        });
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Back to Top Button ---
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1.2,
            scrollTo: 0,
            ease: 'power2.inOut'
        });
    });

    // --- Setup Latar Belakang 3D (Three.js) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0, 12);
    
    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00c6ff,
        transparent: true,
        opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- MEMBUAT OBJEK TEKS 3D "</>" ---
    let textMesh;
    const fontLoader = new THREE.FontLoader();

    fontLoader.load(
        'https://unpkg.com/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json',
        (font) => {
            const textGeometry = new THREE.TextGeometry(
                '</>', {
                    font: font,
                    size: 4.5,
                    height: 0.6,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.15,
                    bevelSize: 0.15,
                    bevelOffset: 0,
                    bevelSegments: 6
                }
            );
            textGeometry.center();

            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0x00c6ff,
                metalness: 0.9,
                roughness: 0.3,
                emissive: 0x0077ff,
                emissiveIntensity: 0.3
            });

            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.z = -5;
            scene.add(textMesh);
        },
        undefined,
        (error) => {
            console.error('Error loading font:', error);
        }
    );

    // Pencahayaan
    const pointLight = new THREE.PointLight(0xffffff, 1.8);
    pointLight.position.set(5, 10, 15);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    const directionalLight = new THREE.DirectionalLight(0x00aaff, 0.7);
    directionalLight.position.set(-5, 5, 5);
    scene.add(pointLight, ambientLight, directionalLight);

    // Efek paralaks untuk partikel
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate3D() {
        requestAnimationFrame(animate3D);
        
        // Animasi partikel
        particlesMesh.rotation.y += 0.0005;
        
        // Efek paralaks
        particlesMesh.rotation.x = mouseY * 0.1;
        particlesMesh.rotation.y = mouseX * 0.1;
        
        // Animasi teks
        if (textMesh) {
            textMesh.rotation.y += 0.002;
        }
        
        renderer.render(scene, camera);
    }
    animate3D();

    // Interaksi mouse untuk teks
    document.addEventListener('mousemove', e => {
        if (textMesh) {
            const mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            const mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
            gsap.to(textMesh.rotation, {
                x: -mouseY * 0.6,
                y: mouseX * 0.6,
                duration: 2,
                ease: 'power2.out'
            });
        }
    });

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // --- Animasi Intro (GSAP Timeline) ---
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.to('.hero-title span, .hero-subtitle span', {
        y: 0,
        duration: 1.6,
        stagger: 0.15,
        delay: 0.3
    })
    .to('.hero-description', {
        opacity: 1,
        duration: 1.2
    }, '-=1.2')
    .to('.hero-button', {
        opacity: 1,
        y: 0,
        duration: 1.2
    }, '-=1')
    .to('.main-header', {
        opacity: 1,
        duration: 1
    }, '-=1');

    // --- Animasi Scroll-Triggered (GSAP & ScrollTrigger) ---
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
        const sectionTitle = section.querySelector('.section-title');
        const titleSpan = section.querySelector('.section-title span');
        const animatedElements = section.querySelectorAll(
            '.project-card, .skill-item, .about-container, .contact-subtitle, .contact-button'
        );

        // Animasi judul section
        gsap.fromTo(sectionTitle, { opacity: 0, y: 40 }, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            scrollTrigger: {
                trigger: sectionTitle,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    titleSpan.classList.add('animate');
                }
            }
        });

        // Animasi elemen di dalam section
        gsap.fromTo(animatedElements, {
            opacity: 0,
            y: 60
        }, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animasi tambahan untuk skill items
    gsap.utils.toArray('.skill-item').forEach((item, i) => {
        gsap.fromTo(item, {
            opacity: 0,
            y: 40
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animasi hover untuk project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
});
