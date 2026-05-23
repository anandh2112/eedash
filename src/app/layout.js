import "./globals.css";
import AuthWrapper from "./components/AuthWrapper"; 

export const metadata = {
  title: "Admin",
  description: "EE Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="flex h-screen w-screen antialiased"
      >
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
