import { ModeChange } from "@/components/mode-change";
import Image from "next/image";
import AvatarUser from "@/components/avatar-user";
function Header() {
  return (
    <div className="bg-card py-5 pr-5">
      <div className="container mx-auto flex items-center justify-between">
        <Image src={"/logos/logo_header_claro.png"} alt="logo-gra" width={200} height={100} className="dark:hidden" />
        <Image src={"/logos/logo_header_oscuro.png"} alt="logo-gra" width={200} height={100} className="hidden dark:block" />
        <h1 className="text-2xl font-semibold hidden md:block">Sistema de carga de plantillas del SGD</h1>
        <div className="flex items-center justify-end gap-4">
          <ModeChange />
          <AvatarUser />
        </div>
      </div>
    </div>
  );
}

export default Header;
