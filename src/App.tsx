import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";

function App() {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Alice',
        'url(https://fonts.gstatic.com/s/alice/v20/OpNCnoEEmtHa6GcOrgo.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('Alice font loaded successfully');
      } catch (error) {
        console.error('Error loading Alice font:', error);
      }
    };

    loadFont();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;