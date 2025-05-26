
import { useState, useCallback, useEffect } from "react";
import { useSlideStore } from "@/stores/slide-store";

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
  const toggleFullScreenWithEffects = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      toggleFullScreen();
      
      // プレゼンテーション開始時の処理
      if (!presentationStartTime) {
        startPresentation();
        setViewerMode("presentation");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        toggleFullScreen();
      }
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
