import { SidebarInset, SidebarProvider } from '@creo/ui';
import AppSidebar from '../shared/components/layout/AppSidebar';
import './global.scss';
import { cookies } from 'next/headers';
import { AuthProvider } from '@creo/auth';
import { TimeProvider } from '@creo/common';
import OverlayContainer from '../shared/features/overlay/common/components/OverlayContainer';
import ModalContainer from '../shared/components/modals/modal-container';

export const metadata = {
  title: 'Home | CREO',
  description:
    'A platform built for the future. Helping you create, ideate, and collaborate in all your creative and professional endeavors.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="en">
      <body>
        <TimeProvider>
          <AuthProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex h-screen w-screen overflow-hidden">
                <AppSidebar />

                <SidebarInset className="flex-1 relative">
                  <OverlayContainer />
                  <ModalContainer />
                  <div className="flex flex-1">{children}</div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </TimeProvider>
      </body>
    </html>
  );
}
