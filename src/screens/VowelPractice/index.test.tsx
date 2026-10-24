import { MemoryRouter } from 'react-router';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { consonants, vowels } from '../../data';
import { generateVowelQuestions } from '../../helpers/vowels';
import { playAudio } from '../../services/audio';
import { playFeedbackSound } from '../../services/sound';
import { speakThai } from '../../services/voice';
import { inBurmese } from '../../tests/fixtures';
import type { Consonant, Vowel, VowelQuestion } from '../../types/learning';

import VowelPractice from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));
vi.mock('../../services/sound', () => ({ FEEDBACK_SOUND_DURATION_MS: 0, playFeedbackSound: vi.fn() }));
vi.mock('../../services/voice', () => ({ speakThai: vi.fn(), stopSpeaking: vi.fn() }));
// A sound question (-ะ) followed by a tone question (ขา).
vi.mock('../../helpers/vowels', async (importOriginal) => {
  const helpers = await importOriginal<typeof import('../../helpers/vowels')>();
  const consonant = (character: string) => consonants.find((item) => item.character === character) as Consonant;
  const vowel = (id: string) => vowels.find((item) => item.id === id) as Vowel;
  const questions: VowelQuestion[] = [
    {
      id: 'กะ',
      kind: 'sound',
      consonant: consonant('ก'),
      vowel: vowel('-ะ'),
      syllable: 'กะ',
      tone: 'low',
      options: [vowel('-า'), vowel('-ะ'), vowel('-ิ')],
    },
    { id: 'ขา', kind: 'tone', consonant: consonant('ข'), vowel: vowel('-า'), syllable: 'ขา', tone: 'rising' },
  ];

  return { ...helpers, generateVowelQuestions: vi.fn(() => questions) };
});

const renderVowelPractice = () =>
  render(
    <MemoryRouter>
      <VowelPractice />
    </MemoryRouter>
  );

const SHORT_A = /\( a \)/;

const answer = async (name: string | RegExp) => {
  await userEvent.click(screen.getByRole('button', { name }));
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
};

describe('VowelPractice', () => {
  it('links back to the practice categories', () => {
    renderVowelPractice();

    expect(screen.getByRole('link', { name: 'Back to Practice' })).toHaveAttribute('href', '/practice');
  });

  describe('given a sound question', () => {
    it('shows only the vowel and offers three sounds', () => {
      renderVowelPractice();

      expect(screen.getByRole('heading', { name: 'What sound is this?' })).toBeInTheDocument();
      expect(screen.getByText('-ะ')).toHaveAttribute('lang', 'th');
      expect(screen.queryByText('กะ')).not.toBeInTheDocument();
      expect(
        within(screen.getByRole('list', { name: 'Answer options' }))
          .getAllByRole('button')
          .map((button) => button.textContent?.trim())
      ).toEqual(['( aa )', '( a )', '( i )']);
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('marks a correct sound and shows the vowel with its sound', async () => {
      renderVowelPractice();

      await answer(SHORT_A);

      expect(screen.getByRole('status')).toHaveTextContent('Correct.');
      expect(within(screen.getByRole('list', { name: 'Answer options' })).getByRole('button', { name: SHORT_A })).toHaveAttribute(
        'data-status',
        'correct'
      );
      expect(screen.getByRole('button', { name: 'Hear -ะ' }).closest('p')).toHaveTextContent('-ะ = ( a )');
      expect(playFeedbackSound).toHaveBeenCalledWith('correct');
    });

    it('reveals the correct sound when answered wrongly', async () => {
      renderVowelPractice();

      await answer(/\( aa \)/);

      expect(screen.getByRole('status')).toHaveTextContent('Incorrect. The answer is ( a ).');
    });
  });

  describe('given a tone question answered wrongly', () => {
    it('reveals the correct tone', async () => {
      renderVowelPractice();
      await answer(SHORT_A);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

      expect(screen.getByRole('heading', { name: 'Which tone is this?' })).toHaveFocus();
      expect(screen.getByText('ขา')).toBeInTheDocument();

      await answer(/Mid Tone/);

      expect(screen.getByRole('status')).toHaveTextContent('Incorrect. The answer is Rising Tone.');
      expect(screen.getByRole('button', { name: /Rising Tone/ })).toHaveAttribute('data-status', 'correct');
      expect(playFeedbackSound).toHaveBeenCalledWith('incorrect');
    });
  });

  describe('given every question is answered', () => {
    it('shows the score, links to the vowels and can start again', async () => {
      renderVowelPractice();
      await answer(SHORT_A);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
      await answer(/Mid Tone/);
      await userEvent.click(screen.getByRole('button', { name: 'See results' }));

      expect(screen.getByText('1 / 2')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Explore vowels' })).toHaveAttribute('href', '/vowels');

      await userEvent.click(screen.getByRole('button', { name: 'Practice again' }));

      expect(screen.getByRole('heading', { name: 'What sound is this?' })).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('given vowel groups to practise', () => {
    const practisedGroups = () =>
      [...new Set(vi.mocked(generateVowelQuestions).mock.lastCall?.[1].map((vowel) => vowel.group))].sort();

    it('starts with short, long and extra vowels', () => {
      renderVowelPractice();

      expect(screen.getByRole('checkbox', { name: /Short vowels/ })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /Long vowels/ })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /Extra vowels/ })).toBeChecked();
      expect(screen.queryByRole('checkbox', { name: /Standalone/ })).not.toBeInTheDocument();
      expect(practisedGroups()).toEqual(['extra', 'long', 'short']);
    });

    it('restarts with only the ticked groups', async () => {
      renderVowelPractice();
      await answer(SHORT_A);

      await userEvent.click(screen.getByRole('checkbox', { name: /Long vowels/ }));
      await userEvent.click(screen.getByRole('checkbox', { name: /Extra vowels/ }));

      expect(practisedGroups()).toEqual(['short']);
      expect(screen.getByRole('checkbox', { name: /Short vowels/ })).toBeDisabled();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('given pronunciation', () => {
    it('plays the recorded vowel only after a sound question is answered', async () => {
      renderVowelPractice();

      await userEvent.click(screen.getByRole('button', { name: SHORT_A }));
      expect(playAudio).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('button', { name: 'Next' }));
      await waitFor(() => expect(playAudio).toHaveBeenCalledWith('/audio/vowels/a.m4a'));
      expect(speakThai).not.toHaveBeenCalled();
    });

    it('speaks a tone question only after it is answered', async () => {
      renderVowelPractice();
      await answer(SHORT_A);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
      vi.mocked(speakThai).mockClear();

      await userEvent.click(screen.getByRole('button', { name: /Mid Tone/ }));
      expect(speakThai).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('button', { name: 'Next' }));
      await waitFor(() => expect(speakThai).toHaveBeenCalledWith('ขา'));
    });

    it('replays the vowel after a sound question', async () => {
      renderVowelPractice();
      await answer(SHORT_A);
      await waitFor(() => expect(playAudio).toHaveBeenCalled());
      vi.mocked(playAudio).mockClear();

      await userEvent.click(screen.getByRole('button', { name: 'Hear -ะ' }));

      expect(playAudio).toHaveBeenCalledWith('/audio/vowels/a.m4a');
    });

    it('replays the syllable after a tone question', async () => {
      renderVowelPractice();
      await answer(SHORT_A);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
      await answer(/Mid Tone/);
      vi.mocked(speakThai).mockClear();

      await userEvent.click(screen.getByRole('button', { name: 'Hear ขา' }));

      expect(speakThai).toHaveBeenCalledWith('ขา');
    });
  });

  describe('given the page is in Burmese', () => {
    it('offers the sounds with their Burmese pronunciation and explains the answer in Burmese', async () => {
      render(
        inBurmese(
          <MemoryRouter>
            <VowelPractice />
          </MemoryRouter>
        )
      );

      expect(screen.getByRole('heading', { name: 'ဒါ ဘာအသံလဲ။' })).toBeInTheDocument();
      expect(
        within(screen.getByRole('list', { name: 'အဖြေများ' }))
          .getAllByRole('button')
          .map((button) => button.textContent?.trim())
      ).toEqual(['( အား - aa )', '( အ - a )', '( အိ - i )']);

      await userEvent.click(screen.getByRole('button', { name: /- aa \)/ }));
      await userEvent.click(screen.getByRole('button', { name: 'ရှေ့သို့' }));

      expect(screen.getByRole('status')).toHaveTextContent('မှားပါသည်။ အဖြေမှန်မှာ ( အ - a ) ဖြစ်သည်။');
    });
  });
});
