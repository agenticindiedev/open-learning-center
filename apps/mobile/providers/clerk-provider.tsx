import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { ReactNode } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

interface Props {
  children: ReactNode;
}

export function ClerkProvider({ children }: Props) {
  return (
    <BaseClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </BaseClerkProvider>
  );
}
