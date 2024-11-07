document.addEventListener('DOMContentLoaded', () => {
    // Recupera il colore miscelato dal localStorage
    const mixedColor = localStorage.getItem('mixedColor');

    // Inserisce il colore nel centro della polaroid
    const polaroidImage = document.getElementById('polaroid-image');
    polaroidImage.style.backgroundColor = mixedColor;

    // Gestione della casella di testo
    const nameInput = document.getElementById('polaroid-name');
    const printButton = document.getElementById('print-button');

    // Abilita il bottone quando il nome è inserito
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            printButton.disabled = false;
        } else {
            printButton.disabled = true;
        }
    });

    // Aggiungi l'evento per il bottone di stampa
    printButton.addEventListener('click', () => {
        alert(`Stampa in corso per: ${nameInput.value}`);
        // Qui puoi aggiungere funzionalità per la stampa (salvare come immagine, inviare a una stampante, ecc.)
    });
});
