import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background))",
                foreground: "var(--foreground)",

                "n-primary": "rgb(var(--n-primary))",
                "n-secondary": "rgb(var(--n-secondary))",
                "n-tertiary": "rgb(var(--n-tertiary))",

                "b-primary": "rgb(var(--b-primary))",
                "b-secondary": "rgb(var(--b-secondary))",
                "b-tertiary": "rgb(var(--b-tertiary))",
                "t-primary": "rgb(var(--t-primary))",
                "t-secondary": "rgb(var(--t-secondary))",
                "t-tertiary": "rgb(var(--t-tertiary))",
                "b-command": "rgb(var(--b-command))",
                "b-accent": "rgb(var(--b-accent))",
                "b-info": "rgb(var(--b-info))",
                "b-success": "rgb(var(--b-success))",
                "b-accent-grey": "rgb(var(--b-accent-grey))",
                "b-accent-green-grey": "rgb(var(--b-accent-green-grey))",
                "b-accent-green": "rgb(var(--b-accent-green))",
                "b-accent-success": "rgb(var(--b-accent-success))",
                "b-accent-info": "rgb(var(--b-accent-info))",
                "b-accent-warning": "rgb(var(--b-accent-warning))",
                "b-accent-blue-grey": "rgb(var(--b-accent-blue-grey))",
            },

            fontFamily: {
                "paytone-one": "var(--font-paytone-one)",
                "space-grotesk": "var(--font-space-grotesk)",
                "geist-sans": "var(--font-geist-sans)",
            },
        },
    },
    plugins: [],
};
export default config;
