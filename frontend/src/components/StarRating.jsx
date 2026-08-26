
export default function StarRating({ value, onChange, readonly = false, size = 24 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          style={{
            fontSize: size,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= value ? '#f59e0b' : 'var(--border2)',
            transition: 'color .15s',
            userSelect: 'none'
          }}
        >★</span>
      ))}
    </div>
  );
}