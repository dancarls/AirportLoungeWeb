/**
 * LoungePlaceholder — renders an operator-aware visual when a lounge has no
 * uploaded photo yet. The goal is for missing photos to look intentional, not
 * unfinished: each major operator gets its own gradient and glyph so the card
 * still communicates *what kind of lounge it is* at a glance.
 *
 * Detection is name-based (lounges live in Supabase by name + slug). Adding a
 * new operator = adding one entry to OPERATORS below.
 */

interface OperatorStyle {
  match:    RegExp
  /** Tailwind gradient classes for the background. */
  bgClass:  string
  /** Material Symbols icon name (filled style). */
  icon:     string
  /** Short text shown small at the bottom — operator wordmark substitute. */
  label:    string
  /** Optional accent colour for the icon ring (hex). */
  accent?:  string
}

const OPERATORS: OperatorStyle[] = [
  {
    match: /signature\s*(suite|lounge)/i,
    bgClass: 'from-[#0F1A24] via-[#1F2937] to-[#3A2A14]',
    icon: 'stars',
    label: 'Signature Suite',
    accent: '#C9A96E',
  },
  {
    match: /(petit[\s-]?caf[eé]|caf[eé])/i,
    bgClass: 'from-[#3B2218] via-[#5C3520] to-[#A77B5D]',
    icon: 'local_cafe',
    label: 'Air Canada Café',
    accent: '#E8C9A4',
  },
  {
    match: /maple\s*leaf\s*(lounge|club)/i,
    bgClass: 'from-[#7A0E0E] via-[#A21B1B] to-[#D43030]',
    icon: 'flight_class',
    label: 'Maple Leaf Lounge',
    accent: '#F8D5D5',
  },
  {
    match: /plaza\s*premium.*first/i,
    bgClass: 'from-[#1A0F2E] via-[#3B2563] to-[#8B6F2E]',
    icon: 'auto_awesome',
    label: 'Plaza Premium First',
    accent: '#C9A96E',
  },
  {
    match: /plaza\s*premium/i,
    bgClass: 'from-[#0E1A3A] via-[#1A2B5E] to-[#2D4A8C]',
    icon: 'weekend',
    label: 'Plaza Premium',
    accent: '#A8C5F4',
  },
  {
    match: /aspire/i,
    bgClass: 'from-[#062639] via-[#0C4C72] to-[#1B89AE]',
    icon: 'weekend',
    label: 'Aspire Lounge',
    accent: '#B8E0F0',
  },
  {
    match: /desjardins|odyss[eé]e/i,
    bgClass: 'from-[#0A3D1F] via-[#1A6B3A] to-[#2E9D5C]',
    icon: 'weekend',
    label: 'Desjardins Odyssey',
    accent: '#C9E8D5',
  },
  {
    match: /national\s*bank/i,
    bgClass: 'from-[#1A2B4A] via-[#2A3F6B] to-[#C1281C]',
    icon: 'weekend',
    label: 'National Bank Lounge',
    accent: '#F0E8D5',
  },
  {
    match: /air\s*france|klm|crown\s*lounge/i,
    bgClass: 'from-[#001E50] via-[#002B70] to-[#0050A0]',
    icon: 'flight',
    label: 'Air France · KLM',
    accent: '#D8E4F8',
  },
  {
    match: /admirals\s*club|american\s*airlines/i,
    bgClass: 'from-[#0D2F5C] via-[#1857B0] to-[#C8102E]',
    icon: 'flight',
    label: 'Admirals Club',
    accent: '#E8E8E8',
  },
  {
    match: /cathay/i,
    bgClass: 'from-[#003A24] via-[#0B6E3D] to-[#10A056]',
    icon: 'spa',
    label: 'Cathay Pacific',
    accent: '#C8E8D0',
  },
  {
    match: /sky\s*team|skyteam/i,
    bgClass: 'from-[#0A1F4D] via-[#1B3D8C] to-[#3D6FD8]',
    icon: 'weekend',
    label: 'SkyTeam Lounge',
    accent: '#D8E4F8',
  },
  {
    match: /westjet|elevation/i,
    bgClass: 'from-[#003A4A] via-[#006B85] to-[#1AAAE2]',
    icon: 'weekend',
    label: 'WestJet Elevation',
    accent: '#D8F0F8',
  },
  {
    match: /m\s*club|marriott/i,
    bgClass: 'from-[#1A0A14] via-[#4A0F1F] to-[#A0142F]',
    icon: 'hotel',
    label: 'M Club · Marriott',
    accent: '#F0D8DC',
  },
  {
    match: /quiet\s*space|quiet\s*zone/i,
    bgClass: 'from-[#1F2937] via-[#374151] to-[#6B7280]',
    icon: 'do_not_disturb_on',
    label: 'Quiet Space',
    accent: '#D1D5DB',
  },
  {
    match: /salon/i,
    bgClass: 'from-[#3A1F0A] via-[#7A4015] to-[#C97A2F]',
    icon: 'weekend',
    label: 'Salon Lounge',
    accent: '#F0D8B8',
  },
]

const GENERIC: OperatorStyle = {
  match: /./,
  bgClass: 'from-[#003434] via-[#005050] to-[#1F7676]',
  icon: 'weekend',
  label: 'Airport Lounge',
  accent: '#C9A96E',
}

function pickStyle(name: string): OperatorStyle {
  for (const op of OPERATORS) if (op.match.test(name)) return op
  return GENERIC
}

interface Props {
  name: string
  /** Visual size: 'card' (lounge card thumbnail) | 'hero' (detail page hero). */
  variant?: 'card' | 'hero'
}

export default function LoungePlaceholder({ name, variant = 'card' }: Props) {
  const style = pickStyle(name)
  const iconSize = variant === 'hero' ? '120px' : '56px'

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${style.bgClass} flex flex-col items-center justify-center text-center relative overflow-hidden`}
    >
      {/* Decorative ring around the glyph */}
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width:  variant === 'hero' ? '180px' : '92px',
          height: variant === 'hero' ? '180px' : '92px',
          background: 'rgba(255,255,255,0.08)',
          border: `1.5px solid ${style.accent ?? '#C9A96E'}40`,
          boxShadow: `inset 0 0 24px ${style.accent ?? '#C9A96E'}1A`,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: iconSize,
            color: style.accent ?? '#C9A96E',
            fontVariationSettings: "'FILL' 1, 'wght' 300",
          }}
        >
          {style.icon}
        </span>
      </div>

      {/* Operator label */}
      <p
        className="font-label-caps mt-4"
        style={{
          fontSize: variant === 'hero' ? '12px' : '9px',
          letterSpacing: '0.25em',
          color: style.accent ?? '#C9A96E',
          opacity: 0.85,
          textTransform: 'uppercase',
        }}
      >
        {style.label}
      </p>

      {/* Subtle texture — diagonal stripes for visual interest at large sizes */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)',
        }}
      />
    </div>
  )
}
