document.addEventListener('DOMContentLoaded', () => {
  const leftColorPicker = document.querySelectorAll('.left .color');
  const rightColorPicker = document.querySelectorAll('.right .color');
  const colorDisplay = document.getElementById('color-display');
  const colorSlider = document.getElementById('color-slider');
  const sliderValue = document.getElementById('slider-value');
  const sliderContainer = document.querySelector('.slider-container');
  const nextButton = document.getElementById('next-button');

  // Questi sono i quadratini invisibili che appaiono vicino alla barra
  const leftColorIndicator = document.querySelector('.left-color-indicator');
  const rightColorIndicator = document.querySelector('.right-color-indicator');

  let leftColor = null; // Colore selezionato a sinistra
  let rightColor = null; // Colore selezionato a destra
  let leftColorSelected = false; // Stato di selezione a sinistra
  let rightColorSelected = false; // Stato di selezione a destra
  let sliderColor = null; // Colore % slider
  let leftIndicatorSelected = false; // Stato di selezione indicatore a sinistra
  let rightIndicatorSelected = false; // Stato di selezione indicatore a destra

  function updateColorVisibility() {
    // Selezione colori a sinistra
    leftColorPicker.forEach((colorElement) => {
      const color = rgbToHex(getComputedStyle(colorElement).backgroundColor);
      if (leftColorSelected) {
        colorElement.style.opacity =  0;
      } else {
        colorElement.style.opacity = 1; // Mostra tutti i colori quando nessuno è selezionato
      }
    });

    // Selezione colori a destra
    rightColorPicker.forEach((colorElement) => {
      const color = rgbToHex(getComputedStyle(colorElement).backgroundColor);
      if (rightColorSelected) {
        colorElement.style.opacity = 0;
      } else {
        colorElement.style.opacity = 1; // Mostra tutti i colori quando nessuno è selezionato
      }
    });

    // Mostra l'indicatore a sinistra solo se il colore è selezionato
    if (leftColorSelected) {
      leftColorIndicator.classList.add('visible');
      leftColorIndicator.style.backgroundColor = leftColor; // Imposta il colore
      leftIndicatorSelected = true;
    } else {
      leftColorIndicator.classList.remove('visible');
      leftIndicatorSelected = false;
      leftColorIndicator.style.backgroundColor = null;
    }

    // Mostra l'indicatore a destra solo se il colore è selezionato
    if (rightColorSelected) {
      rightColorIndicator.classList.add('visible');
      rightColorIndicator.style.backgroundColor = rightColor; // Imposta il colore
      rightIndicatorSelected = true;
    } else {
      rightColorIndicator.classList.remove('visible');
      rightIndicatorSelected = false;
      rightColorIndicator.style.backgroundColor = null; // Imposta il colore
    }

    // La barra di miscelazione appare solo quando entrambi i colori sono selezionati
    if (leftColorSelected && rightColorSelected) {
      sliderContainer.style.display = 'block'; // Mostra la barra
    } else {
      sliderContainer.style.display = 'none'; // Nasconde la barra
    }
  }


  // Funzione per la selezione dei colori (sinistra/destra)
  function toggleColorSelection(colorElement, side) {
    const color = getComputedStyle(colorElement).backgroundColor;
    const hexColor = rgbToHex(color);

    if (side === 'left') {
      if (leftColor === hexColor) {
        leftColor = null; // Deseleziona il colore
        leftColorSelected = false;
      } else {
        leftColor = hexColor;
        leftColorSelected = true;
      }
    } else if (side === 'right') {
      if (rightColor === hexColor) {
        rightColor = null; // Deseleziona il colore
        rightColorSelected = false;
      } else {
        rightColor = hexColor;
        rightColorSelected = true;
      }
    }

    updateColorVisibility(); // Aggiorna la visibilità dei colori
    updateColorDisplay(); // Aggiorna il colore centrale
  }

  // Funzione per aggiornare il colore centrale
  function updateColorDisplay() {
    if (leftColor && rightColor) {
      const mixedColor = mixColors(leftColor, rightColor, sliderColor); // Usa la percentuale della barra
      colorDisplay.style.backgroundColor = mixedColor;  // Applica il colore miscelato al quadrato centrale
    }
  }

  // Funzione per miscelare due colori
  function mixColors(color1, color2, percentage) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * (percentage / 100));
    const g = Math.round(c1.g + (c2.g - c1.g) * (percentage / 100));
    const b = Math.round(c1.b + (c2.b - c1.b) * (percentage / 100));

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Funzione per convertire un colore rgb in formato esadecimale
  function rgbToHex(rgb) {
    const rgbArray = rgb.match(/\d+/g);
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
  }

  // Funzione per convertire un colore esadecimale in rgb
  function hexToRgb(hex) {
    // Se il valore è già in formato rgb, estrai direttamente i valori
    if (hex.startsWith('rgb')) {
      const rgb = hex.match(/\d+/g);  // Estrai i numeri da una stringa rgb
      return { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
    }

    // Se non è un formato RGB, continua con la logica del formato hex
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Eventi per la selezione dei colori a sinistra
  leftColorPicker.forEach((colorElement) => {
    colorElement.addEventListener('click', () => {
      toggleColorSelection(colorElement, 'left');
    });
  });

  // Eventi per la selezione dei colori a destra
  rightColorPicker.forEach((colorElement) => {
    colorElement.addEventListener('click', () => {
      toggleColorSelection(colorElement, 'right');
    });
  });
  leftColorIndicator.addEventListener('click', () => {
    leftColorSelected = false;
    leftColor = null;
    leftColorIndicator.classList.remove('visible');
    updateColorVisibility();
    updateColorDisplay();
  });

  rightColorIndicator.addEventListener('click', () => {
    rightColorSelected = false;
    rightColor = null;
    rightColorIndicator.classList.remove('visible');
    updateColorVisibility();
    updateColorDisplay();
  });

  // Aggiorna il colore centrale quando si muove la barra
  colorSlider.addEventListener('input', () => {
    sliderColor = colorSlider.value;  // Percentuale direttamente come valore numerico
    sliderValue.textContent = `${sliderColor}%`;
    updateColorDisplay();
  });

  // Prossima pagina
  nextButton.addEventListener('click', () => {
    if (leftColor && rightColor) {
      const mixedColor = mixColors(leftColor, rightColor, colorSlider.value);
      localStorage.setItem('mixedColor', mixedColor);
      window.location.href = 'polaroid.html';
    } else {
      alert('Seleziona entrambi i colori per procedere.');
    }
  });
});
