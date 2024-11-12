import Image from "next/image";

function Footer() {
  return (
    <div className="bg-card p-5 flex justify-between items-center">
      <p className="text-sm font-semibold">
        &copy; {new Date().getFullYear()} GORE Ayacucho. Oficina de tecnologías, informática y comunicaciones.
      </p>
      <Image 
        src={'/logos/logo_footer_oscuro.png'} 
        alt="gore-footer" 
        width={200} 
        height={50} 
        className="w-[200px] h-[50px] object-cover hidden dark:block"
      />
      <Image 
        src={'/logos/logo_footer_claro.png'} 
        alt="gore-footer" 
        width={200} 
        height={50} 
        className="w-[200px] h-[50px] object-cover dark:hidden"
      />
    </div>
  )
}

export default Footer;
