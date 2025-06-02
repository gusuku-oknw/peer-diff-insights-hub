import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EvaluationCard from './EvaluationCard';
import { vi } from 'vitest';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock AIReviewSummary to isolate EvaluationCard tests
vi.mock('@/components/slideviewer/panels/AIReviewSummary', () => ({
  AIReviewSummary: ({ slideId }: { slideId: number }) => (
    <div data-testid="ai-review-summary">Mocked AIReviewSummary for Slide ID: {slideId}</div>
  ),
}));

describe('EvaluationCard', () => {
  const defaultProps = {
    thumbnailWidth: 150,
  };

  const renderWithTooltipProvider = (ui: React.ReactElement) => {
    // Set delayDuration to 0 for instant tooltip appearance in tests
    return render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>);
  };

  test('renders the card', () => {
    renderWithTooltipProvider(<EvaluationCard {...defaultProps} />);
    expect(screen.getByText('プレゼン評価')).toBeInTheDocument();
  });

  test('dialog opens on click and AIReviewSummary is rendered with default slideId', async () => {
    const user = userEvent.setup();
    renderWithTooltipProvider(<EvaluationCard {...defaultProps} />);

    // Find the trigger element (the card itself)
    const cardElement = screen.getByText('プレゼン評価').closest('div.thumbnail-card');
    expect(cardElement).toBeInTheDocument();

    if (cardElement) {
      await user.click(cardElement);
    }

    // Wait for the dialog content to appear
    const aiReviewSummary = await screen.findByTestId('ai-review-summary');
    expect(aiReviewSummary).toBeInTheDocument();
    expect(aiReviewSummary).toHaveTextContent('Mocked AIReviewSummary for Slide ID: 1');
  });

  test('tooltip is shown on hover', async () => {
    const user = userEvent.setup();
    renderWithTooltipProvider(<EvaluationCard {...defaultProps} />);
    
    const cardElement = screen.getByText('プレゼン評価').closest('div.thumbnail-card');
    expect(cardElement).toBeInTheDocument();

    if (cardElement) {
      await user.hover(cardElement);
    }

    // Find the visible tooltip element
    const tooltipElement = await screen.findByRole('tooltip', { hidden: false });
    expect(tooltipElement).toBeInTheDocument();

    // Assert content within the visible tooltip
    expect(within(tooltipElement).getByText('プレゼンテーション評価')).toBeInTheDocument();
    expect(within(tooltipElement).getByText('全体の評価とコメントを記録')).toBeInTheDocument();

    // It's good practice to unhover, though not strictly necessary for this test
    if (cardElement) {
      await user.unhover(cardElement);
    }
  });
});
