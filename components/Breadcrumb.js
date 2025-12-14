// components/Breadcrumb.js
import Image from 'next/image';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      padding: 'var(--spacing-md) 0',
      fontSize: '0.875rem',
      color: 'var(--color-text-muted)'
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          {index > 0 && (
            <Image src="/icons/ui/chevron-right.svg" alt="" width={16} height={16} style={{ width: '1rem', height: '1rem' }} />
          )}

          {item.icon === 'home' ? (
            <Image src="/icons/ui/home.svg" alt="" width={16} height={16} style={{ width: '1rem', height: '1rem' }} />
          ) : null}

          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (item.onClick) item.onClick();
              }}
              style={{
                color: index === items.length - 1 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                fontWeight: index === items.length - 1 ? 'var(--font-medium)' : 'var(--font-regular)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-accent-primary)'}
              onMouseLeave={(e) => e.target.style.color = index === items.length - 1 ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
            >
              {item.label}
            </a>
          ) : (
            <span style={{
              color: 'var(--color-text-primary)',
              fontWeight: 'var(--font-medium)'
            }}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
