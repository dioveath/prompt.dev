import createCache from '@emotion/cache'

const isBrowser = typeof window !== 'undefined';

export default function createEmotionCache() {
    let insertionPoint: HTMLMetaElement | undefined;

    if(isBrowser){
        const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
            'meta[name="emotion-insertion-point"]'
        );
        insertionPoint = emotionInsertionPoint ?? undefined;
    }    

    return createCache({ key: 'mui-style', prepend: !!insertionPoint });
}