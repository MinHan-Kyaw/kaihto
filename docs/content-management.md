# Content management

## Files

| File                                 | Contents                                                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/data/consonantClasses.json`     | The three classes: `id`, `group`, live-syllable `tone` (a tone id), example consonant and sound                              |
| `src/data/consonants.json`           | 44 consonants, each with its vocabulary `words`                                                                              |
| `src/data/vowels.json`               | 32 vowels: `id` (written with `-` for the consonant), `group`, English `sound`, Burmese `pronunciation`, `audio`             |
| `src/data/vowelGroups.json`          | Short, long, extra and standalone vowel groups: `id` and `tones` (tone ids) per consonant class                              |
| `src/data/tones.json`                | The five tones: Thai name, an example syllable (คา ข่า ข้า ค้า ขา), pitch contour, `audio`                                   |
| `src/data/toneMarks.json`            | The four tone marks and their Thai names                                                                                     |
| `src/data/guide.json`                | Thai names of live and dead syllables                                                                                        |
| `src/data/meanings.json`             | The 60 words of the source's chapter 3: `id`, Thai word, Burmese `meaning`, `meaningEn`, `image`, `audio`                    |
| `src/i18n/en.yml`, `src/i18n/mm.yml` | UI text in English and Burmese, including the names of classes, tones, vowel groups and syllables and the tones explanations |
| `public/images/words/*.svg`          | Vocabulary pictures (vector)                                                                                                 |
| `public/audio/words/*.m4a`           | Thai audio                                                                                                                   |
| `public/audio/vowels/*.m4a`          | Thai vowel audio                                                                                                             |
| `public/images/meanings/*.svg`       | Meanings pictures (vector)                                                                                                   |
| `public/audio/meanings/*.m4a`        | Thai audio of the Meanings words                                                                                             |

## Word schema

```json
{
  "id": "ก",
  "character": "ก",
  "class": "middle",
  "words": [
    {
      "id": "ก-ไก่",
      "thai": "ไก่",
      "pronunciation": "ကောကိုင်",
      "meaning": "ကြက်",
      "meaningEn": "chicken",
      "pronunciationEn": "gor gai",
      "image": "/images/words/kai.svg",
      "audio": "/audio/words/kai.m4a"
    }
  ]
}
```

| Field             | Required | Rule                                                                                                                                                                               |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | yes      | `<consonant>-<thai>`; never change once published                                                                                                                                  |
| `thai`            | yes      | Thai script only                                                                                                                                                                   |
| `pronunciation`   | yes      | Burmese script, provided by the project owner, stored exactly as the source gives it (e.g. `ကောကိုင်`). Cards show it under the letter and word; practice shows it under `ก (ไก่)` |
| `meaning`         | yes      | Burmese meaning, provided by the project owner                                                                                                                                     |
| `meaningEn`       | yes      | English meaning, shown when the page is in English                                                                                                                                 |
| `pronunciationEn` | yes      | The letter name romanized for English readers (`gor gai`): `or` for the letter, `kh ch th ph` aspirated, `g j d dt b bp` unaspirated, syllables joined with `-`                    |
| `image`           | no       | SVG path. Missing → placeholder on the consonant page, excluded from practice                                                                                                      |
| `audio`           | no       | Missing → no speaker button, silent selection in practice                                                                                                                          |

## Adding or changing content

1. Take the Thai word, Burmese pronunciation and Burmese meaning from the source or the project owner. Where the source
   has no Burmese pronunciation, write it as in [Burmese pronunciation](#burmese-pronunciation) and list it in the
   review log. Add the English meaning and romanized letter name (`meaningEn`, `pronunciationEn`) for English readers.
2. Add the word to the right consonant in `src/data/consonants.json`.
3. Add the image and audio files (see below) and reference them. To replace an existing picture or recording, give the
   new file a new name: browsers keep the old one for up to a week (`public/_headers`).
4. Run `npm test` — `src/data/consonants.test.ts` checks IDs, required fields, Burmese script, Unicode order and that
   referenced files exist.
5. Open a pull request and complete the content checklist in the template.

A word without Burmese pronunciation is incomplete; do not merge it with a placeholder.

## Meanings words

```json
{
  "id": "กา-crow",
  "thai": "กา",
  "syllables": ["กา"],
  "meaning": "ကျီးကန်း",
  "pronunciation": "ကား",
  "meaningEn": "crow",
  "pronunciationEn": "gaa",
  "image": "/images/meanings/ka-crow.svg",
  "audio": "/audio/meanings/ka.m4a"
}
```

- `id` is the Thai word; words spelt alike add the English meaning (`กา-kettle`, `กา-crow`). Never change it once published.
- `syllables` splits the word into open syllables (`["ภู", "เขา"]`). Each must be one consonant + one vowel from
  `vowels.json`, with no tone mark or final consonant, so its tone follows from the rules; the Text tab shows it.
- `meaning` is the Burmese meaning exactly as the source gives it; a `/` separates the source's alternatives (`တွင်း/အပေါက်`).
- `pronunciation` is the Burmese pronunciation, shown in brackets after the meaning on the Burmese Text tab. The source
  has none for these words, so it is written as in [Burmese pronunciation](#burmese-pronunciation).
- `pronunciationEn` is the word in Latin letters, one part per syllable joined with `-` (`phuu-khao`), following
  [Romanization](#romanization); the English Text tab shows it after the meaning.
- `image` and `audio` are required. The picture is `public/images/meanings/<romanized-slug>.svg` (or an existing
  `public/images/words/` picture of the same thing, as ฝา and เสือ use); the audio says only the word, so words spelt
  alike share it. `src/data/meanings.test.ts` checks the fields, syllables, Unicode and files.

## Burmese pronunciation

The book's pronunciations are stored exactly as given. For a word the book has none for, write it in the book's style:

- The initial consonant as the book's letter names spell it: ก `က`, ข ค `ခ`, ง `င`, จ `ကျ`, ฉ ช `ချ`, ซ ศ ส `ဆ`, ด `ဒ`,
  ต `သ`, ถ ท `ထ`, น `န`, บ `ဘ`, ป `ပ`, ผ พ ภ `ဖ`, ฝ ฟ `ဖ` (Burmese has no /f/), ม `မ`, ย `ယ`, ร `ရ`, ล `လ`, ว `ဝ`,
  ห `ဟ`, อ `အ`.
- The vowel as the book's vowel chart spells it on `အ`, with the consonant in its place (`-า` `အား` → นา `နား`); ข ด ป
  take `ါ` (ขา `ခါ`). A short `-ะ` is the bare consonant (กะ `က`).
- A long syllable with a rising tone drops `း`, as the book writes หนู `နူ` and ศาลา `ဆာလား`: หู `ဟူ`, ขา `ခါ`.
- Syllables are written together, as the book does (ชฎา `ချဒါး`): ภูเขา `ဖူးခေါင်`.
- Where the book already spells the word (เสือ `ဆူးရ`), use its spelling.

## Romanization

Romanized pronunciations (`pronunciationEn`) share one scheme:

- Consonants: `g` ก, `kh` ข ค, `ng` ง, `j` จ, `ch` ฉ ช, `s` ซ ศ ส, `d` ด, `dt` ต, `th` ถ ท, `n` น, `b` บ, `bp` ป,
  `ph` ผ พ ภ, `f` ฝ ฟ, `m` ม, `y` ย, `r` ร, `l` ล, `w` ว, `h` ห; อ before a vowel is silent.
- Long vowels are doubled where a single letter would be ambiguous: `aa ii uu oo ee`; otherwise `a i u o e ae ue er
ua uea ai ao am or`. Tones are not marked; the Text tab shows them as curves.
- Syllables are joined with `-`; a letter name is `<consonant>or <word>` (`gor gai`).

## Images

- `public/images/words/<romanized-slug>.svg`, e.g. `kai.svg`. Vector, so they stay sharp on any screen.
- Style: Microsoft [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) **Flat** — `viewBox="0 0 32 32"`, flat
  fills, no outlines, Fluent's colour palette. Use a Fluent asset when one clearly shows the word; otherwise draw a custom
  SVG in the same style (see the custom list below).
- The picture must not contain the Thai letter or word — practice shows it as the question.
- No `<script>`, event handlers, `<foreignObject>` or external `href`s. `src/data/consonants.test.ts` enforces this.
- `alt` text is the Burmese `meaning`, set automatically.

To add a Fluent asset, copy it from a pinned commit (never `main`) and note the commit in this document:

```bash
curl -fsSL "https://raw.githubusercontent.com/microsoft/fluentui-emoji/<commit>/assets/Owl/Flat/owl_flat.svg" \
  -o public/images/words/nokhuk.svg
```

### Current picture sources

Fluent Emoji assets come from commit `1ffb34c752ecf5d402f04cfb4b392c77f57c54bc`.

| Source                                   | Words                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fluent Emoji (exact match)               | ไก่, เด็ก, เต่า, ใบไม้, ปลา, ไข่, ขวด, ผึ้ง, เสือ, ควาย, คน, ระฆัง, งู, ช้าง, โซ่, เฌอ, หญิง, ผู้เฒ่า, ธง, หนู, ฟัน, ม้า, เรือ, ลิง, แหวน, จุฬา, นกฮูก |
| Fluent Emoji (closest available, review) | จาน (fork and knife with plate), ฤาษี (man mage), มณโฑ (princess), ทหาร (military helmet), ยักษ์ (ogre)                                                |
| Custom SVG in Fluent style               | อ่าง, ชฎา, ปฏัก, ฉิ่ง, ถุง, ฐาน, ฝา, ศาลา, หีบ, เณร, พาน, สำเภา                                                                                        |

Meanings pictures (`public/images/meanings/`), from the same Fluent commit:

| Source                                   | Words                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fluent Emoji (exact match)               | กา kettle (teapot), หู, ตา eye, ตา grandfather (old man), สี (artist palette), มือ, ภูเขา, แกะ, ขา, แพะ, อะไร (question mark), หัว, รอ (hourglass), หัวเราะ, ดี (thumbs up), ยา (pill), มือถือ, ใจ (heart), หา (magnifying glass), ดีใจ, ผี, ปู, ถู (sponge), รู, ปี (calendar), ขอ (folded hands), โมโห, ไว (person running), พอใจ, พอ (OK hand) |
| Fluent Emoji (closest available, review) | ไป (person walking), มา (door), เตะ (soccer ball), และ (plus), ทำ (hammer and wrench), ดู (television), ผุ (fallen leaf), นะ (winking face), ไอ (sneezing face), มี (palms up), ไถ (tractor), พา (guide dog), จะ (crystal ball), เอา (takeout box), หอ (castle)                                                                                   |
| Fluent parts combined or recoloured      | กา crow (black bird), กะทิ (coconut and glass of milk), เยอะแยะ (heap of apples), โต (child and adult), ใน (apple in a basket), ไถนา (ox on a rice field), อา (man and woman), เลอะเทอะ (muddy T-shirt)                                                                                                                                           |
| Custom SVG in Fluent style               | นา (rice field), แห (cast net), ยาไอ (cough syrup and spoon), มะลิ (jasmine), ผา (cliff)                                                                                                                                                                                                                                                          |
| Shared with the consonant words          | ฝา (`words/fa.svg`), เสือ (`words/suea.svg`)                                                                                                                                                                                                                                                                                                      |

## Audio

- `public/audio/words/<romanized-slug>.m4a` (AAC, mono, ~64 kbps).
- The recording says the full letter name in Thai, `<consonant>อ <word>`, e.g. "กอ ไก่" (kaw kai), so it matches the
  Burmese pronunciation `ကောကိုင်`. The screen shows only the word `ไก่`.
- Audio is Thai pronunciation only; it is never produced from the Burmese `pronunciation` text.

Vowels:

- `public/audio/vowels/<sound>.m4a`, e.g. `a.m4a` for `-ะ`; `ใ-` and `ไ-` share the sound `ai`, so they use their
  names, `ai-mai-muan.m4a` and `ai-mai-malai.m4a`. Standalone vowels have no audio.
- The recording says the vowel on `อ`: `-ะ` → "อะ". It plays from the button at the start of the vowel's table row.

Tones:

- `public/audio/tones/<tone id>.m4a`, e.g. `mid.m4a`: the tone's `example` syllable from the kha set, คา (mid), ข่า (low),
  ข้า (falling), ค้า (high), ขา (rising), played from the tone cards on the tones screen. Placeholder text-to-speech made
  the same way: `say -v Kanya "คา"`.

Meanings:

- `public/audio/meanings/<romanized-slug>.m4a`, e.g. `hu.m4a`: just the word, "หู", with no letter name. Words spelt alike
  share a file (`ka.m4a` for both กา). Placeholder text-to-speech: `say -v Kanya "หู"`.

Converting a recording on macOS: `afconvert -f m4af -d aac -b 64000 recording.wav public/audio/words/kai.m4a`

## Review checklist

- [ ] Correct Thai character and consonant class
- [ ] Correct Thai word spelling
- [ ] Burmese pronunciation unchanged from the source, or written in the book's style and listed in the review log
- [ ] Burmese meaning correct
- [ ] Image shows the word, contains no text, and is square
- [ ] Audio is the Thai pronunciation of the same word
- [ ] `npm test` passes

## Sources and licensing

- **Text content** (Thai words, Burmese pronunciations, Burmese meanings, class names) was transcribed from the
  PDF text layer of _Thi Thi's Thai Training — Basic + Level 1_ (pages 3–5, 15, 27). Nothing was translated or inferred.
- **Meanings words** (Thai words and Burmese meanings) were transcribed from chapter 3 of the same PDF (PDF pages 61–64),
  reading the Burmese from the rendered pages because the text layer stores it in visual order with marks missing.
  English meanings are not from the book.
- **Vowel Burmese pronunciations** were transcribed from the same PDF's text layer, chapter 2 "32 Thai Vowels"
  (PDF pages 53–55), and checked against the rendered pages. **Vowel tone rules** are the book's English rules from
  chapter 5 (PDF pages 67, 69, 71), with spacing normalised (`Gp1 + Long Vowels -Mid Tone` → `Gp 1 + Long Vowel - Mid Tone`).
  English vowel `sound`s and group names are not from the book.
- **Images** are vector SVGs: Microsoft Fluent Emoji (MIT licence, copyright Microsoft Corporation — see
  `public/images/words/LICENSE-fluentui-emoji.txt`) plus custom drawings made for this project in the same style.
  Nothing is taken from the PDF's picture chart, whose licence was unclear.
- **Audio** files are _placeholders_ generated with the macOS Thai voice "Kanya" (`say -v Kanya "กอ ไก่"`), because the
  source has no audio. They are Thai text-to-speech of the Thai word, not derived from Burmese. Vowel audio is made the
  same way from the vowel on `อ`: `say -v Kanya "อะ"`.
  Replace them with recordings by a native speaker.
- **Vowel practice audio:** sound questions play the recorded vowel files (`public/audio/vowels/`). Tone questions'
  syllables are spoken live by the browser's speech synthesis (`src/services/voice.ts`, `th-TH`), not recorded, because
  there are about 1,232 consonant + vowel syllables. The trade-off: devices without a Thai voice
  (often Windows) stay silent, and the voice and its quality differ by device and browser, unlike the committed
  `.m4a` files, which sound the same everywhere. Record files instead if a syllable set must sound exact; the vowel
  table already plays recorded files (`public/audio/vowels/`).

## Content review log

Items for the project owner to confirm.

### Open

| Item                              | Detail                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ฝ-ฝา`, `ฟ-ฟัน` pronunciation     | The source writes these in Latin script (`Faw Far`, `Faw Fan`); Burmese script has no /f/. Stored as-is and listed in `PENDING_BURMESE_PRONUNCIATION`. Provide Burmese if desired.                                                                                                                                                                                                                                  |
| `ษ-ฤาษี` meaning                  | Source text reads `ရသေ့င်္` (trailing kinzi with no following consonant, which renders as a broken glyph). Stored as `ရသေ့`.                                                                                                                                                                                                                                                                                        |
| `ฮ-นกฮูก` pronunciation           | Source splits it over two lines (`ဟော` / `နို(က်)ဟု(က်)`); stored joined as `ဟောနို(က်)ဟု(က်)`.                                                                                                                                                                                                                                                                                                                     |
| `ญ-หญิง` pronunciation            | Source gives two variants `ယောယင်/ယောဖူးယင်`; stored as written.                                                                                                                                                                                                                                                                                                                                                    |
| Vowel English sounds              | Drafted by Claude at the owner's request (2026-10-01); not in the source. To be reviewed by the owner.                                                                                                                                                                                                                                                                                                              |
| `ใ-`, `ไ-` pronunciation          | The source gives both as `အိုင်း` and tells them apart only by name (`ai mai muam` / `ai mai malai`). Stored as given.                                                                                                                                                                                                                                                                                              |
| `ฤๅ`, `ฦๅ` spelling               | The source writes `ฤา` and `ฦา` (with sara aa); stored with lakkhangyao `ๅ`, the standard form. Confirm.                                                                                                                                                                                                                                                                                                            |
| Extra vowel tone rules            | The source states tone rules for short and long vowels only, so `-ำ ใ- ไ- เ-า` have none. Provide them if wanted.                                                                                                                                                                                                                                                                                                   |
| Approximate pictures              | จาน, ฤาษี, มณโฑ, ทหาร and ยักษ์ use the closest Fluent emoji (see [Current picture sources](#current-picture-sources)). Confirm or replace.                                                                                                                                                                                                                                                                         |
| Burmese UI text                   | All of `src/i18n/mm.yml` (navigation, prompts, buttons, Card options, the names of tones, vowel groups and live/dead syllables, and the tones explanations) was written by Claude at the owner's request (2026-10-20); not in the source. The class names are the owner's existing `burmeseName` values, moved there unchanged. To be reviewed by the owner.                                                        |
| English meanings and letter names | `meaningEn` and `pronunciationEn` for all 44 words were written by Claude at the owner's request (2026-10-20). To be reviewed by the owner.                                                                                                                                                                                                                                                                         |
| Meanings pronunciation            | The source has no pronunciation for the 60 chapter 3 words. The Burmese `pronunciation` values were written by Claude at the owner's request (2026-10-26) in the book's style (see [Burmese pronunciation](#burmese-pronunciation)), except เสือ, which uses the book's `ဆူးရ`; ฝา is `ဖာ` since Burmese has no /f/. The romanized `pronunciationEn` values were written the same day. To be reviewed by the owner. |
| Meanings English and pictures     | The 60 `meaningEn` values and the picture choices were made by Claude (2026-10-25); the source gives Burmese meanings only. Abstract words have approximate pictures (see [Current picture sources](#current-picture-sources)). To be reviewed by the owner.                                                                                                                                                        |
| `นะ` English meaning              | The source gives `နော်`, a sentence particle; stored in English as `softening particle`. Confirm or reword.                                                                                                                                                                                                                                                                                                         |
| Audio                             | Placeholder text-to-speech; see [Sources and licensing](#sources-and-licensing).                                                                                                                                                                                                                                                                                                                                    |

### Mechanical Unicode fixes applied (no change in rendering)

| Word                                                           | Source text layer                           | Stored                                             |
| -------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| `ฃ-ขวด` pronunciation                                          | `ခေါခု၀ပ်` (digit zero `၀` U+1040)          | `ခေါခုဝပ်` (letter wa `ဝ` U+101D)                  |
| `ว-แหวน` pronunciation                                         | ZWNJ + `ေ` typed before `၀` (visual order)  | `ဝေါဝယ်(န်)` (logical order)                       |
| `ผ-ผึ้ง` pronunciation                                         | asat before dot-below                       | `ဖောဖွန့်` (canonical order: dot-below, then asat) |
| `ร-เรือ` pronunciation, `บ-ใบไม้`, `ฐ-ฐาน`, `ภ-สำเภา` meanings | spaces inserted by PDF text extraction      | spaces removed                                     |
| Vowel `-ัวะ` pronunciation                                     | `အူ၀` (digit zero `၀` U+1040)               | `အူဝ` (letter wa `ဝ` U+101D)                       |
| Class name `အမြင့်သံဗျည်းအုပ်စု`                               | stray `ံ` after `့`                         | removed                                            |
| Meanings `ดีใจ` meaning                                        | `၀မ်းသာသည်` (digit zero `၀` U+1040)         | `ဝမ်းသာသည်` (letter wa `ဝ` U+101D)                 |
| Meanings `โมโห` meaning                                        | `စိ်တ်ဆိုးသည်` (stray asat after `ိ`)       | `စိတ်ဆိုးသည်`                                      |
| Meanings `ทำ`, `เยอะแยะ`                                       | `ทํา` (U+0E4D U+0E32), `เยอะเเยะ` (two `เ`) | `ทำ` (U+0E33), `เยอะแยะ` (`แ`)                     |
