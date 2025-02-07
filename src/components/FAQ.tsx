
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionProvider,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does AI improve insurance authorization accuracy?",
    answer: "Our AI system analyzes historical authorization patterns, clinical documentation, and payer requirements to predict approval likelihood and suggest optimal documentation, significantly reducing denials and improving first-pass approval rates."
  },
  {
    question: "What kind of training is required to use the platform?",
    answer: "Our platform is designed to be intuitive and user-friendly. We provide comprehensive onboarding, video tutorials, and ongoing support. Most users can become proficient within a few hours of training."
  },
  {
    question: "Can the system integrate with our existing EHR?",
    answer: "Yes, our platform is designed to integrate seamlessly with major EHR systems. We support standard healthcare interoperability protocols and can customize integration based on your specific needs."
  },
  {
    question: "How secure is the platform?",
    answer: "We maintain the highest level of security with HIPAA compliance, end-to-end encryption, regular security audits, and SOC 2 certification. Your data security is our top priority."
  },
  {
    question: "What kind of ROI can we expect?",
    answer: "Facilities typically see a 30-50% reduction in authorization processing time and a 25-40% decrease in claim denials within the first six months. This translates to significant cost savings and improved revenue cycle efficiency."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Frequently Asked Questions
        </h2>
        <AccordionProvider>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg">
                <AccordionTrigger className="px-6 text-left font-semibold text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionProvider>
      </div>
    </section>
  );
};

export default FAQ;
