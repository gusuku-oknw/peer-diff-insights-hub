
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSlideStore } from "@/stores/slide";
import usePresentationMode from "./usePresentationMode";
import useSlideNavigation from "./useSlideNavigation";
import type { ViewerMode } from "@/types/slide.types";

export const useSlideViewerLogic = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  const { 
    currentSlide, 
    zoom, 
    viewerMode, 
    showPresenterNotes,
    presentationStartTime,
    displayCount,
    slides,
    leftSidebarOpen,
    isFullScreen,
    setZoom,
    setViewerMode,
    setLeftSidebarOpen,
    togglePresenterNotes,
    generateThumbnails,
    setDisplayCount
  } = useSlideStore();
  
  const currentSlideNumber = typeof currentSlide === 'string' ? parseInt(currentSlide, 10) : currentSlide;
  
  const userType = useMemo((): "student" | "enterprise" => {
    const role = userProfile?.role;
    console.log('SlideViewer: User profile role:', role);
    
    if (role === "student") {
      return "student";
    } else if (role === "business") {
      return "enterprise";
    } else if (role === "debugger" || role === "guest") {
      return "student";
    }
    
    console.warn('SlideViewer: Unknown user role, defaulting to student:', role);
    return "student";
  }, [userProfile?.role]);
  
  const { elapsedTime, toggleFullScreenWithEffects } = usePresentationMode();
  const { handlePreviousSlide, handleNextSlide } = useSlideNavigation({
    totalSlides: slides.length
  });
  
  const [currentBranch, setCurrentBranch] = useState("main");
  
  const branches = ["main", "feature/new-slides", "hotfix/typo"];
  const commitHistory = [
    { id: "a1b2c3d", message: "スライド5を追加", author: "田中さん", date: "2025年5月22日", reviewStatus: "reviewing" },
    { id: "e4f5g6h", message: "グラフのデータを更新", author: "佐藤さん", date: "2025年5月21日", reviewStatus: "approved" },
    { id: "i7j8k9l", message: "タイトルのフォント修正", author: "鈴木さん", date: "2025年5月20日", reviewStatus: "approved" },
    { id: "m1n2o3p", message: "初回コミット", author: "山本さん", date: "2025年5月19日", reviewStatus: "approved" }
  ];

  const presenterNotes = useMemo(() => {
    return Object.fromEntries(
      slides.map(slide => [slide.id, slide.notes])
    );
  }, [slides]);

  const elapsedTimeInSeconds = useMemo(() => {
    if (typeof elapsedTime === 'string') {
      const [minutes, seconds] = elapsedTime.split(':').map(Number);
      return minutes * 60 + seconds;
    }
    return 0;
  }, [elapsedTime]);

  const handleZoomChange = (newZoom: number) => {
    if (newZoom >= 50 && newZoom <= 200) {
      setZoom(newZoom);
    }
  };

  const handleModeChange = (mode: ViewerMode) => {
    console.log(`Mode change requested: ${mode} (current: ${viewerMode}) for user type: ${userType}`);
    
    if (mode === "edit" && userType === "student") {
      toast({
        title: "権限がありません",
        description: "学生ユーザーはレビューモードのみ利用できます",
        variant: "destructive"
      });
      return;
    }
    
    if (mode === "presentation" && userType === "student") {
      toast({
        title: "レビューモードへ切り替え",
        description: "学生ユーザーはレビューに集中してください",
        variant: "default"
      });
      setViewerMode("review");
      return;
    }
    
    if (mode === viewerMode) {
      console.log("Same mode selected, skipping update");
      return;
    }
    
    setViewerMode(mode);
    
    toast({
      title: mode === "presentation" 
        ? "プレゼンテーションモードに切り替えました" 
        : mode === "edit" 
          ? "編集モードに切り替えました" 
          : "レビューモードに切り替えました",
      description: mode === "presentation" 
        ? "発表用のプレゼンテーションを準備できます" 
        : mode === "edit" 
          ? "スライドの編集が可能になります"
          : "コメントやフィードバックに集中できます",
    });
  };

  const handleSaveChanges = () => {
    if (userType === "student") {
      toast({
        title: "権限がありません",
        description: "学生ユーザーは変更を保存できません",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "変更が保存されました",
      description: "すべての変更が正常に保存されました。",
      variant: "default"
    });
  };

  const handleStartPresentation = () => {
    toggleFullScreenWithEffects();
    
    toast({
      title: "プレゼンテーションが開始されました",
      description: "ESCキーで終了、矢印キーでスライド移動ができます",
      variant: "default"
    });
  };

  return {
    // State values
    currentSlideNumber,
    userType,
    zoom,
    viewerMode,
    showPresenterNotes,
    presentationStartTime,
    displayCount,
    slides,
    leftSidebarOpen,
    isFullScreen,
    currentBranch,
    branches,
    commitHistory,
    presenterNotes,
    elapsedTimeInSeconds,
    
    // Actions
    handlePreviousSlide,
    handleNextSlide,
    handleZoomChange,
    handleModeChange,
    handleSaveChanges,
    handleStartPresentation,
    setCurrentBranch,
    setLeftSidebarOpen,
    togglePresenterNotes,
    generateThumbnails,
    setDisplayCount
  };
};
