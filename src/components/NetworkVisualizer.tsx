import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

export const NetworkVisualizer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

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
    const animate = () => {
      updateNetworkState();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="network-visualizer" />;
};
