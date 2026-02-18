import { MPProfile, GlobalStats } from "../types";

// Enhanced Static data based on 2024 General Election analysis
const STATIC_STATS: GlobalStats = {
  parties: [
    { partyName: "Conservative", privateSchoolPercent: 46, oxbridgePercent: 38, avgPoshScore: 82, color: "#0087DC" },
    { partyName: "Labour", privateSchoolPercent: 17, oxbridgePercent: 20, avgPoshScore: 42, color: "#E4003B" },
    { partyName: "Lib Dem", privateSchoolPercent: 28, oxbridgePercent: 26, avgPoshScore: 64, color: "#FAA61A" },
    { partyName: "Reform UK", privateSchoolPercent: 25, oxbridgePercent: 10, avgPoshScore: 58, color: "#12B6CF" },
    { partyName: "Green", privateSchoolPercent: 14, oxbridgePercent: 18, avgPoshScore: 48, color: "#02A95B" }
  ],
  regions: [
    { id: "london", name: "London", avgPoshScore: 75, privateSchoolPercent: 30, notableConstituency: "Kensington" },
    { id: "se", name: "South East", avgPoshScore: 80, privateSchoolPercent: 35, notableConstituency: "Henley" },
    { id: "sw", name: "South West", avgPoshScore: 65, privateSchoolPercent: 25, notableConstituency: "North East Somerset" },
    { id: "midlands", name: "Midlands", avgPoshScore: 55, privateSchoolPercent: 15, notableConstituency: "Birmingham Ladywood" },
    { id: "east", name: "East of England", avgPoshScore: 68, privateSchoolPercent: 22, notableConstituency: "South West Norfolk" },
    { id: "north", name: "The North", avgPoshScore: 45, privateSchoolPercent: 10, notableConstituency: "Richmond (Yorks)" },
    { id: "scotland", name: "Scotland", avgPoshScore: 50, privateSchoolPercent: 18, notableConstituency: "Edinburgh South" },
    { id: "wales", name: "Wales", avgPoshScore: 40, privateSchoolPercent: 8, notableConstituency: "Monmouth" },
    { id: "ni", name: "Northern Ireland", avgPoshScore: 45, privateSchoolPercent: 12, notableConstituency: "North Down" }
  ],
  totalPrivateSchool: 23,
  totalOxbridge: 19,
  summary: "Following the 2024 General Election, the House of Commons is less privately educated than at any point in history. However, a significant class divide remains, with Conservatives still disproportionately drawn from fee-paying schools compared to the Labour intake.",
  notableMPs: [
    {
      name: "Rishi Sunak",
      party: "Conservative",
      constituency: "Richmond and Northallerton",
      education: {
        secondary: "Winchester College",
        university: "Lincoln College, Oxford",
        schoolType: "Private"
      },
      previousJobs: ["Goldman Sachs Analyst", "Hedge Fund Partner"],
      poshScore: 94,
      poshAnalysis: "Head Boy at Winchester College, Oxford PPE, Goldman Sachs, and married to a billionaire heiress. He's so establishment he probably dreams in Latin.",
      netWorthEstimate: "£650 Million (Household)"
    },
    {
      name: "Nigel Farage",
      party: "Reform UK",
      constituency: "Clacton",
      education: {
        secondary: "Dulwich College",
        university: "N/A",
        schoolType: "Private"
      },
      previousJobs: ["Commodities Trader"],
      poshScore: 85,
      poshAnalysis: "A Dulwich College alumnus and former commodities trader who somehow convinced the nation he's just an ordinary bloke down the pub. A masterclass in 'Posh Populism'.",
      netWorthEstimate: "£3 Million"
    },
    {
      name: "Keir Starmer",
      party: "Labour",
      constituency: "Holborn and St Pancras",
      education: {
        secondary: "Reigate Grammar School",
        university: "University of Leeds, Oxford",
        schoolType: "Grammar"
      },
      previousJobs: ["Human Rights Lawyer", "Director of Public Prosecutions"],
      poshScore: 68,
      poshAnalysis: "Attended a selective grammar school followed by Leeds and Oxford. He's a Knight of the Realm and former DPP—certainly posh, but in a very 'high-achieving lawyer' kind of way.",
      netWorthEstimate: "£3 Million"
    },
    {
      name: "Angela Rayner",
      party: "Labour",
      constituency: "Ashton-under-Lyne",
      education: {
        secondary: "Avondale School (State)",
        university: "N/A",
        schoolType: "State"
      },
      previousJobs: ["Care Worker", "Trade Union Representative"],
      poshScore: 10,
      poshAnalysis: "Left school at 16 while pregnant, with no qualifications. She's worked her way up through the trade unions. The absolute antithesis of the Eton-to-Oxbridge pipeline.",
      netWorthEstimate: "MP Salary"
    },
    {
      name: "Ed Davey",
      party: "Lib Dem",
      constituency: "Kingston and Surbiton",
      education: {
        secondary: "Nottingham High School",
        university: "Jesus College, Oxford",
        schoolType: "Private"
      },
      previousJobs: ["Management Consultant"],
      poshScore: 72,
      poshAnalysis: "Private school, Oxford, and management consultancy. It's a classic, understated poshness that doesn't shout, but definitely attended all the right garden parties.",
      netWorthEstimate: "£1.5 Million"
    },
    {
      name: "Victoria Atkins",
      party: "Conservative",
      constituency: "Louth and Horncastle",
      education: {
        secondary: "Arnold School",
        university: "Corpus Christi College, Cambridge",
        schoolType: "Private"
      },
      previousJobs: ["Criminal Barrister"],
      poshScore: 88,
      poshAnalysis: "The daughter of a Knight (Sir Robert Atkins), private school, Cambridge, and a career as a high-flying barrister. Quintessentially Blue-blooded.",
      netWorthEstimate: "Significant"
    },
    {
      name: "Lee Anderson",
      party: "Reform UK",
      constituency: "Ashfield",
      education: {
        secondary: "Ashfield School (State)",
        university: "N/A",
        schoolType: "State"
      },
      previousJobs: ["Coal Miner"],
      poshScore: 15,
      poshAnalysis: "A coal miner's son who worked in the pits himself. His score is bolstered slightly by his MP salary, but his roots are as deep-set working class as it gets.",
      netWorthEstimate: "MP Salary"
    }
  ]
};

export const analyzeMP = async (input: string, _isLocation: boolean = false): Promise<MPProfile> => {
  // Client-side search for the hardcoded MPs
  const normalizedInput = input.toLowerCase().trim();

  const match = STATIC_STATS.notableMPs.find(mp =>
    mp.name.toLowerCase().includes(normalizedInput) ||
    normalizedInput.includes(mp.name.toLowerCase()) ||
    mp.constituency.toLowerCase().includes(normalizedInput)
  );

  if (match) {
    return Promise.resolve(match as MPProfile);
  }

  // Fallback "Generic" profile if no match is found
  return Promise.resolve({
    name: input,
    party: "Unknown",
    constituency: "Unknown",
    education: {
      secondary: "Unknown School",
      university: "Unknown University",
      schoolType: "Unknown"
    },
    previousJobs: ["Unknown"],
    poshScore: 50,
    poshAnalysis: "We couldn't find this specific MP in our hardcoded archives! They are currently maintaining a mysterious level of poshness of exactly 50.",
    netWorthEstimate: "Unknown"
  } as MPProfile);
};

export const getGeneralStats = async (): Promise<GlobalStats> => {
  return Promise.resolve(STATIC_STATS);
};