import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this software compliant with healthcare regulations (e.g., HIPAA, CMS)?",
    answer: "Yes. Our AI agent is fully HIPAA-compliant and adheres to CMS guidelines. We encrypt all data (in transit and at rest) and undergo annual third-party audits. Your documentation and workflows will always meet regulatory standards."
  },
  {
    question: "How does this integrate with our existing EHR/billing systems?",
    answer: "We integrate seamlessly with top EHRs like PointClickCare, Cerner, and Epic, as well as major billing platforms. Setup takes <72 hours with zero downtime, and our team handles everything—no IT burden on you."
  },
  {
    question: "What's the ROI? How soon will we see results?",
    answer: "Our clients reduce claim denials by 30-50% within 90 days and accelerate cash flow by 30%. This service pays for itself."
  },
  {
    question: "How difficult is it for our staff to learn this system?",
    answer: "Our AI works in the background—no manual data entry or coding required. Staff only interact with simple alerts and approvals. We include free onboarding, live training, and 24/7 support to ensure a smooth transition."
  },
  {
    question: "What's the cost? Are there hidden fees?",
    answer: "Pricing varies depending on your facility size. You'll pay $0 for setup, integrations, or training. We succeed when you do—most clients cover our fees with recovered revenue in their first 60 days."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-accent rounded-lg">
              <AccordionTrigger className="px-6 text-left font-semibold text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
