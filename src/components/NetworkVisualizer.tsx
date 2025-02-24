import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

export const NetworkVisualizer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const renderer = useMemo(() => new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  }), []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Initialize 3D scene
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add XR support
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
    document.body.appendChild(ARButton.createButton(renderer));

    // Add network visualization
    const nodes = createNetworkNodes();
    const edges = createNetworkEdges();
    scene.add(nodes);
    scene.add(edges);

    // Add real-time updates
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      // Use time-based animations
      const time = performance.now() * 0.001;
      updateNetworkState(time);
      renderer.render(scene, camera);
    };

    animate();
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [renderer]);

  return <div ref={mountRef} className="network-visualizer" />;
};
