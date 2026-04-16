import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata = {
  title: 'PrepForge — DSA Tracker',
  description: 'Track your DSA journey with Striver-inspired sheets, analytics, streaks, and revision mode.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
