import ConsonantCard from '../../components/ConsonantCard';
import { consonantClasses, consonants } from '../../data';

const classes = consonantClasses.map((consonantClass) => ({
  ...consonantClass,
  consonants: consonants.filter((consonant) => consonant.class === consonantClass.id),
}));

const AllConsonants = () => (
  <main className="min-h-dvh p-3">
    <h1 className="sr-only">All Thai consonants</h1>
    {/* The low class has more letters than the middle and high classes together, so it gets a double-width column. */}
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr_2fr]">
      {classes.map((consonantClass) => (
        <section key={consonantClass.id} aria-labelledby={`consonant-class-${consonantClass.id}`}>
          <h2 id={`consonant-class-${consonantClass.id}`} className="mb-2 text-center text-lg font-bold">
            {consonantClass.name}
          </h2>
          <ul
            className="grid grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))] gap-2"
            aria-labelledby={`consonant-class-${consonantClass.id}`}
            role="list"
          >
            {consonantClass.consonants.map((consonant) => (
              <li key={consonant.id}>
                <ConsonantCard consonant={consonant} size="compact" showWord={false} showPicture={false} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </main>
);

export default AllConsonants;
