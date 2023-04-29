declare interface ITokenDetails {
	pos: string;
	count: number;
	sentences: number[];
}

declare interface ITokensByPoS {
	NOUN: { [key: string]: ITokenDetails };
	VERB: { [key: string]: ITokenDetails };
	ADJ: { [key: string]: ITokenDetails };
	ADV: { [key: string]: ITokenDetails };
	PROPN: { [key: string]: ITokenDetails };
}

declare type TBPOS = keyof ITokensByPoS;

declare interface IWordPoSFrequencyTable {
	text: string;
	count: number;
	pos: string;
}
[];

declare module 'svelte-d3-cloud';
