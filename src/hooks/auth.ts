import { usePathname } from "next/navigation";
import { useToast } from "./use-toast";
import { generateOAuthData, getLoginUrl, getLogoutUrl } from "@/wix-api/auth";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import Cookies from "js-cookie";
import { WIX_OAUTH_DATA_COOKIE, WIX_SESSION_COOKIE } from "@/lib/constants";

export default function useAuth(){
    const pathname = usePathname();

    const {toast} = useToast();

    async function login(){
        try {
            const oAuthData = await generateOAuthData(wixBrowserClient, pathname);
            Cookies.set(WIX_OAUTH_DATA_COOKIE, JSON.stringify(oAuthData),{
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(Date.now()+ 60 * 10 * 1000)
            });

            const redirectUrl = await getLoginUrl(wixBrowserClient, oAuthData);

            window.location.href = redirectUrl;
            
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to login. Please try again.",
            })
        }
    }

    async function logout(){
        // clear cookies, remove token, and redirect to homepage
        try {
            const logoutUrl = await getLogoutUrl(wixBrowserClient);
            
            Cookies.remove(WIX_SESSION_COOKIE);

            window.location.href = logoutUrl;
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to logout. Please try again.",
            })
        }
    }

    return { login, logout}
}