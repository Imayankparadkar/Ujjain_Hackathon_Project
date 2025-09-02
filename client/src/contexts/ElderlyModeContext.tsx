import { createContext, useContext, useEffect, useState } from "react";

interface ElderlyModeContextType {
  elderlyMode: boolean;
  toggleElderlyMode: () => void;
}

const ElderlyModeContext = createContext<ElderlyModeContextType>({
  elderlyMode: false,
  toggleElderlyMode: () => {},
});

export const useElderlyMode = () => {
  const context = useContext(ElderlyModeContext);
  if (!context) {
    throw new Error("useElderlyMode must be used within an ElderlyModeProvider");
  }
  return context;
};

export const ElderlyModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [elderlyMode, setElderlyMode] = useState(() => {
    return localStorage.getItem("elderlyMode") === "true";
  });

  const toggleElderlyMode = () => {
    setElderlyMode(prev => {
      const newMode = !prev;
      localStorage.setItem("elderlyMode", String(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("elderly-mode", elderlyMode);
  }, [elderlyMode]);

  return (
    <ElderlyModeContext.Provider value={{ elderlyMode, toggleElderlyMode }}>
      {children}
    </ElderlyModeContext.Provider>
  );
};
