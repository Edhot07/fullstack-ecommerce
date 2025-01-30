import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartButton from "./ShoppingCartButton";
import UserButton from "@/components/UserButton";
import { getLoggedInMember } from "@/wix-api/members";

export default async function Navbar() {

  const wixClient = getWixServerClient();
  const [cart, loggedInMember]= await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient)
  ])
  // const cart = await getCart(getWixServerClient());
  // const totalQuantity =
  //   cart?.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-4">
          <Image src={logo} alt="EStore Logo" width={40} height={40} />
          <span className="text-xl font-bold">EStore</span>
        </Link>
        <div className="flex items-center justify-center gap-5">
          <UserButton
            loggedInMember={loggedInMember}
          />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
}
