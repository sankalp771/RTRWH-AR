import LandingPage from '../LandingPage';

export default function LandingPageExample() {
  return (
    <LandingPage 
      onSelectPath={(path) => console.log('Selected path:', path)} 
    />
  );
}