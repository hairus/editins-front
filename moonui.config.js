module.exports = {
  // MoonUI Theme Configuration
  theme: {
    // Option 1: Use a preset theme
    preset: 'default', // 'default' | 'corporate' | 'creative' | 'nature' | 'minimal' | 'ocean'
    
    // Option 2: Define custom theme (uncomment to use)
    // custom: {
    //   colors: {
    //     background: "0 0% 100%",
    //     foreground: "222.2 84% 4.9%",
    //     primary: "222.2 47.4% 11.2%",
    //     "primary-foreground": "210 40% 98%",
    //     secondary: "210 40% 96.1%",
    //     "secondary-foreground": "222.2 47.4% 11.2%",
    //     accent: "210 40% 96.1%",
    //     "accent-foreground": "222.2 47.4% 11.2%",
    //     destructive: "0 84.2% 60.2%",
    //     "destructive-foreground": "210 40% 98%",
    //     muted: "210 40% 96.1%",
    //     "muted-foreground": "215.4 16.3% 46.9%",
    //     border: "214.3 31.8% 91.4%",
    //     input: "214.3 31.8% 91.4%",
    //     ring: "222.2 84% 4.9%",
    //     card: "0 0% 100%",
    //     "card-foreground": "222.2 84% 4.9%",
    //     popover: "0 0% 100%",
    //     "popover-foreground": "222.2 84% 4.9%",
    //   },
    //   darkMode: {
    //     background: "222.2 84% 4.9%",
    //     foreground: "210 40% 98%",
    //     primary: "210 40% 98%",
    //     "primary-foreground": "222.2 47.4% 11.2%",
    //     // ... other dark mode colors
    //   },
    //   radius: 0.5, // Border radius in rem
    // },
  },
  
  // Tailwind CSS configuration
  tailwind: {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class', // or 'media'
  },
  
  // Component default settings
  components: {
    // Configure default props and variants for components
    Button: {
      defaultVariant: 'default',
      defaultSize: 'md',
    },
    Card: {
      defaultVariant: 'default',
    },
    // Add more component defaults as needed
  },
  
  // Path settings
  paths: {
    // Where to output the components
    components: './src/components/ui',
    // Where to output the utilities
    utils: './src/lib',
    // Where to output the generated theme CSS
    styles: './src/styles',
  },
  
  // Build settings
  build: {
    // Automatically generate theme CSS on build
    generateThemeCSS: true,
    // CSS output file name
    themeCSSFile: 'moonui-theme.css',
  },
}