export interface Player {
    id: string;
    name: string;
    level: number;
    position: string;
}

export interface ColorPalette {
    primary?: string;
    secondary?: string;
    surface?: string;
    tertiary?: string;
    contrast?: string;
}
