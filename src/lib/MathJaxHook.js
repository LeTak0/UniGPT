
//small hook for MathJax to prevent it from crashing the app
//disables beacause MathJax is included via cdn
export async function typesetPage(){
	try { 
		// eslint-disable-next-line no-undef
		MathJax.tex = {
			inlineMath: [['$', '$'], ['\\(', '\\)']],
			processEscapes: true,
		};
		// eslint-disable-next-line no-undef
		await MathJax.typesetPromise(); 
	} catch (e) { ; }
}