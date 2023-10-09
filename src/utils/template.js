export const heartRateTemplate = {
  resourceType: "Observation",
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs",
        },
      ],
      text: "Vital Signs",
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "8867-4",
        display: "heart_rate",
      },
    ],
    //text: "heart_rate",
  },
  subject: {
    reference: "Patient/smart-935270",
  },
  valueQuantity: {
    unit: "beats/minute",
    system: "http://unitsofmeasure.org",
    code: "/min",
  },
};

export const oxygenSaturationTemplate = {
  resourceType: "Observation",
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs",
        },
      ],
      text: "Vital Signs",
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "2710-2",
        display: "oxygen_saturation",
      },
    ],
  },
  subject: {
    reference: "Patient/smart-935270",
  },
  valueQuantity: {
    unit: "%",
    system: "http://unitsofmeasure.org",
    code: "%",
  },
};

export const bloodPressureTemplate = {
  resourceType: "Observation",
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs",
        },
      ],
      text: "Vital Signs",
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "55284-4",
        display: "Blood pressure",
      },
    ],
  },
  subject: {
    reference: "Patient/smart-935270",
  },
  valueQuantity: {
    value: 120,
    unit: "mmHg",
    system: "http://unitsofmeasure.org",
    code: "mm[Hg]"
  }
};
