// Agent identity, role labels, and color theming — shared across the dashboard.

export interface AgentTheme {
  text: string
  bg: string
  border: string
  dot: string
}

interface AgentDef {
  role: string
  theme: AgentTheme
}

// Keyed by lowercase substring match against agent_name / current_agent.
const AGENT_REGISTRY: Record<string, AgentDef> = {
  oscar: {
    role: 'Builder',
    theme: {
      text: 'text-violet-300',
      bg: 'bg-violet-500/12',
      border: 'border-violet-500/30',
      dot: 'bg-violet-400',
    },
  },
  opus: {
    role: 'Builder',
    theme: {
      text: 'text-violet-300',
      bg: 'bg-violet-500/12',
      border: 'border-violet-500/30',
      dot: 'bg-violet-400',
    },
  },
  sheldon: {
    role: 'Orchestrator',
    theme: {
      text: 'text-indigo-300',
      bg: 'bg-indigo-500/12',
      border: 'border-indigo-500/30',
      dot: 'bg-indigo-400',
    },
  },
  orchestrator: {
    role: 'Orchestrator',
    theme: {
      text: 'text-indigo-300',
      bg: 'bg-indigo-500/12',
      border: 'border-indigo-500/30',
      dot: 'bg-indigo-400',
    },
  },
  'visual research': {
    role: 'Visual Research',
    theme: {
      text: 'text-pink-300',
      bg: 'bg-pink-500/12',
      border: 'border-pink-500/30',
      dot: 'bg-pink-400',
    },
  },
  'build planner': {
    role: 'Build Planner',
    theme: {
      text: 'text-fuchsia-300',
      bg: 'bg-fuchsia-500/12',
      border: 'border-fuchsia-500/30',
      dot: 'bg-fuchsia-400',
    },
  },
  planner: {
    role: 'Build Planner',
    theme: {
      text: 'text-fuchsia-300',
      bg: 'bg-fuchsia-500/12',
      border: 'border-fuchsia-500/30',
      dot: 'bg-fuchsia-400',
    },
  },
  qa: {
    role: 'Quality Assurance',
    theme: {
      text: 'text-emerald-300',
      bg: 'bg-emerald-500/12',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
  },
  codex: {
    role: 'Code & Audits',
    theme: {
      text: 'text-sky-300',
      bg: 'bg-sky-500/12',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400',
    },
  },
  sonnet: {
    role: 'Reasoning',
    theme: {
      text: 'text-rose-300',
      bg: 'bg-rose-500/12',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
    },
  },
  haiku: {
    role: 'Routing',
    theme: {
      text: 'text-teal-300',
      bg: 'bg-teal-500/12',
      border: 'border-teal-500/30',
      dot: 'bg-teal-400',
    },
  },
  blake: {
    role: 'Operator',
    theme: {
      text: 'text-amber-300',
      bg: 'bg-amber-500/12',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
    },
  },
}

const FALLBACK: AgentDef = {
  role: 'Agent',
  theme: {
    text: 'text-zinc-300',
    bg: 'bg-zinc-500/12',
    border: 'border-zinc-500/30',
    dot: 'bg-zinc-400',
  },
}

function lookup(name: string): AgentDef {
  const key = name.toLowerCase()
  for (const [prefix, def] of Object.entries(AGENT_REGISTRY)) {
    if (key.includes(prefix)) return def
  }
  return FALLBACK
}

export function agentTheme(name: string): AgentTheme {
  return lookup(name).theme
}

export function agentRole(name: string): string {
  return lookup(name).role
}

// Stable per-slug accent used for app pills in the live feed.
const SLUG_THEMES = [
  'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
  'bg-pink-500/15 text-pink-300 border border-pink-500/25',
  'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function slugTheme(slug: string): string {
  return SLUG_THEMES[hashString(slug) % SLUG_THEMES.length]
}
