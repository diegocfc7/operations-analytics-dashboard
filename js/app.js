/* =========================================================
   OPERATIONS ANALYTICS DASHBOARD
   Application logic
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const periodFilter =
    document.getElementById("periodFilter");

const regionFilter =
    document.getElementById("regionFilter");

const teamFilter =
    document.getElementById("teamFilter");

const serviceFilter =
    document.getElementById("serviceFilter");

const resetFilters =
    document.getElementById("resetFilters");


/* =========================================================
   INITIALIZE FILTER OPTIONS
   ========================================================= */

function populateSelect(
    element,
    values
) {

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        element.appendChild(option);

    });
}


populateSelect(
    regionFilter,
    REGIONS
);

populateSelect(
    teamFilter,
    TEAMS
);

populateSelect(
    serviceFilter,
    SERVICE_TYPES
);


/* =========================================================
   PERIOD FILTER
   ========================================================= */

function matchesPeriod(
    operation,
    period
) {

    if (period === "all") {
        return true;
    }

    const day =
        operation.day;

    const ranges = {

        week1: [1, 7],
        week2: [8, 14],
        week3: [15, 21],
        week4: [22, 28],
        week5: [29, 31]

    };

    const range =
        ranges[period];

    return (
        day >= range[0] &&
        day <= range[1]
    );
}


/* =========================================================
   FILTER DATA
   ========================================================= */

function getFilteredData() {

    return operationsData.filter(
        operation => {

            const periodMatch =
                matchesPeriod(
                    operation,
                    periodFilter.value
                );

            const regionMatch =
                regionFilter.value === "all" ||
                operation.region ===
                regionFilter.value;

            const teamMatch =
                teamFilter.value === "all" ||
                operation.team ===
                teamFilter.value;

            const serviceMatch =
                serviceFilter.value === "all" ||
                operation.serviceType ===
                serviceFilter.value;

            return (
                periodMatch &&
                regionMatch &&
                teamMatch &&
                serviceMatch
            );
        }
    );
}


/* =========================================================
   KPI CALCULATIONS
   ========================================================= */

function calculateKPIs(data) {

    const total =
        data.length;

    if (!total) {

        return {
            total: 0,
            conversion: 0,
            sla: 0,
            avgResponse: 0
        };
    }

    const converted =
        data.filter(
            item => item.converted
        ).length;

    const withinSla =
        data.filter(
            item => item.slaMet
        ).length;

    const totalResponse =
        data.reduce(
            (sum, item) =>
                sum + item.responseTime,
            0
        );

    return {

        total,

        conversion:
            converted /
            total *
            100,

        sla:
            withinSla /
            total *
            100,

        avgResponse:
            totalResponse /
            total
    };
}


/* =========================================================
   PERFORMANCE DATA
   ========================================================= */

function buildPerformanceData(data) {

    const grouped = {};

    data.forEach(operation => {

        if (!grouped[operation.day]) {

            grouped[operation.day] = {
                total: 0,
                converted: 0
            };
        }

        grouped[operation.day].total++;

        if (operation.converted) {
            grouped[operation.day].converted++;
        }
    });


    const days =
        Object.keys(grouped)
            .map(Number)
            .sort(
                (a, b) => a - b
            );


    return {

        labels:
            days.map(
                day =>
                    `${String(day).padStart(2, "0")} Aug`
            ),

        operations:
            days.map(
                day =>
                    grouped[day].total
            ),

        conversion:
            days.map(day => {

                const group =
                    grouped[day];

                return Number(
                    (
                        group.converted /
                        group.total *
                        100
                    ).toFixed(1)
                );
            })
    };
}


/* =========================================================
   NON-CONVERSION DATA
   ========================================================= */

function buildNonConversionData(data) {

    const nonConverted =
        data.filter(
            item => !item.converted
        );

    const counts = {};

    NON_CONVERSION_REASONS.forEach(
        reason => {
            counts[reason] = 0;
        }
    );


    nonConverted.forEach(
        operation => {

            counts[
                operation.nonConversionReason
            ]++;

        }
    );


    const total =
        nonConverted.length || 1;


    return {

        labels:
            NON_CONVERSION_REASONS,

        values:
            NON_CONVERSION_REASONS.map(
                reason =>
                    Number(
                        (
                            counts[reason] /
                            total *
                            100
                        ).toFixed(1)
                    )
            ),

        counts
    };
}


/* =========================================================
   KPI DISPLAY
   ========================================================= */

function updateKPIs(kpis) {

    document.getElementById(
        "totalOperations"
    ).textContent =
        kpis.total.toLocaleString(
            "en-US"
        );


    document.getElementById(
        "conversionRate"
    ).textContent =
        `${kpis.conversion.toFixed(1)}%`;


    document.getElementById(
        "slaCompliance"
    ).textContent =
        `${kpis.sla.toFixed(1)}%`;


    document.getElementById(
        "avgResponseTime"
    ).textContent =
        `${kpis.avgResponse.toFixed(1)}m`;


    document.getElementById(
        "operationsVariation"
    ).textContent =
        "Filtered operational volume";


    document.getElementById(
        "conversionVariation"
    ).textContent =
        `${Math.round(
            kpis.total *
            kpis.conversion /
            100
        )} converted operations`;


    document.getElementById(
        "slaVariation"
    ).textContent =
        "Operations within 15 min";


    document.getElementById(
        "responseVariation"
    ).textContent =
        "Average operational response";
}


/* =========================================================
   INSIGHTS
   ========================================================= */

function updateInsights(
    data,
    kpis,
    nonConversion
) {

    if (!data.length) {

        document.getElementById(
            "insight1Title"
        ).textContent =
            "No data available";

        document.getElementById(
            "insight1Text"
        ).textContent =
            "No operations match the selected filters.";

        document.getElementById(
            "insight2Text"
        ).textContent =
            "Adjust the filters to view operational performance.";

        document.getElementById(
            "insight3Text"
        ).textContent =
            "No non-conversion analysis is available.";

        return;
    }


    /* Insight 1 */

    let conversionAssessment;

    if (kpis.conversion >= 35) {

        conversionAssessment =
            "strong";

    } else if (
        kpis.conversion >= 30
    ) {

        conversionAssessment =
            "stable";

    } else {

        conversionAssessment =
            "below target";
    }


    document.getElementById(
        "insight1Title"
    ).textContent =
        "↗ Conversion performance";


    document.getElementById(
        "insight1Text"
    ).textContent =
        `Conversion is ${conversionAssessment} at ${kpis.conversion.toFixed(1)}%, based on ${kpis.total.toLocaleString("en-US")} operations.`;


    /* Insight 2 */

    document.getElementById(
        "insight2Title"
    ).textContent =
        kpis.sla >= 90
            ? "⚡ SLA performance"
            : "⚠ SLA attention required";


    document.getElementById(
        "insight2Text"
    ).textContent =
        `${kpis.sla.toFixed(1)}% of operations were completed within the 15-minute SLA, with an average response time of ${kpis.avgResponse.toFixed(1)} minutes.`;


    /* Insight 3 */

    const sortedReasons =
        Object.entries(
            nonConversion.counts
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    const topReason =
        sortedReasons[0];


    const totalNonConverted =
        sortedReasons.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );


    const topReasonShare =
        totalNonConverted
            ? (
                topReason[1] /
                totalNonConverted *
                100
            )
            : 0;


    document.getElementById(
        "insight3Title"
    ).textContent =
        "◎ Main opportunity";


    document.getElementById(
        "insight3Text"
    ).textContent =
        `${topReason[0]} is the leading non-conversion driver, representing ${topReasonShare.toFixed(1)}% of non-converted operations.`;
}


/* =========================================================
   FILTER STATUS
   ========================================================= */

function updateStatus(data) {

    const activeFilters = [];

    if (
        periodFilter.value !== "all"
    ) {
        activeFilters.push(
            periodFilter.options[
                periodFilter.selectedIndex
            ].text
        );
    }

    if (
        regionFilter.value !== "all"
    ) {
        activeFilters.push(
            regionFilter.value
        );
    }

    if (
        teamFilter.value !== "all"
    ) {
        activeFilters.push(
            teamFilter.value
        );
    }

    if (
        serviceFilter.value !== "all"
    ) {
        activeFilters.push(
            serviceFilter.value
        );
    }


    document.getElementById(
        "dataStatus"
    ).textContent =
        activeFilters.length
            ? `${data.length.toLocaleString("en-US")} operations • ${activeFilters.join(" • ")}`
            : `${data.length.toLocaleString("en-US")} operations • All data`;
}


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

function updateDashboard() {

    const filteredData =
        getFilteredData();

    const kpis =
        calculateKPIs(
            filteredData
        );

    const performance =
        buildPerformanceData(
            filteredData
        );

    const nonConversion =
        buildNonConversionData(
            filteredData
        );


    updateKPIs(kpis);

    renderPerformanceChart(
        performance
    );

    renderNonConversionChart(
        nonConversion
    );

    updateInsights(
        filteredData,
        kpis,
        nonConversion
    );

    updateStatus(
        filteredData
    );
}


/* =========================================================
   EVENTS
   ========================================================= */

[
    periodFilter,
    regionFilter,
    teamFilter,
    serviceFilter
].forEach(filter => {

    filter.addEventListener(
        "change",
        updateDashboard
    );

});


resetFilters.addEventListener(
    "click",
    () => {

        periodFilter.value =
            "all";

        regionFilter.value =
            "all";

        teamFilter.value =
            "all";

        serviceFilter.value =
            "all";

        updateDashboard();
    }
);


/* =========================================================
   INITIAL RENDER
   ========================================================= */

updateDashboard();
