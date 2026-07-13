import type { DatasetRecord, TermEntry } from '../types/dataset'
import { LOL_TERMS } from './lolColumns'

export const archiveData: { datasets: DatasetRecord[]; terms: TermEntry[] } = {
  datasets: [
  {
    "id": "apd-2025",
    "name": "Arabic Phishing Dataset (Himdi & Alhayan 2025)",
    "description": "Arabic Phishing Dataset (Himdi & Alhayan 2025). Topic: email phishing. Deception type: fabrication. Design/source: Online quasi-experiment.",
    "yearRange": "2025-2025",
    "tags": [
      "email phishing",
      "fabrication",
      "Typed",
      "Arabic"
    ],
    "metadata": {
      "language": "Arabic",
      "statementCount": 1000,
      "groundTruth": "Directly inferred",
      "topic": "email phishing",
      "sourceAndResearchDesign": "Online quasi-experiment",
      "experimentalDesign": "Online quasi-experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "No",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/APD_2025_id.csv",
      "key": "R9A2BBWP"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "atsface-2023",
    "name": "ATSFace (Hsiao, Shun Wen; Sun, Cheng Yuan, 2023)",
    "description": "ATSFace (Hsiao, Shun Wen; Sun, Cheng Yuan, 2023). Topic: major, club experiences, interships, travel experiences, personal hobbies. Deception type: fabrication. Design/source: Offline experiments.",
    "yearRange": "2023-2023",
    "tags": [
      "major",
      "club experiences",
      "interships",
      "travel experiences",
      "personal hobbies"
    ],
    "metadata": {
      "language": "Chinese",
      "statementCount": 309,
      "groundTruth": "Clear but not verifiable",
      "topic": "major, club experiences, interships, travel experiences, personal hobbies",
      "sourceAndResearchDesign": "Offline experiments",
      "experimentalDesign": "Offline experiments",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "No",
      "openSource": "Yes",
      "truthfulDeceptiveProportion": "1.1",
      "format": "Transcribed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/ATSFACE_2023_id.csv",
      "key": "K35DSXH5"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "blc-2019",
    "name": "Box of Lies corpus (Soldner et al., 2019)",
    "description": "Box of Lies corpus (Soldner et al., 2019). Topic: Object description. Deception type: Fabrication. Design/source: Offline naturalistic.",
    "yearRange": "2019-2019",
    "tags": [
      "Object description",
      "Fabrication",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 501,
      "groundTruth": "Clear and verifiable",
      "topic": "Object description",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Between/Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.015277777777777777",
      "format": "Transcribed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/BLC_2019_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "blt-c-2016",
    "name": "Boulder Lies and Truth corpus (Salvetti et al., 2016)",
    "description": "Boulder Lies and Truth corpus (Salvetti et al., 2016). Topic: Reviews. Deception type: Fabrication and embedded lies. Design/source: Offline naturalistic.",
    "yearRange": "2016-2016",
    "tags": [
      "Reviews",
      "Fabrication",
      "embedded lies",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 1492,
      "groundTruth": "Clear and verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Within/Between subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.029861111111111113",
      "format": "Typed",
      "typeOfDeception": "Fabrication and embedded lies",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/BLT_C_2016_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "bluff-2020",
    "name": "Bluff the Listener (BLUFF; Skalicky et al., 2020)",
    "description": "Bluff the Listener (BLUFF; Skalicky et al., 2020). Topic: Radio game broadcast. Deception type: Fabrication. Design/source: Offline naturalistic.",
    "yearRange": "2020-2020",
    "tags": [
      "Radio game broadcast",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 753,
      "groundTruth": "Clear and verifiable",
      "topic": "Radio game broadcast",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.5",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/BLUFF_2020_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "ccd-2014",
    "name": "Cross-cultural deception (Pérez-Rosas & Mihalcea, 2014)",
    "description": "Cross-cultural deception (Pérez-Rosas & Mihalcea, 2014). Topic: Personal opinions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2014-2014",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Typed",
      "American, English, Indian,Spanish"
    ],
    "metadata": {
      "language": "American, English, Indian,Spanish",
      "statementCount": 1550,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/CCD_2014_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "csc-2005",
    "name": "Columbia-SRI-Colorado (CSC) Deceptive Speech dataset (Hirschberg et al., 2005)",
    "description": "Columbia-SRI-Colorado (CSC) Deceptive Speech dataset (Hirschberg et al., 2005). Topic: Interview on task performance. Deception type: Exaggeration, minimization. Design/source: Offline experiment.",
    "yearRange": "2005-2005",
    "tags": [
      "Interview on task performance",
      "Exaggeration",
      "minimization",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 32,
      "groundTruth": "Clear and verifiable",
      "topic": "Interview on task performance",
      "sourceAndResearchDesign": "Offline experiment",
      "experimentalDesign": "Offline experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.5",
      "format": "Transcribed",
      "typeOfDeception": "Exaggeration, minimization",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/CSC_2005_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "csi-2014",
    "name": "CliPS stylometry investigation coprus (Verhoeven & Daelemans, 2014)",
    "description": "CliPS stylometry investigation coprus (Verhoeven & Daelemans, 2014). Topic: Reviews. Deception type: Fabrication. Design/source: Offline naturalistic.",
    "yearRange": "2014-2014",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "Dutch"
    ],
    "metadata": {
      "language": "Dutch",
      "statementCount": 1298,
      "groundTruth": "Clear but not verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/CSI_2014_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "decop-en-2020",
    "name": "DeCop (Capuozzo et al., 2020)",
    "description": "DeCop (Capuozzo et al., 2020). Topic: Personal opinions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2020-2020",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 2500,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DECOP_EN_2020_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "decop-it-2020",
    "name": "DeCop (Capuozzo et al., 2020)",
    "description": "DeCop (Capuozzo et al., 2020). Topic: Personal opinions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2020-2020",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Typed",
      "Italian"
    ],
    "metadata": {
      "language": "Italian",
      "statementCount": 2500,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DECOP_IT_2020_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "decour-2012",
    "name": "DECOUR - DEception in COURT (Fornaciari and Poesio; 2012)",
    "description": "DECOUR - DEception in COURT (Fornaciari and Poesio; 2012). Topic: Trial hearings. Deception type: mixed. Design/source: Offline naturalistic.",
    "yearRange": "2012-2012",
    "tags": [
      "Trial hearings",
      "mixed",
      "Transcribed",
      "Italian"
    ],
    "metadata": {
      "language": "Italian",
      "statementCount": 3015,
      "groundTruth": "Directly inferred",
      "topic": "Trial hearings",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.06041666666666667",
      "format": "Transcribed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DECOUR_2012_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "defabel-2024",
    "name": "DeFaBel (Velutharambath, Wuhrl & Klinger, 2024)",
    "description": "DeFaBel (Velutharambath, Wuhrl & Klinger, 2024). Topic: Personal opinions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2024-2024",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Typed",
      "German"
    ],
    "metadata": {
      "language": "German",
      "statementCount": 1031,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.04236111111111111",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DEFABEL_2024_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "defabel-2025",
    "name": "DEFABEL datasets ( Velutharambath et al. 2025)",
    "description": "DEFABEL datasets ( Velutharambath et al. 2025). Topic: belief. Deception type: fabrication. Design/source: Online experiments.",
    "yearRange": "2025-2025",
    "tags": [
      "belief",
      "fabrication",
      "Typed",
      "English/ German"
    ],
    "metadata": {
      "language": "English/ German",
      "statementCount": 828,
      "groundTruth": "Clear and verifiable",
      "topic": "belief",
      "sourceAndResearchDesign": "Online experiments",
      "experimentalDesign": "Online experiments",
      "withinOrBetweenDesign": "Between subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.57",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DEFABEL_2025_id.csv",
      "key": "C7TRR6Q4"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "derev-2014",
    "name": "Deception in Reviews (DeRev; Fornaciari & Poesio, 2014)",
    "description": "Deception in Reviews (DeRev; Fornaciari & Poesio, 2014). Topic: Reviews. Deception type: Fabrication. Design/source: Online naturalistic.",
    "yearRange": "2014-2014",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 236,
      "groundTruth": "Directly inferred",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online naturalistic",
      "experimentalDesign": "Online naturalistic",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DEREV_2014_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "derev-2020",
    "name": "Deception in Reviews (DeRev; Fornaciari & Poesio, 2020)",
    "description": "Deception in Reviews (DeRev; Fornaciari & Poesio, 2020). Topic: Reviews. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2020-2020",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 1552,
      "groundTruth": "Clear but not verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DEREV_2020_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "difraud-2024",
    "name": "DIFrauD Dataset (Boumber et al., 2024)",
    "description": "DIFrauD Dataset (Boumber et al., 2024). Topic: job scam. Deception type: fabrication. Design/source: Online naturalistic data.",
    "yearRange": "2024-2024",
    "tags": [
      "job scam",
      "fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 14295,
      "groundTruth": "Directly inferred",
      "topic": "job scam",
      "sourceAndResearchDesign": "Online naturalistic data",
      "experimentalDesign": "Online naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "22.8",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/DIFRAUD_2024_id.csv",
      "key": "WLE8BI6N"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "hip-2022",
    "name": "Hippocorpus (Sap et al., 2022)",
    "description": "Hippocorpus (Sap et al., 2022). Topic: Past memorable experiences. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2022-2022",
    "tags": [
      "Past memorable experiences",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 6854,
      "groundTruth": "Clear but not verifiable",
      "topic": "Past memorable experiences",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Between/ Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/HIP_2022_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "int-2021",
    "name": "Intentions dataset (Kleinberg & Verschuere 2021)",
    "description": "Intentions dataset (Kleinberg & Verschuere 2021). Topic: Future intentions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2021-2021",
    "tags": [
      "Future intentions",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 1640,
      "groundTruth": "Clear but not verifiable",
      "topic": "Future intentions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.06319444444444444",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/INT_2021_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "legaleye-2025",
    "name": "LegalEye (Baldivas et al. 2025)",
    "description": "LegalEye (Baldivas et al. 2025). Topic: trial hearings. Deception type: mixed. Design/source: Offline naturalistic data.",
    "yearRange": "2025-2025",
    "tags": [
      "trial hearings",
      "mixed",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 255,
      "groundTruth": "Directly inferred",
      "topic": "trial hearings",
      "sourceAndResearchDesign": "Offline naturalistic data",
      "experimentalDesign": "Offline naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "1.04",
      "format": "Transcribed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/LEGALEYE_2025_id.csv",
      "key": "RLK2XH77"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "li-2014",
    "name": "Li et al., (2014)",
    "description": "Li et al., (2014). Topic: Reviews. Deception type: Fabrication. Design/source: Online quasi - experiment.",
    "yearRange": "2014-2014",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 3032,
      "groundTruth": "Clear but not verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online quasi - experiment",
      "experimentalDesign": "Online quasi - experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.03194444444444444",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/LI_2014_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "loconte-2025",
    "name": "Loconte & Kleinberg (2025)",
    "description": "Loconte & Kleinberg (2025). Topic: autobiographical events. Deception type: embedded lies. Design/source: Online experiments.",
    "yearRange": "2025-2025",
    "tags": [
      "autobiographical events",
      "embedded lies",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 2084,
      "groundTruth": "Clear but not verifiable",
      "topic": "autobiographical events",
      "sourceAndResearchDesign": "Online experiments",
      "experimentalDesign": "Online experiments",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "embedded lies",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/LOCONTE_2025_id.csv",
      "key": "EZVPN8UJ"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "mafiagame-2022",
    "name": "Mafia Game Dataset (Ibraheem et al., 2022)",
    "description": "Mafia Game Dataset (Ibraheem et al., 2022). Topic: Mafia game. Deception type: Mixed. Design/source: Online experiment.",
    "yearRange": "2022-2022",
    "tags": [
      "Mafia game",
      "Mixed",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 2162,
      "groundTruth": "Clear and verifiable",
      "topic": "Mafia game",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.09791666666666667",
      "format": "Typed",
      "typeOfDeception": "Mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MAFIA/Copia di MAFIAGAME_2022_clean.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "mafiascum-2019",
    "name": "Mafiascum dataset (de Ruiter & Kachergis, 2019)",
    "description": "Mafiascum dataset (de Ruiter & Kachergis, 2019). Topic: Mafia game. Deception type: Mixed. Design/source: Online naturalistic.",
    "yearRange": "2019-2019",
    "tags": [
      "Mafia game",
      "Mixed",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 10,
      "groundTruth": "Clear and verifiable",
      "topic": "Mafia game",
      "sourceAndResearchDesign": "Online naturalistic",
      "experimentalDesign": "Online naturalistic",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "____",
      "format": "Typed",
      "typeOfDeception": "Mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MAFIA/Copia di MAFIASCUM_2019_clean.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "spyridis-2024",
    "name": "Spyridis et al. (2024)",
    "description": "Spyridis et al. (2024). Topic: police interviews. Deception type: fabrication. Design/source: Offline experiments.",
    "yearRange": "2024-2024",
    "tags": [
      "police interviews",
      "fabrication",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 687,
      "groundTruth": "Clear but not verifiable",
      "topic": "police interviews",
      "sourceAndResearchDesign": "Offline experiments",
      "experimentalDesign": "Offline experiments",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Unclear",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.06875",
      "format": "Transcribed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MAFIA/SPYRIDIS_2024_id.csv",
      "key": "FIFQJHBU"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "meajor-2025",
    "name": "MeAJOR Corpus (Mendes et al., 2025)",
    "description": "MeAJOR Corpus (Mendes et al., 2025). Topic: Email spam. Deception type: fabrication. Design/source: Mixed.",
    "yearRange": "2025-2025",
    "tags": [
      "Email spam",
      "fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 135894,
      "groundTruth": "Indirectly inferred",
      "topic": "Email spam",
      "sourceAndResearchDesign": "Mixed",
      "experimentalDesign": "Mixed",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.22430555555555556",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MeAJOR_2025_id.csv",
      "key": "2XWISGLU"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "monaro-2022",
    "name": "Monaro et al., (2022)",
    "description": "Monaro et al., (2022). Topic: Past trip. Deception type: Fabrication. Design/source: Offline experiment.",
    "yearRange": "2022-2022",
    "tags": [
      "Past trip",
      "Fabrication",
      "Transcribed",
      "Italian"
    ],
    "metadata": {
      "language": "Italian",
      "statementCount": 62,
      "groundTruth": "Clear but not verifiable",
      "topic": "Past trip",
      "sourceAndResearchDesign": "Offline experiment",
      "experimentalDesign": "Offline experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Transcribed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MONARO_2022_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "mu3d-2019",
    "name": "Miami University Deception Detection Dataset (MU3D; Lloyd et al., 2019)",
    "description": "Miami University Deception Detection Dataset (MU3D; Lloyd et al., 2019). Topic: Personal opinions. Deception type: Fabrication. Design/source: Offline experiment.",
    "yearRange": "2019-2019",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 320,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Offline experiment",
      "experimentalDesign": "Offline experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Transcribed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/MU3D_2019_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "open-2015",
    "name": "Open Domain Dataset (Pérez-Rosas & Mihalcea, 2015)",
    "description": "Open Domain Dataset (Pérez-Rosas & Mihalcea, 2015). Topic: Open domain. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2015-2015",
    "tags": [
      "Open domain",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 7168,
      "groundTruth": "Clear but not verifiable",
      "topic": "Open domain",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/OPEN_2015_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "ott-2011",
    "name": "Deceptive Opinion Spam (Ott et al., 2011)",
    "description": "Deceptive Opinion Spam (Ott et al., 2011). Topic: Reviews. Deception type: Fabrication. Design/source: Online quasi - experiment.",
    "yearRange": "2011-2011",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 800,
      "groundTruth": "Clear but not verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online quasi - experiment",
      "experimentalDesign": "Online quasi - experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/OTT_2011_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "ott-2013",
    "name": "Negative Deceptive Opinion Spam (Ott et al., 2013)",
    "description": "Negative Deceptive Opinion Spam (Ott et al., 2013). Topic: Reviews. Deception type: Fabrication. Design/source: Online quasi - experiment.",
    "yearRange": "2013-2013",
    "tags": [
      "Reviews",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 800,
      "groundTruth": "Clear but not verifiable",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online quasi - experiment",
      "experimentalDesign": "Online quasi - experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/OTT_2013_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "patra-2025",
    "name": "Deceptive Phishing Dataset (Patra et al. 2025)",
    "description": "Deceptive Phishing Dataset (Patra et al. 2025). Topic: open domain. Deception type: mixed. Design/source: Mixed.",
    "yearRange": "2025-2025",
    "tags": [
      "open domain",
      "mixed",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 2001,
      "groundTruth": "Indirectly inferred",
      "topic": "open domain",
      "sourceAndResearchDesign": "Mixed",
      "experimentalDesign": "Mixed",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.049305555555555554",
      "format": "Typed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/PATRA_2025_id.csv",
      "key": "7M4FHP4V"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "pops-2017",
    "name": "Paraphrased OPinion Spam (POPS; Seongsoon et al., 2017)",
    "description": "Paraphrased OPinion Spam (POPS; Seongsoon et al., 2017). Topic: fake reviews. Deception type: fabrication. Design/source: Online quasi-experiment.",
    "yearRange": "2017-2017",
    "tags": [
      "fake reviews",
      "fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 800,
      "groundTruth": "Directly inferred",
      "topic": "fake reviews",
      "sourceAndResearchDesign": "Online quasi-experiment",
      "experimentalDesign": "Online quasi-experiment",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/POPS_2017_id.csv",
      "key": "UMT56BI3"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "real-d-2015",
    "name": "Real-life Deception Detection (Pérez-Rosas et al., 2015)",
    "description": "Real-life Deception Detection (Pérez-Rosas et al., 2015). Topic: TV interviews and trials hearings. Deception type: mixed. Design/source: Offline naturalistic data.",
    "yearRange": "2015-2015",
    "tags": [
      "TV interviews",
      "trials hearings",
      "mixed",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 118,
      "groundTruth": "Directly inferred",
      "topic": "TV interviews and trials hearings",
      "sourceAndResearchDesign": "Offline naturalistic data",
      "experimentalDesign": "Offline naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.9",
      "format": "Transcribed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/REAL_D_2015_id.csv",
      "key": "EI6CALWN"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "real-t-2015",
    "name": "Real-life trial dataset (Pérez-Rosas et al., 2015)",
    "description": "Real-life trial dataset (Pérez-Rosas et al., 2015). Topic: Trial hearings. Deception type: Fabrication. Design/source: Offline naturalistic.",
    "yearRange": "2015-2015",
    "tags": [
      "Trial hearings",
      "Fabrication",
      "Transcribed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 121,
      "groundTruth": "Directly inferred",
      "topic": "Trial hearings",
      "sourceAndResearchDesign": "Offline naturalistic",
      "experimentalDesign": "Offline naturalistic",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "0.06805555555555555",
      "format": "Transcribed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/REAL_T_2015_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "ru-frdc-2022",
    "name": "Roman Urdu Fake Review Detection (RU-FRDC; Hayat et al., 2022)",
    "description": "Roman Urdu Fake Review Detection (RU-FRDC; Hayat et al., 2022). Topic: Reviews. Deception type: mixed. Design/source: Online naturalistic data.",
    "yearRange": "2022-2022",
    "tags": [
      "Reviews",
      "mixed",
      "Typed",
      "Roman Urdo"
    ],
    "metadata": {
      "language": "Roman Urdo",
      "statementCount": 4950,
      "groundTruth": "Directly inferred",
      "topic": "Reviews",
      "sourceAndResearchDesign": "Online naturalistic data",
      "experimentalDesign": "Online naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "0.12708333333333333",
      "format": "Typed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/RU_FRDC_2022_id.csv",
      "key": "NABXLWWK"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "sarzynska-2023",
    "name": "Sarzynska-Wawer et al., (2023)",
    "description": "Sarzynska-Wawer et al., (2023). Topic: personal opinions. Deception type: fabrication. Design/source: Online experiments.",
    "yearRange": "2023-2023",
    "tags": [
      "personal opinions",
      "fabrication",
      "Transcribed",
      "Typed",
      "Polish"
    ],
    "metadata": {
      "language": "Polish",
      "statementCount": 1497,
      "groundTruth": "Clear but not verifiable",
      "topic": "personal opinions",
      "sourceAndResearchDesign": "Online experiments",
      "experimentalDesign": "Online experiments",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "#DIV/0!",
      "format": "Transcribed / Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/SARZYNSKA_2023_id.csv",
      "key": "Y5GIK2PG"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "sbu-2020",
    "name": "Stony Brook University (SBU) deception dataset (Banerjee et al., 2020)",
    "description": "Stony Brook University (SBU) deception dataset (Banerjee et al., 2020). Topic: Personal opinions. Deception type: Fabrication. Design/source: Online experiment.",
    "yearRange": "2020-2020",
    "tags": [
      "Personal opinions",
      "Fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 2600,
      "groundTruth": "Clear but not verifiable",
      "topic": "Personal opinions",
      "sourceAndResearchDesign": "Online experiment",
      "experimentalDesign": "Online experiment",
      "withinOrBetweenDesign": "Within subject",
      "reuse": "Yes",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "Fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/SBU_2020_id.csv"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "sharma-2025",
    "name": "Spam Assassin Dataset (Sharma et al., 2025)",
    "description": "Spam Assassin Dataset (Sharma et al., 2025). Topic: Email spam. Deception type: fabrication. Design/source: Online naturalistic data.",
    "yearRange": "2025-2025",
    "tags": [
      "Email spam",
      "fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 5809,
      "groundTruth": "Indirectly inferred",
      "topic": "Email spam",
      "sourceAndResearchDesign": "Online naturalistic data",
      "experimentalDesign": "Online naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "documentedInAcademicOutlet": "Yes",
      "truthfulDeceptiveProportion": "2.38",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/SHARMA_2025_id.csv",
      "key": "RDK524WM"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "soldner-2022",
    "name": "Soldner, F., Kleinberg, B., & Johnson, S. D. (2022)",
    "description": "Soldner, F., Kleinberg, B., & Johnson, S. D. (2022). Topic: fake reviews - smartphones. Deception type: fabrication. Design/source: Online experiments.",
    "yearRange": "2022-2022",
    "tags": [
      "fake reviews - smartphones",
      "fabrication",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 686,
      "groundTruth": "Clear but not verifiable",
      "topic": "fake reviews - smartphones",
      "sourceAndResearchDesign": "Online experiments",
      "experimentalDesign": "Online experiments",
      "withinOrBetweenDesign": "Between subject",
      "reuse": "No",
      "openSource": "Yes",
      "documentedInAcademicOutlet": "Yes, same paper",
      "truthfulDeceptiveProportion": "1.27",
      "format": "Typed",
      "typeOfDeception": "fabrication",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/SOLDNER_2022_id.csv",
      "key": "ET9L96GP"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  },
  {
    "id": "trec-2005",
    "name": "TREC dataset (Cormack & Lynam, 2005)",
    "description": "TREC dataset (Cormack & Lynam, 2005). Topic: phishing emails. Deception type: mixed. Design/source: Online naturalistic data.",
    "yearRange": "2005-2005",
    "tags": [
      "phishing emails",
      "mixed",
      "Typed",
      "English"
    ],
    "metadata": {
      "language": "English",
      "statementCount": 5000,
      "groundTruth": "Directly inferred",
      "topic": "phishing emails",
      "sourceAndResearchDesign": "Online naturalistic data",
      "experimentalDesign": "Online naturalistic data",
      "withinOrBetweenDesign": "Between-subject",
      "reuse": "Yes",
      "documentedInAcademicOutlet": "Unclear",
      "truthfulDeceptiveProportion": "1.0",
      "format": "Typed",
      "typeOfDeception": "mixed",
      "datasetAvailable": "Yes",
      "note": "Source file: LOL/Dataset_id/TREC_2005_id.csv",
      "key": "CJ9W6U2L"
    },
    "originalSource": {
      "label": "Yes",
      "url": "#"
    }
  }
],
  terms: LOL_TERMS,
}
