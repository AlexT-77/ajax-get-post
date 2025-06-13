// Funzione per generare il grafico
function generateChart(moodData) {
    const ctx = document.getElementById("moodChart").getContext("2d");

    let labels = moodData.map(item => item.timestamp_mood);
    let ratings = moodData.map(item => item.rate_mood);

    // costruisco un array con le date degli ultimi 20 giorni, per l'asse X
    const lastNDays = getLastNDays(20).reverse();

    let avgRating = [];
    let avgDays = [];
    let sum = 0;
    let cont = 0;
    let i = 0;

    // doppio ciclo che calcola la media giornaliera
    while (i < ratings.length) {
        const actualDay = labels[i];
        while (actualDay == labels[i]) {
            sum += parseInt(ratings[i]);
            cont++;
            i++;
        }
        avgRating.push((sum / cont).toFixed(1));
        avgDays.push(actualDay);

        cont = 0;
        sum = 0;
    }

    let avgRatingForDay = [];
    let index = -1;

    for (let y = 0; y < lastNDays.length; y++) {
        index = avgDays.indexOf(lastNDays[y]);
        if (index !== -1) {
            avgRatingForDay.push(avgRating[index]);
        } else {
            avgRatingForDay.push(0);
        }
    }

    new Chart(ctx, {
        type: "line",
        data: {
            labels: lastNDays,
            datasets: [{
                label: "Andamento umore",
                data: avgRatingForDay,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            responsive: true,  // Abilita la risposta al ridimensionamento
            maintainAspectRatio: false, // Consente di adattare il grafico al contenitore
            scales: {
                x: {
                    ticks: {
                        // Usa `autoSkip` per evitare sovrapposizioni delle etichette
                        autoSkip: true,
                        maxRotation: 90, // Limita la rotazione massima a 90 gradi
                        minRotation: 90, // Imposta la rotazione minima a 90 gradi per le etichette
                    }
                },
                y: {
                    min: 0,  // Imposta il valore minimo dell'asse y
                    max: 6,  // Imposta il valore massimo dell'asse y
                    ticks: {
                        stepSize: 1  // Imposta l'incremento tra i valori sull'asse y
                    }
                }
            }
        }
    });

}

function getLastNDays(days) {
    let today = new Date();
    let datesArray = [];

    for (let i = 0; i < days; i++) {
        let pastDate = new Date(today); // Crea una copia della data attuale
        pastDate.setDate(today.getDate() - i); // Sottrae i giorni

        let year = pastDate.getFullYear();
        let month = String(pastDate.getMonth() + 1).padStart(2, '0');
        let day = String(pastDate.getDate()).padStart(2, '0');

        datesArray.push(`${year}-${month}-${day}`); // Aggiunge la data all'array
    }

    return datesArray;
}