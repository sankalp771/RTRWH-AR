import UserInputForm from '../UserInputForm';

export default function UserInputFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  const handleBack = () => {
    console.log('Back button clicked');
  };

  return (
    <UserInputForm
      type="rainwater"
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  );
}