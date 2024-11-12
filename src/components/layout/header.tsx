import { ModeChange } from "@/components/mode-change";
import Image from "next/image";
function Header() {
  return (
    <div className="bg-card flex items-center justify-between py-5 pr-5">
      <Image src={'/logos/logo_header_claro.png'} alt="logo-gra" width={200} height={100} className="dark:hidden"/>
      <Image src={'/logos/logo_header_oscuro.png'} alt="logo-gra" width={200} height={100} className="hidden dark:block"/>
      <h1 className="text-2xl font-semibold">Sistema de carga de plantillas del SGD</h1>
      <ModeChange />
    </div>
  )
}

export default Header;
