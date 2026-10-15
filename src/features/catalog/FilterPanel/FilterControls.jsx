import { useRef, useState } from 'react'

export function CheckboxFilter({ filter, selected, onChange }) {
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{filter.label}</legend>
      <ul className="filter-group__options">
        {filter.options.map((option) => (
          <li key={option.value}>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

export function RadioFilter({ filter, selected, onChange }) {
  const current = selected[0] ?? ''
  const options = [{ value: '', label: 'ყველა' }, ...filter.options]

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{filter.label}</legend>
      <ul className="filter-group__options">
        {options.map((option) => (
          <li key={option.value || 'all'}>
            <label className="filter-option">
              <input
                type="radio"
                name={filter.key}
                checked={current === option.value}
                onChange={() => onChange(option.value ? [option.value] : [])}
              />
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

export function ColorFilter({ filter, selected, onChange }) {
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{filter.label}</legend>
      <div className="color-options">
        {filter.options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="color-swatch"
            style={{ background: option.value }}
            aria-pressed={selected.includes(option.value)}
            aria-label={option.label}
            title={option.label}
            onClick={() => toggle(option.value)}
          />
        ))}
      </div>
    </fieldset>
  )
}

export function RangeFilter({ filter, minValue, maxValue, onChange }) {
  const [draft, setDraft] = useState(null)
  const timer = useRef(null)

  const lowest = 0
  const highest = filter.max

  const current = draft ?? {
    min: minValue != null ? String(minValue) : '',
    max: maxValue != null ? String(maxValue) : '',
  }

  const sliderMin = current.min === '' ? lowest : Number(current.min)
  const sliderMax = current.max === '' ? highest : Number(current.max)

  const clamp = (value) => Math.min(highest, Math.max(lowest, value))
  const percent = (value) => ((clamp(value) - lowest) / (highest - lowest)) * 100

  function commit(value) {
    clearTimeout(timer.current)
    if (!value) return

    let min = value.min === '' ? lowest : clamp(Number(value.min))
    let max = value.max === '' ? highest : clamp(Number(value.max))
    if (min > max) [min, max] = [max, min]

    onChange(min === lowest ? null : min, max === highest ? null : max)
    setDraft(null)
  }

  function slide(next) {
    const value = { ...current, ...next }
    setDraft(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => commit(value), 400)
  }

  function type(next) {
    clearTimeout(timer.current)
    setDraft({ ...current, ...next })
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commit(draft)
  }

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{filter.label}</legend>

      <div className="range-inputs">
        <label className="range-inputs__field">
          <span className="visually-hidden">მინიმალური ფასი</span>
          <span aria-hidden="true">{filter.unit}</span>
          <input
            type="number"
            min={lowest}
            max={highest}
            placeholder={`${lowest}-დან`}
            value={current.min}
            onChange={(e) => type({ min: e.target.value })}
            onBlur={() => commit(draft)}
            onKeyDown={handleKeyDown}
          />
        </label>

        <label className="range-inputs__field">
          <span className="visually-hidden">მაქსიმალური ფასი</span>
          <span aria-hidden="true">{filter.unit}</span>
          <input
            type="number"
            min={lowest}
            max={highest}
            placeholder={`${highest}-მდე`}
            value={current.max}
            onChange={(e) => type({ max: e.target.value })}
            onBlur={() => commit(draft)}
            onKeyDown={handleKeyDown}
          />
        </label>
      </div>

      <div
        className="dual-range"
        style={{ '--from': `${percent(sliderMin)}%`, '--to': `${percent(sliderMax)}%` }}
      >
        <span className="dual-range__track" aria-hidden="true" />
        <input
          type="range"
          className="dual-range__input"
          aria-label="მინიმალური ფასი"
          min={lowest}
          max={highest}
          step="10"
          value={clamp(sliderMin)}
          onChange={(e) => slide({ min: String(Math.min(Number(e.target.value), sliderMax)) })}
        />
        <input
          type="range"
          className="dual-range__input"
          aria-label="მაქსიმალური ფასი"
          min={lowest}
          max={highest}
          step="10"
          value={clamp(sliderMax)}
          onChange={(e) => slide({ max: String(Math.max(Number(e.target.value), sliderMin)) })}
        />
      </div>
    </fieldset>
  )
}