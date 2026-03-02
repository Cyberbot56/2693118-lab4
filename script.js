document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("search-btn");
    const input = document.getElementById("country-input");
    const spinner = document.getElementById("loading-spinner");
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");

    async function getN(borders) {

        if (!borders || borders.length === 0) {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            return;
        }

        try {
            const response = await fetch(
                `https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`
            );

            const data = await response.json();

            const listItems = data.map(country => `
                <li>
                    <strong>${country.name.common}</strong><br>
                    <img src="${country.flags.svg}" 
                         alt="${country.name.common} flag" 
                         width="50">
                </li>
            `).join("");

            borderingCountries.innerHTML = `
                <h3>Bordering Countries:</h3>
                <ul>
                    ${listItems}
                </ul>
            `;

        } catch (error) {
            console.log(error);
        }
    }
    async function searchCountry() {

        const countryName = input.value.trim();
        if (!countryName) return;

        spinner.style.display = "block";
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";

        try {
            const response = await fetch(
                `https://restcountries.com/v3.1/name/${countryName}`
            );

            if (!response.ok) throw new Error("Country not found");

            const data = await response.json();
            const country = data[0];

            countryInfo.innerHTML = `
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" 
                     alt="${country.name.common} flag" 
                     width="150">
            `;

            await getN(country.borders);

        } catch (error) {
            countryInfo.innerHTML = "<p>Country not found.</p>";
        } finally {
            spinner.style.display = "none";
        }
    }

    button.addEventListener("click", searchCountry);

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchCountry();
        }
    });

});