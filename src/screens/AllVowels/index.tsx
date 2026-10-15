import VowelCard from '../../components/VowelCard';
import { vowelGroups, vowels } from '../../data';

const groups = vowelGroups
  .filter((group) => group.id !== 'standalone')
  .map((group) => ({ ...group, vowels: vowels.filter((vowel) => vowel.group === group.id) }));

const AllVowels = () => (
  <main className="min-h-dvh p-3">
    <h1 className="sr-only">All Thai vowels</h1>
    <div className="grid gap-4 sm:grid-cols-3">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`vowel-group-${group.id}`}>
          <h2 id={`vowel-group-${group.id}`} className="mb-2 text-center text-lg font-bold">
            {group.name}
          </h2>
          <ul
            className="grid grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))] gap-2"
            aria-labelledby={`vowel-group-${group.id}`}
            role="list"
          >
            {group.vowels.map((vowel) => (
              <li key={vowel.id}>
                <VowelCard vowel={vowel} size="large" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </main>
);

export default AllVowels;
