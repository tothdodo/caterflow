import { PropsWithChildren, createContext, useContext, useState, useMemo } from 'react';

type TokenContextType = {
  token: string;
  setToken: (token: string) => void;
};

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: PropsWithChildren<{}>) => {
  const [token, setToken] = useState<TokenContextType['token']>('');
 
  const contextValue = useMemo(() => ({ token, setToken }), [token, setToken]);

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error('useTokenContext must be used inside the TokenProvider');
  }

  return context;
};
