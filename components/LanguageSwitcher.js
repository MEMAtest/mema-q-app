import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const activeLocale = router.locale || router.defaultLocale || 'en';

  const handleChange = (event) => {
    const locale = event.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <select
      className="language-select"
      value={activeLocale}
      onChange={handleChange}
      aria-label={t('language.label')}
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.label}
        </option>
      ))}
    </select>
  );
}
