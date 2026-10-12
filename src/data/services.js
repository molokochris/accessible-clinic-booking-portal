export const DAY_OPTIONS = [
  { value: '2026-10-15', label: 'Thursday 15 October' },
  { value: '2026-10-16', label: 'Friday 16 October' },
]

export const URGENCY_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'same-day', label: 'Same-day triage' },
]

export const TYPE_OPTIONS = [
  { value: 'gp', label: 'General practice' },
  { value: 'nursing', label: 'Nursing & wound care' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'chronic', label: 'Chronic condition care' },
  { value: 'mental', label: 'Mental health' },
  { value: 'child', label: 'Child & family health' },
]

export const SERVICES = [
  {
    id: 'standard-gp-consultation',
    title: 'Standard GP Consultation',
    practitioner: 'Dr. Sarah Jenkins',
    type: 'gp',
    urgency: 'routine',
    day: '2026-10-15',
    time: '09:30',
    duration: '15 minutes',
    room: 'Consulting Room 2B, Ground Floor',
    description:
      'Standard 15-minute diagnostic appointment for routine healthcare and advice.',
  },
  {
    id: 'urgent-same-day-triage',
    title: 'Urgent Same-Day Clinical Triage',
    practitioner: 'Duty Clinical Officer',
    type: 'gp',
    urgency: 'same-day',
    day: '2026-10-15',
    time: '11:15',
    duration: '20 minutes',
    room: 'Triage Bay 1',
    description:
      'Immediate assessment for acute non-emergency symptoms requiring rapid medical determination.',
  },
  {
    id: 'gp-medication-review',
    title: 'GP Medication Review',
    practitioner: 'Dr. Sarah Jenkins',
    type: 'gp',
    urgency: 'routine',
    day: '2026-10-15',
    time: '14:00',
    duration: '20 minutes',
    room: 'Consulting Room 2B',
    description:
      'Structured consultation to review recurring prescriptions, dosage adjustments, and treatment tolerance.',
  },
  {
    id: 'chronic-disease-follow-up',
    title: 'Chronic Disease Follow-up',
    practitioner: 'Specialist Practice Nurse',
    type: 'chronic',
    urgency: 'routine',
    day: '2026-10-15',
    time: '15:30',
    duration: '30 minutes',
    room: 'Room 4',
    description:
      'Ongoing clinical monitoring, vitals check, and care plan development for managed conditions.',
  },
  {
    id: 'wound-care-and-dressings',
    title: 'Wound Care and Dressings',
    practitioner: 'Nurse Naledi Maake',
    type: 'nursing',
    urgency: 'same-day',
    day: '2026-10-15',
    time: '10:15',
    duration: '20 minutes',
    room: 'Treatment Room B',
    description:
      'Post-operative wound dressing, catheter changes, and assessment of new or worsening wounds.',
  },
  {
    id: 'injections-and-vaccinations',
    title: 'Injections and Vaccinations',
    practitioner: 'Nurse Naledi Maake',
    type: 'nursing',
    urgency: 'routine',
    day: '2026-10-16',
    time: '08:45',
    duration: '15 minutes',
    room: 'Treatment Room A',
    description:
      'Scheduled injections, travel vaccinations, and routine immunisation updates.',
  },
  {
    id: 'repeat-prescription-review',
    title: 'Repeat Prescription Review',
    practitioner: 'Pharmacist Pieter Venter',
    type: 'pharmacy',
    urgency: 'routine',
    day: '2026-10-16',
    time: '10:00',
    duration: '15 minutes',
    room: 'Pharmacy Counter',
    description:
      'Review and renewal of repeat medication, with advice on side effects and interactions.',
  },
  {
    id: 'pharmacist-medicine-advice',
    title: 'Pharmacist Medicine Advice',
    practitioner: 'Pharmacist Pieter Venter',
    type: 'pharmacy',
    urgency: 'same-day',
    day: '2026-10-15',
    time: '13:00',
    duration: '15 minutes',
    room: 'Pharmacy Counter',
    description:
      'Same-day advice on over-the-counter medicines and minor ailments.',
  },
  {
    id: 'mental-health-support-session',
    title: 'Mental Health Support Session',
    practitioner: 'Counsellor Lerato Sebola',
    type: 'mental',
    urgency: 'routine',
    day: '2026-10-16',
    time: '11:30',
    duration: '45 minutes',
    room: 'Quiet Room 1',
    description:
      'Confidential session with a wellbeing practitioner, including counselling referrals.',
  },
  {
    id: 'child-and-family-health-review',
    title: 'Child and Family Health Review',
    practitioner: 'Nurse Practitioner Anele Dlamini',
    type: 'child',
    urgency: 'routine',
    day: '2026-10-16',
    time: '09:15',
    duration: '30 minutes',
    room: 'Family Clinic',
    description:
      'Childhood immunisations, growth checks, and developmental milestone reviews.',
  },
  {
    id: 'blood-pressure-and-diabetes-check',
    title: 'Blood Pressure and Diabetes Check',
    practitioner: 'Specialist Practice Nurse',
    type: 'chronic',
    urgency: 'routine',
    day: '2026-10-16',
    time: '14:15',
    duration: '20 minutes',
    room: 'Room 4',
    description:
      'Routine monitoring for hypertension and type 2 diabetes, with medication and lifestyle advice.',
  },
  {
    id: 'asthma-review',
    title: 'Asthma Review',
    practitioner: 'Dr. Aisha Patel',
    type: 'chronic',
    urgency: 'routine',
    day: '2026-10-16',
    time: '15:00',
    duration: '20 minutes',
    room: 'Consulting Room 3',
    description:
      'Annual asthma review including inhaler technique and a written action plan.',
  },
]

export function getService(id) {
  return SERVICES.find((service) => service.id === id)
}

export function dayLabel(value) {
  return DAY_OPTIONS.find((day) => day.value === value)?.label ?? value
}

export function typeLabel(value) {
  return TYPE_OPTIONS.find((type) => type.value === value)?.label ?? value
}

/**
 * An empty list in a group means "do not filter on this group".
 * Results are sorted by day, then by time.
 */
export function filterServices(services, { q = '', urgency = [], type = [], day = [] }) {
  const needle = q.trim().toLowerCase()

  return services
    .filter((service) => {
      if (urgency.length && !urgency.includes(service.urgency)) return false
      if (type.length && !type.includes(service.type)) return false
      if (day.length && !day.includes(service.day)) return false
      if (!needle) return true
      const haystack = [
        service.title,
        service.practitioner,
        service.description,
        typeLabel(service.type),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
    .sort((a, b) => `${a.day} ${a.time}`.localeCompare(`${b.day} ${b.time}`))
}
