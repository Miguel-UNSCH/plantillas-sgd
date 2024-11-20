import { auth } from "@/auth";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MainRoute from "@/components/layout/main-route";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />
      <main className="flex flex-col flex-1 gap-4 p-4 overflow-y-auto container mx-auto">
        <MainRoute />
        {children}
      </main>
      <Footer />
    </div>
  );
}
