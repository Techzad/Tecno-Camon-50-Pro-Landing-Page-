import React, { useEffect, useRef, useState } from "react";
import { ActiveScene } from "../types";

interface CinemaCanvasProps {
  scrollProgress: number; // 0 to 1
  activeScene: ActiveScene;
  mouseX: number;
  mouseY: number;
}

// Map the provided images to key scenes
const IMAGE_SOURCES = [
  "/assets/images-CN5C-design-tap_poster-1.jpg.webp",  // Scene 0: HeroIntro - Curved AMOLED display
  "/assets/images-image-card-1-1.jpg.webp",        // Scene 1: CameraStory - Zoom-in perfect snap camera lens
  "/assets/images-CN5C-performance-chip-1.jpg.webp",   // Scene 2: Performance - High-performance motherboard chip schematic
  "/assets/images-performance-green-1.jpg.webp",       // Scene 3: WaterResistant - Atmospheric Green IP69 resilience
  "/assets/images-CN5C-design-img-green-1.jpg.webp",   // Scene 4: DesignForm - Premium emerald green textured back in hand
  "/assets/images-CN5C-ai-swiper-4-1.png.webp",        // Scene 5: TecnoAI - Dynamic borderless screen curve
  "/assets/images-CN5C-performance-bg-4-1.jpg.webp",   // Scene 6: HiOS - Clean high-tech backdrop
  "/assets/images-CN5C-design-tap_poster-1.jpg.webp"   // Scene 7: FinalOutro - Elegant stand representation
];

export default function CinemaCanvas({
  scrollProgress,
  activeScene,
  mouseX,
  mouseY
}: CinemaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const glRef = useRef<WebGL2RenderingContext | WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [failedFallbackImages, setFailedFallbackImages] = useState<Record<string, boolean>>({});

  // Keep track of loaded image assets in a ref
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all assets
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    IMAGE_SOURCES.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.referrerPolicy = "no-referrer";
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedCount++;
        if (loadedCount === IMAGE_SOURCES.length) {
          loadedImagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}. Falling back to styled layouts.`);
        setLoadError(true);
      };
      images[index] = img;
    });

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported in this browser. Falling back to normal rendering.");
      return;
    }
    glRef.current = gl;

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y; // Flip Y for WebGL texture orientation
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source with premium cinematic effects:
    // - Volumetric Light sweeps responding to cursor
    // - Liquid wave transitions
    // - Fish-eye camera lens zoom centered around camera module
    // - Subtle chromatic aberration
    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;

      uniform sampler2D u_tex0;
      uniform sampler2D u_tex1;
      uniform float u_transition;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform vec2 u_zoom_center;
      uniform float u_zoom_amount;
      uniform vec2 u_tilt;
      uniform float u_lens_transition; // Lens sweep opacity
      uniform vec2 u_scale0; // Cover scale for texture 0
      uniform vec2 u_scale1; // Cover scale for texture 1

      // Dynamic chromatic aberration
      vec4 getAberrationColor(sampler2D tex, vec2 uv, float strength) {
        vec4 color;
        color.r = texture2D(tex, uv + vec2(strength, 0.0)).r;
        color.g = texture2D(tex, uv).g;
        color.b = texture2D(tex, uv - vec2(strength, 0.0)).b;
        color.a = texture2D(tex, uv).a;
        return color;
      }

      void main() {
        // Center the coordinate space and apply safe bounds
        vec2 uv = v_texCoord;
        
        // 1. Subtle 3D Tilt based on mouse/scroll
        vec2 tiltUV = uv + u_tilt * 0.015 * (1.0 - length(uv - 0.5));

        // 2. Immersive Lens Distortion (Fish-eye zoom focused on camera module)
        if (u_zoom_amount > 0.0) {
          vec2 toCenter = tiltUV - u_zoom_center;
          float dist = length(toCenter);
          if (dist < 0.4) {
            float strength = (1.0 - dist / 0.4) * u_zoom_amount * 0.15;
            tiltUV -= toCenter * strength;
          }
        }

        // Apply clamping to avoid edge wrap artifacts
        tiltUV = clamp(tiltUV, 0.001, 0.999);

        // 3. Texture Transitions using a clean solid crossfade with object-fit: cover mapping
        float transitionFactor = smoothstep(0.0, 1.0, u_transition);
        
        // Map UV coordinates to object-fit: cover for both texture sizes
        vec2 uv0 = (tiltUV - 0.5) * u_scale0 + 0.5;
        vec2 uv1 = (tiltUV - 0.5) * u_scale1 + 0.5;

        // Clamp corrected UV coordinates to prevent edge wrapping
        uv0 = clamp(uv0, 0.001, 0.999);
        uv1 = clamp(uv1, 0.001, 0.999);
        
        // Solid crossfade with aspect-fit UVs
        vec4 color0 = getAberrationColor(u_tex0, uv0, 0.002);
        vec4 color1 = getAberrationColor(u_tex1, uv1, 0.002);
        vec4 finalColor = mix(color0, color1, transitionFactor);

        // 4. Premium Cinematic Light Sweep (Glint effect following the cursor)
        vec2 screenPos = gl_FragCoord.xy / u_resolution;
        float d = length(screenPos - u_mouse);
        float highlight = smoothstep(0.25, 0.0, d) * 0.18;
        
        // Highlight sweep line
        float sweep = smoothstep(0.04, 0.0, abs(screenPos.x - screenPos.y - sin(u_time * 0.5) * 1.5)) * 0.15;

        finalColor.rgb += vec3(0.9, 0.95, 1.0) * (highlight + sweep);

        // 5. Vignette for focus atmosphere
        float vignette = smoothstep(1.3, 0.5, length(v_texCoord - 0.5));
        finalColor.rgb *= mix(0.35, 1.0, vignette);

        gl_FragColor = finalColor;
      }
    `;

    // Shader Compiler Helpers
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiler error: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader Link Error: ", gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Buffer Setup
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    // Initialize textures with high-fidelity filtering and crisp mipmaps
    const glTextures = loadedImagesRef.current.map((img) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      
      // Standard clamping to prevent wrap borders
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      
      // Load the texture source
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      
      // Generate WebGL Mipmaps for sharp, non-blurry downscaling / upscaling
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      // Enable high-quality anisotropic filtering for tilted perspectives
      const ext = gl.getExtension("EXT_texture_filter_anisotropic") || 
                  gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || 
                  gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
      if (ext) {
        const max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 4;
        gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
      }
      
      return tex as WebGLTexture;
    });
    texturesRef.current = glTextures;

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      glTextures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [imagesLoaded]);

  // Render loop
  useEffect(() => {
    if (!imagesLoaded || !glRef.current || !programRef.current) return;

    const gl = glRef.current;
    const program = programRef.current;
    let startTime = Date.now();

    // Map active scene to specific image cross-fade combinations
    let fromTexIndex = 0;
    let toTexIndex = 0;
    let transitionProgress = 0;
    let zoomAmount = 0;
    let zoomCenter = [0.35, 0.45]; // Relative lens position in images

    // We interpolate textures according to the scroll progress timeline:
    // Scene 0: 0.0 - 0.12 (HeroIntro) -> Image 0
    // Scene 1: 0.12 - 0.28 (CameraStory) -> Transition to Image 1 (Camera lens upclose) + Lens Zoom effect
    // Scene 2: 0.28 - 0.44 (Performance) -> Transition to Image 2 (Performance Chip motherboard)
    // Scene 3: 0.44 - 0.60 (WaterResistant) -> Transition to Image 3 (Atmospheric green IP69 resilient frame)
    // Scene 4: 0.60 - 0.74 (DesignForm) -> Transition to Image 4 (Textured green back in hand)
    // Scene 5: 0.74 - 0.86 (TecnoAI) -> Transition to Image 5 (AI Swiper curve screen)
    // Scene 6: 0.86 - 0.95 (HiOS) -> Transition to Image 6 (Sleek backdrop interface)
    // Scene 7: 0.95 - 1.0 (FinalOutro) -> Transition to Image 7 (Stand / Outro)

    if (scrollProgress < 0.12) {
      fromTexIndex = 0;
      toTexIndex = 0;
      transitionProgress = 0;
    } else if (scrollProgress < 0.28) {
      fromTexIndex = 0;
      toTexIndex = 1;
      const progress = (scrollProgress - 0.12) / 0.16;
      transitionProgress = progress;
      // High-precision camera lens focal zoom animation
      zoomAmount = Math.sin(progress * Math.PI) * 1.6;
      zoomCenter = [0.42, 0.35]; // Focus on primary lens coordinates
    } else if (scrollProgress < 0.44) {
      fromTexIndex = 1;
      toTexIndex = 2;
      transitionProgress = (scrollProgress - 0.28) / 0.16;
    } else if (scrollProgress < 0.60) {
      fromTexIndex = 2;
      toTexIndex = 3;
      transitionProgress = (scrollProgress - 0.44) / 0.16;
    } else if (scrollProgress < 0.74) {
      fromTexIndex = 3;
      toTexIndex = 4;
      transitionProgress = (scrollProgress - 0.60) / 0.14;
    } else if (scrollProgress < 0.86) {
      fromTexIndex = 4;
      toTexIndex = 5;
      transitionProgress = (scrollProgress - 0.74) / 0.12;
    } else if (scrollProgress < 0.95) {
      fromTexIndex = 5;
      toTexIndex = 6;
      transitionProgress = (scrollProgress - 0.86) / 0.09;
    } else {
      fromTexIndex = 6;
      toTexIndex = 7;
      transitionProgress = Math.min((scrollProgress - 0.95) / 0.05, 1.0);
    }

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      gl.useProgram(program);

      // Bind uniform values
      const uTimeLoc = gl.getUniformLocation(program, "u_time");
      gl.uniform1f(uTimeLoc, time);

      const uTransitionLoc = gl.getUniformLocation(program, "u_transition");
      gl.uniform1f(uTransitionLoc, transitionProgress);

      const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
      gl.uniform2f(uMouseLoc, mouseX, 1.0 - mouseY); // Invert Y coordinate

      const uResLoc = gl.getUniformLocation(program, "u_resolution");
      gl.uniform2f(uResLoc, gl.canvas.width, gl.canvas.height);

      const uZoomCenterLoc = gl.getUniformLocation(program, "u_zoom_center");
      gl.uniform2f(uZoomCenterLoc, zoomCenter[0], zoomCenter[1]);

      const uZoomAmountLoc = gl.getUniformLocation(program, "u_zoom_amount");
      gl.uniform1f(uZoomAmountLoc, zoomAmount);

      // Perspective tilt calculation
      const tiltX = (mouseX - 0.5) * 0.4;
      const tiltY = (mouseY - 0.5) * 0.4;
      const uTiltLoc = gl.getUniformLocation(program, "u_tilt");
      gl.uniform2f(uTiltLoc, tiltX, tiltY);

      // Cover Scale calculations to implement perfect "object-fit: cover" for both transition textures
      let fromScale = [1.0, 1.0];
      let toScale = [1.0, 1.0];
      const canvasWidth = gl.canvas.width;
      const canvasHeight = gl.canvas.height;

      if (canvasWidth > 0 && canvasHeight > 0) {
        const canvasAspect = canvasWidth / canvasHeight;
        
        const fromImg = loadedImagesRef.current[fromTexIndex];
        if (fromImg && fromImg.naturalWidth > 0 && fromImg.naturalHeight > 0) {
          const imgAspect = fromImg.naturalWidth / fromImg.naturalHeight;
          if (canvasAspect > imgAspect) {
            fromScale = [1.0, imgAspect / canvasAspect];
          } else {
            fromScale = [canvasAspect / imgAspect, 1.0];
          }
        }

        const toImg = loadedImagesRef.current[toTexIndex];
        if (toImg && toImg.naturalWidth > 0 && toImg.naturalHeight > 0) {
          const imgAspect = toImg.naturalWidth / toImg.naturalHeight;
          if (canvasAspect > imgAspect) {
            toScale = [1.0, imgAspect / canvasAspect];
          } else {
            toScale = [canvasAspect / imgAspect, 1.0];
          }
        }
      }

      const uScale0Loc = gl.getUniformLocation(program, "u_scale0");
      const uScale1Loc = gl.getUniformLocation(program, "u_scale1");
      gl.uniform2f(uScale0Loc, fromScale[0], fromScale[1]);
      gl.uniform2f(uScale1Loc, toScale[0], toScale[1]);

      // Texture Bindings
      const uTex0Loc = gl.getUniformLocation(program, "u_tex0");
      const uTex1Loc = gl.getUniformLocation(program, "u_tex1");

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[fromTexIndex]);
      gl.uniform1i(uTex0Loc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[toTexIndex]);
      gl.uniform1i(uTex1Loc, 1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [imagesLoaded, scrollProgress, mouseX, mouseY, activeScene]);

  // If loading has error or WebGL is not ready, we render a highly stylized fallback layout showing the phone images
  if (loadError || !imagesLoaded) {
    let activeImgSrc = IMAGE_SOURCES[0];
    if (scrollProgress < 0.12) {
      activeImgSrc = IMAGE_SOURCES[0];
    } else if (scrollProgress < 0.28) {
      activeImgSrc = IMAGE_SOURCES[1];
    } else if (scrollProgress < 0.44) {
      activeImgSrc = IMAGE_SOURCES[2];
    } else if (scrollProgress < 0.60) {
      activeImgSrc = IMAGE_SOURCES[3];
    } else if (scrollProgress < 0.74) {
      activeImgSrc = IMAGE_SOURCES[4];
    } else if (scrollProgress < 0.86) {
      activeImgSrc = IMAGE_SOURCES[5];
    } else if (scrollProgress < 0.95) {
      activeImgSrc = IMAGE_SOURCES[6];
    } else {
      activeImgSrc = IMAGE_SOURCES[7];
    }

    const currentSceneTitle = 
      activeScene === ActiveScene.HeroIntro ? "CAMON 50 Pro Series" :
      activeScene === ActiveScene.CameraStory ? "Sony LYTIA-700C Optics" :
      activeScene === ActiveScene.Performance ? "Flagship AI Co-Processor" :
      activeScene === ActiveScene.WaterResistant ? "IP69 & IP69K Durability Shield" :
      activeScene === ActiveScene.DesignForm ? "Premium Textured Back" :
      activeScene === ActiveScene.TecnoAI ? "TECNO AI Intelligence" :
      activeScene === ActiveScene.HiOS ? "HiOS 15 Fluid Ecosystem" :
      "Sleek Back Presentation";

    return (
      <div className="absolute inset-0 bg-[#020202] flex items-center justify-center overflow-hidden">
        {/* Subtle background glow from the phone's color - Emerald/Teal hints */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />
        
        {failedFallbackImages[activeImgSrc] ? (
          <div className="flex flex-col items-center justify-center p-8 max-w-md text-center border border-white/5 bg-neutral-950/40 rounded-2xl backdrop-blur-md relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none rounded-2xl" />
            <span className="text-[10px] tracking-[0.4em] text-cyan-400 font-mono uppercase mb-4 opacity-75">
              WebGL Cinema Experience
            </span>
            <h3 className="text-xl font-light text-white mb-2 tracking-tight">
              {currentSceneTitle}
            </h3>
            <div className="w-16 h-[1px] bg-cyan-500/20 my-3" />
            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm mb-6">
              The real, raw uploaded product files will load here in full WebGL splendor once uploaded directly.
            </p>
            <div className="text-[10px] bg-black/60 rounded px-4 py-2 text-neutral-500 font-mono border border-white/5">
              Required File: <code className="text-cyan-300">{activeImgSrc.split("/").pop()}</code>
            </div>
          </div>
        ) : (
          <img
            src={activeImgSrc}
            alt="TECNO CAMON 50 Pro fallback"
            className="w-full h-full object-contain max-h-[85vh] transition-all duration-700 ease-out select-none"
            style={{
              filter: "contrast(1.05) brightness(0.95)",
              transform: "scale(1)"
            }}
            referrerPolicy="no-referrer"
            onError={() => setFailedFallbackImages((prev) => ({ ...prev, [activeImgSrc]: true }))}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="cinema-canvas-container"
      className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none"
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-cyan-400 w-1/2 animate-shimmer"></div>
          </div>
          <span className="text-xs uppercase tracking-widest text-neutral-400 mt-4 font-mono">
            CALIBRATING CINEMATIC ENGINE
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="cinema-gl-canvas"
        className="w-full h-full block object-cover scale-105 transform-gpu transition-all duration-300"
        style={{
          filter: "contrast(1.05) brightness(0.95)"
        }}
      />
    </div>
  );
}
