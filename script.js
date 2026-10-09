'use strict';

/* ============================================================
   ST. SEBASTIAN CHURCH MADATHIL
   43 SECOND CINEMATIC 3D LOGO REVEAL
   ============================================================ */

const TOTAL_FRAGMENTS = 18;
const TOTAL_DURATION = 43;

const FRAGMENT_WIDTH = 9.4;
const FRAGMENT_HEIGHT =
    FRAGMENT_WIDTH * 941 / 1672;

const MUSIC_FILE =
    'audio/audio2.mp3';

const IMPACT_FILE =
    'audio/trailer-hit.mp3';


/* ============================================================
   HTML ELEMENTS
   ============================================================ */

const canvas =
    document.getElementById('canvas');

const startScreen =
    document.getElementById('start-screen');

const startButton =
    document.getElementById('start-btn');

const finalLogo =
    document.getElementById('final-logo');

const loadingWrap =
    document.getElementById('loading-bar-wrap');

const loadingBar =
    document.getElementById('loading-bar');


/* ============================================================
   THREE.JS
   ============================================================ */

let scene;

let camera;

let renderer;


/* ============================================================
   ANIMATION
   ============================================================ */

let masterTimeline = null;

let animationStarted = false;

let animationFinished = false;


/* ============================================================
   FRAGMENTS
   ============================================================ */

const fragments = [];

const fragmentTextures = [];

const fragmentGlows = [];


/* ============================================================
   PARTICLES
   ============================================================ */

let particleSystem = null;

let particleHalo = null;

let particleGeometry = null;

let particleHaloGeometry = null;

let particlePositions = null;

let particleHaloPositions = null;

const particleVelocities = [];


/* ============================================================
   LIGHTS
   ============================================================ */

let warmLight;

let goldLight;

let rimLight;

let flashLight;


/* ============================================================
   AUDIO
   ============================================================ */

let music = null;

let impactAudio = null;

let musicStopTimer = null;


/* ============================================================
   VISUAL EFFECTS
   ============================================================ */

let flashElement = null;

let finalAura = null;

let finalRing = null;

let finalSweep = null;


/* ============================================================
   CAMERA TARGET
   ============================================================ */

const cameraTarget =
    new THREE.Vector3(
        0,
        0,
        0
    );


/* ============================================================
   3D GOLD SHARDS
   ============================================================ */

const crystalShards = [];


/* ============================================================
   CLOCK
   ============================================================ */

const clock =
    new THREE.Clock();


/* ============================================================
   START INITIALIZATION
   ============================================================ */

initialize();


/* ============================================================
   INITIALIZE
   ============================================================ */

function initialize() {

    createScene();

    createCamera();

    createRenderer();

    createLights();

    createParticles();

    createCrystalField();

    createFlash();

    createFinalEffects();

    prepareFinalLogo();

    setupAudio();

    setupEvents();

    loadFragments();

    renderLoop();

}


/* ============================================================
   SCENE
   ============================================================ */

function createScene() {

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x000000
        );


    scene.fog =
        new THREE.FogExp2(

            0x020100,

            0.018

        );

}


/* ============================================================
   CAMERA
   ============================================================ */

function createCamera() {

    camera =
        new THREE.PerspectiveCamera(

            42,

            window.innerWidth /
            window.innerHeight,

            0.1,

            500

        );


    camera.position.set(

        0,

        0,

        18

    );

}


/* ============================================================
   RENDERER
   ============================================================ */

function createRenderer() {

    renderer =
        new THREE.WebGLRenderer({

            canvas:
                canvas,

            antialias:
                true,

            alpha:
                false,

            powerPreference:
                'high-performance'

        });


    renderer.setPixelRatio(

        Math.min(

            window.devicePixelRatio || 1,

            2

        )

    );


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


    renderer.setClearColor(

        0x000000,

        1

    );


    if (

        'outputColorSpace'
        in renderer

    ) {

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

    }

    else {

        renderer.outputEncoding =
            THREE.sRGBEncoding;

    }

}


/* ============================================================
   LIGHTS
   ============================================================ */

function createLights() {

    const ambient =
        new THREE.AmbientLight(

            0x2b1a08,

            0.15

        );


    scene.add(

        ambient

    );


    warmLight =
        new THREE.PointLight(

            0xffa52e,

            0,

            100

        );


    warmLight.position.set(

        7,

        4,

        12

    );


    scene.add(

        warmLight

    );


    goldLight =
        new THREE.PointLight(

            0xffd36a,

            0,

            90

        );


    goldLight.position.set(

        -7,

        2,

        10

    );


    scene.add(

        goldLight

    );


    rimLight =
        new THREE.DirectionalLight(

            0xffd27a,

            0

        );


    rimLight.position.set(

        -8,

        8,

        -8

    );


    scene.add(

        rimLight

    );


    flashLight =
        new THREE.PointLight(

            0xffffff,

            0,

            160

        );


    flashLight.position.set(

        0,

        0,

        10

    );


    scene.add(

        flashLight

    );

}


/* ============================================================
   GOLD PARTICLES
   ============================================================ */

function createParticles() {

    const amount =
        5200;


    particlePositions =
        new Float32Array(

            amount * 3

        );


    particleGeometry =
        new THREE.BufferGeometry();


    for (

        let i = 0;

        i < amount;

        i++

    ) {

        const p =
            i * 3;


        particlePositions[p] =
            THREE.MathUtils.randFloat(

                -25,

                25

            );


        particlePositions[p + 1] =
            THREE.MathUtils.randFloat(

                -15,

                15

            );


        particlePositions[p + 2] =
            THREE.MathUtils.randFloat(

                -25,

                12

            );


        particleVelocities.push({

            x:
                THREE.MathUtils.randFloat(

                    -0.006,

                    0.006

                ),

            y:
                THREE.MathUtils.randFloat(

                    -0.004,

                    0.004

                ),

            z:
                THREE.MathUtils.randFloat(

                    -0.002,

                    0.004

                )

        });

    }


    particleGeometry.setAttribute(

        'position',

        new THREE.BufferAttribute(

            particlePositions,

            3

        )

    );


    const material =
        new THREE.PointsMaterial({

            color:
                0xffd36b,

            size:
                0.055,

            transparent:
                true,

            opacity:
                0.82,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            sizeAttenuation:
                true

        });


    particleSystem =
        new THREE.Points(

            particleGeometry,

            material

        );


    particleSystem.renderOrder =
        8;


    scene.add(

        particleSystem

    );


    particleHaloPositions =
        particlePositions.slice();


    particleHaloGeometry =
        new THREE.BufferGeometry();


    particleHaloGeometry.setAttribute(

        'position',

        new THREE.BufferAttribute(

            particleHaloPositions,

            3

        )

    );


    const haloMaterial =
        new THREE.PointsMaterial({

            color:
                0xffa928,

            size:
                0.15,

            transparent:
                true,

            opacity:
                0.13,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            sizeAttenuation:
                true

        });


    particleHalo =
        new THREE.Points(

            particleHaloGeometry,

            haloMaterial

        );


    particleHalo.renderOrder =
        7;


    scene.add(

        particleHalo

    );

}
/* ============================================================
   UPDATE PARTICLES
   ============================================================ */

function updateParticles() {

    if (
        !particleGeometry ||
        !particlePositions
    ) {

        return;

    }


    for (
        let i = 0;

        i < particleVelocities.length;

        i++
    ) {

        const p =
            i * 3;


        const v =
            particleVelocities[i];


        particlePositions[p] +=
            v.x;


        particlePositions[p + 1] +=
            v.y;


        particlePositions[p + 2] +=
            v.z;


        if (
            particlePositions[p] > 25
        ) {

            particlePositions[p] =
                -25;

        }


        if (
            particlePositions[p] < -25
        ) {

            particlePositions[p] =
                25;

        }


        if (
            particlePositions[p + 1] > 15
        ) {

            particlePositions[p + 1] =
                -15;

        }


        if (
            particlePositions[p + 1] < -15
        ) {

            particlePositions[p + 1] =
                15;

        }


        if (
            particlePositions[p + 2] > 12
        ) {

            particlePositions[p + 2] =
                -25;

        }


        if (
            particlePositions[p + 2] < -25
        ) {

            particlePositions[p + 2] =
                12;

        }

    }


    particleGeometry
        .attributes
        .position
        .needsUpdate = true;


    if (
        particleHaloGeometry
    ) {

        particleHaloGeometry
            .attributes
            .position
            .needsUpdate = true;

    }


    const time =
        performance.now() *
        0.001;


    particleSystem.material.opacity =
        0.60 +
        Math.sin(
            time * 2.2
        ) * 0.18;


    particleHalo.material.opacity =
        0.09 +
        Math.sin(
            time * 1.7
        ) * 0.04;

}


/* ============================================================
   SMALL GLOWING GOLD PARTICLES
   ============================================================ */

function createCrystalField() {

    for (
        let i = 0;

        i < 220;

        i++
    ) {

        createCrystalShard();

    }

}


/* ============================================================
   CREATE ONE GLOW PARTICLE
   ============================================================ */

function createCrystalShard() {

    const size =
        THREE.MathUtils.randFloat(
            0.025,
            0.10
        );


    const geometry =
        new THREE.SphereGeometry(

            size,

            6,

            6

        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xffc451,

            transparent:
                true,

            opacity:
                THREE.MathUtils.randFloat(
                    0.35,
                    0.9
                ),

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const mesh =
        new THREE.Mesh(

            geometry,

            material

        );


    mesh.position.set(

        THREE.MathUtils.randFloat(
            -15,
            15
        ),

        THREE.MathUtils.randFloat(
            -9,
            9
        ),

        THREE.MathUtils.randFloat(
            -8,
            6
        )

    );


    mesh.userData.velocity =
        new THREE.Vector3(

            THREE.MathUtils.randFloat(
                -0.008,
                0.008
            ),

            THREE.MathUtils.randFloat(
                -0.006,
                0.006
            ),

            THREE.MathUtils.randFloat(
                -0.004,
                0.004
            )

        );


    mesh.userData.phase =
        Math.random() *
        Math.PI *
        2;


    scene.add(
        mesh
    );


    crystalShards.push(
        mesh
    );

}


/* ============================================================
   ANIMATE GLOW PARTICLES
   ============================================================ */

function animateCrystalShards() {

    const time =
        performance.now() *
        0.001;


    crystalShards.forEach(

        shard => {

            shard.position.add(

                shard.userData.velocity

            );


            const pulse =
                0.5 +

                Math.sin(

                    time * 3.5 +
                    shard.userData.phase

                ) * 0.5;


            shard.material.opacity =
                0.22 +
                pulse * 0.7;


            shard.scale.setScalar(

                0.65 +
                pulse * 0.8

            );


            if (
                shard.position.x > 15
            ) {

                shard.position.x =
                    -15;

            }


            if (
                shard.position.x < -15
            ) {

                shard.position.x =
                    15;

            }


            if (
                shard.position.y > 9
            ) {

                shard.position.y =
                    -9;

            }


            if (
                shard.position.y < -9
            ) {

                shard.position.y =
                    9;

            }

        }

    );

}


/* ============================================================
   CINEMATIC FRAGMENT MATERIAL
   ============================================================ */

function createCinematicFragmentMaterial(
    texture
) {

    return new THREE.ShaderMaterial({

        transparent:
            true,

        depthWrite:
            false,

        depthTest:
            true,

        side:
            THREE.DoubleSide,


        uniforms: {

            map: {

                value:
                    texture

            },

            opacity: {

                value:
                    0

            },

            glow: {

                value:
                    0.10

            },

            time: {

                value:
                    0

            }

        },


        vertexShader: `

            varying vec2 vUv;

            uniform float time;


            void main() {

                vUv = uv;


                vec3 p =
                    position;


                /*
                   Curved 3D surface.
                */

                float bendX =
                    sin(
                        uv.y *
                        3.14159
                    ) *
                    0.42;


                float bendY =
                    sin(
                        uv.x *
                        3.14159
                    ) *
                    0.30;


                p.z +=
                    bendX +
                    bendY;


                /*
                   Tiny cinematic movement.
                */

                p.z +=

                    sin(
                        time * 1.2 +
                        uv.x * 6.0
                    ) *

                    0.025;


                vec4 worldPosition =
                    modelMatrix *

                    vec4(
                        p,
                        1.0
                    );


                gl_Position =
                    projectionMatrix *

                    viewMatrix *

                    worldPosition;

            }

        `,


        fragmentShader: `

            uniform sampler2D map;

            uniform float opacity;

            uniform float glow;

            uniform float time;

            varying vec2 vUv;


            void main() {

                vec4 tex =
                    texture2D(
                        map,
                        vUv
                    );


                /*
                   Remove black background.
                */

                float brightness =
                    max(

                        max(
                            tex.r,
                            tex.g
                        ),

                        tex.b

                    );


                float imageAlpha =
                    smoothstep(

                        0.035,

                        0.13,

                        brightness

                    );


                /*
                   Irregular cinematic shape.
                */

                vec2 q =

                    (

                        vUv -

                        vec2(
                            0.5,
                            0.5
                        )

                    )

                    /

                    vec2(
                        0.47,
                        0.43
                    );


                float radius =
                    length(q);


                float angle =
                    atan(
                        q.y,
                        q.x
                    );


                float brokenEdge =

                    1.0 +

                    0.08 *

                    sin(
                        angle * 5.0 +
                        0.7
                    ) +

                    0.045 *

                    sin(
                        angle * 9.0 -
                        1.4
                    );


                float shapeAlpha =

                    1.0 -

                    smoothstep(

                        0.76 *
                        brokenEdge,

                        1.02 *
                        brokenEdge,

                        radius

                    );


                /*
                   Soft irregular edges.
                */

                float cut1 =
                    smoothstep(

                        0.10,

                        0.28,

                        vUv.x

                    );


                float cut2 =
                    smoothstep(

                        0.10,

                        0.28,

                        1.0 -
                        vUv.x

                    );


                float cut3 =
                    smoothstep(

                        0.08,

                        0.25,

                        vUv.y

                    );


                float cut4 =
                    smoothstep(

                        0.08,

                        0.25,

                        1.0 -
                        vUv.y

                    );


                float edge =
                    cut1 *
                    cut2 *
                    cut3 *
                    cut4;


                float alpha =
                    shapeAlpha *
                    imageAlpha;


                alpha *=
                    edge;


                /*
                   Golden cinematic shimmer.
                */

                vec3 gold =
                    vec3(

                        1.0,

                        0.58,

                        0.08

                    );


                float shimmer =

                    0.5 +

                    0.5 *

                    sin(

                        time * 3.0 +

                        vUv.x * 10.0

                    );


                vec3 finalColor =

                    tex.rgb +

                    gold *

                    glow *

                    shimmer *

                    alpha;


                float finalAlpha =

                    alpha *

                    opacity;


                if (
                    finalAlpha < 0.012
                ) {

                    discard;

                }


                gl_FragColor =

                    vec4(

                        finalColor,

                        finalAlpha

                    );

            }

        `

    });

}


/* ============================================================
   CREATE FRAGMENT
   ============================================================ */

function createFragment(
    texture,
    index
) {

    const geometry =
        new THREE.PlaneGeometry(

            FRAGMENT_WIDTH,

            FRAGMENT_HEIGHT,

            32,

            18

        );


    const material =
        createCinematicFragmentMaterial(
            texture
        );


    const mesh =
        new THREE.Mesh(

            geometry,

            material

        );


    mesh.visible =
        false;


    mesh.renderOrder =
        20 + index;


    mesh.userData.index =
        index;


    scene.add(
        mesh
    );


    fragments[index] =
        mesh;


    /*
       Soft golden aura.
    */

    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffad32,

            transparent:
                true,

            opacity:
                0,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            side:
                THREE.DoubleSide

        });


    const glow =
        new THREE.Mesh(

            new THREE.PlaneGeometry(

                FRAGMENT_WIDTH *
                1.08,

                FRAGMENT_HEIGHT *
                1.08

            ),

            glowMaterial

        );


    glow.visible =
        false;


    glow.position.z =
        -0.08;


    glow.renderOrder =
        19;


    scene.add(
        glow
    );


    fragmentGlows[index] =
        glow;

}


/* ============================================================
   LOAD ALL 18 FRAGMENTS
   ============================================================ */

function loadFragments() {

    const loader =
        new THREE.TextureLoader();


    for (

        let i = 0;

        i < TOTAL_FRAGMENTS;

        i++

    ) {

        const number =

            String(
                i + 1
            ).padStart(
                2,
                '0'
            );


        const path =

            `fragments/fragment-${number}.png`;


        loader.load(

            path,


            texture => {

                texture.minFilter =
                    THREE.LinearFilter;


                texture.magFilter =
                    THREE.LinearFilter;


                texture.generateMipmaps =
                    false;


                if (
                    'colorSpace'
                    in texture
                ) {

                    texture.colorSpace =
                        THREE.SRGBColorSpace;

                }

                else {

                    texture.encoding =
                        THREE.sRGBEncoding;

                }


                texture.needsUpdate =
                    true;


                fragmentTextures[i] =
                    texture;


                createFragment(

                    texture,

                    i

                );


                updateLoading();

            },


            undefined,


            error => {

                console.error(

                    'Fragment failed:',

                    path,

                    error

                );


                fragmentTextures[i] =
                    null;


                fragments[i] =
                    null;


                updateLoading();

            }

        );

    }

}


/* ============================================================
   LOADING BAR
   ============================================================ */

function updateLoading() {

    let completed =
        0;


    for (

        let i = 0;

        i < TOTAL_FRAGMENTS;

        i++

    ) {

        if (

            fragmentTextures[i]
            !== undefined

        ) {

            completed++;

        }

    }


    const progress =
        completed /
        TOTAL_FRAGMENTS;


    if (
        loadingBar
    ) {

        loadingBar.style.width =
            `${progress * 100}%`;

    }


    if (

        completed >=
        TOTAL_FRAGMENTS

    ) {

        if (
            loadingWrap
        ) {

            loadingWrap.style.opacity =
                '0';

            loadingWrap.style.transition =
                'opacity .6s ease';

        }


        if (
            startButton
        ) {

            startButton.disabled =
                false;

            startButton.style.opacity =
                '1';

            startButton.style.pointerEvents =
                'auto';

        }


        console.log(
            'All 18 fragments loaded.'
        );

    }

}


/* ============================================================
   RESET FRAGMENTS
   ============================================================ */

function resetFragments() {

    fragments.forEach(

        (fragment, i) => {

            if (
                !fragment
            ) {

                return;

            }


            fragment.visible =
                false;


            fragment.position.set(

                0,

                0,

                -30

            );


            fragment.rotation.set(

                0,

                0,

                0

            );


            fragment.scale.set(

                0.01,

                0.01,

                0.01

            );


            if (

                fragment.material &&

                fragment.material.uniforms

            ) {

                fragment.material
                    .uniforms
                    .opacity
                    .value = 0;

            }


            const glow =
                fragmentGlows[i];


            if (
                glow
            ) {

                glow.visible =
                    false;


                glow.position.copy(
                    fragment.position
                );


                glow.rotation.copy(
                    fragment.rotation
                );


                glow.scale.set(

                    0.01,

                    0.01,

                    0.01

                );


                glow.material.opacity =
                    0;

            }

        }

    );

}


/* ============================================================
   PARTICLE BURST
   ============================================================ */

function createParticleBurst(

    position,

    power = 1

) {

    const count =

        Math.min(

            1600,

            Math.floor(
                360 * power
            )

        );


    const positions =
        new Float32Array(

            count * 3

        );


    const velocities =
        [];


    for (

        let i = 0;

        i < count;

        i++

    ) {

        const p =
            i * 3;


        positions[p] =
            position.x;


        positions[p + 1] =
            position.y;


        positions[p + 2] =
            position.z;


        const direction =

            new THREE.Vector3(

                THREE.MathUtils.randFloatSpread(
                    2
                ),

                THREE.MathUtils.randFloatSpread(
                    2
                ),

                THREE.MathUtils.randFloatSpread(
                    2
                )

            ).normalize();


        const speed =

            THREE.MathUtils.randFloat(

                0.035,

                0.16

            ) *

            power;


        velocities.push({

            x:
                direction.x *
                speed,

            y:
                direction.y *
                speed,

            z:
                direction.z *
                speed

        });

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        'position',

        new THREE.BufferAttribute(

            positions,

            3

        )

    );


    const material =
        new THREE.PointsMaterial({

            color:
                0xffd36b,

            size:
                THREE.MathUtils.randFloat(

                    0.055,

                    0.10

                ),

            transparent:
                true,

            opacity:
                1,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const particles =
        new THREE.Points(

            geometry,

            material

        );


    particles.renderOrder =
        90;


    scene.add(
        particles
    );


    const state = {

        life:
            0

    };


    gsap.to(

        state,

        {

            life:
                1,

            duration:

                Math.max(

                    0.35,

                    0.9 /
                    Math.max(
                        power,
                        0.8
                    )

                ),

            ease:
                'power2.out',


            onUpdate:
                () => {

                    const array =

                        geometry
                            .attributes
                            .position
                            .array;


                    for (

                        let i = 0;

                        i < count;

                        i++

                    ) {

                        const p =
                            i * 3;


                        array[p] +=
                            velocities[i].x;


                        array[p + 1] +=
                            velocities[i].y;


                        array[p + 2] +=
                            velocities[i].z;


                        velocities[i].x *=
                            0.985;


                        velocities[i].y *=
                            0.985;


                        velocities[i].z *=
                            0.985;

                    }


                    geometry
                        .attributes
                        .position
                        .needsUpdate =
                        true;


                    material.opacity =
                        1 -
                        state.life;

                },


            onComplete:
                () => {

                    scene.remove(
                        particles
                    );


                    geometry.dispose();

                    material.dispose();

                }

        }

    );

}
/* ============================================================
   3D LIGHTNING
   ============================================================ */

function spawnLightning(
    start,
    end,
    power = 1
) {

    const points = [];

    const segments = 18;


    for (
        let i = 0;

        i <= segments;

        i++
    ) {

        const t =
            i / segments;


        const point =
            start.clone().lerp(
                end,
                t
            );


        if (
            i !== 0 &&
            i !== segments
        ) {

            point.x +=

                THREE.MathUtils.randFloat(
                    -0.50,
                    0.50
                ) * power;


            point.y +=

                THREE.MathUtils.randFloat(
                    -0.50,
                    0.50
                ) * power;


            point.z +=

                THREE.MathUtils.randFloat(
                    -0.70,
                    0.70
                ) * power;

        }


        points.push(
            point
        );

    }


    const curve =
        new THREE.CatmullRomCurve3(
            points
        );


    /* ========================================================
       BRIGHT INNER LIGHTNING CORE
       ======================================================== */

    const coreGeometry =
        new THREE.TubeGeometry(

            curve,

            segments * 2,

            0.018 +
            power * 0.006,

            5,

            false

        );


    /* ========================================================
       WIDE GOLDEN LIGHTNING GLOW
       ======================================================== */

    const glowGeometry =
        new THREE.TubeGeometry(

            curve,

            segments * 2,

            0.055 +
            power * 0.018,

            5,

            false

        );


    const coreMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffffff,

            transparent:
                true,

            opacity:
                0,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffa82e,

            transparent:
                true,

            opacity:
                0,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const core =
        new THREE.Mesh(

            coreGeometry,

            coreMaterial

        );


    const glow =
        new THREE.Mesh(

            glowGeometry,

            glowMaterial

        );


    core.renderOrder =
        121;


    glow.renderOrder =
        120;


    scene.add(
        glow
    );


    scene.add(
        core
    );


    const life =
        Math.min(

            1,

            0.72 * power

        );


    /* ========================================================
       ELECTRICAL FLICKER
       ======================================================== */

    const lightningTimeline =
        gsap.timeline();


    lightningTimeline

        .to(

            coreMaterial,

            {

                opacity:
                    life,

                duration:
                    0.025

            }

        )

        .to(

            glowMaterial,

            {

                opacity:

                    Math.min(

                        0.80,

                        life * 0.60

                    ),

                duration:
                    0.02

            },

            '<'

        )

        .to(

            coreMaterial,

            {

                opacity:
                    0.08,

                duration:
                    0.035

            }

        )

        .to(

            coreMaterial,

            {

                opacity:
                    life * 0.90,

                duration:
                    0.025

            }

        )

        .to(

            glowMaterial,

            {

                opacity:
                    0.16,

                duration:
                    0.04

            },

            '<'

        )

        .to(

            coreMaterial,

            {

                opacity:
                    0,

                duration:
                    0.13

            }

        )

        .to(

            glowMaterial,

            {

                opacity:
                    0,

                duration:
                    0.16

            },

            '<'

        )

        .call(

            () => {

                scene.remove(
                    core
                );


                scene.remove(
                    glow
                );


                coreGeometry.dispose();

                glowGeometry.dispose();

                coreMaterial.dispose();

                glowMaterial.dispose();

            }

        );


    /* ========================================================
       LIGHTNING BRANCH
       ======================================================== */

    if (
        power > 1.10
    ) {

        const branchStart =
            points[
                Math.floor(
                    segments * 0.48
                )
            ].clone();


        const branchEnd =
            branchStart.clone().add(

                new THREE.Vector3(

                    THREE.MathUtils.randFloat(
                        -2.0,
                        2.0
                    ),

                    THREE.MathUtils.randFloat(
                        -2.4,
                        2.4
                    ),

                    THREE.MathUtils.randFloat(
                        -1.5,
                        1.5
                    )

                )

            );


        const branchMid =
            branchStart
                .clone()
                .lerp(
                    branchEnd,
                    0.5
                );


        branchMid.x +=

            THREE.MathUtils.randFloat(
                -0.5,
                0.5
            );


        branchMid.y +=

            THREE.MathUtils.randFloat(
                -0.5,
                0.5
            );


        const branchCurve =
            new THREE.CatmullRomCurve3(

                [

                    branchStart,

                    branchMid,

                    branchEnd

                ]

            );


        const branchGeometry =
            new THREE.TubeGeometry(

                branchCurve,

                12,

                0.012 +
                power * 0.004,

                4,

                false

            );


        const branchMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffffdf,

                transparent:
                    true,

                opacity:
                    0,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            });


        const branch =
            new THREE.Mesh(

                branchGeometry,

                branchMaterial

            );


        branch.renderOrder =
            119;


        scene.add(
            branch
        );


        gsap.timeline()

            .to(

                branchMaterial,

                {

                    opacity:
                        Math.min(
                            0.9,
                            life
                        ),

                    duration:
                        0.025

                }

            )

            .to(

                branchMaterial,

                {

                    opacity:
                        0,

                    duration:
                        0.16

                }

            )

            .call(

                () => {

                    scene.remove(
                        branch
                    );


                    branchGeometry.dispose();

                    branchMaterial.dispose();

                }

            );

    }


    /* ========================================================
       LIGHT FLASH
       ======================================================== */

    flashScreen(

        Math.min(
            0.55,
            0.14 * power
        )

    );

}


/* ============================================================
   CINEMATIC SCREEN FLASH
   ============================================================ */

function createFlash() {

    flashElement =
        document.createElement(
            'div'
        );


    flashElement.id =
        'cinematic-flash';


    Object.assign(

        flashElement.style,

        {

            position:
                'fixed',

            left:
                '0',

            top:
                '0',

            width:
                '100%',

            height:
                '100%',

            pointerEvents:
                'none',

            zIndex:
                '90',

            opacity:
                '0',

            background:

                'radial-gradient(circle at 50% 50%, rgba(255,255,255,.98) 0%, rgba(255,218,130,.60) 12%, rgba(255,156,40,.16) 36%, transparent 72%)',

            mixBlendMode:
                'screen'

        }

    );


    document.body.appendChild(
        flashElement
    );

}


/* ============================================================
   FLASH SCREEN
   ============================================================ */

function flashScreen(
    strength = 0.5
) {

    if (
        flashElement
    ) {

        gsap.killTweensOf(
            flashElement
        );


        gsap.set(

            flashElement,

            {

                opacity:

                    Math.min(
                        0.95,
                        strength
                    )

            }

        );


        gsap.to(

            flashElement,

            {

                opacity:
                    0,

                duration:

                    Math.max(

                        0.08,

                        0.26 *
                        strength

                    ),

                ease:
                    'power2.out'

            }

        );

    }


    if (
        flashLight
    ) {

        flashLight.intensity =
            45 * strength;


        gsap.to(

            flashLight,

            {

                intensity:
                    0,

                duration:
                    0.24,

                ease:
                    'power2.out'

            }

        );

    }

}


/* ============================================================
   FINAL LOGO CINEMATIC EFFECTS
   ============================================================ */

function createFinalEffects() {

    /* ========================================================
       GOLDEN AURA
       ======================================================== */

    finalAura =
        document.createElement(
            'div'
        );


    finalAura.id =
        'final-aura';


    Object.assign(

        finalAura.style,

        {

            position:
                'fixed',

            left:
                '50%',

            top:
                '50%',

            width:
                '100vmin',

            height:
                '100vmin',

            transform:
                'translate(-50%, -50%) scale(.25)',

            borderRadius:
                '50%',

            pointerEvents:
                'none',

            zIndex:
                '75',

            opacity:
                '0',

            background:

                'radial-gradient(circle, rgba(255,210,100,.30) 0%, rgba(255,160,40,.16) 20%, rgba(255,150,20,.07) 40%, transparent 72%)',

            filter:
                'blur(18px)',

            mixBlendMode:
                'screen'

        }

    );


    document.body.appendChild(
        finalAura
    );


    /* ========================================================
       GOLDEN RING
       ======================================================== */

    finalRing =
        document.createElement(
            'div'
        );


    finalRing.id =
        'final-ring';


    Object.assign(

        finalRing.style,

        {

            position:
                'fixed',

            left:
                '50%',

            top:
                '50%',

            width:
                '20vmin',

            height:
                '20vmin',

            transform:
                'translate(-50%, -50%) scale(.1)',

            borderRadius:
                '50%',

            border:
                '2px solid rgba(255,210,100,.85)',

            boxShadow:

                '0 0 20px rgba(255,190,60,.8), inset 0 0 20px rgba(255,190,60,.3)',

            pointerEvents:
                'none',

            zIndex:
                '76',

            opacity:
                '0',

            mixBlendMode:
                'screen'

        }

    );


    document.body.appendChild(
        finalRing
    );


    /* ========================================================
       GOLDEN SWEEP
       ======================================================== */

    finalSweep =
        document.createElement(
            'div'
        );


    finalSweep.id =
        'final-sweep';


    Object.assign(

        finalSweep.style,

        {

            position:
                'fixed',

            left:
                '-30%',

            top:
                '0',

            width:
                '18%',

            height:
                '100%',

            pointerEvents:
                'none',

            zIndex:
                '78',

            opacity:
                '0',

            transform:
                'skewX(-18deg)',

            background:

                'linear-gradient(90deg, transparent, rgba(255,225,150,.55), rgba(255,255,255,.85), rgba(255,205,90,.30), transparent)',

            filter:
                'blur(8px)',

            mixBlendMode:
                'screen'

        }

    );


    document.body.appendChild(
        finalSweep
    );

}


/* ============================================================
   AUDIO SETUP
   ============================================================ */

function setupAudio() {

    music =
        new Audio(
            MUSIC_FILE
        );


    impactAudio =
        new Audio(
            IMPACT_FILE
        );


    music.preload =
        'auto';


    music.loop =
        true;


    music.volume =
        0.70;


    impactAudio.preload =
        'auto';


    impactAudio.loop =
        false;


    impactAudio.volume =
        0.55;

}


/* ============================================================
   START MUSIC
   ============================================================ */

function startMusic() {

    if (
        !music
    ) {

        return;

    }


    music.pause();


    music.currentTime =
        0;


    music.volume =
        0;


    music.play()
        .then(

            () => {

                gsap.to(

                    music,

                    {

                        volume:
                            0.70,

                        duration:
                            1.4,

                        ease:
                            'power2.out'

                    }

                );

            }

        )
        .catch(

            error => {

                console.warn(

                    'Music playback blocked:',

                    error

                );

            }

        );

}


/* ============================================================
   PLAY IMPACT SOUND
   ============================================================ */

function playImpact() {

    if (
        !impactAudio
    ) {

        return;

    }


    impactAudio.pause();


    impactAudio.currentTime =
        0;


    impactAudio.volume =
        0.55;


    impactAudio
        .play()
        .catch(
            () => {}
        );

}


/* ============================================================
   STOP ALL AUDIO
   IMPORTANT:
   AUDIO ENDS EXACTLY AT 43 SECONDS
   ============================================================ */

function stopAllAudio() {

    if (
        musicStopTimer
    ) {

        clearTimeout(
            musicStopTimer
        );


        musicStopTimer =
            null;

    }


    if (
        music
    ) {

        music.pause();


        music.currentTime =
            0;


        music.volume =
            0;

    }


    if (
        impactAudio
    ) {

        impactAudio.pause();


        impactAudio.currentTime =
            0;


        impactAudio.volume =
            0;

    }

}


/* ============================================================
   SCHEDULE EXACT AUDIO STOP
   ============================================================ */

function scheduleAudioStop() {

    if (
        musicStopTimer
    ) {

        clearTimeout(
            musicStopTimer
        );

    }


    musicStopTimer =
        setTimeout(

            () => {

                stopAllAudio();


                console.log(
                    'AUDIO STOPPED AT 43 SECONDS.'
                );

            },

            43000

        );

}


/* ============================================================
   PREPARE FINAL LOGO
   ============================================================ */

function prepareFinalLogo() {

    if (
        !finalLogo
    ) {

        return;

    }


    finalLogo.style.position =
        'fixed';


    finalLogo.style.left =
        '50%';


    finalLogo.style.top =
        '50%';


    /*
       BIG FINAL LOGO
    */

    finalLogo.style.width =
        'min(90vw, 1080px)';


    finalLogo.style.height =
        'min(90vh, 1080px)';


    finalLogo.style.display =
        'none';


    finalLogo.style.alignItems =
        'center';


    finalLogo.style.justifyContent =
        'center';


    finalLogo.style.zIndex =
        '80';


    finalLogo.style.pointerEvents =
        'none';


    finalLogo.style.opacity =
        '0';


    finalLogo.style.transform =
        'translate(-50%, -50%) scale(.55)';


    const logoImg =
        finalLogo.querySelector(
            'img'
        );


    if (
        logoImg
    ) {

        logoImg.style.width =
            '100%';


        logoImg.style.height =
            '100%';


        logoImg.style.objectFit =
            'contain';


        logoImg.style.display =
            'block';

    }

}


/* ============================================================
   SHOW FINAL LOGO
   SMOOTH CINEMATIC VERSION
   ============================================================ */

function showFinalLogo() {

    if (
        !finalLogo
    ) {

        return;

    }


    finalLogo.style.position =
        'fixed';


    finalLogo.style.left =
        '50%';


    finalLogo.style.top =
        '50%';


    finalLogo.style.width =
        'min(90vw, 1080px)';


    finalLogo.style.height =
        'min(90vh, 1080px)';


    finalLogo.style.display =
        'flex';


    finalLogo.style.alignItems =
        'center';


    finalLogo.style.justifyContent =
        'center';


    finalLogo.style.opacity =
        '0';


    /*
       Start slightly smaller.
    */

    finalLogo.style.transform =
        'translate(-50%, -50%) scale(.72)';


    const logoImg =
        finalLogo.querySelector(
            'img'
        );


    if (
        logoImg
    ) {

        logoImg.style.width =
            '100%';


        logoImg.style.height =
            '100%';


        logoImg.style.objectFit =
            'contain';

    }


    /* ========================================================
       AURA START
       ======================================================== */

    if (
        finalAura
    ) {

        gsap.killTweensOf(
            finalAura
        );


        gsap.set(

            finalAura,

            {

                opacity:
                    0,

                scale:
                    0.25

            }

        );


        gsap.to(

            finalAura,

            {

                opacity:
                    1,

                scale:
                    0.85,

                duration:
                    0.55,

                ease:
                    'power2.out'

            }

        );


        gsap.to(

            finalAura,

            {

                opacity:
                    0.40,

                scale:
                    1.0,

                duration:
                    1.25,

                ease:
                    'power2.out'

            }

        );

    }


    /* ========================================================
       RING START
       ======================================================== */

    if (
        finalRing
    ) {

        gsap.killTweensOf(
            finalRing
        );


        gsap.set(

            finalRing,

            {

                opacity:
                    0.9,

                scale:
                    0.10

            }

        );


        gsap.to(

            finalRing,

            {

                opacity:
                    0,

                scale:
                    3.2,

                duration:
                    1.15,

                ease:
                    'expo.out'

            }

        );

    }


    /* ========================================================
       LOGO APPEARANCE
       ======================================================== */

    gsap.to(

        finalLogo,

        {

            opacity:
                1,

            duration:
                0.50,

            ease:
                'power2.out'

        }

    );


    /*
       Smooth scale.
       No sudden jump.
    */

    gsap.to(

        finalLogo,

        {

            scale:
                1,

            duration:
                1.20,

            ease:
                'expo.out',

            onUpdate:
                () => {

                }

        }

    );


    /*
       Use CSS transform directly
       at the end to guarantee center.
    */

    gsap.delayedCall(

        1.25,

        () => {

            finalLogo.style.transform =
                'translate(-50%, -50%) scale(1)';

        }

    );


    /* ========================================================
       GOLD SWEEP
       ======================================================== */

    if (
        finalSweep
    ) {

        gsap.killTweensOf(
            finalSweep
        );


        gsap.set(

            finalSweep,

            {

                left:
                    '-25%',

                opacity:
                    0

            }

        );


        gsap.to(

            finalSweep,

            {

                opacity:
                    1,

                duration:
                    0.12,

                delay:
                    0.35

            }

        );


        gsap.to(

            finalSweep,

            {

                left:
                    '125%',

                duration:
                    0.90,

                delay:
                    0.35,

                ease:
                    'power2.inOut',

                onComplete:
                    () => {

                        finalSweep.style.opacity =
                            '0';

                    }

            }

        );

    }

}
/* ============================================================
   CINEMATIC IMPACT
   ============================================================ */

function cinematicImpact(
    time,
    x = 0,
    y = 0,
    z = 0,
    power = 1
) {

    masterTimeline.call(

        () => {

            /* --------------------------------------------
               GOLD FLASH
            -------------------------------------------- */

            flashScreen(
                Math.min(
                    0.45,
                    0.18 * power
                )
            );


            /* --------------------------------------------
               GOLD PARTICLE EXPLOSION
            -------------------------------------------- */

            createParticleBurst(

                new THREE.Vector3(
                    x,
                    y,
                    z
                ),

                power

            );


            /* --------------------------------------------
               MAIN 3D LIGHTNING
            -------------------------------------------- */

            spawnLightning(

                new THREE.Vector3(
                    x - 0.6,
                    y + 4.5,
                    z + 1.5
                ),

                new THREE.Vector3(
                    x,
                    y,
                    z + 1.6
                ),

                power

            );


            /* --------------------------------------------
               SECOND LIGHTNING
            -------------------------------------------- */

            if (
                power > 1.15
            ) {

                spawnLightning(

                    new THREE.Vector3(
                        x + 3.8,
                        y + 3.0,
                        z + 1.2
                    ),

                    new THREE.Vector3(
                        x + 0.2,
                        y,
                        z + 1.4
                    ),

                    power * 0.80

                );

            }


            /* --------------------------------------------
               THIRD SMALL LIGHTNING
            -------------------------------------------- */

            if (
                power > 1.50
            ) {

                spawnLightning(

                    new THREE.Vector3(
                        x - 3.2,
                        y - 3.4,
                        z + 1.4
                    ),

                    new THREE.Vector3(
                        x,
                        y,
                        z + 1.3
                    ),

                    power * 0.65

                );

            }


            /* --------------------------------------------
               IMPACT SOUND
            -------------------------------------------- */

            playImpact();


            /* --------------------------------------------
               GOLD LIGHT
            -------------------------------------------- */

            warmLight.intensity =
                5.5 * power;


            goldLight.intensity =
                4.5 * power;


            gsap.to(

                warmLight,

                {

                    intensity:
                        0,

                    duration:
                        0.38,

                    ease:
                        'power2.out'

                }

            );


            gsap.to(

                goldLight,

                {

                    intensity:
                        0,

                    duration:
                        0.38,

                    ease:
                        'power2.out'

                }

            );

        },

        [],

        time

    );

}


/* ============================================================
   CINEMATIC SHOT
   ============================================================ */

function cinematicShot(

    index,

    start,

    duration,

    options = {}

) {

    const fragment =
        fragments[index];


    const glow =
        fragmentGlows[index];


    if (
        !fragment
    ) {

        return;

    }


    /* ========================================================
       OPTIONS
    ======================================================== */

    const mode =
        options.mode ||
        'fly';


    const fromX =
        options.fromX ??
        0;


    const fromY =
        options.fromY ??
        0;


    const fromZ =
        options.fromZ ??
        -18;


    const finalX =
        options.x ??
        0;


    const finalY =
        options.y ??
        0;


    const finalZ =
        options.z ??
        0;


    const startRotX =
        options.startRotX ??
        0;


    const startRotY =
        options.startRotY ??
        0;


    const startRotZ =
        options.startRotZ ??
        0;


    const rotX =
        options.rotX ??
        0;


    const rotY =
        options.rotY ??
        0;


    const rotZ =
        options.rotZ ??
        0;


    const scale =
        options.scale ??
        0.86;


    const impactAt =
        options.impactAt ??
        0.68;


    const power =
        options.power ??
        1;


    /* ========================================================
       INITIAL STATE
    ======================================================== */

    masterTimeline.call(

        () => {

            fragment.visible =
                true;


            fragment.position.set(

                fromX,
                fromY,
                fromZ

            );


            fragment.rotation.set(

                THREE.MathUtils.degToRad(
                    startRotX
                ),

                THREE.MathUtils.degToRad(
                    startRotY
                ),

                THREE.MathUtils.degToRad(
                    startRotZ
                )

            );


            fragment.scale.set(

                0.025,
                0.025,
                0.025

            );


            if (

                fragment.material &&

                fragment.material.uniforms

            ) {

                fragment.material
                    .uniforms
                    .opacity
                    .value = 0;

            }


            /* --------------------------------------------
               GLOW RESET
            -------------------------------------------- */

            if (
                glow
            ) {

                glow.visible =
                    true;


                glow.position.copy(
                    fragment.position
                );


                glow.rotation.copy(
                    fragment.rotation
                );


                glow.scale.set(

                    0.025,
                    0.025,
                    0.025

                );


                glow.material.opacity =
                    0;

            }

        },

        [],

        start

    );


    /* ========================================================
       MOVEMENT STYLE
    ======================================================== */

    let moveDuration =
        duration * 0.52;


    let moveEase =
        'power3.out';


    if (
        mode === 'slam'
    ) {

        moveDuration =
            duration * 0.48;


        moveEase =
            'expo.out';

    }


    if (
        mode === 'whip'
    ) {

        moveDuration =
            duration * 0.34;


        moveEase =
            'power4.out';

    }


    if (
        mode === 'spin'
    ) {

        moveDuration =
            duration * 0.48;


        moveEase =
            'back.out(1.6)';

    }


    if (
        mode === 'drop'
    ) {

        moveDuration =
            duration * 0.46;


        moveEase =
            'bounce.out';

    }


    /* ========================================================
       MOVE INTO SCREEN
    ======================================================== */

    masterTimeline.to(

        fragment.position,

        {

            x:
                finalX,

            y:
                finalY,

            z:
                finalZ,

            duration:
                moveDuration,

            ease:
                moveEase

        },

        start

    );


    /* ========================================================
       3D ROTATION
    ======================================================== */

    let rotationDuration =
        duration * 0.65;


    if (
        mode === 'spin'
    ) {

        rotationDuration =
            duration * 0.80;

    }


    masterTimeline.to(

        fragment.rotation,

        {

            x:
                THREE.MathUtils.degToRad(
                    rotX
                ),

            y:
                THREE.MathUtils.degToRad(
                    rotY
                ),

            z:
                THREE.MathUtils.degToRad(
                    rotZ
                ),

            duration:
                rotationDuration,

            ease:
                mode === 'spin'
                    ? 'power4.out'
                    : 'power3.out'

        },

        start

    );


    /* ========================================================
       SCALE UP
    ======================================================== */

    masterTimeline.to(

        fragment.scale,

        {

            x:
                scale,

            y:
                scale,

            z:
                scale,

            duration:
                duration * 0.44,

            ease:

                mode === 'slam'

                    ? 'back.out(2.4)'

                    :

                mode === 'spin'

                    ? 'back.out(1.8)'

                    :

                    'power4.out'

        },

        start

    );


    /* ========================================================
       IMAGE FADE
    ======================================================== */

    if (

        fragment.material &&

        fragment.material.uniforms

    ) {

        masterTimeline.to(

            fragment.material
                .uniforms
                .opacity,

            {

                value:
                    1,

                duration:
                    duration * 0.18,

                ease:
                    'power2.out'

            },

            start +
            duration * 0.06

        );


        /* --------------------------------------------
           GOLD SHIMMER
        -------------------------------------------- */

        masterTimeline.to(

            fragment.material
                .uniforms
                .glow,

            {

                value:
                    0.28,

                duration:
                    duration * 0.30,

                ease:
                    'power2.out'

            },

            start +
            duration * 0.10

        );

    }


    /* ========================================================
       GLOW MOVEMENT
    ======================================================== */

    if (
        glow
    ) {

        masterTimeline.to(

            glow.position,

            {

                x:
                    finalX,

                y:
                    finalY,

                z:
                    finalZ - 0.08,

                duration:
                    duration * 0.50,

                ease:
                    'power3.out'

            },

            start

        );


        masterTimeline.to(

            glow.rotation,

            {

                x:
                    THREE.MathUtils.degToRad(
                        rotX
                    ),

                y:
                    THREE.MathUtils.degToRad(
                        rotY
                    ),

                z:
                    THREE.MathUtils.degToRad(
                        rotZ
                    ),

                duration:
                    duration * 0.55,

                ease:
                    'power3.out'

            },

            start

        );


        masterTimeline.to(

            glow.scale,

            {

                x:
                    scale * 1.10,

                y:
                    scale * 1.10,

                z:
                    scale * 1.10,

                duration:
                    duration * 0.45,

                ease:
                    'power4.out'

            },

            start

        );


        masterTimeline.to(

            glow.material,

            {

                opacity:
                    0.18,

                duration:
                    duration * 0.20,

                ease:
                    'power2.out'

            },

            start +
            duration * 0.08

        );

    }


    /* ========================================================
       CAMERA MOVEMENT
    ======================================================== */

    masterTimeline.to(

        camera.position,

        {

            x:
                options.cameraX ??
                finalX * 0.40,

            y:
                options.cameraY ??
                finalY * 0.30,

            z:
                options.cameraZ ??
                11,

            duration:
                duration * 0.55,

            ease:
                'power2.inOut'

        },

        start

    );


    /* ========================================================
       CAMERA FOV
    ======================================================== */

    masterTimeline.to(

        camera,

        {

            fov:
                options.fov ??
                40,

            duration:
                duration * 0.45,

            ease:
                'power2.out',

            onUpdate:
                () => {

                    camera.updateProjectionMatrix();

                }

        },

        start

    );


    /* ========================================================
       CAMERA TARGET
    ======================================================== */

    masterTimeline.call(

        () => {

            cameraTarget.set(

                finalX * 0.35,

                finalY * 0.35,

                finalZ

            );

        },

        [],

        start +
        duration * 0.16

    );


    /* ========================================================
       CINEMATIC IMPACT
    ======================================================== */

    cinematicImpact(

        start +
        duration * impactAt,

        finalX,

        finalY,

        finalZ + 0.5,

        power

    );


    /* ========================================================
       IMPACT SHAKE
    ======================================================== */

    masterTimeline.to(

        fragment.rotation,

        {

            z:

                THREE.MathUtils.degToRad(

                    rotZ +
                    (
                        options.shake ??
                        5
                    )

                ),

            duration:
                0.045,

            ease:
                'power4.out'

        },

        start +
        duration * impactAt

    );


    masterTimeline.to(

        fragment.rotation,

        {

            z:

                THREE.MathUtils.degToRad(
                    rotZ
                ),

            duration:
                0.11,

            ease:
                'power2.out'

        },

        start +
        duration * impactAt +
        0.045

    );


    /* ========================================================
       SMALL CAMERA SHAKE
    ======================================================== */

    masterTimeline.to(

        camera.position,

        {

            x:
                `+=${THREE.MathUtils.randFloat(
                    -0.12,
                    0.12
                )}`,

            y:
                `+=${THREE.MathUtils.randFloat(
                    -0.10,
                    0.10
                )}`,

            duration:
                0.035,

            ease:
                'power4.out'

        },

        start +
        duration * impactAt

    );


    masterTimeline.to(

        camera.position,

        {

            x:
                `-=${THREE.MathUtils.randFloat(
                    -0.12,
                    0.12
                )}`,

            y:
                `-=${THREE.MathUtils.randFloat(
                    -0.10,
                    0.10
                )}`,

            duration:
                0.14,

            ease:
                'power2.out'

        },

        start +
        duration * impactAt +
        0.04

    );


    /* ========================================================
       EXIT
    ======================================================== */

    if (
        options.exit !== false
    ) {

        const exitTime =
            start +
            duration * 0.80;


        const direction =
            options.exitDirection ??
            1;


        /* --------------------------------------------
           EXIT POSITION
        -------------------------------------------- */

        masterTimeline.to(

            fragment.position,

            {

                x:
                    finalX +
                    direction * 4.8,

                y:
                    finalY +
                    THREE.MathUtils.randFloat(
                        -2.2,
                        2.2
                    ),

                z:
                    finalZ + 4,

                duration:
                    duration * 0.20,

                ease:
                    'expo.in'

            },

            exitTime

        );


        /* --------------------------------------------
           EXIT ROTATION
        -------------------------------------------- */

        masterTimeline.to(

            fragment.rotation,

            {

                x:
                    `+=${THREE.MathUtils.degToRad(
                        45 * direction
                    )}`,

                y:
                    `+=${THREE.MathUtils.degToRad(
                        65
                    )}`,

                z:
                    `+=${THREE.MathUtils.degToRad(
                        75 * direction
                    )}`,

                duration:
                    duration * 0.20,

                ease:
                    'expo.in'

            },

            exitTime

        );


        /* --------------------------------------------
           EXIT SCALE
        -------------------------------------------- */

        masterTimeline.to(

            fragment.scale,

            {

                x:
                    0.015,

                y:
                    0.015,

                z:
                    0.015,

                duration:
                    duration * 0.18,

                ease:
                    'expo.in'

            },

            exitTime

        );


        /* --------------------------------------------
           EXIT FADE
        -------------------------------------------- */

        if (

            fragment.material &&

            fragment.material.uniforms

        ) {

            masterTimeline.to(

                fragment.material
                    .uniforms
                    .opacity,

                {

                    value:
                        0,

                    duration:
                        duration * 0.16,

                    ease:
                        'power2.in'

                },

                exitTime +
                duration * 0.02

            );

        }


        if (
            glow
        ) {

            masterTimeline.to(

                glow.material,

                {

                    opacity:
                        0,

                    duration:
                        duration * 0.15,

                    ease:
                        'power2.in'

                },

                exitTime

            );

        }

    }

}


/* ============================================================
   FINAL FRAGMENT SPECIAL SHOT
   ============================================================ */

function finalFragmentShot(

    index,
    start,
    duration

) {

    const fragment =
        fragments[index];


    if (
        !fragment
    ) {

        return;

    }


    const glow =
        fragmentGlows[index];


    masterTimeline.call(

        () => {

            fragment.visible =
                true;


            fragment.position.set(

                0,

                7,

                -18

            );


            fragment.rotation.set(

                THREE.MathUtils.degToRad(
                    180
                ),

                THREE.MathUtils.degToRad(
                    90
                ),

                THREE.MathUtils.degToRad(
                    180
                )

            );


            fragment.scale.set(

                0.03,
                0.03,
                0.03

            );


            fragment.material
                .uniforms
                .opacity
                .value = 0;


            if (
                glow
            ) {

                glow.visible =
                    true;


                glow.position.copy(
                    fragment.position
                );


                glow.scale.set(
                    0.03,
                    0.03,
                    0.03
                );


                glow.material.opacity =
                    0;

            }

        },

        [],

        start

    );


    /* ========================================================
       FINAL FRAGMENT DROPS FROM ABOVE
    ======================================================== */

    masterTimeline.to(

        fragment.position,

        {

            x:
                0,

            y:
                0,

            z:
                1,

            duration:
                duration * 0.55,

            ease:
                'expo.out'

        },

        start

    );


    /* ========================================================
       FINAL FRAGMENT UNWINDS IN 3D
    ======================================================== */

    masterTimeline.to(

        fragment.rotation,

        {

            x:
                0,

            y:
                0,

            z:
                0,

            duration:
                duration * 0.70,

            ease:
                'power4.out'

        },

        start

    );


    /* ========================================================
       FINAL FRAGMENT SCALE
    ======================================================== */

    masterTimeline.to(

        fragment.scale,

        {

            x:
                0.88,

            y:
                0.88,

            z:
                0.88,

            duration:
                duration * 0.52,

            ease:
                'back.out(1.7)'

        },

        start

    );


    /* ========================================================
       FINAL FRAGMENT FADE
    ======================================================== */

    masterTimeline.to(

        fragment.material
            .uniforms
            .opacity,

        {

            value:
                1,

            duration:
                duration * 0.24,

            ease:
                'power2.out'

        },

        start +
        duration * 0.08

    );


    /* ========================================================
       FINAL GOLD GLOW
    ======================================================== */

    if (
        glow
    ) {

        masterTimeline.to(

            glow.position,

            {

                x:
                    0,

                y:
                    0,

                z:
                    0.9,

                duration:
                    duration * 0.55,

                ease:
                    'power3.out'

            },

            start

        );


        masterTimeline.to(

            glow.scale,

            {

                x:
                    0.94,

                y:
                    0.94,

                z:
                    0.94,

                duration:
                    duration * 0.50,

                ease:
                    'power3.out'

            },

            start

        );


        masterTimeline.to(

            glow.material,

            {

                opacity:
                    0.20,

                duration:
                    duration * 0.25,

                ease:
                    'power2.out'

            },

            start

        );

    }


    /* ========================================================
       FINAL CAMERA PUSH
    ======================================================== */

    masterTimeline.to(

        camera.position,

        {

            x:
                0,

            y:
                0,

            z:
                7.4,

            duration:
                duration * 0.80,

            ease:
                'power2.inOut'

        },

        start

    );


    masterTimeline.to(

        camera,

        {

            fov:
                35,

            duration:
                duration * 0.70,

            ease:
                'power2.out',

            onUpdate:
                () => {

                    camera.updateProjectionMatrix();

                }

        },

        start

    );


    masterTimeline.call(

        () => {

            cameraTarget.set(
                0,
                0,
                1
            );

        },

        [],

        start + 0.20

    );


    /* ========================================================
       BIG FINAL IMPACT
    ======================================================== */

    cinematicImpact(

        start +
        duration * 0.62,

        0,

        0,

        1.3,

        2.5

    );

}
/* ============================================================
   BUILD 43 SECOND CINEMATIC MOVIE
   ============================================================ */

function buildCinematicTimeline() {

    /* ========================================================
       REMOVE OLD TIMELINE
    ======================================================== */

    if (
        masterTimeline
    ) {

        masterTimeline.kill();

    }


    resetFragments();


    /* ========================================================
       CREATE MASTER TIMELINE
    ======================================================== */

    masterTimeline =
        gsap.timeline({

            paused:
                true,

            defaults: {

                overwrite:
                    'auto'

            }

        });


    /* ========================================================
       INTRO SETTINGS
       
       IMPORTANT:
       MUSIC STARTS FIRST.

       PICTURES START AFTER 2.6 SECONDS.
    ======================================================== */

    masterTimeline.call(

        () => {

            camera.position.set(

                0,

                0,

                18

            );


            cameraTarget.set(

                0,

                0,

                0

            );


            camera.fov =
                42;


            camera.updateProjectionMatrix();


            /*
               Very small opening particle movement.
            */

            createParticleBurst(

                new THREE.Vector3(
                    0,
                    0,
                    0
                ),

                0.35

            );

        },

        [],

        0

    );


    /* ========================================================
       CINEMATIC OPENING CAMERA
    ======================================================== */

    masterTimeline.to(

        camera.position,

        {

            z:
                15.5,

            duration:
                2.6,

            ease:
                'power2.inOut'

        },

        0

    );


    /* ========================================================
       OPENING GOLD LIGHT
    ======================================================== */

    masterTimeline.to(

        warmLight,

        {

            intensity:
                1.5,

            duration:
                1.5,

            ease:
                'power2.out'

        },

        0.4

    );


    masterTimeline.to(

        warmLight,

        {

            intensity:
                0,

            duration:
                0.8,

            ease:
                'power2.in'

        },

        1.7

    );


    /* ========================================================
       FIRST PICTURE STARTS AT 2.6 SECONDS
    ======================================================== */

    const FIRST_PICTURE =
        2.60;


    /* ========================================================
       18 CINEMATIC SHOTS
    ======================================================== */

    const shots = [

        /* ====================================================
           01
        ==================================================== */

        [
            0,

            FIRST_PICTURE,

            {

                mode:
                    'fly',

                fromX:
                    -7,

                fromY:
                    3.5,

                fromZ:
                    -18,

                x:
                    -2.8,

                y:
                    1,

                z:
                    1,

                startRotX:
                    -25,

                startRotY:
                    -60,

                startRotZ:
                    -18,

                rotX:
                    4,

                rotY:
                    -15,

                rotZ:
                    -6,

                scale:
                    0.86,

                cameraX:
                    -2.2,

                cameraY:
                    0.6,

                cameraZ:
                    12.5,

                power:
                    1.0,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           02
        ==================================================== */

        [
            1,

            4.55,

            {

                mode:
                    'slam',

                fromX:
                    8,

                fromY:
                    -2,

                fromZ:
                    -17,

                x:
                    2.5,

                y:
                    -0.8,

                z:
                    0.8,

                startRotX:
                    45,

                startRotY:
                    85,

                startRotZ:
                    50,

                rotX:
                    -7,

                rotY:
                    20,

                rotZ:
                    6,

                scale:
                    0.86,

                cameraX:
                    2,

                cameraY:
                    -0.5,

                cameraZ:
                    11.5,

                power:
                    1.2

            }

        ],


        /* ====================================================
           03
        ==================================================== */

        [
            2,

            6.50,

            {

                mode:
                    'spin',

                fromX:
                    -7,

                fromY:
                    -3,

                fromZ:
                    -15,

                x:
                    -2,

                y:
                    -1,

                z:
                    1,

                startRotX:
                    65,

                startRotY:
                    -135,

                startRotZ:
                    -70,

                rotX:
                    10,

                rotY:
                    -22,

                rotZ:
                    -9,

                scale:
                    0.86,

                cameraX:
                    -1.6,

                cameraY:
                    -0.7,

                cameraZ:
                    11,

                power:
                    1.15

            }

        ],


        /* ====================================================
           04
        ==================================================== */

        [
            3,

            8.45,

            {

                mode:
                    'drop',

                fromX:
                    2.5,

                fromY:
                    8,

                fromZ:
                    -16,

                x:
                    1.8,

                y:
                    1.1,

                z:
                    0.7,

                startRotX:
                    100,

                startRotY:
                    40,

                startRotZ:
                    25,

                rotX:
                    -9,

                rotY:
                    14,

                rotZ:
                    5,

                scale:
                    0.86,

                cameraX:
                    1.4,

                cameraY:
                    0.8,

                cameraZ:
                    11.5,

                power:
                    1.1

            }

        ],


        /* ====================================================
           05
        ==================================================== */

        [
            4,

            10.40,

            {

                mode:
                    'whip',

                fromX:
                    -12,

                fromY:
                    0,

                fromZ:
                    -13,

                x:
                    -2.6,

                y:
                    -0.4,

                z:
                    0.9,

                startRotX:
                    -20,

                startRotY:
                    -105,

                startRotZ:
                    38,

                rotX:
                    5,

                rotY:
                    -18,

                rotZ:
                    -5,

                scale:
                    0.86,

                cameraX:
                    -2,

                cameraY:
                    0,

                cameraZ:
                    11,

                power:
                    1.3,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           06
        ==================================================== */

        [
            5,

            12.35,

            {

                mode:
                    'slam',

                fromX:
                    0,

                fromY:
                    9,

                fromZ:
                    -18,

                x:
                    0.8,

                y:
                    0.8,

                z:
                    0.5,

                startRotX:
                    120,

                startRotY:
                    -50,

                startRotZ:
                    90,

                rotX:
                    -5,

                rotY:
                    16,

                rotZ:
                    8,

                scale:
                    0.86,

                cameraX:
                    0.6,

                cameraY:
                    0.7,

                cameraZ:
                    10.5,

                power:
                    1.4

            }

        ],


        /* ====================================================
           07
        ==================================================== */

        [
            6,

            14.30,

            {

                mode:
                    'spin',

                fromX:
                    9,

                fromY:
                    3,

                fromZ:
                    -17,

                x:
                    2.3,

                y:
                    1,

                z:
                    0.7,

                startRotX:
                    -60,

                startRotY:
                    120,

                startRotZ:
                    -90,

                rotX:
                    8,

                rotY:
                    22,

                rotZ:
                    -7,

                scale:
                    0.86,

                cameraX:
                    1.9,

                cameraY:
                    0.7,

                cameraZ:
                    10.5,

                power:
                    1.25

            }

        ],


        /* ====================================================
           08
        ==================================================== */

        [
            7,

            16.25,

            {

                mode:
                    'slam',

                fromX:
                    -5,

                fromY:
                    -8,

                fromZ:
                    -16,

                x:
                    -1.7,

                y:
                    -1.1,

                z:
                    0.8,

                startRotX:
                    100,

                startRotY:
                    -80,

                startRotZ:
                    -50,

                rotX:
                    5,

                rotY:
                    -14,

                rotZ:
                    6,

                scale:
                    0.86,

                cameraX:
                    -1.4,

                cameraY:
                    -1,

                cameraZ:
                    10,

                power:
                    1.45,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           09
        ==================================================== */

        [
            8,

            18.20,

            {

                mode:
                    'fly',

                fromX:
                    8,

                fromY:
                    -5,

                fromZ:
                    -18,

                x:
                    1.8,

                y:
                    0.8,

                z:
                    0.9,

                startRotX:
                    -80,

                startRotY:
                    90,

                startRotZ:
                    40,

                rotX:
                    -4,

                rotY:
                    17,

                rotZ:
                    -5,

                scale:
                    0.86,

                cameraX:
                    1.4,

                cameraY:
                    0.4,

                cameraZ:
                    10,

                power:
                    1.5

            }

        ],


        /* ====================================================
           10
        ==================================================== */

        [
            9,

            20.15,

            {

                mode:
                    'whip',

                fromX:
                    -13,

                fromY:
                    2,

                fromZ:
                    -16,

                x:
                    -2.1,

                y:
                    0.2,

                z:
                    0.7,

                startRotX:
                    20,

                startRotY:
                    -120,

                startRotZ:
                    -70,

                rotX:
                    5,

                rotY:
                    -18,

                rotZ:
                    7,

                scale:
                    0.86,

                cameraX:
                    -1.8,

                cameraY:
                    0.2,

                cameraZ:
                    9.8,

                power:
                    1.45,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           11
        ==================================================== */

        [
            10,

            22.10,

            {

                mode:
                    'spin',

                fromX:
                    7,

                fromY:
                    7,

                fromZ:
                    -18,

                x:
                    1.6,

                y:
                    -0.8,

                z:
                    0.8,

                startRotX:
                    140,

                startRotY:
                    110,

                startRotZ:
                    120,

                rotX:
                    -7,

                rotY:
                    18,

                rotZ:
                    4,

                scale:
                    0.86,

                cameraX:
                    1.3,

                cameraY:
                    -0.7,

                cameraZ:
                    9.8,

                power:
                    1.6

            }

        ],


        /* ====================================================
           12
        ==================================================== */

        [
            11,

            24.05,

            {

                mode:
                    'slam',

                fromX:
                    0,

                fromY:
                    0,

                fromZ:
                    -23,

                x:
                    0,

                y:
                    0,

                z:
                    1,

                startRotX:
                    0,

                startRotY:
                    180,

                startRotZ:
                    0,

                rotX:
                    0,

                rotY:
                    0,

                rotZ:
                    0,

                scale:
                    0.86,

                cameraX:
                    0,

                cameraY:
                    0,

                cameraZ:
                    8.8,

                fov:
                    37,

                power:
                    1.8

            }

        ],


        /* ====================================================
           13
        ==================================================== */

        [
            12,

            26.00,

            {

                mode:
                    'fly',

                fromX:
                    -10,

                fromY:
                    -6,

                fromZ:
                    -17,

                x:
                    -2,

                y:
                    1,

                z:
                    0.8,

                startRotX:
                    80,

                startRotY:
                    -120,

                startRotZ:
                    50,

                rotX:
                    7,

                rotY:
                    -20,

                rotZ:
                    -5,

                scale:
                    0.86,

                cameraX:
                    -1.5,

                cameraY:
                    0.7,

                cameraZ:
                    9.3,

                power:
                    1.7,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           14
        ==================================================== */

        [
            13,

            27.95,

            {

                mode:
                    'slam',

                fromX:
                    12,

                fromY:
                    5,

                fromZ:
                    -18,

                x:
                    2.2,

                y:
                    0.7,

                z:
                    0.9,

                startRotX:
                    -90,

                startRotY:
                    140,

                startRotZ:
                    -60,

                rotX:
                    -6,

                rotY:
                    23,

                rotZ:
                    7,

                scale:
                    0.86,

                cameraX:
                    1.8,

                cameraY:
                    0.7,

                cameraZ:
                    8.8,

                power:
                    2.0

            }

        ],


        /* ====================================================
           15
        ==================================================== */

        [
            14,

            29.90,

            {

                mode:
                    'spin',

                fromX:
                    -9,

                fromY:
                    5,

                fromZ:
                    -16,

                x:
                    -1.8,

                y:
                    -0.6,

                z:
                    0.8,

                startRotX:
                    150,

                startRotY:
                    -180,

                startRotZ:
                    120,

                rotX:
                    8,

                rotY:
                    -26,

                rotZ:
                    -6,

                scale:
                    0.86,

                cameraX:
                    -1.5,

                cameraY:
                    -0.5,

                cameraZ:
                    8.7,

                power:
                    1.9,

                exitDirection:
                    -1

            }

        ],


        /* ====================================================
           16
        ==================================================== */

        [
            15,

            31.85,

            {

                mode:
                    'slam',

                fromX:
                    9,

                fromY:
                    -7,

                fromZ:
                    -18,

                x:
                    1.5,

                y:
                    -1,

                z:
                    0.8,

                startRotX:
                    -120,

                startRotY:
                    160,

                startRotZ:
                    80,

                rotX:
                    -7,

                rotY:
                    19,

                rotZ:
                    6,

                scale:
                    0.86,

                cameraX:
                    1.2,

                cameraY:
                    -0.9,

                cameraZ:
                    8.2,

                power:
                    2.15

            }

        ],


        /* ====================================================
           17
        ==================================================== */

        [
            16,

            33.80,

            {

                mode:
                    'whip',

                fromX:
                    -14,

                fromY:
                    0,

                fromZ:
                    -19,

                x:
                    -1,

                y:
                    0.4,

                z:
                    0.8,

                startRotX:
                    40,

                startRotY:
                    -160,

                startRotZ:
                    -120,

                rotX:
                    4,

                rotY:
                    -11,

                rotZ:
                    -4,

                scale:
                    0.86,

                cameraX:
                    -0.8,

                cameraY:
                    0.3,

                cameraZ:
                    8,

                power:
                    2.2,

                exitDirection:
                    -1

            }

        ]

    ];


    /* ========================================================
       CREATE 17 MAIN SHOTS
    ======================================================== */

    shots.forEach(

        shot => {

            cinematicShot(

                shot[0],

                shot[1],

                1.65,

                shot[2]

            );

        }

    );


    /* ========================================================
       FINAL FRAGMENT
       ======================================================== */

    finalFragmentShot(

        17,

        35.75,

        2.15

    );


    /* ========================================================
       MASSIVE FINAL CINEMATIC TRANSITION
       ======================================================== */

    masterTimeline.call(

        () => {

            /* --------------------------------------------
               BIG CENTER PARTICLE EXPLOSION
            -------------------------------------------- */

            createParticleBurst(

                new THREE.Vector3(
                    0,
                    0,
                    1
                ),

                5.0

            );


            /* --------------------------------------------
               CENTER FLASH
            -------------------------------------------- */

            flashScreen(
                0.95
            );


            /* --------------------------------------------
               MAIN LIGHTNING STRIKES
            -------------------------------------------- */

            spawnLightning(

                new THREE.Vector3(
                    -5.5,
                    5.5,
                    2.2
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.7
                ),

                2.4

            );


            spawnLightning(

                new THREE.Vector3(
                    5.5,
                    -5.5,
                    2.2
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.7
                ),

                2.4

            );


            spawnLightning(

                new THREE.Vector3(
                    5.0,
                    4.0,
                    2.1
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.7
                ),

                2.0

            );


            spawnLightning(

                new THREE.Vector3(
                    -4.5,
                    -4.5,
                    2.0
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.7
                ),

                2.0

            );


            /* --------------------------------------------
               GOLD LIGHT
            -------------------------------------------- */

            warmLight.intensity =
                12;


            goldLight.intensity =
                10;


            flashLight.intensity =
                20;


            gsap.to(

                warmLight,

                {

                    intensity:
                        0,

                    duration:
                        0.65,

                    ease:
                        'power3.out'

                }

            );


            gsap.to(

                goldLight,

                {

                    intensity:
                        0,

                    duration:
                        0.65,

                    ease:
                        'power3.out'

                }

            );


            gsap.to(

                flashLight,

                {

                    intensity:
                        0,

                    duration:
                        0.35,

                    ease:
                        'power3.out'

                }

            );

        },

        [],

        37.90

    );


    /* ========================================================
       FINAL LOGO TRANSITION
       
       IMPORTANT:
       Everything is prepared BEFORE the logo appears.
       This prevents the lag/jump you had before.
    ======================================================== */

    masterTimeline.call(

        () => {

            /*
               Hide fragments first.
            */

            fragments.forEach(

                fragment => {

                    if (
                        fragment
                    ) {

                        fragment.visible =
                            false;

                    }

                }

            );


            fragmentGlows.forEach(

                glow => {

                    if (
                        glow
                    ) {

                        glow.visible =
                            false;

                    }

                }

            );


            /*
               Camera is already centered.
            */

            camera.position.set(

                0,

                0,

                7.4

            );


            cameraTarget.set(

                0,

                0,

                1

            );


            camera.fov =
                35;


            camera.updateProjectionMatrix();


            /*
               Final logo appears.
            */

            showFinalLogo();


            /*
               Strong but short flash.
            */

            flashScreen(
                0.70
            );


            /*
               One final impact.
            */

            playImpact();

        },

        [],

        38.35

    );


    /* ========================================================
       FINAL CAMERA PUSH
       
       Very smooth.
       No sudden jump.
    ======================================================== */

    masterTimeline.to(

        camera.position,

        {

            x:
                0,

            y:
                0,

            z:
                6.8,

            duration:
                1.25,

            ease:
                'power2.out'

        },

        38.40

    );


    masterTimeline.to(

        camera,

        {

            fov:
                33,

            duration:
                1.20,

            ease:
                'power2.out',

            onUpdate:
                () => {

                    camera.updateProjectionMatrix();

                }

        },

        38.40

    );


    /* ========================================================
       FINAL GOLDEN AURA
    ======================================================== */

    masterTimeline.to(

        finalAura,

        {

            opacity:
                0.32,

            duration:
                0.8,

            ease:
                'power2.out'

        },

        39.0

    );


    /* ========================================================
       FINAL GOLD PARTICLES
    ======================================================== */

    masterTimeline.call(

        () => {

            createParticleBurst(

                new THREE.Vector3(
                    0,
                    0,
                    1
                ),

                2.5

            );

        },

        [],

        39.15

    );


    /* ========================================================
       FINAL SMALL LIGHTNING
    ======================================================== */

    masterTimeline.call(

        () => {

            spawnLightning(

                new THREE.Vector3(
                    -3.8,
                    4.5,
                    2
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.8
                ),

                1.6

            );


            spawnLightning(

                new THREE.Vector3(
                    3.8,
                    -4.5,
                    2
                ),

                new THREE.Vector3(
                    0,
                    0,
                    1.8
                ),

                1.6

            );

        },

        [],

        39.55

    );


    /* ========================================================
       FINAL LOGO SETTLE
    ======================================================== */

    masterTimeline.to(

        finalLogo,

        {

            opacity:
                1,

            duration:
                0.5,

            ease:
                'power2.out'

        },

        39.70

    );


    /* ========================================================
       43 SECOND END
       
       NOTHING FADES OUT.
       LOGO REMAINS FOREVER.
    ======================================================== */

    masterTimeline.call(

        () => {

            animationFinished =
                true;


            /* --------------------------------------------
               STOP MUSIC EXACTLY HERE
            -------------------------------------------- */

            stopAllAudio();


            /* --------------------------------------------
               HIDE START SCREEN
            -------------------------------------------- */

            if (
                startScreen
            ) {

                startScreen.style.display =
                    'none';

            }


            /* --------------------------------------------
               FORCE FINAL LOGO CENTER
            -------------------------------------------- */

            if (
                finalLogo
            ) {

                finalLogo.style.position =
                    'fixed';


                finalLogo.style.left =
                    '50%';


                finalLogo.style.top =
                    '50%';


                finalLogo.style.transform =
                    'translate(-50%, -50%) scale(1)';


                finalLogo.style.opacity =
                    '1';

            }


            console.log(
                '43 SECONDS COMPLETE.'
            );


            console.log(
                'MUSIC STOPPED.'
            );


            console.log(
                'FINAL LOGO FROZEN.'
            );


            /*
               DO NOT RESTART.
            */

            masterTimeline.pause();

        },

        [],

        43

    );

}
/* ============================================================
   START ANIMATION
   ============================================================ */

function startAnimation() {

    /* --------------------------------------------------------
       PREVENT DOUBLE START
    -------------------------------------------------------- */

    if (
        animationStarted
    ) {

        return;

    }


    /* --------------------------------------------------------
       CHECK ALL 18 IMAGES
    -------------------------------------------------------- */

    if (

        fragmentTextures.filter(
            Boolean
        ).length < TOTAL_FRAGMENTS

    ) {

        console.warn(
            'Please wait until all 18 fragments are loaded.'
        );

        return;

    }


    /* --------------------------------------------------------
       MARK ANIMATION STARTED
    -------------------------------------------------------- */

    animationStarted =
        true;


    animationFinished =
        false;


    /* --------------------------------------------------------
       DISABLE START BUTTON
    -------------------------------------------------------- */

    if (
        startButton
    ) {

        startButton.disabled =
            true;


        startButton.style.pointerEvents =
            'none';


        startButton.style.opacity =
            '0.45';

    }


    /* --------------------------------------------------------
       HIDE START SCREEN
    -------------------------------------------------------- */

    if (
        startScreen
    ) {

        gsap.to(

            startScreen,

            {

                opacity:
                    0,

                duration:
                    0.65,

                ease:
                    'power2.in',

                onComplete:
                    () => {

                        startScreen.style.display =
                            'none';

                    }

            }

        );

    }


    /* ========================================================
       START AUDIO FIRST
       
       IMPORTANT:
       Music starts immediately.
       Pictures wait 2.6 seconds.
    ======================================================== */

    startMusic();


    /* --------------------------------------------------------
       AUDIO SAFETY TIMER
       
       Guarantees audio cannot continue beyond 43 seconds.
    -------------------------------------------------------- */

    scheduleAudioStop();


    /* ========================================================
       BUILD 43 SECOND TIMELINE
    ======================================================== */

    buildCinematicTimeline();


    /* ========================================================
       START TIMELINE
    ======================================================== */

    masterTimeline.play(
        0
    );


    console.log(
        'Cinematic presentation started.'
    );

}


/* ============================================================
   RESTART ANIMATION
   ============================================================ */

function restartAnimation() {

    /* --------------------------------------------------------
       STOP CURRENT TIMELINE
    -------------------------------------------------------- */

    if (
        masterTimeline
    ) {

        masterTimeline.kill();

        masterTimeline =
            null;

    }


    /* --------------------------------------------------------
       STOP AUDIO
    -------------------------------------------------------- */

    stopAllAudio();


    /* --------------------------------------------------------
       RESET STATES
    -------------------------------------------------------- */

    animationStarted =
        false;


    animationFinished =
        false;


    /* --------------------------------------------------------
       RESET FINAL LOGO
    -------------------------------------------------------- */

    if (
        finalLogo
    ) {

        finalLogo.style.display =
            'none';


        finalLogo.style.opacity =
            '0';


        finalLogo.style.left =
            '50%';


        finalLogo.style.top =
            '50%';


        finalLogo.style.transform =
            'translate(-50%, -50%) scale(.72)';

    }


    /* --------------------------------------------------------
       RESET FINAL AURA
    -------------------------------------------------------- */

    if (
        finalAura
    ) {

        gsap.killTweensOf(
            finalAura
        );


        finalAura.style.opacity =
            '0';


        finalAura.style.transform =
            'translate(-50%, -50%) scale(.25)';

    }


    /* --------------------------------------------------------
       RESET FINAL RING
    -------------------------------------------------------- */

    if (
        finalRing
    ) {

        gsap.killTweensOf(
            finalRing
        );


        finalRing.style.opacity =
            '0';


        finalRing.style.transform =
            'translate(-50%, -50%) scale(.1)';

    }


    /* --------------------------------------------------------
       RESET FINAL SWEEP
    -------------------------------------------------------- */

    if (
        finalSweep
    ) {

        gsap.killTweensOf(
            finalSweep
        );


        finalSweep.style.opacity =
            '0';


        finalSweep.style.left =
            '-25%';

    }


    /* --------------------------------------------------------
       RESET START SCREEN
    -------------------------------------------------------- */

    if (
        startScreen
    ) {

        startScreen.style.display =
            'flex';


        startScreen.style.opacity =
            '1';

    }


    /* --------------------------------------------------------
       RESET START BUTTON
    -------------------------------------------------------- */

    if (
        startButton
    ) {

        startButton.disabled =
            false;


        startButton.style.pointerEvents =
            'auto';


        startButton.style.opacity =
            '1';

    }


    /* --------------------------------------------------------
       RESET FRAGMENTS
    -------------------------------------------------------- */

    resetFragments();


    /* --------------------------------------------------------
       RESET CAMERA
    -------------------------------------------------------- */

    camera.position.set(

        0,

        0,

        18

    );


    cameraTarget.set(

        0,

        0,

        0

    );


    camera.fov =
        42;


    camera.updateProjectionMatrix();


    /* --------------------------------------------------------
       RESET LIGHTS
    -------------------------------------------------------- */

    warmLight.intensity =
        0;


    goldLight.intensity =
        0;


    rimLight.intensity =
        0;


    flashLight.intensity =
        0;


    /* --------------------------------------------------------
       RESET FLASH
    -------------------------------------------------------- */

    if (
        flashElement
    ) {

        gsap.killTweensOf(
            flashElement
        );


        flashElement.style.opacity =
            '0';

    }


    console.log(
        'Presentation reset.'
    );

}


/* ============================================================
   EVENT SETUP
   ============================================================ */

function setupEvents() {

    /* ========================================================
       START BUTTON
    ======================================================== */

    if (
        startButton
    ) {

        startButton.disabled =
            true;


        startButton.style.opacity =
            '0.45';


        startButton.style.pointerEvents =
            'none';


        startButton.addEventListener(

            'click',

            () => {

                startAnimation();

            }

        );

    }


    /* ========================================================
       WINDOW RESIZE
    ======================================================== */

    window.addEventListener(

        'resize',

        () => {

            handleResize();

        }

    );


    /* ========================================================
       KEYBOARD
       
       SPACE = START
       R     = RESTART
    ======================================================== */

    window.addEventListener(

        'keydown',

        event => {

            /* ------------------------------------------------
               SPACE
            ------------------------------------------------ */

            if (
                event.code ===
                'Space'
            ) {

                event.preventDefault();


                startAnimation();

            }


            /* ------------------------------------------------
               R
            ------------------------------------------------ */

            if (

                event.key.toLowerCase()
                === 'r'

            ) {

                restartAnimation();

            }

        }

    );

}


/* ============================================================
   RESIZE HANDLER
   ============================================================ */

function handleResize() {

    if (
        !camera ||
        !renderer
    ) {

        return;

    }


    /* --------------------------------------------------------
       CAMERA ASPECT
    -------------------------------------------------------- */

    camera.aspect =

        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    /* --------------------------------------------------------
       RENDERER SIZE
    -------------------------------------------------------- */

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


    /* --------------------------------------------------------
       PIXEL RATIO
    -------------------------------------------------------- */

    renderer.setPixelRatio(

        Math.min(

            window.devicePixelRatio ||
            1,

            2

        )

    );


    /* --------------------------------------------------------
       FINAL LOGO ALWAYS CENTER
    -------------------------------------------------------- */

    if (
        finalLogo
    ) {

        finalLogo.style.left =
            '50%';


        finalLogo.style.top =
            '50%';

    }


    /* --------------------------------------------------------
       FINAL EFFECTS CENTER
    -------------------------------------------------------- */

    if (
        finalAura
    ) {

        finalAura.style.left =
            '50%';


        finalAura.style.top =
            '50%';

    }


    if (
        finalRing
    ) {

        finalRing.style.left =
            '50%';


        finalRing.style.top =
            '50%';

    }

}


/* ============================================================
   CAMERA UPDATE
   ============================================================ */

function updateCamera() {

    if (
        !camera
    ) {

        return;

    }


    camera.lookAt(
        cameraTarget
    );

}


/* ============================================================
   RENDER LOOP
   ============================================================ */

function renderLoop() {

    requestAnimationFrame(
        renderLoop
    );


    /* --------------------------------------------------------
       TIME
    -------------------------------------------------------- */

    const elapsed =
        clock.getElapsedTime();


    /* --------------------------------------------------------
       GOLD PARTICLES
    -------------------------------------------------------- */

    updateParticles();


    /* --------------------------------------------------------
       SMALL GLOW PARTICLES
    -------------------------------------------------------- */

    animateCrystalShards();


    /* ========================================================
       UPDATE FRAGMENT SHADER TIME
    ======================================================== */

    fragments.forEach(

        fragment => {

            if (

                fragment &&

                fragment.material &&

                fragment.material.uniforms &&

                fragment.material.uniforms.time

            ) {

                fragment.material
                    .uniforms
                    .time
                    .value =
                    elapsed;

            }

        }

    );


    /* ========================================================
       CINEMATIC CAMERA BREATHING
    ======================================================== */

    if (

        animationStarted &&

        !animationFinished

    ) {

        camera.position.x +=

            Math.sin(
                elapsed * 0.70
            ) *
            0.0008;


        camera.position.y +=

            Math.cos(
                elapsed * 0.55
            ) *
            0.0005;

    }


    /* ========================================================
       CAMERA LOOK AT TARGET
    ======================================================== */

    updateCamera();


    /* ========================================================
       RENDER
    ======================================================== */

    renderer.render(

        scene,

        camera

    );

}


/* ============================================================
   FINAL SAFETY
   ============================================================ */

window.addEventListener(

    'beforeunload',

    () => {

        stopAllAudio();

    }

);


/* ============================================================
   INITIAL FINAL EFFECT SETUP
   ============================================================ */

function initializeFinalEffects() {

    /*
       Prevent duplicate effects.
    */

    if (
        typeof finalAura ===
        'undefined' ||
        !finalAura
    ) {

        createFinalEffects();

    }

}


/* ============================================================
   SAFE INITIALIZATION
   ============================================================ */

function safeInitialize() {

    try {

        initializeFinalEffects();

    }

    catch (
        error
    ) {

        console.error(

            'Final effects initialization error:',

            error

        );

    }

}


/* ============================================================
   RUN FINAL EFFECT SETUP
   ============================================================ */

safeInitialize();


/* ============================================================
   READY MESSAGE
   ============================================================ */

console.log(
    '========================================'
);


console.log(
    'ST. SEBASTIAN CHURCH MADATHIL'
);


console.log(
    '43 SECOND CINEMATIC 3D LOGO REVEAL'
);


console.log(
    '========================================'
);


console.log(
    'Gold particles: ON'
);


console.log(
    '3D fragment animation: ON'
);


console.log(
    '3D lightning: ON'
);


console.log(
    'Cinematic final logo: ON'
);


console.log(
    'Music starts before pictures: ON'
);


console.log(
    'Pictures begin after 2.6 seconds: ON'
);


console.log(
    'Audio safety stop: 43 seconds'
);


console.log(
    'Final logo remains frozen: ON'
);


console.log(
    '========================================'
);