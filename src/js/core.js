var dispatchEvent = (name, details) => {
    document.dispatchEvent(
        new CustomEvent(name, details)
    );
}

export var addItem = (id) => {
    dispatchEvent('excelsiorAddItem', { detail: { id: id } });
}

export var print = (text) => {
    dispatchEvent('excelsiorAppendGameText', { detail: { text: text } });
}