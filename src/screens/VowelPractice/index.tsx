import { useEffect, useRef, useState } from 'react';

import AnswerOption from '../../components/AnswerOption';
import BackLink from '../../components/BackLink';
import CheckboxChips from '../../components/CheckboxChips';
import PracticeFeedback from '../../components/PracticeFeedback';
import PracticeSummary from '../../components/PracticeSummary';
import ProgressBar from '../../components/ProgressBar';
import type { AnswerResult } from '../../components/ResultIcon';
import ToneContour from '../../components/ToneContour';
import VowelExplanation from '../../components/VowelExplanation';
import VowelQuestion from '../../components/VowelQuestion';
import VowelSound from '../../components/VowelSound';
import { consonantClasses, consonants, guide, toneById, tones, vowelGroups, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { combineVowel, generateVowelQuestions, getSyllable, getVowelAnswer, isCombinable } from '../../helpers/vowels';
import { playAudio, stopAudio } from '../../services/audio';
import { FEEDBACK_SOUND_DURATION_MS, playFeedbackSound } from '../../services/sound';
import { speakThai, stopSpeaking } from '../../services/voice';
import type { Vowel, VowelGroupId, VowelQuestion as VowelQuestionType } from '../../types/learning';

type GroupSelection = Partial<Record<VowelGroupId, boolean>>;

const practiceGroups = vowelGroups.filter((group) => vowels.some((vowel) => vowel.group === group.id && isCombinable(vowel)));
const ALL_GROUPS: GroupSelection = Object.fromEntries(practiceGroups.map((group) => [group.id, true]));

const buildQuestions = (groups: GroupSelection) =>
  generateVowelQuestions(
    consonants,
    vowels.filter((vowel) => groups[vowel.group])
  );

// The vowel on อ ("โอ"): the recorded clip when there is one, otherwise the browser's Thai voice.
const playVowel = (vowel: Vowel) => {
  if (vowel.audio) {
    void playAudio(assetUrl(vowel.audio));
  } else {
    speakThai(combineVowel('อ', vowel));
  }
};

// Heard only after answering: hearing it first would give the answer away.
const playQuestion = (question: VowelQuestionType) => {
  if (question.kind === 'sound') {
    playVowel(question.vowel);
  } else {
    speakThai(question.syllable);
  }
};

const getOptionResult = (option: string, answer: string, selected: string | null, answered: boolean): AnswerResult | null => {
  if (!answered) {
    return null;
  }
  if (option === answer) {
    return 'correct';
  }
  return option === selected ? 'incorrect' : null;
};

const VowelPractice = () => {
  const [groups, setGroups] = useState(ALL_GROUPS);
  const [questions, setQuestions] = useState(() => buildQuestions(ALL_GROUPS));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const speakTimer = useRef<number | undefined>(undefined);
  const question = questions[index];

  useEffect(
    () => () => {
      window.clearTimeout(speakTimer.current);
      stopSpeaking();
      stopAudio();
    },
    []
  );

  const silence = () => {
    window.clearTimeout(speakTimer.current);
    stopSpeaking();
    stopAudio();
  };

  const restart = (nextGroups = groups) => {
    silence();
    setQuestions(buildQuestions(nextGroups));
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
  };

  const handleGroupChange = (groupId: VowelGroupId, checked: boolean) => {
    const nextGroups = { ...groups, [groupId]: checked };
    setGroups(nextGroups);
    restart(nextGroups);
  };

  if (!question) {
    return (
      <PracticeSummary
        score={score}
        total={questions.length}
        onRestart={() => restart()}
        explore={{ to: '/vowels', label: 'Explore vowels' }}
      />
    );
  }

  const answer = getVowelAnswer(question);
  const isCorrect = selected === answer;
  const result: AnswerResult | null = answered ? (isCorrect ? 'correct' : 'incorrect') : null;
  const isLastQuestion = index === questions.length - 1;
  const consonantClass = consonantClasses.find((item) => item.id === question.consonant.class);
  const tone = toneById[question.tone];

  const handleAction = () => {
    if (answered) {
      silence();
      setIndex(index + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }
    if (selected === null) {
      return;
    }
    playFeedbackSound(isCorrect ? 'correct' : 'incorrect');
    setAnswered(true);
    speakTimer.current = window.setTimeout(() => playQuestion(question), FEEDBACK_SOUND_DURATION_MS);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const optionProps = (option: string) => ({
    selected: option === selected,
    result: getOptionResult(option, answer, selected, answered),
    disabled: answered,
    onSelect: () => setSelected(option),
  });

  return (
    <div className="mx-auto flex max-w-[42rem] flex-col">
      <h1 className="sr-only">Vowel practice</h1>
      <BackLink to="/practice">Practice</BackLink>
      <CheckboxChips
        legend="Vowels to practise"
        options={practiceGroups.map((group) => ({
          id: group.id,
          checked: Boolean(groups[group.id]),
          label: (
            <>
              {group.name} <span className="text-sm">{vowels.filter((vowel) => vowel.group === group.id).length}</span>
            </>
          ),
        }))}
        onChange={handleGroupChange}
      />
      <div className="mt-3 mb-4 flex items-center gap-3">
        <ProgressBar current={index + (answered ? 1 : 0)} total={questions.length} label="Practice progress" />
      </div>

      <VowelQuestion question={question}>
        {question.kind === 'sound' ? (
          <ul className="grid w-full gap-3 md:grid-cols-3" aria-label="Answer options" role="list">
            {question.options.map((option) => (
              <li key={option.id}>
                <AnswerOption {...optionProps(option.id)} compact>
                  <span className="text-lg font-bold whitespace-nowrap text-ink-muted">
                    <VowelSound vowel={option} />
                  </span>
                </AnswerOption>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Tones" role="list">
            {tones.map((item) => (
              <li key={item.id}>
                <AnswerOption {...optionProps(item.id)} compact>
                  <ToneContour pitch={item.pitch} />
                  <span className="font-bold">{item.name}</span>
                </AnswerOption>
              </li>
            ))}
          </ul>
        )}

        {answered && (
          <VowelExplanation
            question={question}
            consonantClassName={consonantClass?.burmeseName ?? ''}
            syllableName={guide.syllables[getSyllable(question.vowel)].name}
            toneName={tone.name}
            onPlay={() => playQuestion(question)}
          />
        )}
      </VowelQuestion>

      <PracticeFeedback
        result={result}
        correctAnswer={question.kind === 'sound' ? <VowelSound vowel={question.vowel} /> : tone.name}
        actionLabel={!answered ? 'Next' : isLastQuestion ? 'See results' : 'Continue'}
        actionDisabled={!answered && selected === null}
        onAction={handleAction}
      />
    </div>
  );
};

export default VowelPractice;
