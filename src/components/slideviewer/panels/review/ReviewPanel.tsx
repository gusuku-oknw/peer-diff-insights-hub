
import React from "react";
import ReviewDashboard from "../components/ReviewDashboard";
import { useReviewPanel } from "@/hooks/useReviewPanel";

interface ReviewPanelProps {
  currentSlide: number;
  totalSlides: number;
  userType: "student" | "enterprise";
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  currentSlide,
  totalSlides,
  userType,
  panelWidth,
  panelHeight,
  isNarrow = false,
  isVeryNarrow = false,
}) => {
  const { completionPercentage } = useReviewPanel({ userType });

  // Simple dashboard view without internal tabs
  return (
    <div className="h-full bg-white">
      <ReviewDashboard
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        completionPercentage={completionPercentage}
        pendingItems={3}
        urgentItems={1}
        completedToday={5}
        isVeryNarrow={isVeryNarrow}
      />
    </div>
  );
};

export default ReviewPanel;
