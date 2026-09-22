async function openPopup(data) {
    try {
        // const dataToRender = {
        //     content: content || {},
        // };
        return new Promise((resolve, reject) => {
            var popupElement = document.getElementById('popup-content');
            popupElement.classList.remove('d-none');
            var templateName = 'popup';

            if (window.precompiledTemplates && typeof window.precompiledTemplates[templateName] === 'function') {
                var templateFunction = window.precompiledTemplates[templateName];
                try {
                    var renderedHtml = templateFunction(data);
                    popupElement.innerHTML = renderedHtml;
                    resolve(true);
                } catch (e) {
                    console.error('Error rendering popup template:', e);
                    reject(e);
                }
            } else {
                console.error('popup template not found or not a function:', templateName);
                reject(new Error('popup template not found or not a function'));
            }
        });
    } catch (e) {
        console.error('Error parsing JSON from data-item:', e);
    }
}

function closePopup() {
    return new Promise((resolve) => {
        var popupElement = document.getElementById('popup-content');
        if (popupElement) {
            popupElement.classList.add('d-none');
            popupElement.innerHTML = '';
            resolve(true);
        } else {
            console.error('popup element not found');
            resolve(false); // Resolve with false if the popup element was not found
        }
    });
}