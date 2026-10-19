import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import ClassTabs from '../../components/ClassTabs';
import Toggle from '../../components/Toggle';
import VowelCard from '../../components/VowelCard';
import VowelTable from '../../components/VowelTable';
import { consonantClasses, vowelGroups, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { isCombinable } from '../../helpers/vowels';
import { playAudio, stopAudio } from '../../services/audio';
import type { Vowel, VowelGroupId } from '../../types/learning';

const DEFAULT_GROUP_ID: VowelGroupId = 'short';

const isVowelGroupId = (value: string | null): value is VowelGroupId => vowelGroups.some((group) => group.id === value);

const counts = Object.fromEntries(
  vowelGroups.map((group) => [group.id, vowels.filter((vowel) => vowel.group === group.id).length])
) as Record<VowelGroupId, number>;

const overviewGroups = vowelGroups
  .filter((group) => group.id !== 'standalone')
  .map((group) => ({ ...group, vowels: vowels.filter((vowel) => vowel.group === group.id) }));

const overviewCount = overviewGroups.reduce((total, group) => total + group.vowels.length, 0);

const handlePlayAudio = (vowel: Vowel) => {
  if (vowel.audio) {
    void playAudio(assetUrl(vowel.audio));
  }
};

interface VowelsProps {
  showOverview?: boolean;
}

const Vowels = ({ showOverview = false }: VowelsProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedGroupId = searchParams.get('group');
  const selectedGroupId = isVowelGroupId(requestedGroupId) ? requestedGroupId : DEFAULT_GROUP_ID;
  const group = vowelGroups.find((item) => item.id === selectedGroupId);
  const groupVowels = vowels.filter((vowel) => vowel.group === selectedGroupId);

  useEffect(() => () => stopAudio(), []);

  const handleSelectGroup = (groupId: VowelGroupId) => {
    if (groupId === selectedGroupId) {
      return;
    }
    setSearchParams({ group: groupId }, { replace: true });
    window.scrollTo({ top: 0 });
  };

  const handleShowOverviewChange = (checked: boolean) => {
    void navigate(checked ? '/vowels/overview' : '/vowels', { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1 className="sr-only">Thai Vowels</h1>

      <div className="sticky top-header z-5 -mx-4 -mt-2 flex items-center gap-2 bg-surface px-4 py-2">
        <div className="min-w-0 flex-1">
          {showOverview ? (
            <p className="flex min-h-16 items-center px-2 font-bold text-ink-muted">
              All {overviewCount} short, long and extra vowels
            </p>
          ) : (
            <ClassTabs
              items={vowelGroups.map((item) => ({ id: item.id, label: item.shortName }))}
              counts={counts}
              selectedId={selectedGroupId}
              label="Vowel group"
              countLabel="vowels"
              onSelect={handleSelectGroup}
            />
          )}
        </div>
        <Toggle
          label="Overview"
          description="Show every vowel group on one page"
          checked={showOverview}
          onChange={handleShowOverviewChange}
        />
      </div>

      {showOverview ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {overviewGroups.map((overviewGroup) => (
            <section key={overviewGroup.id} aria-labelledby={`vowel-group-${overviewGroup.id}`}>
              <h2 id={`vowel-group-${overviewGroup.id}`} className="mb-2 text-center text-lg font-bold">
                {overviewGroup.name}
              </h2>
              <ul
                className="grid grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))] gap-2"
                aria-labelledby={`vowel-group-${overviewGroup.id}`}
                role="list"
              >
                {overviewGroup.vowels.map((vowel) => (
                  <li key={vowel.id}>
                    <VowelCard vowel={vowel} size="large" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        group && (
          <section className="mt-4" aria-labelledby="vowel-group-title">
            <h2 id="vowel-group-title" className="sr-only">
              {group.name}
            </h2>
            {groupVowels.every(isCombinable) ? (
              <VowelTable
                vowels={groupVowels}
                consonantClasses={consonantClasses}
                tones={group.tones}
                labelledBy="vowel-group-title"
                onPlayAudio={handlePlayAudio}
              />
            ) : (
              <ul className="grid grid-cols-4 gap-3" role="list" aria-labelledby="vowel-group-title">
                {groupVowels.map((vowel) => (
                  <li key={vowel.id}>
                    <VowelCard vowel={vowel} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      )}
    </>
  );
};

export default Vowels;
