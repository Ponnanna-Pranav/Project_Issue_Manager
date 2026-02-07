/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Oxygen",
                    "Ubuntu",
                    "Fira Sans",
                    "Droid Sans",
                    "Helvetica Neue",
                    "sans-serif",
                ],
            },
            colors: {
                primary: "#579DFF", // Jira Blue (Lighter for Dark Mode)
                secondary: "#1D2125", // Main Dark Background
                success: "#36B37E", // Keep success green
                warning: "#FFAB00", // Keep warning yellow
                danger: "#FF5630", // Keep danger red
                background: "#1D2125", // Jira Dark Background
                surface: "#161A1D", // Darker surface (Sidebar/Nav)
                card: "#22272B", // Card Background
                text: {
                    main: "#B6C2CF", // Light Gray Text
                    secondary: "#9FADBC", // Muted Text
                    light: "#B6C2CF",
                },
                border: "#45505E", // Dark Border
            },
            boxShadow: {
                card: "0px 1px 2px 0px rgba(0, 0, 0, 0.5)",
                "card-hover": "0px 1px 4px 0px rgba(0, 0, 0, 0.5)",
            },
        },
    },
    plugins: [],
}
