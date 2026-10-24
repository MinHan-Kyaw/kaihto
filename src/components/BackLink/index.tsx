import { Link } from 'react-router';

import { useTranslation } from '../../i18n';

interface BackLinkProps {
  to: string;
  children: string;
}

const BackLink = ({ to, children }: BackLinkProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to={to}
      aria-label={t('common.backTo', { page: children })}
      className="inline-flex min-h-11 items-center gap-1 self-start rounded-xl font-bold text-brand no-underline hover:underline"
    >
      <span aria-hidden="true">←</span> {children}
    </Link>
  );
};

export default BackLink;
