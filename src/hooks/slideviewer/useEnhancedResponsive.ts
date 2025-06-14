
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseEnhancedResponsiveProps {
  containerWidth: number;
  containerHeight: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  devicePixelRatio: number;
}

export const useEnhancedResponsive = ({ 
  containerWidth, 
  containerHeight 
}: UseEnhancedResponsiveProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 900 });
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isPortrait: false,
    isLandscape: true,
    devicePixelRatio: 1
  });
  
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced device detection with 5 breakpoints
  const detectDevice = useCallback((width: number, height: number): DeviceInfo => {
    const isPortrait = height > width;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Enhanced breakpoints
    const isMobile = width < 640;          // 0-639px
    const isSmallTablet = width >= 640 && width < 768;   // 640-767px
    const isTablet = width >= 768 && width < 1024;       // 768-1023px
    const isSmallDesktop = width >= 1024 && width < 1440; // 1024-1439px
    const isDesktop = width >= 1440;                     // 1440px+
    
    return {
      isMobile,
      isTablet: isSmallTablet || isTablet,
      isDesktop: isSmallDesktop || isDesktop,
      isPortrait,
      isLandscape: !isPortrait,
      devicePixelRatio
    };
  }, []);

  const calculateOptimalSize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const device = detectDevice(containerWidth, containerHeight);
      setDeviceInfo(device);
      
      // Enhanced padding calculation based on device
      let padding = 40;
      if (device.isMobile) padding = 20;
      else if (device.isTablet) padding = 30;
      
      const availableWidth = Math.max(320, containerWidth - padding);
      const availableHeight = Math.max(240, containerHeight - padding);
      
      const aspectRatio = 16 / 9;
      
      // Calculate base size
      let optimalWidth = availableWidth * 0.92;
      let optimalHeight = optimalWidth / aspectRatio;
      
      // Height constraint check
      if (optimalHeight > availableHeight * 0.92) {
        optimalHeight = availableHeight * 0.92;
        optimalWidth = optimalHeight * aspectRatio;
      }
      
      // Device-specific optimization with 5 levels
      let finalWidth, finalHeight;
      
      if (device.isMobile) {
        // Mobile: Optimized for small screens
        const multiplier = device.isPortrait ? 0.95 : 0.85;
        finalWidth = Math.max(280, Math.min(600, Math.round(optimalWidth * multiplier)));
        finalHeight = Math.max(158, Math.min(338, Math.round(optimalHeight * multiplier)));
      } else if (device.isTablet) {
        // Tablet: Balanced approach
        const multiplier = device.isPortrait ? 0.90 : 0.95;
        finalWidth = Math.max(500, Math.min(1000, Math.round(optimalWidth * multiplier)));
        finalHeight = Math.max(281, Math.min(563, Math.round(optimalHeight * multiplier)));
      } else {
        // Desktop: Full experience
        finalWidth = Math.max(800, Math.min(1920, Math.round(optimalWidth)));
        finalHeight = Math.max(450, Math.min(1080, Math.round(optimalHeight)));
      }
      
      // Performance optimization for high DPI displays
      if (device.devicePixelRatio > 2) {
        finalWidth = Math.min(finalWidth, 1600);
        finalHeight = Math.min(finalHeight, 900);
      }
      
      const newCanvasSize = { width: finalWidth, height: finalHeight };
      setCanvasSize(newCanvasSize);
      
      console.log('Enhanced responsive calculation:', {
        container: { containerWidth, containerHeight },
        device,
        calculated: { optimalWidth, optimalHeight },
        final: newCanvasSize,
        aspectRatio: finalWidth / finalHeight
      });
    }, 100); // Faster debounce for better responsiveness
  }, [containerWidth, containerHeight, detectDevice]);

  useEffect(() => {
    calculateOptimalSize();
    
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateOptimalSize]);

  const getScaleFactors = useCallback(() => {
    return {
      scaleX: canvasSize.width / 1600,
      scaleY: canvasSize.height / 900,
      scale: Math.min(canvasSize.width / 1600, canvasSize.height / 900)
    };
  }, [canvasSize]);

  const getPerformanceInfo = useCallback(() => {
    const pixelCount = canvasSize.width * canvasSize.height;
    const scaleFactor = getScaleFactors().scale;
    
    return {
      pixelCount,
      scaleFactor,
      isHighDensity: pixelCount > 1000000,
      renderingComplexity: scaleFactor < 0.5 ? 'low' : scaleFactor < 0.8 ? 'medium' : 'high',
      recommendedQuality: deviceInfo.devicePixelRatio > 2 ? 'high' : 'standard'
    };
  }, [canvasSize, getScaleFactors, deviceInfo]);

  return {
    canvasSize,
    deviceInfo,
    getScaleFactors,
    getPerformanceInfo,
    isResponsive: containerWidth > 0 && containerHeight > 0,
    containerDimensions: { containerWidth, containerHeight }
  };
};
