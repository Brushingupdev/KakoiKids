
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#8BC399", 
                primary_dark: "#6da37a",
                secondary: "#F28C8C", 
                "background-light": "#FDF8E9", 
                "background-dark": "#1a1a1a", 
                "card-light": "#FFFFFF",
                "card-dark": "#2d2d2d",
                "text-light": "#4A4A4A",
                "text-dark": "#E0E0E0",
                "accent-red": "#E65561", 
            },
            fontFamily: {
                display: ["Fredoka", "sans-serif"], 
                body: ["Nunito Sans", "sans-serif"], 
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

