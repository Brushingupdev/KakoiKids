// Configuración de TailwindCSS para KakoiKids
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#8BC399", // Soft green from the screenshot
                primary_dark: "#6da37a",
                secondary: "#F28C8C", // Pinkish accent
                "background-light": "#FDF8E9", // Creamy background
                "background-dark": "#1a1a1a", // Dark mode background
                "card-light": "#FFFFFF",
                "card-dark": "#2d2d2d",
                "text-light": "#4A4A4A",
                "text-dark": "#E0E0E0",
                "accent-red": "#E65561", // Sale tag red
            },
            fontFamily: {
                display: ["Fredoka", "sans-serif"], // Friendly rounded font for headings
                body: ["Nunito Sans", "sans-serif"], // Clean readable font for body
            },
            borderRadius: {
                DEFAULT: "12px",
                'xl': "20px",
                '2xl': "32px",
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
            }
        },
    },
};
