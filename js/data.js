/* =========================================================
   OPERATIONS ANALYTICS DASHBOARD
   Synthetic operational dataset
   ========================================================= */

const REGIONS = [
    "South",
    "Southeast",
    "Midwest",
    "Northeast"
];

const TEAMS = [
    "Team Alpha",
    "Team Beta",
    "Team Gamma",
    "Team Delta"
];

const SERVICE_TYPES = [
    "Field Response",
    "Vehicle Recovery",
    "Monitoring Support"
];

const NON_CONVERSION_REASONS = [
    "Network Availability",
    "Customer Decision",
    "Operational Failure",
    "Geographic Restriction",
    "System Issues",
    "Other"
];


/* Deterministic random generator
   Keeps demo data consistent after page refresh
*/

let seed = 20260808;

function random() {

    seed =
        (seed * 9301 + 49297) %
        233280;

    return seed / 233280;
}


function randomItem(array) {

    return array[
        Math.floor(random() * array.length)
    ];
}


/* Weighted non-conversion reason */

function getNonConversionReason() {

    const value = random();

    if (value < 0.34) {
        return "Network Availability";
    }

    if (value < 0.59) {
        return "Customer Decision";
    }

    if (value < 0.77) {
        return "Operational Failure";
    }

    if (value < 0.87) {
        return "Geographic Restriction";
    }

    if (value < 0.94) {
        return "System Issues";
    }

    return "Other";
}


/* Conversion probability */

function getConversionProbability(
    region,
    team,
    service,
    day
) {

    let probability = 0.30;

    if (region === "South") {
        probability += 0.035;
    }

    if (region === "Southeast") {
        probability -= 0.025;
    }

    if (team === "Team Alpha") {
        probability += 0.025;
    }

    if (team === "Team Delta") {
        probability -= 0.015;
    }

    if (service === "Vehicle Recovery") {
        probability += 0.02;
    }

    /* Slight improvement during the month */

    probability += day * 0.0015;

    return Math.min(
        Math.max(probability, 0.18),
        0.48
    );
}


/* Response time */

function generateResponseTime(
    region,
    service
) {

    let response =
        8 + random() * 8;

    if (region === "Southeast") {
        response += 1.5;
    }

    if (region === "Northeast") {
        response += 0.8;
    }

    if (service === "Vehicle Recovery") {
        response += 2;
    }

    return Number(
        response.toFixed(1)
    );
}


/* Generate dataset */

function generateOperations() {

    const operations = [];

    let id = 1001;

    for (
        let day = 1;
        day <= 31;
        day++
    ) {

        const dailyVolume =
            78 +
            Math.floor(random() * 28);

        for (
            let i = 0;
            i < dailyVolume;
            i++
        ) {

            const region =
                randomItem(REGIONS);

            const team =
                randomItem(TEAMS);

            const serviceType =
                randomItem(SERVICE_TYPES);

            const probability =
                getConversionProbability(
                    region,
                    team,
                    serviceType,
                    day
                );

            const converted =
                random() < probability;

            const responseTime =
                generateResponseTime(
                    region,
                    serviceType
                );

            const slaThreshold = 15;

            operations.push({

                id: id++,

                date:
                    `2026-08-${String(day).padStart(2, "0")}`,

                day,

                region,

                team,

                serviceType,

                converted,

                slaMet:
                    responseTime <= slaThreshold,

                responseTime,

                nonConversionReason:
                    converted
                        ? null
                        : getNonConversionReason()

            });
        }
    }

    return operations;
}


const operationsData =
    generateOperations();
