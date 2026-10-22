import { render, screen } from '@testing-library/react';

import { buildQuestion, inBurmese } from '../../tests/fixtures';

import PracticeQuestion from '.';

describe('PracticeQuestion', () => {
  it('renders the picture, the prompt and the answer area', () => {
    render(
      <PracticeQuestion question={buildQuestion()}>
        <p>Answer area</p>
      </PracticeQuestion>
    );

    expect(screen.getByRole('img', { name: 'chicken' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Which word is this?' })).toBeInTheDocument();
    expect(screen.getByText('Answer area')).toBeInTheDocument();
  });

  describe('given a typing question', () => {
    it('asks for the Thai letter and hints the pronunciation without showing the Thai', () => {
      render(
        <PracticeQuestion question={buildQuestion(0, 'type')}>
          <p>Answer area</p>
        </PracticeQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Type the Thai letter' })).toBeInTheDocument();
      expect(screen.getByText('gor gai')).toHaveAttribute('lang', 'en');
      expect(screen.queryByText(/ไก่/)).not.toBeInTheDocument();
    });
  });

  describe('given a group question', () => {
    it('shows the picture with the letter, word and pronunciation', () => {
      render(
        <PracticeQuestion question={buildQuestion(0, 'class')}>
          <p>Answer area</p>
        </PracticeQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Which group is this letter in?' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'chicken' })).toBeInTheDocument();
      expect(screen.getByText('ก (ไก่)')).toHaveAttribute('lang', 'th');
      expect(screen.getByText('gor gai')).toHaveAttribute('lang', 'en');
    });
  });

  describe('given a speaking question', () => {
    it('shows only the picture so the learner recalls the word', () => {
      render(
        <PracticeQuestion question={buildQuestion(0, 'speak')}>
          <p>Answer area</p>
        </PracticeQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Say this word' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'chicken' })).toBeInTheDocument();
      expect(screen.queryByText(/ไก่/)).not.toBeInTheDocument();
      expect(screen.queryByText('gor gai')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('given the page is in Burmese', () => {
    it('asks in Burmese and gives the Burmese meaning and pronunciation', () => {
      render(
        inBurmese(
          <PracticeQuestion question={buildQuestion(0, 'type')}>
            <p>Answer area</p>
          </PracticeQuestion>
        )
      );

      expect(screen.getByRole('heading', { name: 'ထိုင်းစာလုံးကို ရိုက်ပါ' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'ကြက်' })).toHaveAttribute('lang', 'my');
      expect(screen.getByText('ကောကိုင်')).toHaveAttribute('lang', 'my');
    });
  });

  describe('given the question changes', () => {
    it('moves focus to the prompt for keyboard and screen reader users', () => {
      const { rerender } = render(
        <PracticeQuestion question={buildQuestion(0)}>
          <p>Answer area</p>
        </PracticeQuestion>
      );

      rerender(
        <PracticeQuestion question={buildQuestion(1)}>
          <p>Answer area</p>
        </PracticeQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Which word is this?' })).toHaveFocus();
    });
  });
});
