export default class Config {
    public static API_URL = Config.get('NEXT_PUBLIC_API_BASE_URL') || 'http://localhost:3000/api';
    public static PLATFORM_URL = Config.get('NEXT_PUBLIC_PLATFORM_BASE_URL') || 'http://localhost:3001';


    public static get(key: string): string | undefined {
        return process.env[key];
    }
}