
import { env } from "@/env";
import {
    backInStockNotifications,
    checkout,
    orders,
    currentCart,
    recommendations,
} from "@wix/ecom";
import {files} from "@wix/media"
import { members } from"@wix/members";
import {redirects} from "@wix/redirects";
import {reviews} from "@wix/reviews"
import {createClient, OAuthStrategy, Tokens} from "@wix/sdk";
import {collections, products} from "@wix/stores";

export function getWixClient( tokens: Tokens | undefined ){
    return createClient({
        modules:{
            products,
            collections,
            backInStockNotifications,
            checkout,
            currentCart,
            recommendations,
            files,
            members,
            redirects,
            reviews,
            orders,            
        },
        auth: OAuthStrategy({
            clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
            tokens,
        }),
    });
}

export type WixClient = ReturnType<typeof getWixClient>;