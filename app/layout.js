import "./globals.css";
import { UserProvider } from "../contexts/UserContext";

export const metadata = {
  title: "Agency Ads System",
  description: "Login",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
