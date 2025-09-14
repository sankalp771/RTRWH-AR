import HeroSection from './HeroSection';

interface LandingPageProps {
  onSelectPath: (path: 'rainwater' | 'recharge') => void;
}

export default function LandingPage({ onSelectPath }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onSelectPath={onSelectPath} />
    </div>
  );
}