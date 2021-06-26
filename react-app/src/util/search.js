import AbortController from 'abort-controller';

const searchCreator = () => {
    let controller;
    let signal;
    let searching = false;
    return async query => {
        if (searching) {
            controller.abort();
            searching = false;
        }
        controller = new AbortController();
        signal = controller.signal;
        try {
            searching = true;
            const res = await fetch(query, { signal});
            const results = await res.json();
            return results;
        } catch(error) {
            console.log('Error', error);
        }
        searching = false;
    }
}

export const search = searchCreator();
