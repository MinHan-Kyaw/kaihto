import VowelCard from '../../components/VowelCard';
import { vowels } from '../../data';
import { isCombinable } from '../../helpers/vowels';

const combinableVowels = vowels.filter(isCombinable);

const AllVowels = () => (
  <main className="min-h-dvh p-3">
    <h1 className="sr-only">All Thai vowels</h1>
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))] gap-2" aria-label="All Thai vowels" role="list">
      {combinableVowels.map((vowel) => (
        <li key={vowel.id}>
          <VowelCard vowel={vowel} />
        </li>
      ))}
    </ul>
  </main>
);

export default AllVowels;
