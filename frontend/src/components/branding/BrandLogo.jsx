import { ICARUS_BRAND } from '../../config/constants';

export function BrandLogo({ src = ICARUS_BRAND.defaultLogoUrl, alt = ICARUS_BRAND.name, className = 'h-10' }) {
  return <img src={src} alt={alt} className={className} />;
}
