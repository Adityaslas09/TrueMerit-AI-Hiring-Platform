import HeroSection from '../components/auth/HeroSection';
import SignupForm from '../components/auth/SignupForm';

const Register = () => {
  return (
    <div className="flex w-full min-h-[calc(100vh-80px)] overflow-hidden bg-[#0A0D14] flex-col lg:flex-row">
      <HeroSection />
      <SignupForm />
    </div>
  );
};

export default Register;
