import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const useCases = [
  { title: "Patient Sourcing", description: "AI-driven patient acquisition and engagement." },
  { title: "Prior Authorization", description: "Automated prior auth requests and tracking." },
  { title: "Eligibility & Verification", description: "Instant insurance eligibility checks and verification." },
  { title: "Claim Generation", description: "Seamless, error-free claim creation and submission." },
  { title: "Claim Status", description: "Real-time claim status monitoring and updates." },
  { title: "Denial & ADR Management", description: "Automated denial and additional documentation request management." },
  { title: "Facility Optimization", description: "AI insights to optimize facility operations and revenue." },
];

const VISIBLE_COUNT = 3;
const CARD_WIDTH = 260; // px
const CARD_HEIGHT = 180; // px
const GAP = 24; // px
const TRANSITION_DURATION = 700; // ms
const AUTO_CYCLE_INTERVAL = 5000; // ms

const getCircularIdx = (idx: number, length: number) => (idx + length) % length;

const MoreFeatures = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Prepare the track: [last, 0, 1, 2, 3, 4, 5, 0, 1, 2]
  const total = useCases.length;
  const trackItems = [
    useCases[getCircularIdx(currentIdx - 1, total)],
    ...Array(VISIBLE_COUNT)
      .fill(0)
      .map((_, i) => useCases[getCircularIdx(currentIdx + i, total)]),
    useCases[getCircularIdx(currentIdx + VISIBLE_COUNT, total)],
  ];

  // Track position: always start at -1 (showing the first visible card)
  const [trackPos, setTrackPos] = useState(-1);

  // Handle auto-cycling
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, AUTO_CYCLE_INTERVAL);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [currentIdx]);

  // Slide to next
  const handleNext = () => {
    if (isSliding) return;
    setDirection('next');
    setIsSliding(true);
    setTrackPos((pos) => pos - 1);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsSliding(false);
      setCurrentIdx((idx) => getCircularIdx(idx + 1, total));
      setTrackPos(-1); // reset to center
    }, TRANSITION_DURATION);
  };

  // Slide to prev
  const handlePrev = () => {
    if (isSliding) return;
    setDirection('prev');
    setIsSliding(true);
    setTrackPos((pos) => pos + 1);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsSliding(false);
      setCurrentIdx((idx) => getCircularIdx(idx - 1, total));
      setTrackPos(-1); // reset to center
    }, TRANSITION_DURATION);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  // Calculate transform for sliding
  const getTransform = () => {
    return `translateX(${trackPos * (CARD_WIDTH + GAP)}px)`;
  };

  // Calculate the exact width for 3 cards and 2 gaps
  const containerWidth = VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP;
  const trackWidth = (VISIBLE_COUNT + 2) * CARD_WIDTH + (VISIBLE_COUNT + 1) * GAP;

  // For indicators, show which window is active
  const totalDots = useCases.length;

  return (
    <section id="why-need-us-section" className="relative py-20 bg-[#004466]">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-4 text-center transition-all duration-1000">
          Complete Revenue Cycle Automation
        </h2>
        <p className="text-xl text-[#EAEFF2] mb-8 text-center font-normal">
          Our AI agents automate the entire revenue cycle
        </p>
        <div className="relative w-full flex flex-col items-center">
          <div className="flex items-center justify-center w-full">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="rounded-full bg-white text-[#004466] p-2 mx-4 shadow hover:bg-[#EAEFF2] transition"
              disabled={isSliding}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div
              className="overflow-hidden flex justify-center"
              style={{ width: `${containerWidth}px` }}
            >
              <div
                ref={trackRef}
                className="flex"
                style={{
                  gap: `${GAP}px`,
                  transform: getTransform(),
                  transition: isSliding ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
                  width: `${trackWidth}px`,
                }}
              >
                {trackItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center"
                    style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
                  >
                    <h3 className="text-xl font-serif font-bold text-[#004466] mb-3">{item.title}</h3>
                    <p className="text-base text-[#004466]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              aria-label="Next"
              onClick={handleNext}
              className="rounded-full bg-white text-[#004466] p-2 mx-4 shadow hover:bg-[#EAEFF2] transition"
              disabled={isSliding}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => !isSliding && setCurrentIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIdx === idx ? 'bg-white' : 'bg-[#EAEFF2]'}`}
                aria-label={`Go to use case window ${idx + 1}`}
                disabled={isSliding}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreFeatures;
