
import { useState, useEffect, useMemo } from 'react';

interface UseEnhancedResponsiveProps {
  containerWidth: number;
  containerHeight: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
  touchSupported: boolean;
}

interface CanvasSize {
  width: number;
  height: number;
  aspectRatio: number;
}

export const useEnhancedResponsive = ({
  containerWidth,
  containerHeight
}: UseEnhancedResponsiveProps) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    devicePixelRatio: 1,
    touchSupported: false
  });

  // Update device info
  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        devicePixelRatio: window.devicePixelRatio || 1,
        touchSupported: 'ontouchstart' in window
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  // Calculate optimal canvas size
  const canvasSize: CanvasSize = useMemo(() => {
    if (containerWidth <= 0 || containerHeight <= 0) {
      return { width: 800, height: 450, aspectRatio: 16/9 };
    }

    const aspectRatio = 16 / 9;
    let width = containerWidth * 0.9; // Leave some margin
    let height = width / aspectRatio;

    // Adjust if height exceeds container
    if (height > containerHeight * 0.9) {
      height = containerHeight * 0.9;
      width = height * aspectRatio;
    }

    // Minimum size constraints
    width = Math.max(width, deviceInfo.isMobile ? 300 : 600);
    height = Math.max(height, deviceInfo.isMobile ? 169 : 338);

    return { width, height, aspectRatio };
  }, [containerWidth, containerHeight, deviceInfo.isMobile]);

  const isResponsive = containerWidth > 0 && containerHeight > 0;

  return {
    deviceInfo,
    canvasSize,
    isResponsive
  };
};
