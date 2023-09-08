// worker.js
onmessage = function(e) {
    try {
        eval(e.data);
        postMessage({ status: 'completed' });
    } catch (error) {
        postMessage({ status: 'error', message: error.toString() });
    }
};
