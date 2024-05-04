const q1Aggr = `
MATCH (city)<-[:IN_CITY]-(o:Organisation)-[:EMITS]->(e:Emission)
WITH city.population AS population,
     COALESCE(SUM(e.total_emission), 0) AS totalEmissions
WHERE population IS NOT NULL

WITH collect({population: population, totalEmissions: totalEmissions}) AS data
WITH [d IN data | d.population] AS populations,
     [d IN data | d.totalEmissions] AS emissions

// Compute correlation coefficient
WITH size(populations) AS n,
     REDUCE(s = 0.0, i IN RANGE(0, size(populations)-1) | s + populations[i] * emissions[i]) AS sumXY,
     REDUCE(sx = 0.0, x IN populations | sx + x) AS sumX,
     REDUCE(sy = 0.0, y IN emissions | sy + y) AS sumY,
     REDUCE(sxx = 0.0, x IN populations | sxx + x * x) AS sumXX,
     REDUCE(syy = 0.0, y IN emissions | syy + y * y) AS sumYY
WITH n, sumXY, sumX, sumY, sumXX, sumYY,
     (n * sumXY - sumX * sumY) AS covarianceXY,
     sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)) AS denominator
RETURN covarianceXY / denominator AS correlationCoefficient
`;

const q2Aggr = `
MATCH (o:Organisation)-[:EMITS {year: 2016.0}]-(e: Emission)
WITH AVG(e.total_emission) AS avg2016

MATCH (o:Organisation)-[:EMITS {year: 2017.0}]-(e: Emission)
WITH avg2016, AVG(e.total_emission) AS avg2017

RETURN avg2016, avg2017,
avg2016 - avg2017 AS emissionsChange
`;

const q3Aggr = 
`MATCH (o:Organisation)-[:EMITS {year: 2016.0}]-(e: Emission)
WITH AVG(e.pct_target_reduction) AS avg2016

MATCH (o:Organisation)-[:EMITS {year: 2017.0}]-(e: Emission)
WITH avg2016, AVG(e.pct_target_reduction) AS avg2017

RETURN avg2016, avg2017,
avg2017 - avg2016 AS pctTargetReductionChange
`;

const q4Aggr = `
MATCH (e:Emission)-[:EMITS]-(:Organisation)-[:IN_CITY]->(city:City)
WHERE city.c40 IS NOT NULL
WITH city, AVG(e.pct_target_reduction) AS avg
WHERE city.c40 = true
RETURN 'C40 member' AS organization, AVG(avg) AS avgPctTargetReduction

UNION

MATCH (e:Emission)-[:EMITS]-(:Organisation)-[:IN_CITY]->(city:City)
WHERE city.c40 = false OR city.c40 IS NULL
WITH city, AVG(e.pct_target_reduction) AS avg
RETURN 'Not C40 member' AS organization, AVG(avg) AS avgPctTargetReduction

UNION

MATCH (e:Emission)-[:EMITS]-(:Organisation)-[:IN_CITY]->(city:City)
WHERE city.gcom IS NOT NULL
WITH city, AVG(e.pct_target_reduction) AS avg
WHERE city.gcom = true
RETURN 'GCoM member' AS organization, AVG(avg) AS avgPctTargetReduction

UNION

MATCH (e:Emission)-[:EMITS]-(:Organisation)-[:IN_CITY]->(city:City)
WHERE city.gcom IS NULL OR city.gcom = false
WITH city, AVG(e.pct_target_reduction) AS avg
RETURN 'Not GCoM member' AS organization, AVG(avg) AS avgPctTargetReduction
`;

const q5Aggr = `
MATCH (e:Emission)-[:EMITS]-(:Organisation)-[:IN_CITY]->(:City)-[:IN_COUNTRY]->(:Country)-[:IN_REGION]->(region:Region)
WITH region, SUM(e.total_emission) AS totalEmissions, AVG(e.pct_target_reduction) AS avgPctTargetReduction
RETURN region.name AS regionName, totalEmissions, avgPctTargetReduction
`;

const q6Aggr = `
MATCH (e:Emission)-[:EMITS]-(o:Organisation)
WHERE e.pct_target_reduction IS NOT NULL
WITH o.name AS orgName, MAX(e.pct_target_reduction) AS maxReductionPct
RETURN orgName, maxReductionPct
ORDER BY maxReductionPct DESC
LIMIT 1
`;

const q7Aggr = `
MATCH (city:City)-[:IN_COUNTRY]->(country:Country)
RETURN country.name AS countryName, count(city) AS numberOfCities
ORDER BY countryName
`;

const q8Aggr = `
MATCH (c:Country)
RETURN count(c) AS numberOfCountriesInData
`;

const q9Aggr = `
MATCH (o:Organisation)-[:EMITS]->(e:Emission)
WHERE e.pct_target_reduction IS NOT NULL AND e.total_emission IS NULL
RETURN count(DISTINCT o) AS orgsWithPctTargetButNoBaseline
`;

const q10Aggr = `
MATCH (o:Organisation)
WHERE o.sector IS NOT NULL
WITH o.sector AS sector, count(o) AS sectorCount
ORDER BY sectorCount DESC
LIMIT 1
RETURN sector AS mostCommonSector, sectorCount AS countOfOrganisations
`;

module.exports = {q1Aggr, q2Aggr, q3Aggr, q4Aggr,
    q5Aggr, q6Aggr, q7Aggr, q8Aggr, q9Aggr, q10Aggr};