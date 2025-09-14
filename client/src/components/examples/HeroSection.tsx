import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      onSelectPath={(path) => console.log('Selected path:', path)} 
    />
  );
}