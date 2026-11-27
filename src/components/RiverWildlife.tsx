import { motion } from 'motion/react'
import { mediaUrl } from '../helpers/mediaUrl'

/**
 * Art-directed botanical & wildlife SVG illustrations for the Historia
 * ("El río de la memoria" — Magdalena River in Santa Cruz de Mompox).
 *
 * Palette harmonized with SKILLS/DESIGN.MD:
 * - River emerald/teal: #1f4e43, #2c5e4c, #3a7a67, #569b84, #7fc0a8
 * - Sunset reflection & ochre: #d99b26, #e8b85c, #f5d896
 * - Tropical foliage: #1e3d2b, #2c5439, #3f6f46, #5a8c52, #7aa665
 * - Riverbank barro/sand: #d9c5a0, #c4aa82, #a68c65
 * - Accents: heliconia #c84b31/#df6b3b, egret #faf6ee, iguana #4f7f3c/#78a84e,
 *   macaw #c94a30/#e3a32b/#2c6a58, Macondo butterflies #f0b83a/#fbd86b.
 */

/* ============================================================================
   Shared Magdalena Riverbed Geometry (viewBox 0 0 260 1200)
   Exact path alignment ensures RiverWaterOverlaySvg illuminates cleanly
   inside RiverChannelSvg as scroll clipPath progresses.
   ============================================================================ */

const OUTER_BANK_PATH =
  'M 38 0 ' +
  'C 12 115, 6 225, 34 340 ' +
  'C 62 455, 76 545, 42 665 ' +
  'C 10 780, 12 895, 44 1015 ' +
  'C 66 1095, 58 1152, 40 1200 ' +
  'L 224 1200 ' +
  'C 242 1148, 248 1090, 224 1008 ' +
  'C 192 892, 190 778, 224 662 ' +
  'C 256 546, 244 452, 214 338 ' +
  'C 186 226, 194 114, 222 0 Z'

const WET_SHORE_PATH =
  'M 48 0 ' +
  'C 24 115, 18 225, 45 340 ' +
  'C 72 455, 86 546, 54 665 ' +
  'C 22 782, 24 894, 56 1015 ' +
  'C 76 1094, 68 1152, 51 1200 ' +
  'L 212 1200 ' +
  'C 229 1148, 236 1090, 212 1008 ' +
  'C 180 892, 178 780, 212 662 ' +
  'C 244 545, 232 452, 202 338 ' +
  'C 175 226, 183 114, 210 0 Z'

const WATER_BODY_PATH =
  'M 56 0 ' +
  'C 33 116, 28 225, 54 340 ' +
  'C 80 454, 94 546, 63 665 ' +
  'C 32 782, 34 894, 65 1015 ' +
  'C 84 1094, 77 1152, 60 1200 ' +
  'L 202 1200 ' +
  'C 219 1148, 225 1090, 202 1008 ' +
  'C 171 892, 169 780, 202 662 ' +
  'C 233 545, 221 452, 193 338 ' +
  'C 167 226, 174 114, 200 0 Z'

const DEEP_CORE_PATH =
  'M 86 0 ' +
  'C 64 116, 60 225, 84 340 ' +
  'C 108 454, 122 546, 94 665 ' +
  'C 65 782, 67 894, 95 1015 ' +
  'C 112 1094, 106 1152, 91 1200 ' +
  'L 172 1200 ' +
  'C 188 1148, 193 1090, 172 1008 ' +
  'C 143 892, 141 780, 172 662 ' +
  'C 201 545, 190 452, 164 338 ' +
  'C 140 226, 146 114, 170 0 Z'

const SUN_RIBBON_PATH =
  'M 134 0 ' +
  'C 112 120, 108 226, 132 340 ' +
  'C 156 454, 168 548, 139 665 ' +
  'C 110 782, 112 894, 140 1014 ' +
  'C 156 1094, 150 1152, 136 1200 ' +
  'L 158 1200 ' +
  'C 172 1150, 178 1092, 161 1012 ' +
  'C 133 892, 131 780, 160 663 ' +
  'C 188 546, 177 452, 153 338 ' +
  'C 129 224, 134 118, 155 0 Z'

/* ============================================================================
   1. RiverChannelSvg — Base Magdalena River Channel + Banks + Fish + Lilies
   ============================================================================ */

export function RiverChannelSvg({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className="rio-svg-channel"
      viewBox="0 0 260 1200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-reduced={reduced ? 'true' : undefined}
    >
      <defs>
        {/* Warm Mompox sand / barro riverbanks */}
        <linearGradient id="rio-ch-bank-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d9c5a0" stopOpacity="0.18" />
          <stop offset="12%" stopColor="#d9c5a0" stopOpacity="0.82" />
          <stop offset="22%" stopColor="#c4aa82" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#a68c65" stopOpacity="0.95" />
          <stop offset="78%" stopColor="#c4aa82" stopOpacity="0.95" />
          <stop offset="88%" stopColor="#d9c5a0" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#d9c5a0" stopOpacity="0.18" />
        </linearGradient>

        {/* Wet silt edge transitioning into river water */}
        <linearGradient id="rio-ch-wet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a68c65" stopOpacity="0.88" />
          <stop offset="18%" stopColor="#7a7c5e" stopOpacity="0.72" />
          <stop offset="50%" stopColor="#2c5e4c" stopOpacity="0.6" />
          <stop offset="82%" stopColor="#7a7c5e" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#a68c65" stopOpacity="0.88" />
        </linearGradient>

        {/* Horizontal cross-channel depth gradient */}
        <linearGradient id="rio-ch-water-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#569b84" />
          <stop offset="16%" stopColor="#3a7a67" />
          <stop offset="48%" stopColor="#1f4e43" />
          <stop offset="84%" stopColor="#3a7a67" />
          <stop offset="100%" stopColor="#569b84" />
        </linearGradient>

        {/* Vertical Magdalena depth & evening reflection wash */}
        <linearGradient id="rio-ch-water-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c5e4c" stopOpacity="0.35" />
          <stop offset="28%" stopColor="#1f4e43" stopOpacity="0.48" />
          <stop offset="58%" stopColor="#183f36" stopOpacity="0.52" />
          <stop offset="85%" stopColor="#1f4e43" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2c5e4c" stopOpacity="0.38" />
        </linearGradient>

        {/* Deep central riverbed channel */}
        <linearGradient id="rio-ch-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1f4e43" stopOpacity="0" />
          <stop offset="30%" stopColor="#173d34" stopOpacity="0.58" />
          <stop offset="55%" stopColor="#14362e" stopOpacity="0.68" />
          <stop offset="78%" stopColor="#1a453b" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#1f4e43" stopOpacity="0" />
        </linearGradient>

        {/* Golden-hour sunlit sheen along surface */}
        <linearGradient id="rio-ch-sun-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5d896" stopOpacity="0.22" />
          <stop offset="22%" stopColor="#e8b85c" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#f5d896" stopOpacity="0.26" />
          <stop offset="76%" stopColor="#e8b85c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f5d896" stopOpacity="0.22" />
        </linearGradient>

        {/* Water lily pad gradient */}
        <radialGradient id="rio-ch-pad-grad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7aa665" />
          <stop offset="58%" stopColor="#3f6f46" />
          <stop offset="100%" stopColor="#1e3d2b" />
        </radialGradient>

        {/* Clip path to keep internal reflections & fish strictly inside the water */}
        <clipPath id="rio-ch-water-clip">
          <path d={WATER_BODY_PATH} />
        </clipPath>
      </defs>

      {/* Outer sandy/barro riverbank shoals */}
      <path d={OUTER_BANK_PATH} fill="url(#rio-ch-bank-grad)" />
      <path d={WET_SHORE_PATH} fill="url(#rio-ch-wet-grad)" />

      {/* Subtle shoreline contours */}
      <path
        d="M 42 0 C 17 115, 11 225, 39 340 C 67 455, 81 545, 48 665 C 16 780, 18 895, 50 1015 C 71 1095, 63 1152, 46 1200"
        fill="none"
        stroke="#a68c65"
        strokeWidth="1.2"
        strokeOpacity="0.45"
        strokeDasharray="18 10 6 14"
      />
      <path
        d="M 218 0 C 189 114, 181 226, 209 338 C 239 452, 250 546, 218 662 C 185 778, 187 892, 218 1008 C 242 1090, 236 1148, 218 1200"
        fill="none"
        stroke="#a68c65"
        strokeWidth="1.2"
        strokeOpacity="0.45"
        strokeDasharray="14 12 8 10"
      />

      {/* Main Magdalena water body */}
      <path d={WATER_BODY_PATH} fill="url(#rio-ch-water-h)" />
      <path d={WATER_BODY_PATH} fill="url(#rio-ch-water-v)" />

      {/* Clipped underwater details, depth core, currents, fish & glints */}
      <g clipPath="url(#rio-ch-water-clip)">
        {/* Deep emerald riverbed core */}
        <path d={DEEP_CORE_PATH} fill="url(#rio-ch-core-grad)" />

        {/* Subtle sunlit ribbon */}
        <path d={SUN_RIBBON_PATH} fill="url(#rio-ch-sun-ribbon)" />

        {/* Subtle bocachico fish silhouettes gliding beneath the surface */}
        <g className="rio-svg-fish" fill="#0f2c24" fillOpacity="0.34">
          {/* Fish 1 — upper bend, angled down-left */}
          <g transform="translate(106 196) rotate(14)">
            <path d="M 0 -13 C 5.5 -6, 6 5, 1.5 13 L 6 20 C 2 18, 0.5 16.5, 0 15 C -0.5 16.5, -2 18, -6 20 L -1.5 13 C -6 5, -5.5 -6, 0 -13 Z" />
            <path d="M 4 -2 C 9 1, 9 4, 4.5 5 Z" fillOpacity="0.24" />
            <path d="M -4 -2 C -9 1, -9 4, -4.5 5 Z" fillOpacity="0.24" />
          </g>
          {/* Fish 2 — companion smaller bocachico */}
          <g transform="translate(124 222) rotate(18) scale(0.76)">
            <path d="M 0 -13 C 5.5 -6, 6 5, 1.5 13 L 6 20 C 2 18, 0.5 16.5, 0 15 C -0.5 16.5, -2 18, -6 20 L -1.5 13 C -6 5, -5.5 -6, 0 -13 Z" />
          </g>
          {/* Fish 3 — mid-river bend */}
          <g transform="translate(154 558) rotate(-14) scale(0.92)">
            <path d="M 0 -13 C 5.5 -6, 6 5, 1.5 13 L 6 20 C 2 18, 0.5 16.5, 0 15 C -0.5 16.5, -2 18, -6 20 L -1.5 13 C -6 5, -5.5 -6, 0 -13 Z" />
            <path d="M 4 -2 C 9 1, 9 4, 4.5 5 Z" fillOpacity="0.24" />
            <path d="M -4 -2 C -9 1, -9 4, -4.5 5 Z" fillOpacity="0.24" />
          </g>
          {/* Fish 4 — lower-river glide */}
          <g transform="translate(104 888) rotate(10) scale(0.88)">
            <path d="M 0 -13 C 5.5 -6, 6 5, 1.5 13 L 6 20 C 2 18, 0.5 16.5, 0 15 C -0.5 16.5, -2 18, -6 20 L -1.5 13 C -6 5, -5.5 -6, 0 -13 Z" />
          </g>
          {/* Fish 5 — near lower bend */}
          <g transform="translate(148 1068) rotate(-11) scale(0.74)">
            <path d="M 0 -13 C 5.5 -6, 6 5, 1.5 13 L 6 20 C 2 18, 0.5 16.5, 0 15 C -0.5 16.5, -2 18, -6 20 L -1.5 13 C -6 5, -5.5 -6, 0 -13 Z" />
          </g>
        </g>

        {/* Layered flowing river current streamlines */}
        <g className="rio-svg-stream rio-svg-stream--1" fill="none" strokeLinecap="round">
          <path
            d="M 128 0 C 106 118, 102 224, 126 340 C 150 454, 162 548, 134 665 C 106 782, 108 894, 136 1014 C 152 1094, 146 1152, 132 1200"
            stroke="#7fc0a8"
            strokeOpacity="0.42"
            strokeWidth="2.1"
            strokeDasharray="34 22 14 28"
          />
          <path
            d="M 118 0 C 96 118, 92 224, 116 340 C 140 454, 152 548, 124 665 C 96 782, 98 894, 126 1014 C 142 1094, 136 1152, 122 1200"
            stroke="#569b84"
            strokeOpacity="0.34"
            strokeWidth="1.4"
            strokeDasharray="24 30 12 24"
          />
        </g>

        <g className="rio-svg-stream rio-svg-stream--2" fill="none" strokeLinecap="round">
          <path
            d="M 88 0 C 66 118, 62 226, 86 340 C 110 454, 124 548, 95 665 C 66 782, 68 894, 96 1014 C 114 1094, 108 1152, 93 1200"
            stroke="#7fc0a8"
            strokeOpacity="0.32"
            strokeWidth="1.6"
            strokeDasharray="22 28 10 34"
          />
          <path
            d="M 164 0 C 141 116, 138 224, 162 340 C 186 454, 198 548, 169 665 C 140 782, 142 894, 170 1014 C 187 1094, 181 1152, 166 1200"
            stroke="#7fc0a8"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="28 24 14 26"
          />
        </g>

        <g className="rio-svg-stream rio-svg-stream--3" fill="none" strokeLinecap="round">
          <path
            d="M 145 0 C 122 118, 118 224, 142 340 C 166 454, 178 548, 149 665 C 120 782, 122 894, 150 1014 C 166 1094, 160 1152, 146 1200"
            stroke="#f5d896"
            strokeOpacity="0.36"
            strokeWidth="1.35"
            strokeDasharray="16 34 8 42"
          />
          <path
            d="M 74 0 C 52 118, 48 226, 72 340 C 96 454, 108 548, 80 665 C 52 782, 54 894, 82 1014 C 98 1094, 92 1152, 78 1200"
            stroke="#e8b85c"
            strokeOpacity="0.22"
            strokeWidth="1.1"
            strokeDasharray="12 36 18 30"
          />
        </g>

        {/* Warm golden-hour sunlit shimmer ripples */}
        <g className="rio-svg-glint" fill="none" strokeLinecap="round">
          <path d="M 102 92 Q 124 88 144 93" stroke="#f5d896" strokeWidth="1.5" strokeOpacity="0.45" />
          <path d="M 114 102 Q 128 99 140 103" stroke="#e8b85c" strokeWidth="1.1" strokeOpacity="0.34" />
          <path d="M 88 262 Q 112 257 134 263" stroke="#f5d896" strokeWidth="1.6" strokeOpacity="0.42" />
          <path d="M 134 428 Q 160 423 182 429" stroke="#f5d896" strokeWidth="1.5" strokeOpacity="0.44" />
          <path d="M 146 439 Q 164 436 176 440" stroke="#e8b85c" strokeWidth="1.1" strokeOpacity="0.32" />
          <path d="M 118 614 Q 144 609 168 615" stroke="#f5d896" strokeWidth="1.5" strokeOpacity="0.42" />
          <path d="M 86 786 Q 110 781 132 787" stroke="#f5d896" strokeWidth="1.6" strokeOpacity="0.44" />
          <path d="M 98 797 Q 114 794 126 798" stroke="#e8b85c" strokeWidth="1.1" strokeOpacity="0.3" />
          <path d="M 122 968 Q 148 963 170 969" stroke="#f5d896" strokeWidth="1.5" strokeOpacity="0.42" />
          <path d="M 116 1124 Q 140 1119 162 1125" stroke="#f5d896" strokeWidth="1.4" strokeOpacity="0.4" />
        </g>

        {/* Soft translucent shoreline foam / shallows highlight */}
        <path
          d="M 59 0 C 36 116, 31 225, 57 340 C 83 454, 97 546, 66 665 C 35 782, 37 894, 68 1015 C 87 1094, 80 1152, 63 1200"
          fill="none"
          stroke="#7fc0a8"
          strokeWidth="2.4"
          strokeOpacity="0.3"
        />
        <path
          d="M 199 0 C 171 114, 164 226, 190 338 C 218 452, 230 545, 199 662 C 166 780, 168 892, 199 1008 C 222 1090, 216 1148, 199 1200"
          fill="none"
          stroke="#7fc0a8"
          strokeWidth="2.4"
          strokeOpacity="0.3"
        />
      </g>

      {/* Floating clusters of water lilies / buchón de agua tucked along inner banks */}
      <g>
        {/* Upper-left cove */}
        <g transform="translate(46 154)">
          <path d="M 0 0 C -9 -6, -12 5, -2 9 C 6 12, 12 4, 8 -3 C 5 -7, 1 -4, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M 11 9 C 5 4, 4 14, 12 16 C 19 18, 22 11, 17 7 C 14 5, 12 7, 11 9 Z" fill="#5a8c52" />
          <circle cx="4" cy="2" r="2.6" fill="#bda0cc" />
          <circle cx="4" cy="2" r="1.1" fill="#e8b85c" />
        </g>

        {/* Upper-right bend */}
        <g transform="translate(184 282)">
          <path d="M 0 0 C -8 -7, -14 3, -5 9 C 3 13, 12 7, 9 -1 C 7 -5, 2 -3, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M -11 11 C -17 7, -19 16, -12 19 C -5 21, 0 15, -4 10 C -6 8, -9 10, -11 11 Z" fill="#3f6f46" />
          <circle cx="-2" cy="4" r="2.4" fill="#c7a9d4" />
          <circle cx="-2" cy="4" r="1" fill="#e8b85c" />
        </g>

        {/* Mid-left shoal */}
        <g transform="translate(81 516)">
          <path d="M 0 0 C -10 -6, -13 6, -3 10 C 6 13, 13 5, 9 -3 C 6 -7, 2 -4, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M -7 12 C -14 9, -15 18, -8 20 C -1 22, 4 16, 0 11 Z" fill="#5a8c52" />
          <path d="M 9 11 C 4 8, 3 15, 9 17 C 15 18, 18 13, 14 9 Z" fill="#2c5439" />
          <circle cx="1" cy="3" r="2.7" fill="#faf6ee" />
          <circle cx="1" cy="3" r="1.2" fill="#e8b85c" />
        </g>

        {/* Mid-right cove */}
        <g transform="translate(194 708)">
          <path d="M 0 0 C -9 -6, -13 5, -4 10 C 5 13, 12 6, 8 -2 C 6 -6, 2 -3, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M -10 -9 C -16 -13, -19 -5, -12 -2 C -6 0, -1 -5, -5 -9 Z" fill="#5a8c52" />
          <circle cx="-1" cy="2" r="2.5" fill="#bda0cc" />
          <circle cx="-1" cy="2" r="1" fill="#e8b85c" />
        </g>

        {/* Lower-left shoal */}
        <g transform="translate(52 848)">
          <path d="M 0 0 C -9 -6, -12 5, -3 9 C 5 12, 12 5, 8 -2 C 5 -6, 1 -3, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M 10 10 C 5 6, 4 15, 11 17 C 17 18, 21 12, 16 8 Z" fill="#5a8c52" />
          <circle cx="2" cy="2" r="2.6" fill="#faf6ee" />
          <circle cx="2" cy="2" r="1.1" fill="#d99b26" />
        </g>

        {/* Lower-right shoal */}
        <g transform="translate(208 1072)">
          <path d="M 0 0 C -8 -6, -12 4, -4 9 C 4 12, 11 5, 7 -2 C 5 -6, 1 -3, 0 0 Z" fill="url(#rio-ch-pad-grad)" />
          <path d="M -9 10 C -15 7, -17 15, -10 18 C -4 19, 0 14, -4 9 Z" fill="#3f6f46" />
          <circle cx="-2" cy="2" r="2.4" fill="#c7a9d4" />
          <circle cx="-2" cy="2" r="1" fill="#e8b85c" />
        </g>
      </g>
    </svg>
  )
}

/* ============================================================================
   2. RiverWaterOverlaySvg — Sunlit Active Magdalena River Surge
   ============================================================================ */

export function RiverWaterOverlaySvg() {
  return (
    <svg
      className="rio-svg-water-live"
      viewBox="0 0 260 1200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="rio-live-water-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7fc0a8" />
          <stop offset="18%" stopColor="#4f9680" />
          <stop offset="48%" stopColor="#266353" />
          <stop offset="76%" stopColor="#438a74" />
          <stop offset="100%" stopColor="#7fc0a8" />
        </linearGradient>

        <linearGradient id="rio-live-water-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7fc0a8" stopOpacity="0.28" />
          <stop offset="30%" stopColor="#3a7a67" stopOpacity="0.22" />
          <stop offset="65%" stopColor="#2c5e4c" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#569b84" stopOpacity="0.34" />
        </linearGradient>

        <linearGradient id="rio-live-sun-glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5d896" stopOpacity="0.48" />
          <stop offset="25%" stopColor="#e8b85c" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#f5d896" stopOpacity="0.52" />
          <stop offset="78%" stopColor="#e8b85c" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#f5d896" stopOpacity="0.48" />
        </linearGradient>

        <clipPath id="rio-live-water-clip">
          <path d={WATER_BODY_PATH} />
        </clipPath>
      </defs>

      {/* Vivid turquoise-emerald illuminated river surge */}
      <path d={WATER_BODY_PATH} fill="url(#rio-live-water-h)" />
      <path d={WATER_BODY_PATH} fill="url(#rio-live-water-v)" />

      <g clipPath="url(#rio-live-water-clip)">
        {/* Sunlit golden reflection down the active current */}
        <path d={SUN_RIBBON_PATH} fill="url(#rio-live-sun-glow)" />

        {/* Luminous current streams */}
        <g className="rio-svg-stream rio-svg-stream--1" fill="none" strokeLinecap="round">
          <path
            d="M 128 0 C 106 118, 102 224, 126 340 C 150 454, 162 548, 134 665 C 106 782, 108 894, 136 1014 C 152 1094, 146 1152, 132 1200"
            stroke="#f5d896"
            strokeOpacity="0.65"
            strokeWidth="2.2"
            strokeDasharray="36 22 14 26"
          />
          <path
            d="M 114 0 C 92 118, 88 224, 112 340 C 136 454, 148 548, 120 665 C 92 782, 94 894, 122 1014 C 138 1094, 132 1152, 118 1200"
            stroke="#a8dfd0"
            strokeOpacity="0.58"
            strokeWidth="1.5"
            strokeDasharray="24 28 12 24"
          />
        </g>

        <g className="rio-svg-stream rio-svg-stream--2" fill="none" strokeLinecap="round">
          <path
            d="M 86 0 C 64 118, 60 226, 84 340 C 108 454, 122 548, 93 665 C 64 782, 66 894, 94 1014 C 112 1094, 106 1152, 91 1200"
            stroke="#a8dfd0"
            strokeOpacity="0.48"
            strokeWidth="1.6"
            strokeDasharray="26 24 10 30"
          />
          <path
            d="M 166 0 C 143 116, 140 224, 164 340 C 188 454, 200 548, 171 665 C 142 782, 144 894, 172 1014 C 189 1094, 183 1152, 168 1200"
            stroke="#a8dfd0"
            strokeOpacity="0.46"
            strokeWidth="1.5"
            strokeDasharray="30 22 12 26"
          />
        </g>

        <g className="rio-svg-stream rio-svg-stream--3" fill="none" strokeLinecap="round">
          <path
            d="M 146 0 C 123 118, 119 224, 143 340 C 167 454, 179 548, 150 665 C 121 782, 123 894, 151 1014 C 167 1094, 161 1152, 147 1200"
            stroke="#fff4d6"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeDasharray="18 32 10 38"
          />
        </g>

        {/* Sparkling golden surface glints */}
        <g className="rio-svg-glint" fill="none" strokeLinecap="round">
          <path d="M 96 64 Q 124 58 152 65" stroke="#fff4d6" strokeWidth="1.8" strokeOpacity="0.65" />
          <path d="M 80 188 Q 108 182 134 189" stroke="#f5d896" strokeWidth="1.6" strokeOpacity="0.58" />
          <path d="M 108 324 Q 138 318 166 325" stroke="#fff4d6" strokeWidth="1.7" strokeOpacity="0.62" />
          <path d="M 132 478 Q 162 472 188 479" stroke="#f5d896" strokeWidth="1.8" strokeOpacity="0.6" />
          <path d="M 110 644 Q 138 638 166 645" stroke="#fff4d6" strokeWidth="1.7" strokeOpacity="0.62" />
          <path d="M 84 812 Q 112 806 140 813" stroke="#f5d896" strokeWidth="1.8" strokeOpacity="0.6" />
          <path d="M 118 986 Q 146 980 174 987" stroke="#fff4d6" strokeWidth="1.7" strokeOpacity="0.62" />
          <path d="M 112 1142 Q 140 1136 168 1143" stroke="#f5d896" strokeWidth="1.6" strokeOpacity="0.58" />
        </g>

        {/* Illuminated aqua edge gleam */}
        <path
          d="M 59 0 C 36 116, 31 225, 57 340 C 83 454, 97 546, 66 665 C 35 782, 37 894, 68 1015 C 87 1094, 80 1152, 63 1200"
          fill="none"
          stroke="#b7ead9"
          strokeWidth="2.2"
          strokeOpacity="0.45"
        />
        <path
          d="M 199 0 C 171 114, 164 226, 190 338 C 218 452, 230 545, 199 662 C 166 780, 168 892, 199 1008 C 222 1090, 216 1148, 199 1200"
          fill="none"
          stroke="#b7ead9"
          strokeWidth="2.2"
          strokeOpacity="0.45"
        />
      </g>
    </svg>
  )
}


/* ============================================================================
   3. RiverCanoe — Editorial Illustrated Mompox Wooden Canoe
   ============================================================================ */

export function RiverCanoe() {
  return (
    <div className="rio-canoe-art" aria-hidden="true">
      <svg
        className="rio-canoe__wake-svg"
        viewBox="0 0 120 72"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g className="rio-canoe__wake" strokeLinecap="round">
          <path d="M 60 8 Q 36 30 14 62" stroke="#f5d896" strokeOpacity="0.52" strokeWidth="1.6" strokeDasharray="8 7" />
          <path d="M 60 8 Q 84 30 106 62" stroke="#f5d896" strokeOpacity="0.52" strokeWidth="1.6" strokeDasharray="8 7" />
          <path d="M 60 18 Q 42 38 26 66" stroke="#b7ead9" strokeOpacity="0.48" strokeWidth="1.2" strokeDasharray="5 6" />
          <path d="M 60 18 Q 78 38 94 66" stroke="#b7ead9" strokeOpacity="0.48" strokeWidth="1.2" strokeDasharray="5 6" />
        </g>
      </svg>
      <img
        src={mediaUrl('media/illustrations/canoa.webp')}
        alt=""
        className="rio-canoe-img"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/* ============================================================================
   4. RiverBankDiscovery — Sequential Editorial Fauna & Flora Vignettes
      One distinct discovery opposite each historical card as the user scrolls.
   ============================================================================ */

type SpriteLayer = {
  file: string
  role: 'main' | 'accent' | 'backdrop'
  motion?: 'sway' | 'flutter' | 'bob' | 'swim'
  flip?: boolean
}

type DiscoveryScene = {
  id: string
  layers: SpriteLayer[]
}

const DISCOVERY_SCENES: DiscoveryScene[] = [
  // 0 · 1537 (right bank) — Palm tree welcoming the journey + yellow butterfly
  {
    id: 'palmera-mariposa',
    layers: [
      { file: 'palmera.webp', role: 'main', motion: 'sway' },
      { file: 'mariposa.webp', role: 'accent', motion: 'flutter' },
    ],
  },
  // 1 · 1540 (left bank) — White egret standing calmly among aquatic reeds
  {
    id: 'garza-acuaticas',
    layers: [
      { file: 'plantas-acuaticas.webp', role: 'backdrop', motion: 'sway' },
      { file: 'garza.webp', role: 'main', motion: 'bob' },
    ],
  },
  // 2 · 1541 (right bank) — Green Mompox iguana perched on a leafy branch facing the river
  {
    id: 'iguana-verde',
    layers: [
      { file: 'iguana.webp', role: 'main', motion: 'sway', flip: true },
    ],
  },
  // 3 · 1561 (left bank) — River turtle resting beside blooming water lilies
  {
    id: 'tortuga-nenufares',
    layers: [
      { file: 'nenufares.webp', role: 'backdrop', motion: 'bob' },
      { file: 'tortuga.webp', role: 'main' },
    ],
  },
  // 4 · 1613 (right bank) — Kingfisher perched over lush tropical leaves
  {
    id: 'martin-pescador',
    layers: [
      { file: 'hojas-tropicales.webp', role: 'backdrop', motion: 'sway' },
      { file: 'martin-pescador.webp', role: 'main', motion: 'bob' },
    ],
  },
  // 5 · s. XVII (left bank) — Playful monkey among leafy branches
  {
    id: 'mono-ramas',
    layers: [
      { file: 'mono.webp', role: 'main', motion: 'sway' },
    ],
  },
  // 6 · 1784 (right bank) — Delicate dragonflies hovering over tropical flowers
  {
    id: 'libelulas-flores',
    layers: [
      { file: 'flores-tropicales.webp', role: 'backdrop', motion: 'sway' },
      { file: 'libelulas.webp', role: 'main', motion: 'flutter' },
    ],
  },
  // 7 · 1810 (left bank) — Friendly river caiman resting calmly along aquatic plants
  {
    id: 'caiman-orilla',
    layers: [
      { file: 'plantas-acuaticas.webp', role: 'backdrop', motion: 'sway', flip: true },
      { file: 'caiman.webp', role: 'main' },
    ],
  },
  // 8 · 1812 (right bank) — Green tree frog on a tropical leaf with heliconia foliage
  {
    id: 'rana-hoja',
    layers: [
      { file: 'follaje-heliconia.webp', role: 'backdrop', motion: 'sway' },
      { file: 'rana.webp', role: 'main', motion: 'bob', flip: true },
    ],
  },
  // 9 · 1959 (left bank) — Magdalena river fish swimming near water lilies
  {
    id: 'peces-rio',
    layers: [
      { file: 'nenufares.webp', role: 'backdrop', motion: 'bob' },
      { file: 'peces.webp', role: 'main', motion: 'swim' },
    ],
  },
  // 10 · 1995 (right bank) — Lush tropical ceiba tree & yellow butterfly finale
  {
    id: 'ceiba-mariposa',
    layers: [
      { file: 'arbol-ceiba.webp', role: 'main', motion: 'sway' },
      { file: 'mariposa.webp', role: 'accent', motion: 'flutter' },
    ],
  },
]

export function RiverBankDiscovery({
  index,
  side,
  reduced,
}: {
  index: number
  side: 'left' | 'right'
  reduced: boolean
}) {
  const scene = DISCOVERY_SCENES[index % DISCOVERY_SCENES.length]
  if (!scene) return null

  return (
    <motion.div
      className={`rio__discovery rio__discovery--${side} rio__discovery--${scene.id}`}
      aria-hidden="true"
      initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rio__discovery-stage">
        {scene.layers.map((layer) => (
          <span
            key={`${scene.id}-${layer.file}`}
            className={[
              'rio-illu',
              `rio-illu--${layer.role}`,
              layer.motion ? `rio-illu--${layer.motion}` : '',
              layer.flip ? 'rio-illu--flip' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <img
              src={mediaUrl(`media/illustrations/${layer.file}`)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </div>
    </motion.div>
  )
}

/* ============================================================================
   5. RiverBankScenery — Living riverbank framing tied to timeline chapters
      Dense tropical margins emerge from the screen edges. The highlighted
      chapter changes with the active historical milestone so the landscape
      evolves with the story rather than acting as static decoration.
   ============================================================================ */

type EdgeItem = {
  slot: number
  file: string
  motion?: 'sway' | 'flutter' | 'bob'
  flip?: boolean
  size?: 'lg' | 'md' | 'sm'
  companion?: string
  companionMotion?: 'sway' | 'flutter' | 'bob' | 'swim'
  companionFlip?: boolean
  flora?: EdgeFloraLayer[]
  chapter: number
}

type EdgeFloraLayer = {
  file: string
  placement: 'canopy' | 'vine' | 'understory' | 'bloom'
  motion?: 'sway' | 'flutter' | 'bob'
  flip?: boolean
}

const LEFT_EDGE_FLORA: EdgeItem[] = [
  {
    slot: 1, file: 'palmera.webp', motion: 'sway', size: 'lg', companion: 'iguana.webp', companionMotion: 'sway', chapter: 0,
    flora: [
      { file: 'hojas-tropicales.webp', placement: 'canopy', motion: 'sway' },
      { file: 'follaje-heliconia.webp', placement: 'vine', motion: 'sway' },
    ],
  },
  {
    slot: 2, file: 'plantas-acuaticas.webp', motion: 'sway', size: 'md', companion: 'garza.webp', companionMotion: 'bob', chapter: 0,
    flora: [{ file: 'flores-tropicales.webp', placement: 'bloom', motion: 'sway' }],
  },
  {
    slot: 3, file: 'hojas-tropicales.webp', motion: 'sway', size: 'lg', companion: 'martin-pescador.webp', companionMotion: 'bob', chapter: 1,
    flora: [
      { file: 'palmera.webp', placement: 'canopy', motion: 'sway' },
      { file: 'plantas-acuaticas.webp', placement: 'understory', motion: 'sway' },
    ],
  },
  {
    slot: 4, file: 'flores-tropicales.webp', motion: 'sway', size: 'md', companion: 'libelulas.webp', companionMotion: 'flutter', chapter: 2,
    flora: [{ file: 'hojas-tropicales.webp', placement: 'vine', motion: 'sway' }],
  },
  {
    slot: 5, file: 'nenufares.webp', motion: 'bob', size: 'lg', companion: 'tortuga.webp', companionMotion: 'bob', chapter: 3,
    flora: [{ file: 'plantas-acuaticas.webp', placement: 'understory', motion: 'sway' }],
  },
]

const RIGHT_EDGE_FLORA: EdgeItem[] = [
  {
    slot: 1, file: 'arbol-ceiba.webp', motion: 'sway', flip: true, size: 'lg', companion: 'mono.webp', companionMotion: 'sway', companionFlip: true, chapter: 1,
    flora: [
      { file: 'hojas-tropicales.webp', placement: 'canopy', motion: 'sway', flip: true },
      { file: 'follaje-heliconia.webp', placement: 'vine', motion: 'sway', flip: true },
    ],
  },
  {
    slot: 2, file: 'follaje-heliconia.webp', motion: 'sway', flip: true, size: 'md', companion: 'mariposa.webp', companionMotion: 'flutter', companionFlip: true, chapter: 0,
    flora: [{ file: 'flores-tropicales.webp', placement: 'bloom', motion: 'sway', flip: true }],
  },
  {
    slot: 3, file: 'plantas-acuaticas.webp', motion: 'sway', flip: true, size: 'lg', companion: 'caiman.webp', companionFlip: true, chapter: 2,
    flora: [
      { file: 'hojas-tropicales.webp', placement: 'canopy', motion: 'sway', flip: true },
      { file: 'nenufares.webp', placement: 'understory', motion: 'bob', flip: true },
    ],
  },
  {
    slot: 4, file: 'hojas-tropicales.webp', motion: 'sway', flip: true, size: 'md', companion: 'rana.webp', companionMotion: 'bob', companionFlip: true, chapter: 3,
    flora: [{ file: 'follaje-heliconia.webp', placement: 'vine', motion: 'sway', flip: true }],
  },
  {
    slot: 5, file: 'nenufares.webp', motion: 'bob', flip: true, size: 'lg', companion: 'peces.webp', companionMotion: 'swim', companionFlip: true, chapter: 3,
    flora: [{ file: 'plantas-acuaticas.webp', placement: 'understory', motion: 'sway', flip: true }],
  },
]

function RiverEdge({ side, item }: { side: 'left' | 'right'; item: EdgeItem }) {
  return (
    <div
      className={`rio-cluster rio-cluster--${item.slot} rio-edge-art rio-edge-art--${item.size ?? 'md'}`}
      data-chapter={item.chapter}
    >
      <span
        className={[
          'rio-edge-art__inner',
          item.motion ? `rio-illu--${item.motion}` : '',
          item.flip ? 'rio-illu--flip' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <img src={mediaUrl(`media/illustrations/${item.file}`)} alt="" loading="lazy" decoding="async" />
      </span>
      {item.flora?.map((layer) => (
        <span
          key={`${item.slot}-${layer.placement}-${layer.file}`}
          className={[
            'rio-edge-art__flora',
            `rio-edge-art__flora--${layer.placement}`,
            item.flip ? `rio-edge-art__flora--${side}` : '',
            layer.motion ? `rio-illu--${layer.motion}` : '',
            layer.flip ? 'rio-illu--flip' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img src={mediaUrl(`media/illustrations/${layer.file}`)} alt="" loading="lazy" decoding="async" />
        </span>
      ))}
      {item.companion && (
        <span
          className={[
            'rio-edge-art__companion',
            `rio-edge-art__companion--${side}`,
            item.companionMotion ? `rio-illu--${item.companionMotion}` : '',
            item.companionFlip ? 'rio-illu--flip' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img src={mediaUrl(`media/illustrations/${item.companion}`)} alt="" loading="lazy" decoding="async" />
        </span>
      )}
    </div>
  )
}

export function RiverBankScenery({ activeIndex }: { activeIndex: number }) {
  const chapter = activeIndex <= 2 ? 0 : activeIndex <= 5 ? 1 : activeIndex <= 8 ? 2 : 3

  return (
    <div className={`rio-scenery rio-scenery--chapter-${chapter}`} aria-hidden="true">
      <div className="rio-scenery__side rio-scenery__side--left">
        {LEFT_EDGE_FLORA.map((item) => <RiverEdge key={`left-${item.slot}`} side="left" item={item} />)}
      </div>

      <div className="rio-scenery__side rio-scenery__side--right">
        {RIGHT_EDGE_FLORA.map((item) => <RiverEdge key={`right-${item.slot}`} side="right" item={item} />)}
      </div>
    </div>
  )
}
