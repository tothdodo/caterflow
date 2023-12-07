import { PropsWithChildren, createContext, useContext, useState, useMemo } from 'react';

type UnitContextType = {
  unitId: number;
  setUnitId: (unitId: number) => void;
};

export const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider = ({ children }: PropsWithChildren<{}>) => {
  const [unitId, setUnitId] = useState<UnitContextType['unitId']>(0);
 
  const contextValue = useMemo(() => ({ unitId, setUnitId }), [unitId, setUnitId]);

  return (
    <UnitContext.Provider value={contextValue}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnitContext = () => {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error('useUnitContext must be used inside the UnitProvider');
  }

  return context;
};
