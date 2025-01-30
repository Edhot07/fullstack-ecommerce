/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{//This part is added manually so that we can have a cache data for 30 seconds
        staleTimes:{
            dynamic: 30,
        }
    }//Till here
};

export default nextConfig;
