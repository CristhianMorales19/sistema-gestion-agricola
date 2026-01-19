import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        accent: Palette['primary'];
        surface: {
            main: string;
            light: string;
        };
    }

    interface PaletteOptions {
        accent?: PaletteOptions['primary'];
        surface?: {
            main?: string;
            light?: string;
        };
    }
}