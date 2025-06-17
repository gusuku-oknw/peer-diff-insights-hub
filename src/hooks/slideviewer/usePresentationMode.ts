import { useState, useCallback, useEffect } from "react";
import { useSlideStore } from "@/stores/slide.store";

export const usePresentationMode = () => {
  const isFullScreen = useSlideStore(state => state.isFullScreen);
  const toggleFullScreen = useSlideStore(state => state.toggleFullScreen);
  const presentationStartTime = useSlideStore(state => state.presentationStartTime);
  const startPresentation = useSlideStore(state => state.startPresentation);
  const setViewerMode = useSlideStore(state => state.setViewerMode);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

  // 経過時間の計算
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (presentationStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - presentationStartTime;
        
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [presentationStartTime]);

  // フルスクリーンの切り替え
  const toggleFullScreenWithEffects = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // フルスクリーンに入る
        const docElement = document.documentElement;
        
        if (docElement.requestFullscreen) {
          await docElement.requestFullscreen();
        } else if ((docElement as any).webkitRequestFullscreen) {
          await (docElement as any).webkitRequestFullscreen();
        } else if ((docElement as any).msRequestFullscreen) {
          await (docElement as any).msRequestFullscreen();
        } else if ((docElement as any).mozRequestFullScreen) {
          await (docElement as any).mozRequestFullScreen();
        }
        
        toggleFullScreen();
        
        // プレゼンテーション開始時の処理
        if (!presentationStartTime) {
          startPresentation();
          setViewerMode("presentation");
        }
      } else {
        // フルスクリーンから出る
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        }
        
        toggleFullScreen();
      }
    } catch (error) {
      console.error(`Error toggling fullscreen: ${error}`);
    }
  }, [presentationStartTime, toggleFullScreen, startPresentation, setViewerMode]);

  return {
    isFullScreen,
    presentationStartTime,
    elapsedTime,
    toggleFullScreenWithEffects,
    isPresentationMode: !!presentationStartTime
  };
};

export default usePresentationMode;
