import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth";
import { ModalProvider } from "@/context/modal";
import { ActionsProvider } from "@/context/actions";
import { DataProvider } from "@/context/data";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ModalProvider>
        <ActionsProvider>
          <DataProvider>
            <Component {...pageProps} />
          </DataProvider>
        </ActionsProvider>
      </ModalProvider>
    </AuthProvider>
  );
}
