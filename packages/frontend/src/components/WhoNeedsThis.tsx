
import { Card, CardContent } from "./ui/card";
import { Hospital, UserCog, Stethoscope } from "lucide-react";

const profiles = [
  {
    icon: Hospital,
    title: "Skilled Nursing Facilities",
    description: "Perfect for SNFs looking to streamline their insurance authorization process, reduce claim denials, and improve operational efficiency."
  },
  {
    icon: UserCog,
    title: "Healthcare Administrators",
    description: "Ideal for administrators seeking to optimize workflow, reduce staff burnout, and ensure compliance while maximizing reimbursement rates."
  },
  {
    icon: Stethoscope,
    title: "Clinical Staff",
    description: "Essential for clinical teams who want to spend less time on paperwork and more time focusing on quality patient care."
  }
];

const WhoNeedsThis = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Who Needs This Most?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                    <profile.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{profile.title}</h3>
                  <p className="text-gray-600">{profile.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoNeedsThis;
