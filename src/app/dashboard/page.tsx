import { getTemplatesData } from "@/actions/templates";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import DashboardContainer from "./dashboard-container";

async function Page() {

  const plantillas = await getTemplatesData();
  console.log(plantillas);

  if (!plantillas) {
    return <p>Error al cargar las plantillas.</p>;
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 p-4 overflow-y-auto">
        <DashboardContainer documents={plantillas}/>
      </main>
      <Footer />
    </div>
  )
}

export default Page;
