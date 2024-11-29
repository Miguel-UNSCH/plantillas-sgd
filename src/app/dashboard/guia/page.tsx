import GuiaPlantillaTable from "@/components/table/guia-plantilla-table";
import GuiaTable from "@/components/table/guia-table";
import { guiaPlantillas, guiaPlantillasDocs } from "@/utils/guia";

function Page() {
  return (
    <div className="space-y-4">
      <GuiaTable guias={guiaPlantillas}/>
      <GuiaPlantillaTable documents={guiaPlantillasDocs}/>
    </div>
  )
}

export default Page;
