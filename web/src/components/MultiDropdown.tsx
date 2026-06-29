import { useEffect, useRef, useState } from 'react'

interface MultiDropdownProps {
  id: string
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

export function MultiDropdown({ id, label, options, selected, onChange }: MultiDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  const summary =
    selected.length === 0 ? 'All' : selected.join(', ')

  return (
    <div className="filter-field" ref={ref}>
      <span className="filter-label">{label}</span>
      <button
        id={id}
        type="button"
        className="filter-dropdown-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="filter-dropdown-summary">{summary}</span>
        <span className="filter-dropdown-arrow">▾</span>
      </button>
      {open && (
        <div className="filter-dropdown-panel" role="listbox" aria-multiselectable="true">
          <div
            className={`filter-dropdown-item filter-dropdown-item-all${selected.length === options.length ? ' filter-dropdown-item-checked' : ''}`}
            onClick={() => onChange(selected.length === options.length ? [] : [...options])}
          >
            <span className="filter-dropdown-tick">{selected.length === options.length ? '✔' : '\u00a0'}</span>
            Select all
          </div>
          <div className="filter-dropdown-divider" />
          {options.map((opt) => {
            const checked = selected.includes(opt)
            return (
              <div
                key={opt}
                role="option"
                aria-selected={checked}
                className={`filter-dropdown-item${checked ? ' filter-dropdown-item-checked' : ''}`}
                onClick={() => toggle(opt)}
              >
                <span className="filter-dropdown-tick">{checked ? '✔' : '\u00a0'}</span>
                {opt}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
