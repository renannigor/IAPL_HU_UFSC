import { Link } from "react-router-dom";
import { Button } from "@/ui/button";

const AuthNavCard = ({
  title,
  subtitle,
  buttonText,
  linkTo,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  linkTo: string;
}) => {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 p-6 bg-white">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-1">{subtitle}</p>
      <Button
        asChild
        className="mt-4 h-12 w-full bg-green-100 text-[#1F4D2C] hover:bg-green-200"
      >
        <Link to={linkTo}>{buttonText}</Link>
      </Button>
    </div>
  );
};

export default AuthNavCard;
