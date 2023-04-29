import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);
const { its, as } = nlp;

export const toCapitalCase = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getSentences = (text: string, indexes: number[]) => {
	const sentences = nlp
		.readDoc(text)
		.sentences()
		.out(its.value, as.array)
		.filter((_, i) => indexes.includes(i));

	return sentences;
};

export const highlightWords = (word: string, sentence: string) => {
	const document = nlp.readDoc(sentence);
	document.tokens().each((t) => {
		if (t.out(its.lemma) === word.toLowerCase()) {
			t.markup('<mark class="highlight">', '</mark>');
		}
	});
	console.log(document.out(its.markedUpText));

	return document.out(its.markedUpText);
};

export const getWordFrequencyTable = (
	text: string,
	stopwords = false,
	maxWords = 200,
	minWordLength = 3
) => {
	const table = nlp
		.readDoc(text)
		.tokens()
		.filter((t) => t.out(its.type) === 'word')
		.filter((t) => stopwords || t.out(its.stopWordFlag) === false)
		.filter((t) => t.out(its.value).length >= minWordLength)
		.out(its.lemma, as.freqTable)
		.map(([text, count]) => ({ text: toCapitalCase(String(text)), count: parseInt(String(count)) }))
		.filter((_, i) => i < maxWords);

	return table;
};

export const getWordPoSFrequencyTable = (
	text: string,
	stopwords = false,
	maxWords = 250,
	minWordLength = 3
) => {
	const tokensPoS: ITokensByPoS = {
		// PoS: Part of Speech
		NOUN: {}, // Noun: Man, dog, table, chair
		VERB: {}, // Verb: Run, sing, develop
		ADJ: {}, // Adjective: Big, happy, green
		ADV: {}, // Adverb: Quickly, quietly, well
		PROPN: {} // Proper noun: Mary, John, London, NATO
	};

	nlp
		.readDoc(text)
		.tokens()
		.filter((t) => t.out(its.type) === 'word')
		.filter((t) => stopwords || t.out(its.stopWordFlag) === false)
		.filter((t) => t.out(its.value).length >= minWordLength)
		.each((t) => {
			const pos = t.out(its.pos) as TBPOS;
			const token = toCapitalCase(t.out(its.lemma));

			if (!tokensPoS[pos]) return;

			tokensPoS[pos][token] = tokensPoS[pos][token] || {
				count: 0,
				sentences: []
			};

			tokensPoS[pos][token].count += 1;
			tokensPoS[pos][token].sentences.push(t.parentSentence().index());
		});

	const table = Object.keys(tokensPoS)
		.map((pos) => {
			const tpos = tokensPoS[pos as keyof ITokensByPoS];
			return Object.entries(tpos).reduce(
				(
					acc: { text: string; count: number; pos: string; sentences: number[] }[],
					[text, { count, sentences }]
				) => {
					acc.push({ text, count, pos, sentences });
					return acc;
				},
				[]
			);
		})
		.reduce((acc, cur) => acc.concat(cur), [])
		.sort((a, b) => b.count - a.count)
		.filter((_, i) => i < maxWords);

	return table;
};
